interface ChatType {
  text: string;
  from: "user" | "assistant";
}

interface PromptTutorialType {
  title: string;
  promptBase: string;
  promptInput: string;
  promptExample: string;
}

type TabsType = "tutorial" | "commands" | "home";

type TimeOfDayType = "Morning" | "Night" | "Evening" | "Afternoon" | "Unknown";

interface HandlerStateType {
  handlerPicked: boolean;
  handlerID: string | null;
}

export {
  ChatType,
  HandlerStateType,
  PromptTutorialType,
  TabsType,
  TimeOfDayType,
};
