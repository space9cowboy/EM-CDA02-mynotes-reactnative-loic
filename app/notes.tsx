import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'Important' | 'Normal' | 'Pense bête';
}

const notes = () => {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        try {
          const storedNotes = await AsyncStorage.getItem('notes');
          if (storedNotes) {
            const notes = JSON.parse(storedNotes) as Note[];
            const noteToView = notes.find(n => n.id === noteId);
            if (noteToView) {
              setNote(noteToView);
            }
          }
        } catch (error) {
          console.error('Failed to load note', error);
        }
      };

      fetchNote();
    }
  }, [noteId]);

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedNotes = await AsyncStorage.getItem('notes');
              const notes = storedNotes ? (JSON.parse(storedNotes) as Note[]) : [];
              const updatedNotes = notes.filter(n => n.id !== noteId);
              await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
              router.push('/');
            } catch (error) {
              console.error('Failed to delete note', error);
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.date}>{note.date}</Text>
      <Text style={styles.content}>{note.content}</Text>
      <Text style={styles.priority}>
        {note.priority}
      </Text>
      <View style={styles.buttonContainer}>
        <Link href={`/formulaire?noteId=${note.id}`} style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </Link>
        <TouchableOpacity onPress={handleDelete} style={styles.button}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Link href="/" style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
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
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  content: {
    fontSize: 18,
    marginBottom: 16,
  },
  priority: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 16,
  },
  priorityImportant: {
    backgroundColor: '#FF0000',
    color: '#FFF',
  },
  priorityNormal: {
    backgroundColor: '#FFD700',
    color: '#FFF',
  },
  priorityPenseBete: {
    backgroundColor: '#00FF00',
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default notes;
