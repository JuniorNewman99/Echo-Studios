import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

function pcmToWavBase64(pcmBase64: string, sampleRate: number = 24000): string {
  const pcmData = Buffer.from(pcmBase64, 'base64');
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const chunkSize = 36 + dataSize;
  const buffer = Buffer.alloc(44 + dataSize);
  
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(chunkSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  pcmData.copy(buffer, 44);
  
  return buffer.toString('base64');
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function executeWithRetry<T>(fn: () => Promise<T>, maxRetries = 6): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (e: any) {
      attempt++;
      if (attempt >= maxRetries || (!e.message?.includes("503") && !e.message?.includes("UNAVAILABLE") && e.status !== 503 && e.code !== 503)) {
        throw e;
      }
      const waitTime = attempt * 3000;
      console.log(`Encountered 503 error, retrying attempt ${attempt} in ${waitTime / 1000}s...`);
      await delay(waitTime);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Route for podcast generation
  app.post("/api/generate-podcast", async (req, res) => {
    try {
      const { topic, duration, numSpeakers, speakers, musicMood, language } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is not configured. Please verify your Secrets panel configuration in Google AI Studio."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const speakerDetails = speakers && speakers.length > 0 
        ? speakers.map((s: any) => `${s.name} (${s.gender}, speaking style: ${s.style})`).join(", ")
        : `${numSpeakers} diverse hosts`;

      const prompt = `You are a veteran Podcast Producer and Script Writer.
Generate an immersive podcast transcript episode based on the following:
- Topic / Focus: "${topic}"
- Target Duration: ${duration}
- Number of Active Speakers: ${numSpeakers}
- Speaker Profile Choices: ${speakerDetails}
- Intro/Outro Music Mood: ${musicMood}
- Dialogue Language: ${language || "English"}

Ensure the conversation flows naturalistically. It must have pauses ("...", "uh", "hmm"), light mutual agreements ("totally", "absolutely"), occasional friendly chuckle or interrupts, and highly informative yet conversational debate. Do not make it sound like a reading of dry bullet points. Incorporate realistic actions and sound effects like [laughs], [sighs], [sips tea], [clears throat].

Keep estimated duration calculations accurate:
- Estimate roughly 1 second for every 3 words in a dialogue part. 
- short duration should aim for ~8-12 beautiful sequential lines (~60-90 seconds total)
- medium duration should aim for ~16-24 sequential lines (~120-180 seconds total)
- long duration should aim for ~32-45 sequential lines (~240-360 seconds total)

Structure the JSON output strictly matching the supplied schema.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "An incredibly captivating and clickable title for the episode" },
          tagline: { type: Type.STRING, description: "A memorable one-line summary or pitch" },
          description: { type: Type.STRING, description: "A refined and short editorial description of the episode content" },
          musicMood: { type: Type.STRING, description: "Recommended sound cue and music style based on user request" },
          speakers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Direct name of the speaker" },
                role: { type: Type.STRING, description: "E.g. Host, Technical Co-Host, Skeptic Guest, Expert" },
                bio: { type: Type.STRING, description: "A fun, witty, single-sentence introduction of their background" },
                voiceAccent: { type: Type.STRING, description: "Vocal description e.g. Warm and slow English accent, enthusiastic geeky speed" }
              },
              required: ["name", "role", "bio", "voiceAccent"]
            }
          },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Name of the podcast segment" },
                startSeconds: { type: Type.INTEGER, description: "Zero-based running start time in seconds" }
              },
              required: ["title", "startSeconds"]
            }
          },
          script: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Unique sequential ID starting at '1'" },
                speakerName: { type: Type.STRING, description: "The exact name of the character speaking this line" },
                dialogue: { type: Type.STRING, description: "The immersive verbal statement spoken by this character. Exclude meta actions." },
                soundEffect: { type: Type.STRING, description: "Emotional state or background audio action such as laughs, deep breath, keyboard tapping, coffee sip, clears throat or null if none", nullable: true },
                durationSeconds: { type: Type.NUMBER, description: "Estimated delivery duration for this piece of text in seconds" },
                estimatedStartSeconds: { type: Type.NUMBER, description: "Cumulative calculated start offset in seconds of this line within the podcast" }
              },
              required: ["id", "speakerName", "dialogue", "durationSeconds", "estimatedStartSeconds"]
            }
          }
        },
        required: ["title", "tagline", "description", "musicMood", "speakers", "chapters", "script"]
      };

      const response = await executeWithRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are the master engine of ECHO Studios. E.C.H.O. stands for:
E – Endless
C – Conversational
H – Host
O – Orchestrator

Your mission is to return beautifully structured podcast episode responses matching the provided schema, with witty, realistic dialogue flow, highly detailed chapters, and accurate duration mappings. Return valid JSON only.`,
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      }));

      const responseText = response.text;
      if (!responseText) {
        throw new Error("ECHO script orchestrator reached an empty response state.");
      }

      const podcastData = JSON.parse(responseText.trim());
      res.json(podcastData);

    } catch (e: any) {
      console.error("ECHO Studios Podcast Generation Error:", e);
      res.status(500).json({ error: e.message || "ECHO engine was unable to synthesize the screenplay orchestration." });
    }
  });

  // API Route for generating audio using TTS
  app.post("/api/generate-audio", async (req, res) => {
    try {
      const { script, speakers } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Missing API key" });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const voiceNames = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede', 'Zephyr'];
      
      const speakerVoiceMap: Record<string, string> = {};
      speakers.forEach((s: any, index: number) => {
        speakerVoiceMap[s.name] = voiceNames[index % voiceNames.length];
      });

      const buffers: Buffer[] = [];
      let totalLength = 0;
      let finalSampleRate = 24000;

      // Generate TTS sequentially to avoid rate limits
      for (let i = 0; i < script.length; i++) {
        const line = script[i];
        const voice = speakerVoiceMap[line.speakerName] || voiceNames[0];
        try {
          const interaction = await executeWithRetry(() => ai.interactions.create({
            model: "gemini-3.1-flash-tts-preview",
            // Generate audio for just the dialogue text, using the assigned voice
            input: line.dialogue,
            response_modalities: ['audio'],
            generation_config: {
              speech_config: [
                { voice: voice }
              ]
            }
          }));
          
          let pcmBase64 = null;
          let sampleRate = 24000;
          for (const step of interaction.steps) {
            if (step.type === 'model_output') {
              const audioContent = step.content?.find(c => c.type === 'audio');
              if (audioContent && audioContent.data) {
                pcmBase64 = audioContent.data;
                if (audioContent.sample_rate) sampleRate = audioContent.sample_rate;
              }
            }
          }
          
          if (pcmBase64) {
            const buf = Buffer.from(pcmBase64, 'base64');
            buffers.push(buf);
            totalLength += buf.length;
            finalSampleRate = sampleRate;
          }
        } catch (err: any) {
          console.error(`Line ${i} TTS error:`, err.message);
        }
      }

      if (buffers.length === 0) {
        throw new Error("No audio could be generated for the script.");
      }

      const combinedPcmBuffer = Buffer.concat(buffers, totalLength);
      const combinedWavBase64 = pcmToWavBase64(combinedPcmBuffer.toString('base64'), finalSampleRate);

      res.json({ audio: combinedWavBase64 });
    } catch (e: any) {
      console.error("TTS Error:", e);
      res.status(500).json({ error: e.stack || e.message || "Failed to generate audio" });
    }
  });

  // API Route for AI Oracle Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { text, fileBase64, fileMimeType, history, language } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Missing API key" });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const contents = history || [];
      const currentMessageParts: any[] = [];
      
      if (text) {
        currentMessageParts.push({ text: `[User is communicating in ${language}]: ${text}` });
      }

      if (fileBase64 && fileMimeType) {
        currentMessageParts.push({
          inlineData: {
            data: fileBase64,
            mimeType: fileMimeType
          }
        });
      }

      if (currentMessageParts.length > 0) {
        contents.push({ role: "user", parts: currentMessageParts });
      }

      const response = await executeWithRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `You are the AI ORACLE, an AI Design Assistant for ECHO Studios. You help users with SaaS typography, UX motion, layout density, and general app queries. 
You are highly capable of understanding screenshots and audio uploads. Be extremely helpful, concise, and friendly. 
IMPORTANT: The user has selected the language: ${language}. You MUST reply in ${language} unless explicitly asked otherwise.`,
        }
      }));

      res.json({ text: response.text });
    } catch (e: any) {
      console.error("AI Oracle Error:", e);
      res.status(500).json({ error: e.message || "Oracle failed to respond." });
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ECHO Studios] Service listening securely on http://localhost:${PORT}`);
  });
}

startServer();
