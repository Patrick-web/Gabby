/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";

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

import { TabsType } from "./types";
import { GlobalContext } from "./context/globalContext";
import { initStore } from "./stores/staticStore";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  const [listening, setListening] = useState(false);
  const [activeTab, setActiveTab] = useState<TabsType>("home");
  const [partialSpeechResults, setPartialSpeechResults] = useState("");
  const [chats, setAllChats] = useState<any[]>([]);

  function addChat(chat: any) {
    setTimeout(() => {
      setAllChats((arr) => [...arr, chat]);
    }, 1000);
  }
  function _setPartialSpeechResults(text: string) {
    setPartialSpeechResults(text);
  }

  function setIsListening(state: boolean) {
    console.log("speak pressed");
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (activeTab === "home") {
      setListening(state);
    } else {
      setActiveTab("home");
    }
  }

  useEffect(() => {
    initStore();
  }, []);

  return (
    <View style={styles.container}>
      <GlobalContext.Provider
        value={{ chats, addChat, isListening: listening, setIsListening }}>
        <TabSwitcher
          inListenMode={listening}
          activeTab={activeTab}
          switchTab={(tab: any) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
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
              <Chats partialSpeechResults={partialSpeechResults} />
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
        />
      </GlobalContext.Provider>
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
