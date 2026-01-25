import BackButton from "@/components/backButton";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    // maybe add some vibrator ahhhhhhh

    Alert.alert("Check-in Successful", `Session: ${timeOfDay}\ Event Data: ${data}`, [
      { text: "Scan Next", onPress: () => setScanned(false) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top_items}>
        <BackButton size={30} />
        <Text style={styles.pageTitle}>QRCode Scanning</Text>
        {/* <Text style={styles.dateBadgeText}>{params.date}</Text> */}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: "Scan Attendance", headerBackTitle: "Back" }} />

        {/* Header Info */}
        <View style={styles.header}>

          <Text style={styles.title}>{params.title}</Text>
          <Text style={styles.description}>{params.description}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    padding: 24,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  header: { marginBottom: 10 },
  top_items: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 15
  },
  dateBadgeText: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center"
  },
    pageTitle: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center"
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
    // textAlign: 'center'
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 24
  },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333"
  },

  // Radio Buttons
  radioGroup: { flexDirection: "row", gap: 16 },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#eee",
    flex: 1,
    justifyContent: "center",
  },
  radioButtonSelected: { borderColor: "#007bff", backgroundColor: "#f8fbff" },
  radioOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#bbb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInnerCircle: { height: 10, width: 10, borderRadius: 5, backgroundColor: "#007bff" },
  radioText: { fontSize: 16, fontWeight: "600", color: "#777" },
  radioTextSelected: { color: "#007bff" },

  // Scanner UI
  qrCodeSection: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  scannerContainer: {
    width: 300,
    height: 300,
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginVertical: 15,
  },
  qrHint: { color: "#888", fontSize: 14, marginBottom: 16 },
});
