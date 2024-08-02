import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const Formulaire = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const noteId = route.params?.noteId;
  const [note, setNote] = useState<Note>({
    id: '',
    title: '',
    date: new Date().toLocaleDateString(),
    content: '',
    priority: 'Normal',
    createdAt: new Date().toISOString(),
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
        const newNote = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() }; // Génération d'un identifiant unique basé sur la date actuelle
        await AsyncStorage.setItem('notes', JSON.stringify([...notes, newNote]));
      }

      navigation.navigate('dashboard');
    } catch (error) {
      console.error('Failed to save note', error);
      Alert.alert('Error', 'Failed to save note.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={note.title}
        onChangeText={(text) => setNote(prev => ({ ...prev, title: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Content"
        value={note.content}
        onChangeText={(text) => setNote(prev => ({ ...prev, content: text }))}
        multiline
      />
      <Text style={styles.label}>Priority:</Text>
      <View style={styles.priorityContainer}>
        {['Important', 'Normal', 'Pense bête'].map((priority) => (
          <TouchableOpacity
            key={priority}
            style={[
              styles.priorityButton,
              note.priority === priority && styles.selectedPriorityButton,
            ]}
            onPress={() => setNote(prev => ({ ...prev, priority }))}
          >
            <Text style={styles.priorityButtonText}>{priority}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save" size={24} color="white" />
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#456990',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Montserrat',
    alignSelf: 'center',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: 'white',
    fontFamily: 'Montserrat',
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  priorityButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#7EE4EC',
  },
  selectedPriorityButton: {
    backgroundColor: '#F45B69',
  },
  priorityButtonText: {
    color: 'white',
    fontFamily: 'Montserrat',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#114B5F',
  },
  saveButtonText: {
    marginLeft: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
});

export default Formulaire;
