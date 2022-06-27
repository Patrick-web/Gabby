import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutAnimation,
} from "react-native";

const TabSwitcher = ({
  inListenMode,
  activeTab,
  switchTab,
}: {
  inListenMode: boolean;
  activeTab: "home" | "tutorial" | "commands";
  switchTab: Function;
}) => {
  function setTab(tab: "tutorial" | "commands") {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    switchTab(tab);
  }
  return (
    <View
      style={{
        marginTop: inListenMode ? -60 : 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        marginBottom: 30,
        width: "100%",
      }}>
      <Pressable
        style={{
          ...styles.switcher,
          borderBottomWidth: activeTab == "tutorial" ? 4 : 1,
        }}
        onPress={() => setTab("tutorial")}>
        <Text
          style={{
            ...styles.switcherText,
            color: activeTab == "tutorial" ? "#BC61C2" : "white",
            fontWeight: activeTab == "tutorial" ? "bold" : "normal",
          }}>
          Tutorial
        </Text>
      </Pressable>
      <Pressable
        style={{
          ...styles.switcher,
          borderBottomWidth: activeTab == "commands" ? 4 : 1,
        }}
        onPress={() => setTab("commands")}>
        <Text
          style={{
            ...styles.switcherText,
            color: activeTab == "commands" ? "#BC61C2" : "white",
            fontWeight: activeTab == "commands" ? "bold" : "normal",
          }}>
          Commands
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  switcher: {
    height: 50,
    width: 120,
    borderColor: "transparent",
    borderBottomColor: "#BC61C2",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  switcherText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "normal",
  },
});

export default TabSwitcher;
