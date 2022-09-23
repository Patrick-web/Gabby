import React, {useState, useEffect} from 'react';
import {View, Text, LayoutAnimation} from 'react-native';
import Tts from 'react-native-tts';
import {WebView} from 'react-native-webview';
import {ChatType} from '../types';

export const TextBubble = ({
  from,
  text,
}: {
  from: 'user' | 'assistant';
  text: string;
}) => {
  return (
    <View
      style={{
        width: '100%',
        alignItems: from == 'user' ? 'flex-end' : 'flex-start',
        marginVertical: 5,
      }}>
      <View
        style={{
          backgroundColor: from == 'user' ? '#2D1342' : '#700C58',
          borderRadius: 20,
          borderTopRightRadius: from == 'user' ? 0 : 20,
          borderTopLeftRadius: from == 'user' ? 20 : 0,
          maxWidth: '90%',
          padding: 10,
        }}>
        <Text style={{color: 'white'}}>{text}</Text>
      </View>
    </View>
  );
};

export const GoogleBubble = ({chat}: {chat: ChatType}) => {
  const [webviewHeight, setWebviewHeight] = useState(0);
  const jsToInject = `(function() {
        document.body.style.filter = "invert(1)";
        document.querySelectorAll('img').forEach(el => {
          el.style.filter = "invert(1)"
        });
})();`;

  let prevAnswer = '';

  function onWebviewMessage(jsonObj: string) {
    console.log('Called onWebviewMessage');
    interface Data {
      boxHeight: number;
      answer: string;
    }
    const data: Data = JSON.parse(jsonObj);
    if (prevAnswer !== data.answer) {
      setWebviewHeight(data.boxHeight);
      Tts.speak(data.answer);
    }
    prevAnswer = data.answer;
  }

  useEffect(() => {
    setTimeout(() => {
      setWebviewHeight(260);
    }, 1000);
  }, []);

  return (
    <View
      style={{
        marginVertical: 5,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: 260,
          borderRadius: 20,
          width: '100%',
          overflow: 'hidden',
        }}>
        <WebView
          source={{
            uri: chat.extraData.url,
          }}
          injectedJavaScript={jsToInject}
          injectedJavaScriptBeforeContentLoaded={jsToInject}
          onMessage={e => {
            onWebviewMessage(e.nativeEvent.data);
          }}
          style={{
            marginTop: -150,
            height: 400,
          }}
        />
      </View>
    </View>
  );
};

export const ChessBubble = () => {
  const [webviewHeight, setWebviewHeight] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setWebviewHeight(435);
    }, 1000);
  }, []);

  return (
    <View
      style={{
        marginVertical: 5,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: webviewHeight,
          borderRadius: 20,
          width: '100%',
          overflow: 'hidden',
        }}>
        <WebView
          source={{
            uri: 'https://www.chess.com/play/computer/',
          }}
          style={{
            height: 435,
          }}
        />
      </View>
    </View>
  );
};

export const GamesBubble = () => {
  const [webviewHeight, setWebviewHeight] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setWebviewHeight(600);
    }, 1000);
  }, []);

  return (
    <View
      style={{
        marginVertical: 5,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        height: 800,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: webviewHeight,
          borderRadius: 20,
          width: '100%',
          overflow: 'scroll',
        }}>
        <WebView
          source={{
            uri: 'https://poki.com/',
          }}
          style={{
            height: 1000,
          }}
        />
      </View>
    </View>
  );
};

export const MusicBubble = ({chat}: {chat: ChatType}) => {
  const [webviewHeight, setWebviewHeight] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setWebviewHeight(600);
    }, 1000);
  }, []);

  return (
    <View
      style={{
        marginVertical: 5,
        width: '100%',
        height: 400,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: webviewHeight,
          borderRadius: 20,
          width: '100%',
          overflow: 'scroll',
          position: 'relative',
        }}>
        <WebView
          source={{
            uri: chat.extraData.url,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 50,
          }}></View>
      </View>
    </View>
  );
};
