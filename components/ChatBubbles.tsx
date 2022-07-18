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
  const [webviewHeight, setWebviewHeight] = useState(400);
  const jsToInject = `(function() {
    
    function format() {
      var element = null;
      if(document.querySelector(".di3YZe")){
        element = document.querySelector(".di3YZe"); 
      }
      if(document.querySelector("block-component")){
        element = document.querySelector("block-component");
      }
      if(document.querySelector("#knowledge-finance-wholepage__entity-summary")){
        element = document.querySelector("#knowledge-finance-wholepage__entity-summary");
      }
      if(document.querySelector(".obcontainer")){
        element = document.querySelector(".obcontainer");
      }
      if(document.querySelector("#kp-wp-tab-overview")){
        element = document.querySelector("#kp-wp-tab-overview");
      }
      document.querySelectorAll(".XbtRGb").forEach((el)=>{
        if(el.textContent.includes("People also search for")){
          el.style.display = "none"
        }
      }

      if(element){
        element.style.background = "white";
        element.style.height = "100vh";
        element.style.position= "absolute";
        element.style.top = "0px";
        element.style.bottom = "0px";
        element.style.left = "0px";
        element.style.right = "0px";
        element.style.padding = "10px";
        element.style.zIndex= "20";
        element.style.margin= "0px";
        const answerBoxHeight = element.getBoundingClientRect().height;
        document.body.style.height = answerBoxHeight + "px";
        document.body.style.overflow = "hidden";
        document.body.style.filter = "invert(1)";
        document.querySelectorAll('img').forEach(el => {
          el.style.filter = "invert(1)"
        });
        return answerBoxHeight;
      }
    }

    function pullOutAnswer(){
      let singleWordAnswer = ""
      const singleWordAnswerDiv = document.querySelector(".Z0LcW")
      
      let descriptiveAnser = ""
      const descriptionAnswerDiv1 = document.querySelectorAll(".LTKOO")[2]
      const descriptionAnswerDiv2 = document.querySelector(".hgKElc")
      
      if(singleWordAnswerDiv){
        singleWordAnswer = singleWordAnswerDiv.textContent.trim()
            console.log(singleWordAnswer)
      }
      
      if(descriptionAnswerDiv1){
        descriptiveAnser = descriptionAnswerDiv1.querySelector('span').textContent.trim()
        console.log(descriptiveAnser)
      }
      
      if(descriptionAnswerDiv2){
        descriptiveAnser = descriptionAnswerDiv2.textContent.trim()
        console.log(descriptiveAnser)
      }
      return singleWordAnswer || descriptiveAnser
    }

    const boxHeight = format()
    const answer = pullOutAnswer()

    window.ReactNativeWebView.postMessage(JSON.stringify({boxHeight: boxHeight,answer: answer}))


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
        style={{ height: webviewHeight, width: "100%", overflow: "hidden" }}>
        <WebView
          source={{
            uri: chat.extraData.url,
          }}
          injectedJavaScript={jsToInject}
          onMessage={(e) => {
            onWebviewMessage(e.nativeEvent.data);
          }}
          style={{
            marginTop: 20,
            height: 400,
            borderRadius: 20,
            overflow: "hidden",
            padding: 10,
          }}
        />
      </View>
    </View>
  );
};
