import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'Important' | 'Normal' | 'Pense bête';
}

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Failed to load notes', error);
      }
    };

    fetchNotes();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Important':
        return '#FF0000'; // Red
      case 'Normal':
        return '#00FF00'; // Green
      case 'Pense bête':
        return '#0000FF'; // Blue
      default:
        return '#000000'; // Black
    }
  };

  const navigateToNoteDetails = (noteId: string) => {
    navigation.navigate('notes', { noteId }); // Naviguer vers 'notes' avec l'ID de la note comme paramètre
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
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
      <Link href="/formulaire" style={styles.addButton}>
        <Text style={styles.addButtonText}>ADD</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noNotesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  priorityIndicator: {
    width: 10,
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
  },
  noteDate: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  noteContent: {
    fontSize: 16,
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Dashboard;
