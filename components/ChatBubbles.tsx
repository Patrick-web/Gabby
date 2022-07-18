import React, { useState } from "react";
import { View, Text } from "react-native";
import Tts from "react-native-tts";
import { WebView } from "react-native-webview";
import { ChatType } from "../types";

export const TextBubble = ({
  from,
  text,
}: {
  from: "user" | "assistant";
  text: string;
}) => {
  return (
    <View
      style={{
        width: "100%",
        alignItems: from == "user" ? "flex-end" : "flex-start",
        marginVertical: 5,
      }}>
      <View
        style={{
          backgroundColor: from == "user" ? "#2D1342" : "#700C58",
          borderRadius: 20,
          borderTopRightRadius: from == "user" ? 0 : 20,
          borderTopLeftRadius: from == "user" ? 20 : 0,
          maxWidth: "90%",
          padding: 10,
        }}>
        <Text style={{ color: "white" }}>{text}</Text>
      </View>
    </View>
  );
};

export const GoogleBubble = ({ chat }: { chat: ChatType }) => {
  const [webviewHeight, setWebviewHeight] = useState(260);
  const jsToInject = `(function() {
        document.body.style.filter = "invert(1)";
        document.querySelectorAll('img').forEach(el => {
          el.style.filter = "invert(1)"
        });
})();`;

  let prevAnswer = "";

  function onWebviewMessage(jsonObj: string) {
    console.log("Called onWebviewMessage");
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

  return (
    <View
      style={{
        marginVertical: 5,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <View
        style={{
          height: webviewHeight,
          borderRadius: 20,
          width: "100%",
          overflow: "hidden",
        }}>
        <WebView
          source={{
            uri: chat.extraData.url,
          }}
          injectedJavaScript={jsToInject}
          onMessage={(e) => {
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
