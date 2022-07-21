import Tts from "react-native-tts";
import { actions } from "../stores/staticStore";

export function speak(text: string) {
  if (actions.useVoiceReply()) {
    try {
      Tts.speak(text);
    } catch (error) {
      console.log("Error speaking");
      console.log(error);
    }
  }
}

export function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
