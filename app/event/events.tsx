import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
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
import { EventCard } from "../../components/EventCard"; // Import the new component
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
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, paddingTop: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { textAlign: "center", fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#333" },
  listContainer: { flexGrow: 1, padding: 16, paddingBottom: 100 },
  noEvents: { textAlign: "center", fontSize: 16, color: "#888", marginTop: 50 },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    fontSize: 16,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  dateText: { marginLeft: 10, fontSize: 16, color: "#333" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  cancelButton: { backgroundColor: "#e0e0e0", paddingVertical: 12, borderRadius: 8, flex: 1 },
  saveButton: { backgroundColor: "#007bff", paddingVertical: 12, borderRadius: 8, flex: 1 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600", fontSize: 16 },

  // Pagination Styles
  pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#ddd" },
  pageButton: { backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  disabledButton: { backgroundColor: "#ccc" },
  pageButtonText: { color: "white", fontWeight: "600" },
  pageInfo: { fontSize: 16, color: "#333" },
});
