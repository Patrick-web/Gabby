/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';

import {
  Platform,
  UIManager,
  StyleSheet,
  LayoutAnimation,
  View,
  LogBox,
} from 'react-native';

import TabSwitcher from './components/TabSwitcher';
import Visualizer from './components/Visualizer';
import SpeakButton from './components/SpeakButton';
import Greeting from './components/Greeting';
import Chats from './components/Chats';
import Tabs from './components/Tabs';
import Modal from './components/Modal';

import {ChatType, TabsType} from './types';
import {GlobalContext} from './context/globalContext';
import {initStore} from './stores/staticStore';

LogBox.ignoreLogs(['new NativeEventEmitter']);

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  const [listening, setListening] = useState(false);
  const [activeTab, setActiveTab] = useState<TabsType>('home');
  const [partialSpeechResults, setPartialSpeechResults] = useState('');
  const [chats, setAllChats] = useState<ChatType[]>([]);
  const [modalChild, setModalChild] = useState(null);

  function addChat(chat: ChatType) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAllChats(arr => [...arr, chat]);
    if (chat.extraData?.modalChild) {
      setModalChild(chat.extraData.modalChild);
    }
  }
  function _setPartialSpeechResults(text: string) {
    setPartialSpeechResults(text);
  }

  function setIsListening(state: boolean) {
    console.log(`listening: ${state}`);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (activeTab === 'home') {
      setListening(state);
    } else {
      setActiveTab('home');
    }
  }

  useEffect(() => {
    initStore();
  }, []);

  return (
    <View style={styles.container}>
      <GlobalContext.Provider
        value={{chats, addChat, isListening: listening, setIsListening}}>
        {modalChild && (
          <Modal setModalChild={setModalChild} child={modalChild} />
        )}
        <TabSwitcher
          inListenMode={listening}
          activeTab={activeTab}
          switchTab={(tab: any) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setActiveTab(tab);
          }}
        />
        <Visualizer isListening={listening} />

        <View
          style={{
            flex: 1,
            marginTop: -20,
            width: '100%',
          }}>
          {activeTab == 'home' ? (
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
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});

export default App;
