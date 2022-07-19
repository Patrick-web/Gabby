import React from 'react';
import {View, Text} from 'react-native';

import {PromptTutorialType} from '../types';

const PromptTutorialCard = ({prompt}: {prompt: PromptTutorialType}) => {
  return (
    <View
      style={{
        margin: 10,
        borderColor: '#BC61C2',
        padding: 10,
        borderLeftWidth: 2,
      }}>
      <Text style={{color: 'white', fontSize: 20, fontWeight: '900'}}>
        {prompt.title}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            color: 'white',
            fontSize: 15,
            fontWeight: '300',
            marginRight: 5,
            fontStyle: 'italic',
          }}>
          for example: {prompt.example}
        </Text>
      </View>
    </View>
  );
};

export default PromptTutorialCard;
