import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { spacing, touchTarget } from '@/constants/theme';

interface BackButtonProps {
  color?: string;
  size?: number;
}

const BackButton: React.FC<BackButtonProps> = ({ color = '#000', size = 24 }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xs,
    position: 'absolute',
    top: 0,
    left: 0,
    minWidth: touchTarget.minimum,
    minHeight: touchTarget.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButton;
