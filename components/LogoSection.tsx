import { LOGO_SOURCES } from "@/constants/loginConstants";
import { spacing } from "@/constants/theme";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

const LogoSection = () => (
  <View style={styles.logo_container}>
    <Image
      source={LOGO_SOURCES.ncf}
      style={styles.logoRaised}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={200}
    />
    <Image
      source={LOGO_SOURCES.cyber}
      style={styles.logoRaised}
      cachePolicy="memory-disk"
      contentFit="cover"
      transition={200}
    />
    <Image
      source={LOGO_SOURCES.ccs}
      style={styles.logo}
      cachePolicy="memory-disk"
      contentFit="cover"
      transition={200}
    />
  </View>
);

const styles = StyleSheet.create({
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
  logoRaised: {
    width: 100,
    height: 100,
    marginHorizontal: spacing.xs + 1,
    marginTop: 20,
  }
});

export default LogoSection;
