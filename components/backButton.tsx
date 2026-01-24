import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface BackButtonProps {
  color?: string;
  size?: number;
}

const BackButton: React.FC<BackButtonProps> = ({ color = 'black', size = 24 }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default BackButton;
