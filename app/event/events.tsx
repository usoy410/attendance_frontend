import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
// import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventCard } from "../../components/EventCard";
import { borderRadius, colors, elevation, gradients, spacing, touchTarget, typography } from "../../constants/theme";
import { Event, useEvents } from "../../hooks/useEvents";

export default function EventsScreen() {
  const { events, loading, refetch, addEvent, updateEvent, deleteEvent, page, limit, total, setPage } = useEvents();
  const [saving, setSaving] = useState(false);

  // UI State
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Local refreshing state

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // --- Handlers ---

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewTitle("");
    setNewDescription("");
    setSelectedDate(new Date());
    setIsEditing(false);
    setEditingEvent(null);
    setShowDatePicker(false);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleEditPress = (event: Event) => {
    setIsEditing(true);
    setEditingEvent(event);
    setNewTitle(event.eventTitle);
    setNewDescription(event.eventDescription);
    setSelectedDate(new Date(event.date));
    setModalVisible(true);
  };

  const handleDeletePress = (id: string) => {
    Alert.alert("Delete Event", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteEvent(id) },
    ]);
  };

  const handleSave = async () => {
    if (!newTitle.trim()) return Alert.alert("Validation", "Please enter a title");
    if (!newDescription.trim()) return Alert.alert("Validation", "Please enter a description");
    if (!selectedDate) return Alert.alert("Validation", "Please select a date");

    setSaving(true);
    const eventPayload = {
      eventTitle: newTitle.trim(),
      eventDescription: newDescription.trim(),
      date: selectedDate.toISOString().substring(0, 10),
    };

    let success = false;
    if (isEditing && editingEvent) {
      success = await updateEvent(editingEvent._id, eventPayload);
    } else {
      success = await addEvent(eventPayload);
    }

    setSaving(false);
    if (success) closeModal();
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  return (
    // <LinearGradient  {...gradients.blueRedHorizontal} style={styles.gradientContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Events</Text>

          {loading && !refreshing ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#007bff" />
            </View>
          ) : (
            <FlatList
              data={events}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.noEvents}>No events found</Text>}
              // for refresh of list
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007bff"]} />
              }
              renderItem={({ item }) => (
                <EventCard event={item} onEdit={handleEditPress} onDelete={handleDeletePress} />
              )}
            />
          )}

          {/* Pagination */}
          {total > limit && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageButton, page === 1 && styles.disabledButton]}
                onPress={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
              >
                <Text style={styles.pageButtonText}>Prev</Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo}>Page {page} of {Math.ceil(total / limit)}</Text>
              <TouchableOpacity
                style={[styles.pageButton, page >= Math.ceil(total / limit) && styles.disabledButton]}
                onPress={() => page < Math.ceil(total / limit) && setPage(page + 1)}
                disabled={page >= Math.ceil(total / limit)}
              >
                <Text style={styles.pageButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{isEditing ? "Edit Event" : "Add New Event"}</Text>

              <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#333" />
                <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveButton, saving && styles.disabledButton]} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{isEditing ? "Update" : "Add"}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
          {showDatePicker && (
            <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onDateChange} />
          )}
        </Modal>
      </SafeAreaView>
    // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,

  },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: spacing.md - 2,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    textAlign: "center",
    ...typography.h1,
    marginBottom: spacing.md - 2,
    color: colors.textPrimary,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
  },
  listContainer: { flexGrow: 1, padding: spacing.lg, paddingBottom: 100 },
  noEvents: {
    textAlign: "center",
    ...typography.bodyLg,
    color: colors.textMuted,
    marginTop: 50
  },
  addButton: {
    position: "absolute",
    bottom: spacing.xxl + 6,
    right: spacing.xl,
    backgroundColor: '#007bff', // Semi-transparent white
    borderRadius: borderRadius.round,
    width: touchTarget.large,
    height: touchTarget.large,
    justifyContent: "center",
    alignItems: "center",
    ...elevation.level4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay
  },
  modalContent: {
    backgroundColor: colors.bgPrimary,
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
    width: "85%",
    ...elevation.level5,
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.xl,
    textAlign: "center",
    color: colors.textPrimary
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg - 1,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgTertiary,
    ...typography.bodyLg,
    minHeight: touchTarget.comfortable,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xl,
    backgroundColor: colors.bgTertiary,
    minHeight: touchTarget.comfortable,
  },
  dateText: {
    marginLeft: spacing.md - 2,
    ...typography.bodyLg,
    color: colors.textSecondary
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md - 2 },
  cancelButton: {
    backgroundColor: colors.borderDark,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    flex: 1,
    minHeight: touchTarget.minimum,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.level1,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    flex: 1,
    minHeight: touchTarget.minimum,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.level1,
  },
  buttonText: {
    color: colors.textWhite,
    textAlign: "center",
    ...typography.button
  },

  // Pagination Styles
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.borderMedium,
    ...elevation.level2,
  },
  pageButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    minHeight: touchTarget.minimum,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.level1,
  },
  disabledButton: {
    backgroundColor: colors.borderDark,
    ...elevation.level0,
  },
  pageButtonText: {
    color: colors.textWhite,
    ...typography.button
  },
  pageInfo: {
    ...typography.bodyLg,
    color: colors.textSecondary
  },
});
