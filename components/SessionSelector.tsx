import {
  borderRadius,
  colors,
  elevation,
  spacing,
  typography
} from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface SessionSelectorProps {
  session: "AM" | "PM";
  onSessionChange: (value: "AM" | "PM") => void;
  timeType: "Time In" | "Time Out";
  onTimeTypeChange: (value: "Time In" | "Time Out") => void;
}

export function SessionSelector({ session, onSessionChange, timeType, onTimeTypeChange }: SessionSelectorProps) {
  const [sessionOpen, setSessionOpen] = useState(false);
  const [timeTypeOpen, setTimeTypeOpen] = useState(false);
  const [localSession, setLocalSession] = useState(session);
  const [localTimeType, setLocalTimeType] = useState(timeType);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Session</Text>

      <View style={{ flexDirection: "row", gap: spacing.lg }}>
        {/* Session AM or PM */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Session</Text>
          <DropDownPicker
            open={sessionOpen}
            setOpen={setSessionOpen}
            value={localSession}
            setValue={setLocalSession}
            onSelectItem={(item) => item.value && onSessionChange(item.value)}
            items={[
              { label: "AM", value: "AM" },
              { label: "PM", value: "PM" },
            ]}
            style={styles.pickerWrapper}
            textStyle={styles.pickerText}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            // scrollViewProps={{ nestedScrollEnabled: true }}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Time in or time out */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Time type</Text>
          <DropDownPicker
            open={timeTypeOpen}
            setOpen={setTimeTypeOpen}
            value={localTimeType}
            setValue={setLocalTimeType}
            onSelectItem={(item) => item.value && onTimeTypeChange(item.value)}
            items={[
              { label: "Time In", value: "Time In" },
              { label: "Time Out", value: "Time Out" },
            ]}
            style={styles.pickerWrapper}
            textStyle={styles.pickerText}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            // scrollViewProps={{ nestedScrollEnabled: true }}
            listMode="SCROLLVIEW"

          />
        </View>
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
  dropdownContainer: {
    marginBottom: spacing.lg,
    flex: 1,
  },
  label: {
    ...typography.bodyLg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.md,
    ...elevation.level1,
  },
  pickerText: {
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  dropDownContainerStyle: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgPrimary,
    ...elevation.level1,
  },
});
