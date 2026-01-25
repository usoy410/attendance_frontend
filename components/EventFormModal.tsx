import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { borderRadius, colors, elevation, spacing, touchTarget, typography } from "../constants/theme";

export interface FormState {
  title: string;
  description: string;
  date: Date;
  isEditing: boolean;
  editingId: string | null;
}

interface EventFormModalProps {
  visible: boolean;
  formState: FormState;
  saving: boolean;
  onFormChange: (updates: Partial<FormState>) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
}

export function EventFormModal({
  visible,
  formState,
  saving,
  onFormChange,
  onSave,
  onClose,
}: EventFormModalProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (date) onFormChange({ date });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {formState.isEditing ? "Edit Event" : "Add New Event"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={formState.title}
            onChangeText={(title) => onFormChange({ title })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={formState.description}
            onChangeText={(description) => onFormChange({ description })}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#333" />
            <Text style={styles.dateText}>{formState.date.toDateString()}</Text>
          </TouchableOpacity>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={onSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>{formState.isEditing ? "Update" : "Add"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      {showDatePicker && (
        <DateTimePicker value={formState.date} mode="date" display="default" onChange={handleDateChange} />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.bgPrimary,
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
    width: "85%",
    ...elevation.level5,
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.xl,
    textAlign: "center",
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg - 1,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgTertiary,
    ...typography.bodyLg,
    minHeight: touchTarget.comfortable,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xl,
    backgroundColor: colors.bgTertiary,
    minHeight: touchTarget.comfortable,
  },
  dateText: {
    marginLeft: spacing.md - 2,
    ...typography.bodyLg,
    color: colors.textSecondary,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md - 2 },
  cancelButton: {
    backgroundColor: colors.borderDark,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    flex: 1,
    minHeight: touchTarget.minimum,
    justifyContent: "center",
    alignItems: "center",
    ...elevation.level1,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    flex: 1,
    minHeight: touchTarget.minimum,
    justifyContent: "center",
    alignItems: "center",
    ...elevation.level1,
  },
  buttonText: {
    color: colors.textWhite,
    textAlign: "center",
    ...typography.button,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
