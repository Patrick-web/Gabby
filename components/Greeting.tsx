import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { GlobalContext } from "../context/globalContext";

const Greeting = ({ isListening: isListening }: { isListening: boolean }) => {
  const [greeting, setGreeting] = useState({
    timeOfDay: "Unknown",
    image: require("../assets/galaxy-icon.png"),
    text: `Hey Patrick`,
  });
  const { chats } = useContext(GlobalContext);
  useEffect(() => {
    const hourOfTheDay = new Date().getHours();
    if (hourOfTheDay > 4 && hourOfTheDay < 12) {
      setGreeting({
        timeOfDay: "Morning",
        image: require("../assets/morning-icon.png"),
        text: "Good Morning",
      });
    } else if (hourOfTheDay > 12 && hourOfTheDay < 17) {
      setGreeting({
        timeOfDay: "Afternoon",
        image: require("../assets/afternoon-icon.png"),
        text: "Good Afternoon",
      });
    } else if (hourOfTheDay > 17 && hourOfTheDay < 20) {
      setGreeting({
        timeOfDay: "Evening",
        image: require("../assets/sunset-icon.png"),
        text: "Good Evening",
      });
    } else if (hourOfTheDay > 19 && hourOfTheDay < 25) {
      setGreeting({
        timeOfDay: "Night",
        image: require("../assets/night-icon.png"),
        text: "A Beautiful Night",
      });
    }
  }, []);
  return (
    <View
      style={{
        opacity: isListening ? 0 : 1,
        marginTop: chats.length > 1 ? 0 : 10,
        marginBottom: chats.length > 1 ? 0 : 10,
      }}>
      <View
        style={{
          ...styles.greeting,
          flexDirection: chats.length > 1 ? "row" : "column",
          justifyContent: chats.length > 1 ? "flex-start" : "space-between",
          height: chats.length > 1 ? 60 : 200,
        }}>
        <Image
          style={{
            width: chats.length > 1 ? 35 : 150,
            height: chats.length > 1 ? 35 : 150,
            marginRight: chats.length > 1 ? 10 : 0,
            marginLeft: chats.length > 1 ? 20 : 0,
          }}
          source={greeting.image}
        />
        <Text
          style={{
            ...styles.greetingText,
            fontSize: chats.length > 1 ? 20 : 30,
          }}>
          {greeting.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  greeting: {
    alignItems: "center",
    width: "100%",
  },
  greetingText: {
    color: "white",
    fontWeight: "bold",
  },
  greetingImage: {
    width: 150,
    height: 150,
  },
});

export default Greeting;
