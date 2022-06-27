import React from "react";
import { ScrollView } from "react-native";
import ChatBubble from "./ChatBubble";

const Chats = ({
  partialSpeechResults,
  chats,
  isListening,
}: {
  partialSpeechResults: string;
  chats: any[];
  isListening: boolean;
}) => {
  return (
    <ScrollView
      style={{
        width: "100%",
        padding: 10,
        paddingBottom: 40,
        marginTop: isListening ? 80 : 0,
      }}>
      <ChatBubble fullwidth={false} from={"assistant"} text="How Can I Help" />
      {chats.map((chat: any, index: number) => (
        <ChatBubble
          key={index}
          fullwidth={false}
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
