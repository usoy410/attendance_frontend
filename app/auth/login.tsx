import { gradients } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import LoginForm from "../../components/LoginForm";
import LogoSection from "../../components/LogoSection";
import { performLogin } from "../../utils/loginUtils";

const LoginScreen = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const id = studentId.trim();
    const pass = password.trim();

    if (!id || !pass) {
      Alert.alert("Incomplete", "Please enter both student ID and password.");
      return;
    }

    setLoading(true);

    try {
      const token = await performLogin(id, pass);
      await AsyncStorage.setItem("userToken", token);
      router.replace("/event/events");
    } catch (error: any) {
      if (error.name === 'AbortError') {
        Alert.alert("Timeout", "The server took too long to respond. Please check your connection.");
      } else {
        console.error("Login Error:", error);
        Alert.alert("Login Failed", error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient {...gradients.blueRedHorizontal} style={styles.gradientContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrapper}>
            <LogoSection />
            <LoginForm
              studentId={studentId}
              password={password}
              loading={loading}
              onStudentIdChange={setStudentId}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1 },
  wrapper: { flex: 1, justifyContent: "center" },
});

export default LoginScreen;
