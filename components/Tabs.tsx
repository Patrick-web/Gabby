import React from "react";
import { View, Text, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";
import PromptTutorialCard from "./PromptTutorialCard";

import { PromptTutorialType } from "../types";
import { TextBubble } from "./ChatBubbles";

export const CommandsTab = ({
  activeTab,
}: {
  activeTab: "tutorial" | "commands";
}) => {
  const commands: PromptTutorialType[] = [
    {
      title: "Make a Call",
      example: "Call James or Make a call",
    },
    {
      title: "Send a message",
      example: "Send a message Kim or Send sms to Kim or Text Alex",
    },
    {
      title: "Send an Email",
      example: "email lizz@gmail.com",
    },
    {
      title: "Send a Whatsapp Message",
      example: "Whatsapp Jilian or Send whatsapp message",
    },
    {
      title: "Play a song",
      example:
        "Play some jazz or Play hillsong or Play i'll catch your grenade",
    },
    {
      title: "Open an App",
      example: "Open YouTube",
    },
    {
      title: "Get a joke",
      example: "Tell me a joke",
    },
    {
      title: "Get a Quote",
      example: "Give a quote",
    },
    {
      title: "Get memes",
      example: "Show me some memes",
    },
    {
      title: "Play a game",
      example: "Play a game or Chess game or Sudoku game",
    },
    {
      title: "Google Something",
      example: "Who was the first nobel prize winner or Google bitcoin price",
    },
    {
      title: "Get news",
      example: "Give the news or news ...",
    },
    {
      title: "Get the weather",
      example: "Whats the weather",
    },
    {
      title: "Who made me",
      example: "Who made you",
    },
    {
      title: "Is my voice annoying",
      example: "Shut up or Voice off",
    },
    {
      title: "You want to hear my voice",
      example: "Voice on",
    },
    {
      title: "Exit a command that is in progress",
      example: "Reset",
    },
    {
      title: "",
      example: "",
    },
  ];
  return (
    <View>
      <ScrollView
        style={{
          height: activeTab == "commands" ? "100%" : "0%",
          overflow: "hidden",
        }}>
        {commands.map((command, index) => (
          <PromptTutorialCard key={index} prompt={command} />
        ))}
      </ScrollView>
    </View>
  );
};

export const TutorialTab = ({
  activeTab,
}: {
  activeTab: "tutorial" | "commands";
}) => {
  return (
    <View
      style={{
        height: activeTab == "tutorial" ? "100%" : "0%",
        overflow: "hidden",
        paddingHorizontal: 20,
      }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 60,
        }}>
        <Text
          style={{
            color: "white",
            width: "50%",
            textAlign: "center",
            paddingHorizontal: 10,
            fontSize: 18,
          }}>
          Text bubbles on this side are what you tell me
        </Text>
        <View
          style={{
            borderColor: "white",
            borderLeftWidth: 2,
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            width: "32%",
          }}>
          <TextBubble from={"user"} text={"Call Jane"} />
          <TextBubble from={"user"} text={"What is the weather ?"} />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 60,
        }}>
        <View
          style={{
            borderColor: "white",
            borderRightWidth: 2,
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            width: "45%",
            paddingVertical: 10,
          }}>
          <TextBubble
            from={"assistant"}
            text={"Its cloudy. 59 degrees Farenheit"}
          />
          <TextBubble from={"assistant"} text={"Okay Calling Jane"} />
        </View>
        <Text
          style={{
            color: "white",
            width: "50%",
            textAlign: "center",
            paddingHorizontal: 20,
            fontSize: 18,
          }}>
          These ones are my response
        </Text>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            width: "50%",
            textAlign: "center",
            marginBottom: 10,
          }}>
          Press this button to talk to me
        </Text>
        <Svg width={18} height={62} viewBox="0 0 18 62" fill="none">
          <Path d="M7.5 0L8.5 -4.37114e-08L8.5 58L7.5 58L7.5 0Z" fill="white" />
          <Path
            d="M0.624191 50.8649L1.37578 50.2053L8.35777 58.1606L14.1629 49.4709L14.9945 50.0264L8.46556 59.7994L0.624191 50.8649Z"
            fill="white"
          />
        </Svg>
      </View>
    </View>
  );
};

const Tabs = ({ activeTab }: { activeTab: "tutorial" | "commands" }) => {
  return (
    <View style={{ width: "100%", overflow: "hidden" }}>
      <CommandsTab activeTab={activeTab} />
      <TutorialTab activeTab={activeTab} />
    </View>
  );
};

export default Tabs;
