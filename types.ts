export interface PromptTutorialType {
  title: string;
  example: string;
}

export type TabsType = 'tutorial' | 'commands' | 'home';

export type TimeOfDayType =
  | 'Morning'
  | 'Night'
  | 'Evening'
  | 'Afternoon'
  | 'Unknown';

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
  author: {name: string; id?: any};
  approved: boolean;
  date: number;
  NSFW: boolean;
}

export interface QuoteType {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}

export type ChatBubbleVariants =
  | 'basic text'
  | 'weather'
  | 'google'
  | 'youtube'
  | 'games'
  | 'memes'
  | 'news';

export interface ChatType {
  variant: ChatBubbleVariants;
  text: string;
  extraData: any;
}

export type KeywordsType =
  | 'hello'
  | 'hi'
  | 'hey'
  | 'morning'
  | 'open'
  | 'whatsapp'
  | 'call'
  | 'message'
  | 'text'
  | 'sms'
  | 'weather'
  | 'temperature'
  | 'email'
  | 'joke'
  | 'quote'
  | 'notifications'
  | 'launch'
  | 'brightness'
  | 'reminder'
  | 'google'
  | 'who'
  | 'why'
  | 'when'
  | 'how'
  | 'what'
  | 'which'
  | 'memes'
  | 'play'
  | 'game'
  | 'chess'
  | 'sudoku'
  | 'checkers'
  | 'start over'
  | 'news'
  | ' reset';
