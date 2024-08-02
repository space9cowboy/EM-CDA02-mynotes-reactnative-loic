import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '../misc/colors';

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'Important' | 'Normal' | 'Pense bête';
}

const Notes = () => {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const navigation = useNavigation();

 

  useFocusEffect(
    React.useCallback(() => {
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
    }, [noteId])
  );

  const handleDelete = async () => {
    try {
      // Get the existing notes
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? (JSON.parse(storedNotes) as Note[]) : [];

      // Filter out the note to be deleted
      const updatedNotes = notes.filter(n => n.id !== noteId);

      // Save the updated notes back to AsyncStorage
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

      // Navigate back to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading...</Text>
      </View>
    );
  }

  const handlePress = () => {
    navigation.navigate('dashboard');
  };

  const handleEditPress = () => {
    navigation.navigate('formulaire', { noteId: note.id });
  };

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


  return (
    <View style={styles.container}>
      <View style={styles.formHead}>
        <TouchableOpacity 
      onPress={handlePress}>
          <Ionicons name="arrow-back" size={30} color='#114B5F' />
        </TouchableOpacity>
        <Text style={styles.title}>My Note</Text>
      </View>
      <View style={styles.notesContainer}>
        <Text style={styles.titleNote}>{note.title}</Text>
        <Text style={styles.date}>{note.date}</Text>
        <Text style={styles.content}>{note.content}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={handleEditPress} style={styles.buttonEdit}>
        <AntDesign name="edit" size={30} color="white" />
      </TouchableOpacity>
        <View style={{ ...styles.priorityText, backgroundColor: getPriorityColor(note.priority) }}>
          <Text style={styles.priority}>
          {note.priority}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.buttonDelete}>
        <AntDesign name="delete" size={30} color="white" />
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFD4CA'
  },
  formHead: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 25,
    
  },
  notesContainer : {
    flex : 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    //marginBottom: 16,
    fontFamily: 'Montserrat',
    color: '#114B5F',
    marginRight : 120,
    
  },
  titleNote: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Montserrat',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  content: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  priority: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 25,
    //borderRadius: 25,
    textAlign: 'center',
    //backgroundColor: 'blue',
    alignSelf: 'center',
    //marginBottom: 16,
    fontFamily: 'Montserrat',
    
  },
  priorityText : {
    
    borderRadius : 10,
  },
 
  buttonContainer: {
    //width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,

  },
  buttonEdit: {
    //flex: 1,
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#114B5F',
    alignItems: 'center',
    marginHorizontal: 4,
    //width : 100,
   
  },
  buttonDelete: {
    //flex: 1,
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#114B5F',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  // buttonText: {
  //   fontSize: 18,
  //   color: '#FFF',
  //   fontWeight: 'bold',
  // },
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

export default Notes;
