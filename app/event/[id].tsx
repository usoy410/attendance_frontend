import BackButton from "@/components/backButton";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
// import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, elevation, spacing, touchTarget, typography } from "../../constants/theme";

export default function EventDetails() {
  const params = useLocalSearchParams();

  // Permission Hook
  const [permission, requestPermission] = useCameraPermissions();

  const [timeOfDay, setTimeOfDay] = useState<"AM" | "PM">("AM");
  const [scanned, setScanned] = useState(false);

  // Handle Permissions
  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need camera access to scan QR.</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Handle Scan Logic
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    // maybe add some vibrator ahhhhhhh
  };

  return (
    // <LinearGradient  {...gradients.blueRedHorizontal} style={styles.gradientContainer}>
    <View style={styles.container}>
      <View style={styles.top_items}>
        <BackButton size={30} />
        <Text style={styles.pageTitle}>QRCode Scanning</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: "Scan Attendance", headerBackTitle: "Back" }} />

        {/* Header Info */}
        <View style={styles.header}>

          <Text style={styles.title}>{params.title}</Text>
          <View style={styles.spanContent
          }>
            <Text style={styles.whatInfo}>
              Description:
            </Text>
            <Text style={styles.description}>{params.description}</Text>
          </View>
          <View style={styles.spanContent
          }>
            <Text style={styles.whatInfo}>
              Date:
            </Text>
            <Text style={styles.dateBadgeText}>
              {params.date}</Text>

          </View>
        </View>

        <View style={styles.divider} />

        {/* Session Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Session</Text>
          <View style={styles.radioGroup}>
            {["AM", "PM"].map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.radioButton, timeOfDay === option && styles.radioButtonSelected]}
                onPress={() => setTimeOfDay(option as "AM" | "PM")}
              >
                <View style={styles.radioOuterCircle}>
                  {timeOfDay === option && <View style={styles.radioInnerCircle} />}
                </View>
                <Text style={[styles.radioText, timeOfDay === option && styles.radioTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* --- SCANNER SECTION --- */}
        <View style={styles.qrCodeSection}>
          <Text style={styles.sectionTitle}>Scan QRCode</Text>

          {/* Scanner Box*/}
          <View style={styles.scannerContainer}>
            {!scanned ? (
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
              />
            ) : (
              <View style={styles.successView}>
                <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                <Text style={styles.successText}>Success!</Text>
                <Button title="Scan Another" onPress={() => setScanned(false)} />
              </View>
            )}
          </View>

          <Text style={styles.qrHint}>
            Scanning for <Text style={{ fontWeight: "bold" }}>{timeOfDay}</Text> session
          </Text>
        </View>
      </ScrollView>
    </View>
    // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.xxl,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  permissionText: {
    ...typography.bodyLg,
    marginBottom: spacing.xl,
    textAlign: "center",
    color: colors.textSecondary,
  },
  header: { marginBottom: spacing.md - 2 },
  spanContent: {
    flexDirection: 'row',
  },
  whatInfo: {
    marginRight: spacing.md,
    ...typography.bodyLg,
  },
  top_items: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: spacing.lg - 1,
  },
  dateBadgeText: {
    color: colors.textTertiary,
    ...typography.bodyLg,
  },
  pageTitle: {
    color: colors.textPrimary,
    ...typography.h3,
    textAlign: "center",
  },
  title: {
    ...typography.h2,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodyLg,
    color: colors.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xxl,
  },
  section: { marginBottom: spacing.md - 2 },
  sectionTitle: {
    ...typography.h3,
    fontWeight: "700",
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },

  // Radio Buttons
  radioGroup: { flexDirection: "row", gap: spacing.lg },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgPrimary,
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.borderLight,
    flex: 1,
    minHeight: touchTarget.comfortable,
    justifyContent: "center",
    ...elevation.level1,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: "#f8fbff",
    ...elevation.level2,
  },
  radioOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md - 2,
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.primary
  },
  radioText: {
    ...typography.bodyLg,
    fontWeight: "600",
    color: colors.textMuted
  },
  radioTextSelected: { color: colors.primary },

  // Scanner UI
  qrCodeSection: {
    alignItems: "center",
    backgroundColor: colors.bgPrimary,
    padding: spacing.md - 2,
    borderRadius: borderRadius.xl,
    ...elevation.level3,
    marginBottom: spacing.xxxl * 3
  },
  scannerContainer: {
    width: 300,
    height: 300,
    backgroundColor: "#000",
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  successView: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    ...typography.h3,
    fontWeight: "bold",
    color: colors.success,
    marginVertical: spacing.lg - 1,
  },
  qrHint: {
    color: colors.textMuted,
    ...typography.body,
    marginBottom: spacing.lg
  },
});
