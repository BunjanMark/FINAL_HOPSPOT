import React, { useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Provider as PaperProvider, Text, Button } from "react-native-paper";
import { FormStyle } from "../Styles/FormStyle";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

import { Platform, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import Toast from "react-native-root-toast";
import fetchServices from "../services/fetchServices";
import { ngrok } from "../services/ngrok";

const AccountRecoveryScreen = () => {
  const navigator = useNavigation();
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [HideEntry, setHideEntry] = useState(true);

  const showToast = (message = "Something went wrong") => {
    Toast.show(message, 3000);
  };

  const toggleSecureEntry = () => {
    setHideEntry(!HideEntry);
  };

  const handleSendCode = async () => {
    try {
      // Perform account recovery logic here
      setLoading(!loading);
      if (email === "") {
        showToast("Please enter your email");
        setIsError(true);
        return false;
      }

      const url = `${ngrok}/api/password/reset`;

      const data = {
        email,
      };

      const result = await fetchServices.postData(url, data);

      if (result.message != null) {
        showToast(result?.message);
      } else {
        navigator.navigate("CodeVerificationScreen", { email });
      }
    } catch (e) {
      console.error(e.toString());
      showToast("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const currentLogoWidth = 50;
  const currentLogoHeight = 50;
  const newSizeMultiplier = 2;

  const newLogoWidth = currentLogoWidth * newSizeMultiplier;
  const newLogoHeight = currentLogoHeight * newSizeMultiplier;

  return (
    <PaperProvider>
      <ImageBackground
        source={require("../images/login.png")}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={FormStyle.formContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.form}
            keyboardVerticalOffset={
              Platform.OS === "ios" ? 0 : heightPercentageToDP("15%")
            }
          >
            <Image
              source={require("../images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text
              variant="headlineLarge"
              style={{
                top: -50,
                fontWeight: "bold",
                fontSize: widthPercentageToDP("8%"),
              }}
            >
              ACCOUNT RECOVERY
            </Text>
            <TextInput
              style={{ ...styles.inputStyle, borderRadius: 10 }}
              mode="outlined"
              label="Email"
              placeholder="Enter your email"
              inputMode="email"
              value={email}
              error={isError}
              onChangeText={(text) => setEmail(text)}
            />
            <Button
              loading={loading}
              disabled={loading}
              style={{ ...styles.buttonStyle, backgroundColor: "black" }}
              mode="contained-tonal"
              icon="send"
              onPress={handleSendCode}
              labelStyle={{ color: "white" }}
            >
              Send Code
            </Button>
            <Button
              style={{ ...styles.goback }}
              onPress={() => {
                navigator.goBack();
              }}
            >
              Go Back
            </Button>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  inputStyle: {
    width: widthPercentageToDP("80%"),
    marginBottom: heightPercentageToDP("20%"),
  },
  buttonStyle: {
    marginBottom: 120,
    marginVertical: -130,
  },
  goback: {
    marginBottom: 120,
    marginVertical: -100,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: heightPercentageToDP("8%"),
  },
  form: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: heightPercentageToDP("1%"),
  },
  logo: {
    width: widthPercentageToDP("25%"),
    height: heightPercentageToDP("25%"),
    position: "absolute",
    top: heightPercentageToDP("-10%"),
    left: widthPercentageToDP("-7%"),
    alignSelf: "flex-start",
  },
});

export default AccountRecoveryScreen;
