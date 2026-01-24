import AsyncStorage from '@react-native-async-storage/async-storage';
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

const API_URL = `${BASE_API_URL}/auth/login`;
const LoginScreen = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validation
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

      // 2. Success Handling (Common for both modes)
      // Save the token securely so the user stays logged in

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.wrapper}>
        <View style={styles.logo_container}>
          <Image source={require('../../assets/images/cyberdevlogo.png')} style={[styles.logo, { marginTop: 20 }]} />
          <Image source={require('../../assets/images/ccslogo.png')} style={styles.logo} />
          <Image source={require('../../assets/images/ncflogo.png')} style={[styles.logo, { marginTop: 20 }]} />

        </View>
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

            {/* Helper text for development
          {USE_MOCK_API && (
        //    <Text style={styles.devText}>Dev Mode: Use ID: 12345 / Pass: pass</Text>
        //  )}*/}


          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  wrapper: { flex: 1, justifyContent: 'center' },
  inner: { padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600', color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 20, borderRadius: 8, backgroundColor: '#fafafa', fontSize: 16 },
  buttonContainer: { marginTop: 10 },
  devText: { marginTop: 20, textAlign: 'center', color: 'orange', fontSize: 12 },
  logo_container: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 20, height: 100 },
  logo: { width: 100, height: 100, resizeMode: 'contain', marginHorizontal: 5 }
});

export default LoginScreen;
