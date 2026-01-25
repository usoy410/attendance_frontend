import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { Button, StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  colors,
  elevation,
  spacing,
  typography,
} from "../constants/theme";

interface QRScannerProps {
  scanned: boolean;
  onScan: (data: { data: string }) => Promise<void>;
  onReset: () => void;
  timeOfDay: "AM" | "PM";
}

export function QRScanner({
  scanned,
  onScan,
  onReset,
  timeOfDay,
}: QRScannerProps) {
  return (
    <View style={styles.qrCodeSection}>
      <Text style={styles.sectionTitle}>Scan QRCode</Text>

      <View style={styles.scannerContainer}>
        {!scanned ? (
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={onScan}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
        ) : (
          <View style={styles.successView}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.successText}>Success!</Text>
            <Button title="Scan Another" onPress={onReset} />
          </View>
        )}
      </View>

      <Text style={styles.qrHint}>
        Scanning for <Text style={{ fontWeight: "bold" }}>{timeOfDay}</Text>{" "}
        session
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.h3,
    fontWeight: "700",
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },
  qrCodeSection: {
    alignItems: "center",
    backgroundColor: colors.bgPrimary,
    padding: spacing.md - 2,
    borderRadius: borderRadius.xl,
    ...elevation.level3,
    marginBottom: spacing.xxxl * 3,
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
    marginBottom: spacing.lg,
  },
});
