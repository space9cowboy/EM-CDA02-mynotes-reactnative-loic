import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import colors from '../misc/colors';

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

  // handlesave est une fonction asynchrone utilisé pour sauvegarder une nouvelle note ou mettre à jour une note existante
  // dans le local storage en utilisant AsyncStorage
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

  const getSelectedPriorityButtonStyle = (priority) => {
    switch (priority) {
      case 'Important':
        return { backgroundColor: '#F45B69', borderWidth: 1, borderColor: '#F45B69'  }; // Tomate
      case 'Normal':
        return { backgroundColor: '#114B5F' , borderWidth: 1, borderColor: '#114B5F'  }; // Or
      case 'Pense bête':
        return { backgroundColor: '#7EE4EC', borderWidth: 1, borderColor: '#7EE4EC'  }; // Vert lime
      default:
        return {};
    }
  };

  const renderPriorityButton = (priority: 'Important' | 'Normal' | 'Pense bête') => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        note.priority === priority && getSelectedPriorityButtonStyle(priority), 
      ]}
      onPress={() => setNote(prevNote => ({ ...prevNote, priority }))}
    >
      <Text style={[styles.priorityButtonText, note.priority === priority && styles.selectedPriorityButtonText]}>{priority}</Text>
    </TouchableOpacity>
  );

  const handlePress = () => {
    if (noteId) {
      navigation.navigate('notes');  // Redirige vers la page 'notes' si on édite une note
    } else {
      navigation.navigate('dashboard');  // Redirige vers le 'dashboard' si on crée une nouvelle note
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.formHead}>
        <TouchableOpacity style={styles.addButton} 
      onPress={handlePress}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{noteId ? 'Edit Note' : 'Create Note'}</Text>
      </View>
      <TextInput
        style={styles.inputTitle}
        placeholder="Title"
        value={note.title}
        onChangeText={(text) => setNote(prev => ({ ...prev, title: text }))}
      />
      <TextInput
        style={styles.inputContent}
        placeholder="Content"
        value={note.content}
        onChangeText={(text) => setNote(prev => ({ ...prev, content: text }))}
        multiline
      />
      <Text style={styles.label}>Priority:</Text>
      
      <View style={styles.priorityContainer}>
        {renderPriorityButton('Important')}
        {renderPriorityButton('Normal')}
        {renderPriorityButton('Pense bête')}
      </View>
      
      <TouchableOpacity style={[styles.addCreate, { backgroundColor: colors.LIGHT, borderColor: 'white' }]} 
      onPress={handleSave}>
        {/* <Text style={styles.createText}>Create</Text> */}
        <Ionicons name="add" size={40} color={colors.SECONDARY} />
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
  formHead: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 15,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    //marginBottom: 16,
    fontFamily: 'Montserrat',
    alignSelf: 'center',
    color: 'white',
  },
  inputTitle: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    fontFamily: 'Montserrat',
    fontSize : '15',
  },
  inputContent: {
    height: '55%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    fontFamily: 'Montserrat',
    fontSize : '15',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: 'white',
    fontFamily: 'Montserrat',
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 36,
    justifyContent: 'space-around',
    
  },
  priorityButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#456990',
    borderWidth : 1,
    borderColor: 'white',
  },
  selectedPriorityButton: {
    backgroundColor: '#456990',
    
  },
  priorityButtonText: {
    color: 'white',
    fontFamily: 'Montserrat',
  },
  addCreate : {
    
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
});

export default Formulaire;
