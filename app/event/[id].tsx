import { AttendanceModal, StudentData } from "@/components/AttendanceModal";
import BackButton from "@/components/backButton";
import { QRScanner } from "@/components/QRScanner";
import { SessionSelector } from "@/components/SessionSelector";
import {
  colors,
  spacing,
  typography
} from "@/constants/theme";
import { useAttendance } from "@/hooks/useAttendance";
import { useCameraPermissions } from "expo-camera";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function EventDetails() {
  const params = useLocalSearchParams();
  const eventId = params.id as string;

  const [permission, requestPermission] = useCameraPermissions();
  const { submitAttendance, isLoading } = useAttendance();

  const [timeOfDay, setTimeOfDay] = useState<"AM" | "PM">("AM");
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  const handleBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (scanned) return;

      try {
        const parsedData = JSON.parse(data);
        const extracted: StudentData = {
          firstName: parsedData.firstName || parsedData.first_name || "",
          lastName: parsedData.lastName || parsedData.last_name || "",
          CSY: parsedData.CSY || parsedData.course_year_section || "",
          studentId: parsedData.studentId || parsedData.student_id || "",
          gbox: parsedData.gbox || parsedData.email || "",
        };
        setStudentData(extracted);
        setScanned(true);
        setModalVisible(true);
      } catch (error) {
        console.error("Failed to parse QR code:", error);
        Alert.alert("Error", "Invalid QR code format. Please try again.");
        setStudentData(null);
      }
    },
    [scanned]
  );

  const handleApprove = useCallback(async () => {
    if (!studentData) {
      Alert.alert("Error", "No student data available");
      return;
    }

    const payload = {
      ...studentData,
      [timeOfDay]: true,
    };

    const success = await submitAttendance(eventId, payload);

    if (success) {
      setModalVisible(false);
      setScanned(false);
      setStudentData(null);
      Alert.alert("Success", "Attendance recorded successfully");
    }
  }, [studentData, timeOfDay, eventId, submitAttendance]);

  const handleReject = useCallback(() => {
    setModalVisible(false);
    setScanned(false);
    setStudentData(null);
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need camera access to scan QR.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AttendanceModal
        visible={modalVisible}
        studentData={studentData}
        isLoading={isLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        onClose={() => setModalVisible(false)}
      />

      <View style={styles.top_items}>
        <BackButton size={30} />
        <Text style={styles.pageTitle}>QRCode Scanning</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{ title: "Scan Attendance", headerBackTitle: "Back" }}
        />

        <View style={styles.header}>
          <Text style={styles.title}>{params.title}</Text>
          <View style={styles.spanContent}>
            <Text style={styles.whatInfo}>Description:</Text>
            <Text style={styles.description}>{params.description}</Text>
          </View>
          <View style={styles.spanContent}>
            <Text style={styles.whatInfo}>Date:</Text>
            <Text style={styles.dateBadgeText}>{params.date}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <SessionSelector value={timeOfDay} onChange={setTimeOfDay} />

        <View style={styles.divider} />

        <QRScanner
          scanned={scanned}
          onScan={handleBarcodeScanned}
          onReset={() => setScanned(false)}
          timeOfDay={timeOfDay}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxl,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  permissionText: {
    ...typography.bodyLg,
    marginBottom: spacing.xl,
    textAlign: "center",
    color: colors.textSecondary,
  },
  header: { marginBottom: spacing.md - 2 },
  spanContent: {
    flexDirection: "row",
  },
  whatInfo: {
    marginRight: spacing.md,
    ...typography.bodyLg,
  },
  top_items: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
});
