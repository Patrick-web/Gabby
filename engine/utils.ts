import Tts from "react-native-tts";
import { actions } from "../stores/staticStore";

export function speak(text: string) {
  if (actions.useVoiceReply()) {
    Tts.speak(text);
  }
}

export function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
