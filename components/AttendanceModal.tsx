import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  borderRadius,
  colors,
  elevation,
  spacing,
  touchTarget,
  typography,
} from "../constants/theme";

export interface StudentData {
  firstName: string;
  lastName: string;
  CSY: string;
  studentId: string;
  gbox: string;
}

interface AttendanceModalProps {
  visible: boolean;
  studentData: StudentData | null;
  isLoading: boolean;
  onApprove: () => Promise<void>;
  onReject: () => void;
  onClose: () => void;
}

export function AttendanceModal({
  visible,
  studentData,
  isLoading,
  onApprove,
  onReject,
  onClose,
}: AttendanceModalProps) {
  const dataContent = useMemo(() => {
    if (!studentData) {
      return <Text style={styles.noDataText}>No valid student data</Text>;
    }
    const fields = [
      { label: "First Name:", value: studentData.firstName },
      { label: "Last Name:", value: studentData.lastName },
      { label: "Student ID:", value: studentData.studentId },
      { label: "Course/Year/Section:", value: studentData.CSY },
      { label: "GBox Email:", value: studentData.gbox },
    ];
    return (
      <>
        {fields.map((field, idx) => (
          <View key={idx} style={styles.dataItem}>
            <Text style={styles.dataKey}>{field.label}</Text>
            <Text style={styles.dataValue}>{field.value}</Text>
          </View>
        ))}
      </>
    );
  }, [studentData]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>QR Code Data</Text>

          <ScrollView
            style={styles.dataContainer}
            showsVerticalScrollIndicator={false}
          >
            {dataContent}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={onReject}
              disabled={isLoading}
            >
              <Ionicons name="close-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.approveButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={onApprove}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Approve</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    width: "90%",
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...elevation.level5,
    maxHeight: "80%",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  dataContainer: {
    maxHeight: 300,
    marginBottom: spacing.lg,
  },
  dataItem: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  dataKey: {
    ...typography.bodySm,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  dataValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  noDataText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    minHeight: touchTarget.comfortable,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  buttonText: {
    ...typography.button,
    color: "#fff",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
