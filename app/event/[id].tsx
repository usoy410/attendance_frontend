import BackButton from '@/components/backButton';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function EventDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [timeOfDay, setTimeOfDay] = useState<'AM' | 'PM'>('AM');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: 'Event Details', headerBackTitle: 'Back' }} />
      {/* header section */}
      <View style={styles.header}>
        <View style={styles.top_items}>
          <BackButton size={30} />
          {/* <View style={styles.dateBadgeContainer}> */}
          {/* <Ionicons name="calendar" size={20} color="#007bff" /> */}
          <Text style={styles.dateBadgeText}>{params.date}</Text>
          {/* </View> */}
        </View>
        <Text style={styles.title}>{params.title}</Text>
        <Text style={styles.description}>{params.description}</Text>
      </View>

      <View style={styles.divider} />

      {/* --- Time Selection --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Session Time</Text>
        <View style={styles.radioGroup}>
          {['AM', 'PM'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.radioButton,
                timeOfDay === option && styles.radioButtonSelected
              ]}
              onPress={() => setTimeOfDay(option as 'AM' | 'PM')}
            >
              <View style={styles.radioOuterCircle}>
                {timeOfDay === option && <View style={styles.radioInnerCircle} />}
              </View>
              <Text style={[
                styles.radioText,
                timeOfDay === option && styles.radioTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.divider} />


      {/* QRCode card */}
      <View style={styles.qrCodeSection}>
        <Text style={styles.sectionTitle}>Event QR Code</Text>
        {/* Placeholder Box */}
        <View style={styles.qrPlaceholder}>
          <Ionicons name="qr-code-outline" size={60} color="#ccc" />
          <Text style={styles.qrPlaceholderText}>QR Code Area</Text>
        </View>

        <Text style={styles.qrHint}>Scan for attendance</Text>

        {/* Dynamic Badge showing selected time */}
        <View style={styles.sessionBadge}>
          <Text style={styles.sessionBadgeText}>{timeOfDay} SESSION</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  // Header Styles
  header: {
    marginBottom: 10,
  },
  top_items: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  dateBadgeText: {
    color: '#1a1a1a',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 24,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  // Radio Buttons
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee', // Default border
    flex: 1,
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007bff',
    backgroundColor: '#f8fbff', // Very light blue bg when selected
  },
  radioOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  radioText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
  },
  radioTextSelected: {
    color: '#007bff',
  },
  // Ticket / QR Section
  qrCodeSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed', // Dashed border to indicate placeholder
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrPlaceholderText: {
    marginTop: 10,
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  qrHint: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  sessionBadge: {
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sessionBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1.2,
  }
});
