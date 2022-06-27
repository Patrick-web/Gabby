import React from "react";
import { View, Text } from "react-native";

interface PromptTutorial {
  title: string;
  promptBase: string;
  promptInput: string;
  promptExample: string;
}

const PromptTutorialCard = ({ prompt }: { prompt: PromptTutorial }) => {
  return (
    <View
      style={{
        margin: 10,
        borderColor: "#BC61C2",
        padding: 10,
        borderLeftWidth: 2,
      }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "900" }}>
        To {prompt.title}, say
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "300" }}>
          {prompt.promptBase}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "300",
            fontStyle: "italic",
          }}>
          {" <"}
          {prompt.promptInput}
          {"> "}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            color: "white",
            fontSize: 15,
            fontWeight: "300",
            marginRight: 5,
          }}>
          for example:
        </Text>
        <Text
          style={{
            color: "#BC61C2",
            fontSize: 15,
            fontWeight: "900",
            fontStyle: "italic",
          }}>
          {prompt.promptExample}
        </Text>
      </View>
    </View>
  );
};

export default PromptTutorialCard;
