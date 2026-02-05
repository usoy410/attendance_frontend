import { borderRadius, colors, spacing, touchTarget, typography } from "@/constants/theme";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

interface LoginFormProps {
  studentId: string;
  password: string;
  loading: boolean;
  onStudentIdChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
}

const LoginForm = ({
  studentId,
  password,
  loading,
  onStudentIdChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.loginContainer}>
      <View style={styles.inner}>
        <Text style={styles.title}>Student Portal</Text>

        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          value={studentId}
          onChangeText={onStudentIdChange}
          placeholder="Enter ID"
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.textSecondary}
          editable={!loading}
        />
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry={!showPassword}
            placeholder="Enter Password"
            autoCapitalize="none"
            placeholderTextColor={colors.textSecondary}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Verifying..." : "Login"}
            onPress={onSubmit}
            disabled={loading}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    marginHorizontal: 40,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  inner: { padding: spacing.xxl },
  title: {
    ...typography.h1,
    textAlign: "center",
    marginBottom: 40,
    color: colors.textPrimary,
  },
  label: {
    ...typography.bodyLg,
    marginBottom: spacing.sm,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    ...typography.bodyLg,
    minHeight: touchTarget.comfortable,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    marginBottom: spacing.xl,
    minHeight: touchTarget.comfortable,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    ...typography.bodyLg,
  },
  visibilityButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  buttonContainer: { marginTop: spacing.md - 2 },
});

export default LoginForm;
