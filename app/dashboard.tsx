import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'Important' | 'Normal' | 'Pense bête';
  createdAt: string;
}

const Dashboard = () => {
  const [greet, setGreet] = useState('Evening');
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<{ name: string }>({ name: '' });
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      }
    };

    fetchUser();
  }, []);

  const fetchNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const notesArray = JSON.parse(storedNotes);
        // Trier les notes par createdAt dans l'ordre décroissant
        notesArray.sort((a: Note, b: Note) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotes(notesArray);
      }
    } catch (error) {
      console.error('Failed to load notes', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotes();
    }, [])
  );

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreet('Morning');
    } else if (currentHour < 18) {
      setGreet('Afternoon');
    } else {
      setGreet('Evening');
    }
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Important':
        return '#F45B69'; // Red
      case 'Normal':
        return '#456990'; // Green
      case 'Pense bête':
        return '#7EE4EC'; // Blue
      default:
        return '#000000'; // Black
    }
  };

  const handlePress = () => {
    navigation.navigate('formulaire');
  };

  const navigateToNoteDetails = (noteId: string) => {
    navigation.navigate('notes', { noteId }); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Good ${greet}, ${user.name}`}</Text>
      {notes.length === 0 ? (
        <Text style={styles.noNotesText}>No notes available</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.card}
              onPress={() => navigateToNoteDetails(note.id)}
            >
              <View style={{ ...styles.priorityIndicator, backgroundColor: getPriorityColor(note.priority) }} />
              <View style={styles.cardContent}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteDate}>{note.date}</Text>
                <Text style={styles.noteContent} numberOfLines={1}>{note.content}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={handlePress}>
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#456990',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Montserrat',
    alignSelf: 'center',
    color: 'white',
  },
  noNotesText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  priorityIndicator: {
    width: 20,
    height: '100%',
    borderRadius: 4,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat'
  },
  noteDate: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
    fontFamily: 'Montserrat'
  },
  noteContent: {
    fontSize: 16,
    fontFamily: 'Montserrat'
  },
  addButton: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#114B5F',
    padding: 15,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    fontFamily: 'Montserrat',
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 9,
    },
    shadowOpacity: 0.9,
    shadowRadius: 9.51,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default Dashboard;
