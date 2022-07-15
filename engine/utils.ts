import Tts from "react-native-tts";

export function speak(text: string) {
  Tts.speak(text);
}
