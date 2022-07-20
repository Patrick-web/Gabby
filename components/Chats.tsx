import React, { useContext, useRef } from "react";
import { ScrollView } from "react-native";
import { GlobalContext } from "../context/globalContext";
import { ChatType } from "../types";
import { TextBubble, GoogleBubble } from "./ChatBubbles";

const Chats = ({ partialSpeechResults }: { partialSpeechResults: string }) => {
  const { chats, isListening } = useContext(GlobalContext);
  const scrollViewRef = useRef<any>();
  function onNewChat() {
    if (!scrollViewRef?.current) {
      return;
    }
    scrollViewRef.current.scrollToEnd({ animated: false });
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }, 1000);
  }
  return (
    <ScrollView
      ref={scrollViewRef}
      nestedScrollEnabled={true}
      onContentSizeChange={() => onNewChat()}
      style={{
        width: "100%",
        height: 300,
        paddingHorizontal: 10,
        paddingBottom: 40,
        marginTop: isListening ? (chats.length > 1 ? 250 : 230) : 0,
        marginBottom: 140,
      }}>
      {chats.map((chat: ChatType, index: number) => {
        if (chat.variant == "basic text") {
          return (
            <TextBubble
              from={chat.extraData.from}
              text={chat.text}
              key={index}
            />
          );
        }
        if (chat.variant == "google") {
          return <GoogleBubble chat={chat} key={index} />;
        }
      })}
      {partialSpeechResults !== "" && (
        <TextBubble from={"user"} text={partialSpeechResults} />
      )}
    </ScrollView>
  );
};

export default Chats;
