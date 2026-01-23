import { router } from 'expo-router'
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

const Index = () => {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    router.navigate("/(tabs)/events")
    console.log('Login pressed', studentId, password)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.label}>Student ID</Text>
      <TextInput
        style={styles.input}
        value={studentId}
        onChangeText={setStudentId}
        placeholder="Enter Student ID"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter Password"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
})

export default Index
