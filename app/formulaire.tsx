import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'Important' | 'Normal' | 'Pense bête';
}

const Formulaire = () => {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [note, setNote] = useState<Note>({
    id: '',
    title: '',
    date: new Date().toLocaleDateString(),
    content: '',
    priority: 'Normal',
  });

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        try {
          const storedNotes = await AsyncStorage.getItem('notes');
          if (storedNotes) {
            const notes = JSON.parse(storedNotes) as Note[];
            const noteToEdit = notes.find(n => n.id === noteId);
            if (noteToEdit) {
              setNote(noteToEdit);
            }
          }
        } catch (error) {
          console.error('Failed to load note', error);
        }
      };

      fetchNote();
    }
  }, [noteId]);

  const handleSave = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? (JSON.parse(storedNotes) as Note[]) : [];

      if (noteId) {
        const updatedNotes = notes.map(n => (n.id === noteId ? note : n));
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      } else {
        const newNote = { ...note, id: Date.now().toString() }; // Génération d'un identifiant unique basé sur la date actuelle
        await AsyncStorage.setItem('notes', JSON.stringify([...notes, newNote]));
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save note', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const renderPriorityButton = (priority: 'Important' | 'Normal' | 'Pense bête') => (
    <TouchableOpacity
      style={[styles.priorityButton, note.priority === priority && styles.selectedPriorityButton]}
      onPress={() => setNote(prevNote => ({ ...prevNote, priority }))}
    >
      <Text style={styles.priorityButtonText}>{priority}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{noteId ? 'Edit Note' : 'Create Note'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={note.title}
        onChangeText={(text) => setNote(prevNote => ({ ...prevNote, title: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Content"
        value={note.content}
        onChangeText={(text) => setNote(prevNote => ({ ...prevNote, content: text }))}
        multiline
      />
      <Text style={styles.priorityLabel}>Priority:</Text>
      <View style={styles.priorityContainer}>
        {renderPriorityButton('Important')}
        {renderPriorityButton('Normal')}
        {renderPriorityButton('Pense bête')}
      </View>
      <Button title="Save" onPress={handleSave} />
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
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  priorityLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedPriorityButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  priorityButtonText: {
    color: '#fff',
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
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Formulaire;
