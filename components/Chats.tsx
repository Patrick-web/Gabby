import React, { useContext, useRef } from "react";
import { ScrollView } from "react-native";
import { GlobalContext } from "../context/globalContext";
import ChatBubble from "./ChatBubble";

const Chats = ({ partialSpeechResults }: { partialSpeechResults: string }) => {
  const { chats, isListening } = useContext(GlobalContext);
  const scrollViewRef = useRef();
  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
      style={{
        width: "100%",
        paddingHorizontal: 10,
        paddingBottom: 40,
        marginTop: isListening ? 80 : 0,
        marginBottom: 140,
      }}>
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
