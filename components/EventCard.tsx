import { borderRadius, colors, elevation, spacing, typography } from '@/constants/theme';
import { Event } from '@/hooks/useEvents';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}
const EventCardBase = ({ event, onEdit, onDelete }: EventCardProps) => {
  const router = useRouter();

  const handleCardPress = useCallback(() => {
    router.push({
      pathname: '/event/[id]',
      params: {
        id: event._id,
        title: event.eventTitle,
        description: event.eventDescription,
        date: event.date
      }
    });
  }, [router, event._id, event.eventTitle, event.eventDescription, event.date]);

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.7}>
      <Text style={styles.cardTitle}>{event.eventTitle}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {event.eventDescription}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.cardDate}>{event.date}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onEdit(event)}
          >
            <Ionicons name="pencil" size={20} color="#007bff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onDelete(event._id)}
          >
            <Ionicons name="trash" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Export the memoized version
export const EventCard = React.memo(EventCardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgPrimary,
    padding: spacing.xl,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...elevation.level2,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  cardDesc: {
    ...typography.body,
    color: colors.textTertiary,
    marginBottom: spacing.md - 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  cardDate: {
    ...typography.bodySm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: spacing.sm,
    padding: spacing.md,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
