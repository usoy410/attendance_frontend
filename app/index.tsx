import { gradients } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          // User is logged in, navigate to events
          router.replace("/event/events");
        } else {
          // No token, navigate to login
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // On error, default to login screen
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    // Show splash for at least 1.5 seconds for better UX
    const timer = setTimeout(() => {
      checkAuth();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient {...gradients.blueRedHorizontal} style={styles.container}>
      <Image source={require("../assets/images/splash.png")} style={styles.logo} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 200, height: 200, resizeMode: "contain" },
});

export default SplashScreen;
