import React, { useState, useEffect } from "react";
import Voice from "@react-native-voice/voice";
import { Image, Pressable, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const SpeakButton = ({
  isListening,
  toggleListenMode,
  activeTab,
  _setPartialSpeechResults,
  addChat,
}: {
  isListening: boolean;
  activeTab: "tutorial" | "commands" | "home";
  toggleListenMode: Function;
  addChat: Function;
  _setPartialSpeechResults: Function;
}) => {
  const [started, setStarted] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [pitch, setPitch] = useState("");
  const [recognized, setRecognized] = useState("");

  const onSpeechStart = (e: any) => {
    console.log("onSpeechStart: ", e);
    setStarted("√");
  };

  const onSpeechRecognized = (e: any) => {
    console.log("onSpeechRecognized: ", e);
    setRecognized("√");
  };

  const onSpeechEnd = (e: any) => {
    _setPartialSpeechResults("");
    toggleListenMode(false);
  };

  const onSpeechError = (e: any) => {
    console.log("onSpeechError: ", e);
    toggleListenMode(false);
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e: any) => {
    addChat({ from: "user", text: e.value[0] });
    _setPartialSpeechResults("");
  };

  const onSpeechPartialResults = (e: any) => {
    console.log("onSpeechPartialResults: ", e);
    _setPartialSpeechResults(e.value[0]);
  };

  const onSpeechVolumeChanged = (e: any) => {
    // console.log("onSpeechVolumeChanged: ", e);
    setPitch(e.value);
  };

  const startVoiceRecognition = async () => {
    setRecognized("");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");

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

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setRecognized("");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");
  };

  function toggleRecognition() {
    if (isListening == true) {
      stopVoiceRecognizing();
      toggleListenMode(false);
    } else {
      if (activeTab === "home") {
        startVoiceRecognition();
        toggleListenMode(true);
      }
    }
  }

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    console.log("Voices loaded");
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
