import React, { useContext, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { GlobalContext } from "../context/globalContext";
import ChatBubble from "./ChatBubble";
import { WebView } from "react-native-webview";

const Chats = ({ partialSpeechResults }: { partialSpeechResults: string }) => {
  const { chats, isListening } = useContext(GlobalContext);
  const scrollViewRef = useRef();
  const [webviewHeight, setWebviewHeight] = useState(400);
  const jsToInject = `(function() {
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
    if(element){
      element.style.background = "white"
      element.style.height = "100vh"
      element.style.position= "absolute"
      element.style.top = "0px"
      element.style.bottom = "0px"
      element.style.left = "0px"
      element.style.right = "0px"
      element.style.padding = "10px"
      element.style.zIndex= "20"
      element.style.margin= "0px"
      // element.style.color = "white"
      // element.querySelectorAll('div').forEach(el => {
      //   el.style.color = "white"
      // });
      // element.querySelectorAll('td').forEach(el => {
      //   el.style.color = "white"
      // });
      // element.querySelectorAll('span').forEach(el => {
      //   el.style.color = "white"
      // });
      const answerBoxHeight = element.getBoundingClientRect().height
      document.body.style.height = answerBoxHeight + "px"
      document.body.style.overflow = "hidden"
      document.body.style.filter = "invert(1)"
      window.ReactNativeWebView.postMessage(answerBoxHeight)
    }
})();`;
  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
      style={{
        width: "100%",
        height: 300,
        paddingHorizontal: 10,
        paddingBottom: 40,
        marginTop: isListening ? 80 : 0,
        marginBottom: 140,
      }}>
      <WebView
        source={{
          uri: "https://www.google.com/search?q=when+is+world+cup+2022&client=ubuntu&channel=fs&ei=jSXUYvqZHPn87_UP1eSKoAc&ved=0ahUKEwi6lIfQmYD5AhV5_rsIHVWyAnQQ4dUDCA0&uact=5&oq=when+is+world+cup+2022&gs_lcp=Cgdnd3Mtd2l6EAMyCggAEEcQsAMQyQMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAELADEEMyBwgAELADEEMyBwgAELADEEMyBwgAELADEEMyCggAEOQCELADGAEyCggAEOQCELADGAEyCggAEOQCELADGAEyDAguEMgDELADEEMYAkoECEEYAEoECEYYAVAAWABgggJoAXABeACAAQCIAQCSAQCYAQDIARDAAQHaAQYIARABGAnaAQYIAhABGAg&sclient=gws-wiz#sbfbu=0&pi=when%20is%20world%20cup%202022",
        }}
        injectedJavaScript={jsToInject}
        onMessage={(e) => {
          console.log(e.nativeEvent.data);
          setWebviewHeight(Number.parseFloat(e.nativeEvent.data));
          console.log(webviewHeight);
        }}
        style={{
          marginTop: 20,
          height: webviewHeight,
          borderRadius: 20,
          overflow: "hidden",
          padding: 10,
        }}
      />
      <ChatBubble fullwidth={false} from={"assistant"} text="How Can I Help" />
      {chats.map((chat: any, index: number) => (
        <ChatBubble
          key={index}
          fullwidth={true}
          from={chat.from}
          text={chat.text}
        />
      ))}
      {partialSpeechResults !== "" && (
        <ChatBubble
          fullwidth={false}
          from={"user"}
          text={partialSpeechResults}
        />
      )}
    </ScrollView>
  );
};

export default Chats;
