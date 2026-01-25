import { borderRadius, colors, spacing, touchTarget, typography } from "@/constants/theme";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

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
}: LoginFormProps) => (
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
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        placeholder="Enter Password"
        autoCapitalize="none"
        placeholderTextColor={colors.textSecondary}
        editable={!loading}
      />

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
  buttonContainer: { marginTop: spacing.md - 2 },
});

export default LoginForm;
