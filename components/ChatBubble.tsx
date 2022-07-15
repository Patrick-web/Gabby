import React from "react";
import { View, Text } from "react-native";

const ChatBubble = ({
  from,
  text,
  fullwidth,
}: {
  from: "user" | "assistant";
  text: string;
  fullwidth: boolean | null;
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
          maxWidth: fullwidth ? "90%" : "48%",
          padding: 10,
        }}>
        <Text style={{ color: "white" }}>{text}</Text>
      </View>
    </View>
  );
};

export default ChatBubble;
