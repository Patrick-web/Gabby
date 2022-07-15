import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { TimeOfDayType } from "../types";

const Greeting = ({ isListening: isListening }: { isListening: boolean }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayType>("Unknown");
  useEffect(() => {
    const hourOfTheDay = new Date().getHours();
    if (hourOfTheDay > 4 && hourOfTheDay < 12) {
      setTimeOfDay("Morning");
    } else if (hourOfTheDay > 12 && hourOfTheDay < 17) {
      setTimeOfDay("Afternoon");
    } else if (hourOfTheDay > 17 && hourOfTheDay < 20) {
      setTimeOfDay("Evening");
    } else if (hourOfTheDay > 19 && hourOfTheDay < 25) {
      setTimeOfDay("Night");
    }
  }, []);
  return (
    <View
      style={{
        opacity: isListening ? 0 : 1,
        marginTop: 10,
      }}>
      {timeOfDay == "Unknown" && (
        <View style={styles.greeting}>
          <Image
            style={{
              width: isListening ? 0 : 150,
              height: isListening ? 0 : 150,
            }}
            source={require("../assets/galaxy-icon.png")}
          />
          <Text style={styles.greetingText}> Hey Patrick </Text>
        </View>
      )}

      {timeOfDay == "Morning" && (
        <View style={styles.greeting}>
          <Image
            style={{
              width: isListening ? 0 : 150,
              height: isListening ? 0 : 150,
            }}
            source={require("../assets/morning-icon.png")}
          />
          <Text style={styles.greetingText}> Morning Patrick </Text>
        </View>
      )}

      {timeOfDay == "Night" && (
        <View style={styles.greeting}>
          <Image
            style={{
              width: isListening ? 0 : 150,
              height: isListening ? 0 : 150,
            }}
            source={require("../assets/night-icon.png")}
          />
          <Text style={styles.greetingText}> Night Patrick </Text>
        </View>
      )}
      {timeOfDay == "Evening" && (
        <View style={styles.greeting}>
          <Image
            style={{
              width: isListening ? 0 : 150,
              height: isListening ? 0 : 150,
            }}
            source={require("../assets/sunset-icon.png")}
          />
          <Text style={styles.greetingText}> Evening Patrick </Text>
        </View>
      )}
      {timeOfDay == "Afternoon" && (
        <View style={styles.greeting}>
          <Image
            style={{
              width: isListening ? 0 : 150,
              height: isListening ? 0 : 150,
            }}
            source={require("../assets/afternoon-icon.png")}
          />
          <Text style={styles.greetingText}> Afternoon Patrick </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  greeting: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: 200,
  },
  greetingText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  greetingImage: {
    width: 150,
    height: 150,
  },
});

export default Greeting;
