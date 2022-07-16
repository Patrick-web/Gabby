import Tts from "react-native-tts";
import { HandlerStateType } from "../types";
import { MakeCallHandler, SendMessageHandler } from "./Handlers";

const keyphrases = [
  "hello",
  "hi",
  "hey",
  "morning",
  "call",
  "message",
  "text",
  "sms",
  "weather",
  "temperature",
  "email",
  "notifications",
  "open",
  "brightness",
  "reminder",
];

const commands = new Map();

const callHandler = new MakeCallHandler();
commands.set("call", callHandler);
const messageHandler = new SendMessageHandler();
commands.set("message", messageHandler);
commands.set("text", messageHandler);
commands.set("sms", messageHandler);

//State that influences the decisionMaker
/*
  State 1 => No handler has been picked, look for appropriate handler
  State 2 => In converstion flow, forward spokenText to handler

The handler must be able to swith the decisionMaker make state between 1 or 2.
When a converstion flow ends, the handler should set the state to State 1
*/
const handlerState: HandlerStateType = {
  handlerPicked: false,
  handlerID: null,
};

function setHandler(handlerID: typeof keyphrases) {
  handlerState.handlerID = handlerID as any;
  handlerState.handlerPicked = true;
}
export function removeHandler() {
  handlerState.handlerID = null;
  handlerState.handlerPicked = false;
}

let addChatFx: Function;
function sendAMessage(text: string) {
  addChatFx({ from: "assistant", text });
  Tts.speak(text);
}

export function setCoreFx(_addChatFx: Function, _toggleSpeakFx: Function) {
  addChatFx = _addChatFx;
  commands.forEach((handler) =>
    handler.setCoreFunctions(
      _addChatFx,
      _toggleSpeakFx,
      setHandler,
      removeHandler
    )
  );
}

export function decisionMaker(spokenText: string) {
  if (handlerState.handlerPicked == false) {
    const handlerID = keyphrases.find((phrase: string) =>
      spokenText.toLowerCase().includes(phrase)
    );
    console.log(`Handler is ${handlerID}`);
    if (handlerID) {
      const handler = commands.get(handlerID);
      handler.handleInput(spokenText);
    } else {
      sendAMessage("Sorry, I don't understand that");
    }
    return;
  }

  if (handlerState.handlerPicked == true) {
    const handlerID = handlerState.handlerID as string;
    console.log(`Flow Handler is ${handlerID}`);
    const handler = commands.get(handlerID);
    return handler.handleInput(spokenText);
  }
}
