import React from "react";
import { View, Text, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";
import PromptTutorialCard from "./PromptTutorialCard";

import { PromptTutorialType } from "../types";

const Tabs = ({ activeTab }: { activeTab: "tutorial" | "commands" }) => {
  const sp: PromptTutorialType = {
    title: "Call Someone",
    promptBase: "Call",
    promptInput: "insert their name",
    promptExample: "Call Jenny",
  };
  return (
    <View style={{ width: "100%", overflow: "hidden" }}>
      <ScrollView
        style={{
          height: activeTab == "commands" ? "0%" : "100%",
          overflow: "hidden",
        }}>
        <PromptTutorialCard prompt={sp} />
        <PromptTutorialCard prompt={sp} />
        <PromptTutorialCard prompt={sp} />
      </ScrollView>
      <View
        style={{
          height: activeTab == "tutorial" ? "0%" : "100%",
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
            <ChatBubble fullwidth={true} from={"user"} text={"Call Jane"} />
            <ChatBubble
              fullwidth={true}
              from={"user"}
              text={"What is the weather ?"}
            />
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
            <ChatBubble
              from={"assistant"}
              text={"Its cloudy. 59 degrees Farenheit"}
              fullwidth={true}
            />
            <ChatBubble
              fullwidth={true}
              from={"assistant"}
              text={"Okay Calling Jane"}
            />
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
            <Path
              d="M7.5 0L8.5 -4.37114e-08L8.5 58L7.5 58L7.5 0Z"
              fill="white"
            />
            <Path
              d="M0.624191 50.8649L1.37578 50.2053L8.35777 58.1606L14.1629 49.4709L14.9945 50.0264L8.46556 59.7994L0.624191 50.8649Z"
              fill="white"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};

export default Tabs;
