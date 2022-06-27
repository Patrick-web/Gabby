/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import Voice from "@react-native-voice/voice";
import {
  Platform,
  UIManager,
  StyleSheet,
  LayoutAnimation,
  View,
} from "react-native";

import TabSwitcher from "./components/TabSwitcher";
import Visualizer from "./components/Visualizer";
import SpeakButton from "./components/SpeakButton";
import Greeting from "./components/Greeting";
import Chats from "./components/Chats";
import Tabs from "./components/Tabs";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  const [listening, setListening] = useState(false);
  const [activeTab, setActiveTab] = useState<"tutorial" | "commands" | "home">(
    "home"
  );
  const [partialSpeechResults, setPartialSpeechResults] = useState("");
  const [chats, setAllChats] = useState<any[]>([]);

  function addChat(chat: any) {
    setTimeout(() => {
      console.log("Adding new chat ");
      setAllChats((arr) => [...arr, chat]);
      console.log(chats);
    }, 1000);
  }
  function _setPartialSpeechResults(text: string) {
    setPartialSpeechResults(text);
  }

  function setIsListening(state: boolean) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (activeTab === "home") {
      setListening(state);
    } else {
      setActiveTab("home");
    }
  }
  useEffect(() => {
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View style={styles.container}>
      <TabSwitcher
        inListenMode={listening}
        activeTab={activeTab}
        switchTab={(tab: any) => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setActiveTab(tab);
        }}
      />
      <Visualizer isListening={listening} />

      <View
        style={{
          flex: 1,
          marginTop: -20,
          width: "100%",
        }}>
        {activeTab == "home" ? (
          <>
            <Greeting isListening={listening} />
            <Chats
              isListening={listening}
              chats={chats}
              partialSpeechResults={partialSpeechResults}
            />
          </>
        ) : (
          <Tabs activeTab={activeTab} />
        )}
      </View>
      <SpeakButton
        isListening={listening}
        activeTab={activeTab}
        toggleListenMode={(state: boolean) => setIsListening(state)}
        _setPartialSpeechResults={(text: string) =>
          _setPartialSpeechResults(text)
        }
        addChat={(chat: any) => addChat(chat)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050615",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
