import { gradients } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet } from "react-native";

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 2000); // Navigate to login after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient {...gradients.blueRedHorizontal} style={styles.container}>
      <Image source={require("../assets/images/icon.png")} style={styles.logo} />
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
