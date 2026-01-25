import { borderRadius, colors, gradients, spacing, touchTarget, typography } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BASE_API_URL } from "../../constants/api";

const BASE_CDN = "https://res.cloudinary.com/dgebrdeka/image/upload";
// prevent double transformation parameters
const TRANSFORMS = "c_auto,h_100,w_100";

const API_URL = `${BASE_API_URL}/auth/login`;
const REQUEST_TIMEOUT_MS = 20000; // 20 seconds timeout

const getErrorMessage = (status: number, data: any) => {
  if (status === 401) return "Invalid student ID or password.";
  if (status === 500) return "Server error. Please try again later.";
  if (status === 400) return data.message || "Invalid request. Please check your input.";
  return data.message || `Login failed with status ${status}`;
};

const LoginScreen = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Memoize the image sources to prevent re-creation on render
  const logos = useMemo(() => ({
    ncf: { uri: `${BASE_CDN}/${TRANSFORMS}/ncflogo_esrp4u.png` },
    cyber: { uri: `${BASE_CDN}/${TRANSFORMS}/cyberdevlogo_tysgps.png` },
    ccs: { uri: `${BASE_CDN}/${TRANSFORMS}/ccslogo_hsyi31.png` }
  }), []);

  const handleLogin = async () => {
    // Trim inputs once
    const id = studentId.trim();
    const pass = password.trim();

    if (!id || !pass) {
      Alert.alert("Incomplete", "Please enter both student ID and password.");
      return;
    }

    setLoading(true);

    // AbortController for network timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: id,
          password: pass,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status, data));
      }

      if (data.token) {
        // Parallelize navigation and storage if possible,
        // we await storage to ensure auth state is persisted before mounting next screen.
        await AsyncStorage.setItem("userToken", data.token);
        router.replace("/event/events");
      } else {
        throw new Error("Token missing from response");
      }
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Tweaked for Android consistency
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrapper}>
            <View style={styles.logo_container}>
              {/* Used memoized source and extracted styles to avoid inline object creation */}
              <Image
                source={logos.ncf}
                style={styles.logoRaised}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />

              <Image
                source={logos.cyber}
                style={styles.logoRaised}
                cachePolicy="memory-disk"
                contentFit="cover"
                transition={200}
              />

              <Image
                source={logos.ccs}
                style={styles.logo}
                cachePolicy="memory-disk"
                contentFit="cover"
                transition={200}
              />
            </View>

            <View style={styles.loginContainer}>
              <View style={styles.inner}>
                <Text style={styles.title}>Student Portal</Text>

                <Text style={styles.label}>Student ID</Text>

                <TextInput
                  style={styles.input}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Enter ID"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />

                <Text style={styles.label}>Password</Text>

                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter Password"
                  autoCapitalize="none"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />

                <View style={styles.buttonContainer}>
                  <Button
                    title={loading ? "Verifying..." : "Login"}
                    onPress={handleLogin}
                    disabled={loading}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1 },
  loginContainer: {
    marginHorizontal: 40,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  wrapper: { flex: 1, justifyContent: "center" },
  inner: { padding: spacing.xxl },
  title: {
    ...typography.h1,
    textAlign: "center",
    marginBottom: 40,
    color: colors.textPrimary,
  },
  label: {
    ...typography.bodyLg,
    marginBottom: spacing.sm,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    ...typography.bodyLg,
    minHeight: touchTarget.comfortable,
  },
  buttonContainer: { marginTop: spacing.md - 2 },
  logo_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: spacing.xl,
    height: 100,
  },
  logo: {
    width: 100,
    height: 100,
    marginHorizontal: spacing.xs + 1,
  },
  // Pre-calculated style for the raised logos
  logoRaised: {
    width: 100,
    height: 100,
    marginHorizontal: spacing.xs + 1,
    marginTop: 20,
  }
});

export default LoginScreen;
