import Tts from "react-native-tts";
import { HandlerStateType, KeywordsType } from "../types";
import {
  AppOpenerHandler,
  GiveQuoteHandler,
  GoogleItHandler,
  MakeCallHandler,
  SendEmailHandeler,
  SendMessageHandler,
  SendWhatsappMessageHandler,
  TellJokeHandler,
} from "./Handlers";

const keyphrases: KeywordsType[] = [
  "hello",
  "hi",
  "hey",
  "morning",
  "open",
  "whatsapp",
  "call",
  "message",
  "text",
  "sms",
  "weather",
  "temperature",
  "email",
  "notifications",
  "launch",
  "brightness",
  "reminder",
  "joke",
  "quote",
  "google",
  "who",
  "why",
  "when",
  "how",
  "what",
];

const commands = new Map<KeywordsType, any>();

const callHandler = new MakeCallHandler();
commands.set("call", callHandler);
const messageHandler = new SendMessageHandler();
commands.set("message", messageHandler);
commands.set("text", messageHandler);
commands.set("sms", messageHandler);
const appOpenHandler = new AppOpenerHandler();
commands.set("open", appOpenHandler);
commands.set("launch", appOpenHandler);
const whatsappMessageHandler = new SendWhatsappMessageHandler();
commands.set("whatsapp", whatsappMessageHandler);
const emailHandler = new SendEmailHandeler();
commands.set("email", emailHandler);
const jokeHandler = new TellJokeHandler();
commands.set("joke", jokeHandler);
const quoteHandler = new GiveQuoteHandler();
commands.set("quote", quoteHandler);
const googleHandler = new GoogleItHandler();
commands.set("google", googleHandler);
commands.set("who", googleHandler);
commands.set("why", googleHandler);
commands.set("when", googleHandler);
commands.set("how", googleHandler);
commands.set("what", googleHandler);
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
  if (handlerState.handlerID) {
    const command = commands.get(handlerState.handlerID);
    command.cleanUp();
    console.log(`handler: ${handlerState.handlerID} removed`);
    handlerState.handlerID = null;
    handlerState.handlerPicked = false;
  }
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
  try {
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

    if (handlerState.handlerPicked == true && handlerState.handlerID) {
      const handlerID = handlerState.handlerID;
      console.log(`Flow Handler is ${handlerID}`);
      const handler = commands.get(handlerID);
      return handler.handleInput(spokenText);
    }
  } catch (error) {
    console.log("Error in decisionMaker");
  }
}
