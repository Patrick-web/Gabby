import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Pressable, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {WebView} from 'react-native-webview';

const Modal = ({data, setModalData}: any) => {
  const webviewRef = useRef<any>();
  function goBackWebview() {
    webviewRef.current.goBack();
  }
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        zIndex: 25,
      }}>
      <Pressable
        onPress={() => setModalData(null)}
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          borderColor: 'black',
          borderWidth: 4,
          height: 40,
          width: 40,
          right: '45%',
          top: 0,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
        <Svg
          width={20}
          height={20}
          fill="none"
          viewBox="0 0 24 24"
          stroke={'black'}
          strokeWidth={2}>
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </Svg>
      </Pressable>
      <View
        style={{
          backgroundColor: 'yellow',
          height: '95%',
          borderRadius: 20,
          overflow: 'hidden',
          marginTop: 20,
        }}>
        {data.modalChild == 'games' && (
          <WebView source={{uri: 'https://poki.com/'}} />
        )}
        {data.modalChild == 'chess' && (
          <WebView source={{uri: 'https://poki.com/en/g/master-chess'}} />
        )}
        {data.modalChild == 'sudoku' && (
          <WebView source={{uri: 'https://poki.com/en/g/sudoku-village'}} />
        )}
        {data.modalChild == 'checkers' && (
          <WebView source={{uri: 'https://poki.com/en/g/master-checkers'}} />
        )}
        {data.modalChild == 'memes' && (
          <WebView source={{uri: 'https://redditmemes.netlify.app/'}} />
        )}
        {data.modalChild == 'news' && (
          <WebView
            source={{uri: 'https://news.google.com'}}
            style={{marginTop: -80}}
          />
        )}
        {data.modalChild == 'music' && (
          <View style={{height: '100%', position: 'relative'}}>
            <WebView source={{uri: data.url}} ref={webviewRef} />
            <View
              style={{
                height: 50,
                width: '100%',
                position: 'absolute',
                bottom: 0,
                left: 0,
                backgroundColor: 'black',
                zIndex: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Pressable
                onPress={() => goBackWebview()}
                style={{
                  width: 100,
                  height: 40,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Svg
                  height={20}
                  width={20}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                  strokeWidth={2}>
                  <Path
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </Svg>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Modal;
