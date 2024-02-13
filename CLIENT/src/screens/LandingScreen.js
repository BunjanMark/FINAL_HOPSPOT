import React from "react";
import { SafeAreaView, ImageBackground, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

const LandingScreen = () => {
  const navigator = useNavigation();

  const currentLogoWidth = widthPercentageToDP("25%"); // Adjust the percentage as needed
  const currentLogoHeight = heightPercentageToDP("25%"); // Adjust the percentage as needed

  return (
    <ImageBackground
      source={require("../images/landing.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={require("../images/logo.png")}
          style={{
            ...styles.logo,
            width: currentLogoWidth,
            height: currentLogoHeight,
          }}
          resizeMode="contain"
        />

        <Text
          variant="headlineMedium"
          style={{
            fontSize: widthPercentageToDP("6%"), // Adjust the percentage as needed
            color: "black",
            marginBottom: heightPercentageToDP("2%"), // Adjust the percentage as needed
            fontWeight: "bold",
          }}
        >
          HopSpot
        </Text>
        <SafeAreaView style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => {
              navigator.navigate("LoginScreen");
            }}
            style={{
              backgroundColor: "black",
              width: widthPercentageToDP("70%"),
              height: heightPercentageToDP("6%"),
            }}
            contentStyle={{
              flexDirection: "row-reverse",
              justifyContent: "center",
              alignItems: "center",
            }}
            icon={"arrow-right"}
          >
            Start To Join
          </Button>
        </SafeAreaView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: heightPercentageToDP("15%"),
  },
  logo: {
    position: "absolute",
    top: heightPercentageToDP("-4%"),
    left: widthPercentageToDP("3%"),
  },
  buttonContainer: {
    flexDirection: "column",
    gap: heightPercentageToDP("4%"),
  },
});

export default LandingScreen;
