import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Event {
  id: number;
  title: string;
  description: string;
}

export default function events() {
  const addEvent = () => {
    console.log('addEvent called');
  }

  const deleteEvent = (id: number) => {
    // setEventsData(prev => prev.filter(event => event.id !== id));
  }

  const updateEvent = (event: Event) => {
    console.log('updateEvent called for', event);
    // TODO: Implement update logic, e.g., open edit modal or navigate to edit screen
  }

  // const [eventsData, setEventsData] = useState<Event[]>([]);
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await fetch('');
  //       const data = await response.json();
  //       setEventsData(data);
  //     } catch (error) {
  //       console.error('Error fetching events:', error);
  //     }
  //   };
  //   fetchEvents();
  // }, []);

  // sample lang
  const eventsData: Event[] = [
    { id: 1, title: 'Instrms', description: 'mag tambay sa school' },
    { id: 2, title: 'general assymbly', description: 'mag halat snack' },
  ];

  return (
    <SafeAreaView>

      <View style={styles.container}>
        <Text style={styles.title}>Events</Text>
        <FlatList
          data={eventsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: Event }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={() => updateEvent(item)}>
                  <Ionicons name="pencil" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => deleteEvent(item.id)}>
                  <Ionicons name="trash" size={20} color="#dc3545" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.noEvents}>No events</Text>}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity style={styles.addButton} onPress={addEvent}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noEvents: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
  },
})

