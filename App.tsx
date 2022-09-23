import React, {useEffect, useState} from 'react';

import {
  Platform,
  UIManager,
  StyleSheet,
  LayoutAnimation,
  View,
  LogBox,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sleep} from './engine/utils';

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
  const [modalData, setModalData] = useState(null);

  function addChat(chat: ChatType) {
    console.log('Adding chat');
    console.log(chat);
    setAllChats(arr => [...arr, chat]);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (chat.extraData?.modalChild) {
      console.log('chat.extraData');
      console.log(chat);
      setModalData(chat.extraData);
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

  async function onboard() {
    addChat({text: 'Hello 👋', variant: 'basic text', extraData: {}});
    await sleep(1500);
    addChat({
      text: 'Am Gabby, a voice assistant',
      variant: 'basic text',
      extraData: {},
    });
    await sleep(2000);
    addChat({
      text: 'To see what I can do, click on Commands up there ☝️',
      variant: 'basic text',
      extraData: {},
    });
    await sleep(2800);
    addChat({
      text: 'If you are confused on the layout of the app, click on Tutorial also up there ☝️  for a walk through',
      variant: 'basic text',
      extraData: {},
    });
    await sleep(3000);
    addChat({
      text: 'Also, you might want to lower your volume as I reply by voice 🎤',
      variant: 'basic text',
      extraData: {},
    });
  }

  useEffect(() => {
    async function intialize() {
      await initStore();
      SplashScreen.hide();
      AsyncStorage.getItem('firstLaunch').then(value => {
        if (!value) {
          onboard();
          AsyncStorage.setItem('firstLaunch', 'yes');
        } else {
          addChat({
            text: 'How can I help',
            variant: 'basic text',
            extraData: {},
          });
        }
      });
    }
    intialize();
  }, []);

  return (
    <View style={styles.container}>
      <GlobalContext.Provider
        value={{chats, addChat, isListening: listening, setIsListening}}>
        {modalData && <Modal setModalData={setModalData} data={modalData} />}
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
