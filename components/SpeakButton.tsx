import React, { useState, useEffect, useContext } from "react";
import Tts from "react-native-tts";
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice";
import { Image, Pressable, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { decisionMaker, setCoreFx, removeHandler } from "../engine/engine";
import { GlobalContext } from "../context/globalContext";

const SpeakButton = ({
  isListening,
  toggleListenMode,
  activeTab,
  _setPartialSpeechResults,
}: {
  isListening: boolean;
  activeTab: "tutorial" | "commands" | "home";
  toggleListenMode: Function;
  _setPartialSpeechResults: Function;
}) => {
  const { addChat } = useContext(GlobalContext);
  const [activeResolver, setActiveResolver] = useState<string | null>(null);

  const onSpeechEnd = () => {
    _setPartialSpeechResults("");
    toggleListenMode(false);
  };

  const onSpeechError = () => {
    // console.log("onSpeechError: ", e);
    toggleListenMode(false);
    removeHandler();
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (!e.value) {
      return;
    }
    const spokenText = e.value[0];
    addChat({ from: "user", text: spokenText });
    _setPartialSpeechResults("");
    decisionMaker(spokenText);
  };

  const onSpeechPartialResults = (e: any) => {
    _setPartialSpeechResults(e.value[0]);
  };

  const startVoiceRecognition = async () => {
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  const stopVoiceRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  function toggleRecognition(turnOn: boolean) {
    if (turnOn) {
      startVoiceRecognition();
      toggleListenMode(true);
      return;
    }
    if (isListening == true) {
      stopVoiceRecognizing();
      toggleListenMode(false);
    } else {
      if (activeTab === "home") {
        startVoiceRecognition();
        toggleListenMode(true);
      } else {
        toggleListenMode(false);
      }
    }
  }

  useEffect(() => {
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    setCoreFx(addChat, toggleRecognition);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <Pressable
      onPress={toggleRecognition}
      style={{
        backgroundColor: "crimson",
        height: isListening ? 50 : activeTab == "home" ? 100 : 60,
        width: isListening ? 180 : activeTab == "home" ? 100 : 60,
        borderRadius: 50,
        position: "absolute",
        bottom: 20,
        zIndex: 20,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
      {isListening == false && (
        <LinearGradient
          // Background Linear Gradient
          colors={["#E87BEF", "#FF55A7", "#963CCE"]}
          style={{
            width: "100%",
            height: "100%",
            transform: [{ rotate: "40deg" }],
            position: "absolute",
          }}
        />
      )}
      {isListening == true ? (
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
          Stop Listening
        </Text>
      ) : (
        <Image
          style={{
            width: activeTab == "home" ? 30 : 20,
            height: activeTab == "home" ? 38 : 26,
          }}
          source={require("../assets/mic-icon.png")}
        />
      )}
    </Pressable>
  );
};

export default SpeakButton;
