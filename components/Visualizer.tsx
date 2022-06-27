import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions } from "react-native";
import Video from "react-native-video";

const deviceWidth = Dimensions.get("screen").width;

const Visualizer = ({ isListening }: { isListening: boolean }) => {
  let video = useRef<any>(null);
  return (
    <View
      style={{
        position: "absolute",
        top: isListening ? -40 : 40,
        width: isListening ? deviceWidth : 15,
        height: isListening ? 350 : 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isListening ? "#050615" : "transparent",
        overflow: "hidden",
        borderRadius: isListening ? 0 : 10,
      }}>
      <Video
        source={require("../assets/visualizer.mp4")}
        repeat={true}
        paused={!isListening}
        ref={(ref: any) => (video = ref)}
        style={{
          width: deviceWidth - 150,
          height: deviceWidth - 150,
          alignSelf: "center",
        }}
      />
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 30,
          marginTop: isListening ? 20 : 150,
          opacity: isListening ? 1 : 0,
        }}>
        Am Listening...
      </Text>
    </View>
  );
};

export default Visualizer;
