import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-tts-preview",
      input: "Maya: Hello\nMarcus: Hi",
      response_modalities: ['audio'],
      generation_config: {
        speech_config: [
          { speaker: "Maya", voice: "Puck" },
          { speaker: "Marcus", voice: "Zephyr" }
        ]
      }
    });
    for (const step of interaction.steps) {
      if (step.type === 'model_output') {
        const audioContent = step.content?.find(c => c.type === 'audio');
        if (audioContent) {
           console.log("Audio Content:", { ...audioContent, data: audioContent.data?.length });
        }
      }
    }
  } catch(e: any) {
    console.error("FAILED:", e.stack || e.message);
  }
}
run();
