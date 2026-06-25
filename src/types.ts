export interface Speaker {
  name: string;
  role: string;
  bio: string;
  voiceAccent: string;
  avatarSeed: string;
  gender: "male" | "female" | "neutral";
  style: string;
}

export interface Chapter {
  title: string;
  startSeconds: number;
}

export interface ScriptLine {
  id: string;
  speakerName: string;
  dialogue: string;
  soundEffect: string | null;
  durationSeconds: number;
  estimatedStartSeconds: number;
}

export interface PodcastMetadata {
  title: string;
  tagline: string;
  description: string;
  musicMood: string;
  speakers: Speaker[];
  chapters: Chapter[];
  script: ScriptLine[];
}

export interface PresetTopic {
  emoji: string;
  category: string;
  topic: string;
  description: string;
}
