import React from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ImageBackground,
  StyleSheet,
  Image,
  Platform,
  View,
} from "react-native";
import {
  Button,
  Provider as PaperProvider,
  TextInput,
  Text,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { useState } from "react";
import Toast from "react-native-root-toast";
import fetchServices from "../services/fetchServices";
import { ngrok } from "../services/ngrok";

const LoginScreen = () => {
  const navigator = useNavigation();

  const [HideEntry, setHideEntry] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const showToast = (message = "Something went wrong") => {
    Toast.show(message, 3000);
  };

  const handleLogin = async () => {
    try {
      setLoading(!loading);

      if (email === "" || password === "") {
        showToast("Please input required data");
        setIsError(true);
        return false;
      }

      const url = `${ngrok}/api/login`;

      const data = {
        email,
        password,
      };

      const result = await fetchServices.postData(url, data);

      if (result.message != null) {
        showToast(result?.message);
      } else {
        navigator.navigate("HomeScreen");
      }

      if (result.message === "User Logged in Successfully") {
        navigator.navigate("HomeScreen");
      } else {
        return false;
      }
    } catch (e) {
      console.debug(e.toString());
      showToast("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleSecureEntry = () => {
    setHideEntry(!HideEntry);
  };

  return (
    <PaperProvider>
      <ImageBackground
        source={require("../images/login.png")}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.formContainer}
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
                marginTop: 5,
                fontWeight: "bold",
                fontSize: widthPercentageToDP("8%"),
              }}
            >
              LOGIN
            </Text>

            <SafeAreaView style={{ gap: heightPercentageToDP("1%") }}>
              <TextInput
                style={styles.inputStyle}
                mode="outlined"
                label="Email"
                placeholder="Enter your email"
                inputMode="email"
                value={email}
                error={isError}
                onChangeText={(text) => {
                  setEmail(text);
                }}
              />
              <TextInput
                mode="outlined"
                style={styles.inputStyle}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={HideEntry}
                right={
                  <TextInput.Icon
                    onPress={toggleSecureEntry}
                    icon={HideEntry ? "eye" : "eye-off"}
                  />
                }
              />
              <View style={styles.forgotPasswordContainer}>
                <Button
                  onPress={() => {
                    navigator.navigate("AccountRecoveryScreen");
                  }}
                >
                  Forgot Password
                </Button>
              </View>
            </SafeAreaView>
            <Button
              style={{ ...styles.buttonStyle, backgroundColor: "black" }}
              mode="contained-tonal"
              icon="login"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              labelStyle={{ color: "white" }}
            >
              Log In
            </Button>

            <SafeAreaView
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: -20,
              }}
            >
              <Text>Not a member?</Text>
              <Button
                mode="text"
                onPress={() => {
                  navigator.navigate("RegisterScreen");
                }}
                loading={loading}
                disabled={loading}
              >
                Sign Up Now
              </Button>
            </SafeAreaView>
            <Button
              mode="text"
              onPress={() => {
                navigator.navigate("LandingScreen");
              }}
              loading={loading}
              disabled={loading}
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
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: heightPercentageToDP("8%"),
  },
  formContainer: {
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
  inputStyle: {
    // Define your TextInput styles here
    width: widthPercentageToDP("80%"),
    marginBottom: heightPercentageToDP("2%"),
  },
  buttonStyle: {
    // Define your Button styles here
    width: widthPercentageToDP("80%"),
    height: heightPercentageToDP("6%"),
    marginBottom: heightPercentageToDP("5%"),
    marginTop: heightPercentageToDP("-10%"),
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightPercentageToDP("10%"),
    marginTop: -15,
  },
});

export default LoginScreen;
