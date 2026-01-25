import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { BASE_API_URL } from '../../constants/api';
import { borderRadius, colors, elevation, gradients, spacing, touchTarget, typography } from '../../constants/theme';

const API_URL = `${BASE_API_URL}/auth/login`;
const LoginScreen = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      Alert.alert('Incomplete', 'Please enter both student ID and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentId,
          password: password
        })
      });

      const data = await response.json();

      // console.log('Login response status:', response.status);
      // console.log('Login response data:', data);

      if (!response.ok) {
        let errorMessage = 'Login failed';
        if (response.status === 400) {
          errorMessage = data.message || 'Invalid request. Please check your input.';
        } else if (response.status === 401) {
          errorMessage = 'Invalid student ID or password.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.message || `Login failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
      }

      // Navigate to the events page
      router.replace('/event/events');
    } catch (error: any) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient  {...gradients.blueRedHorizontal} style={styles.gradientContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          <View style={styles.logo_container}>
            <Image source={require('../../assets/images/ccslogo.png')} style={styles.logo} />
            <Image source={require('../../assets/images/cyberdevlogo.png')} style={[styles.logo, { marginTop: 20 }]} />
            <Image source={require('../../assets/images/ncflogo.png')} style={[styles.logo, { marginTop: 20 }]} />

          </View>
          <View style={styles.loginContainer}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inner}>
                <Text style={styles.title}>Student Portal</Text>

                <Text style={styles.label}>Student ID</Text>
                <TextInput
                  style={styles.input}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Enter ID"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter Password"
                  autoCapitalize="none"
                />

                <View style={styles.buttonContainer}>
                  <Button
                    title={loading ? 'Verifying...' : 'Login'}
                    onPress={handleLogin}
                    disabled={loading}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1 },
  loginContainer: {
    marginHorizontal: 40,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  wrapper: { flex: 1, justifyContent: 'center' },
  inner: { padding: spacing.xxl },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: 40,
    color: colors.textPrimary
  },
  label: {
    ...typography.bodyLg,
    marginBottom: spacing.sm,
    fontWeight: '600',
    color: colors.textSecondary
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgTertiary,
    ...typography.bodyLg,
    minHeight: touchTarget.comfortable,
    ...elevation.level1,
  },
  buttonContainer: { marginTop: spacing.md - 2 },
  devText: {
    marginTop: spacing.xl,
    textAlign: 'center',
    color: colors.warning,
    ...typography.caption
  },
  logo_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
    height: 100
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginHorizontal: spacing.xs + 1
  }
});

export default LoginScreen;
