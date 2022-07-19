import React, {useEffect, useState} from 'react';
import {BackHandler, Pressable, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {WebView} from 'react-native-webview';

const Modal = ({child, setModalChild}: any) => {
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
        onPress={() => setModalChild(null)}
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
        {child == 'games' && <WebView source={{uri: 'https://poki.com/'}} />}
        {child == 'chess' && (
          <WebView source={{uri: 'https://poki.com/en/g/master-chess'}} />
        )}
        {child == 'sudoku' && (
          <WebView source={{uri: 'https://poki.com/en/g/sudoku-village'}} />
        )}
        {child == 'checkers' && (
          <WebView source={{uri: 'https://poki.com/en/g/master-checkers'}} />
        )}
        {child == 'memes' && (
          <WebView source={{uri: 'https://redditmemes.netlify.app/'}} />
        )}
      </View>
    </View>
  );
};

export default Modal;
