export interface ChatType {
  text: string;
  from: "user" | "assistant";
}

export interface PromptTutorialType {
  title: string;
  promptBase: string;
  promptInput: string;
  promptExample: string;
}

export type TabsType = "tutorial" | "commands" | "home";

export type TimeOfDayType =
  | "Morning"
  | "Night"
  | "Evening"
  | "Afternoon"
  | "Unknown";

export interface HandlerStateType {
  handlerPicked: boolean;
  handlerID: KeywordsType | null;
}

export interface AppType {
  packageName: string;
  versionName: string;
  versionCode: string;
  firstInstallTime: string;
  lastUpdateTime: string;
  appName: string;
  icon: string; // Base64
  apkDir: string;
  size: string; // Bytes
}

export interface JokeType {
  _id: string;
  setup: string;
  punchline: string;
  type: string;
  likes: any[];
  author: { name: string; id?: any };
  approved: boolean;
  date: number;
  NSFW: boolean;
}

export type KeywordsType =
  | "hello"
  | "hi"
  | "hey"
  | "morning"
  | "open"
  | "whatsapp"
  | "call"
  | "message"
  | "text"
  | "sms"
  | "weather"
  | "temperature"
  | "email"
  | "joke"
  | "notifications"
  | "launch"
  | "brightness"
  | "reminder";
