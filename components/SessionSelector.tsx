import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  borderRadius,
  colors,
  elevation,
  spacing,
  touchTarget,
  typography,
} from "../constants/theme";

interface SessionSelectorProps {
  value: "AM" | "PM";
  onChange: (val: "AM" | "PM") => void;
}

export function SessionSelector({ value, onChange }: SessionSelectorProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Session</Text>
      <View style={styles.radioGroup}>
        {(["AM", "PM"] as const).map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.radioButton,
              value === option && styles.radioButtonSelected,
            ]}
            onPress={() => onChange(option)}
          >
            <View style={styles.radioOuterCircle}>
              {value === option && <View style={styles.radioInnerCircle} />}
            </View>
            <Text
              style={[
                styles.radioText,
                value === option && styles.radioTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.md - 2 },
  sectionTitle: {
    ...typography.h3,
    fontWeight: "700",
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },
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
    backgroundColor: colors.primary,
  },
  radioText: {
    ...typography.bodyLg,
    fontWeight: "600",
    color: colors.textMuted,
  },
  radioTextSelected: { color: colors.primary },
});
