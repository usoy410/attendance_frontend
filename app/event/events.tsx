import { EventCard } from "@/components/EventCard";
import { EventFormModal, FormState } from "@/components/EventFormModal";
import { PaginationControls } from "@/components/PaginationControls";
import { Event, useEvents } from "@/hooks/useEvents";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, elevation, spacing, touchTarget, typography } from "../../constants/theme";

const INITIAL_FORM_STATE: FormState = {
  title: "",
  description: "",
  date: new Date(),
  isEditing: false,
  editingId: null,
};

export default function EventsScreen() {
  const { events, loading, refetch, addEvent, updateEvent, deleteEvent, page, limit, total, setPage } = useEvents();

  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Helpers
  const validateForm = (): boolean => {
    if (!formState.title.trim()) {
      Alert.alert("Validation", "Please enter a title");
      return false;
    }
    if (!formState.description.trim()) {
      Alert.alert("Validation", "Please enter a description");
      return false;
    }
    if (!formState.date) {
      Alert.alert("Validation", "Please select a date");
      return false;
    }
    return true;
  };

  const createEventPayload = () => ({
    eventTitle: formState.title.trim(),
    eventDescription: formState.description.trim(),
    date: formState.date.toISOString().substring(0, 10),
  });

  const closeModal = () => {
    setModalVisible(false);
    setFormState(INITIAL_FORM_STATE);
  };

  const openAddModal = () => {
    setFormState(INITIAL_FORM_STATE);
    setModalVisible(true);
  };

  const handleEditPress = (event: Event) => {
    setFormState({
      title: event.eventTitle,
      description: event.eventDescription,
      date: new Date(event.date),
      isEditing: true,
      editingId: event._id,
    });
    setModalVisible(true);
  };

  const handleDeletePress = (id: string) => {
    Alert.alert("Delete Event", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteEvent(id) },
    ]);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    const payload = createEventPayload();
    let success = false;

    if (formState.isEditing && formState.editingId) {
      success = await updateEvent(formState.editingId, payload);
    } else {
      success = await addEvent(payload);
    }

    setSaving(false);
    if (success) closeModal();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.noEvents}>No events found</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007bff"]} />
            }
            renderItem={({ item }) => (
              <EventCard event={item} onEdit={handleEditPress} onDelete={handleDeletePress} />
            )}
          />
        )}

        {total > limit && (
          <PaginationControls page={page} total={total} limit={limit} onPageChange={setPage} />
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <EventFormModal
        visible={modalVisible}
        formState={formState}
        saving={saving}
        onFormChange={(updates) => setFormState((prev) => ({ ...prev, ...updates }))}
        onSave={handleSave}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
  listContainer: { flexGrow: 1, padding: spacing.lg, paddingBottom: 100 },
  noEvents: {
    textAlign: "center",
    ...typography.bodyLg,
    color: colors.textMuted,
    marginTop: 50,
  },
  addButton: {
    position: "absolute",
    bottom: spacing.xxl + 6,
    right: spacing.xl,
    backgroundColor: "#007bff",
    borderRadius: 999,
    width: touchTarget.large,
    height: touchTarget.large,
    justifyContent: "center",
    alignItems: "center",
    ...elevation.level4,
  },
});
