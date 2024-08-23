import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import {  useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceType } from '../hooks/useDeviceType'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '../misc/colors';
import BackButton from '@/components/BackButton';
import { RichEditor } from 'react-native-pell-rich-editor';
import useOrientation from '../hooks/useOrientation';
import { ORIENTATION } from '../constants/orientation/index';

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'Important' | 'Normal' | 'Reminder';
}

const Notes = () => {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const navigation = useNavigation();
  const { isTabletOrMobileDevice, isTablet } = useDeviceType(); 
  const [editorKey, setEditorKey] = useState(0);
  const orientation = useOrientation();

 

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
              setEditorKey(prevKey => prevKey + 1); 
            }
          }
        } catch (error) {
          console.error('Failed to load note', error);
        }
      };
  
      fetchNote();
    }, [noteId]) // Ajout de noteId comme dépendance pour assurer le rechargement
  );
  
// Fonction pour la suppression de notes 
  const handleDelete = () => {
    Alert.alert(
      "Confirm deletion",
      "Are you sure ou want to delete this note ? ",
      [
        {
          text: "Non",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: async () => {
            try {
              const storedNotes = await AsyncStorage.getItem('notes');
              const notes = storedNotes ? JSON.parse(storedNotes) : [];
              const updatedNotes = notes.filter(n => n.id !== noteId);
              await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
              router.push('/dashboard');
            } catch (error) {
              console.error('Failed to delete note', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  //Loader
  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading...</Text>
      </View>
    );
  }

 

 /**
  * The function `getPriorityColor` takes a priority string as input and returns a corresponding color
  * based on the priority level.
  * @param {string} priority - The `getPriorityColor` function takes a `priority` parameter, which is a
  * string indicating the priority level. The function then returns a color based on the priority level
  * provided. The color returned depends on the priority level as follows:
  * @returns The `getPriorityColor` function returns a color based on the priority input. If the
  * priority is 'Important', it returns the color represented by `colors.ERROR`. If the priority is
  * 'Normal', it returns the color represented by `colors.SECONDARY`. If the priority is 'Reminder', it
  * returns the color represented by `colors.PRIMARY`. If the priority does not match any of these
  * cases
  */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Important':
        return colors.ERROR; 
      case 'Normal':
        return colors.SECONDARY; 
      case 'Reminder':
        return colors.PRIMARY 
      default:
        return '#000000'; 
    }
  };

  const handlePress = () => {
    navigation.navigate('dashboard');
  };

  const handleEditPress = () => {
    navigation.navigate('formulaire', { noteId: note.id });
  };


  return (
    <View style={[orientation === ORIENTATION.PORTRAIT ? styles.container : styles.containerLandscape, isTabletOrMobileDevice && styles.containerTablet]}>
      <View style={styles.formHead}>
        <TouchableOpacity 
      onPress={handlePress}>
          <BackButton  onPress={handlePress} color={colors.SECONDARY} size={30} />
        </TouchableOpacity>
        <Text style={[styles.title, isTablet && styles.titleTablet]}>My Note</Text>
      </View>

      <View style={orientation === ORIENTATION.PORTRAIT ? styles.notesContainer : styles.notesContainerLandscape}>
      <View style={{ ...styles.priorityText, backgroundColor: getPriorityColor(note.priority) }}>
          <Text style={[styles.priority, isTablet && styles.priorityTablet]}>
          {note.priority}
          </Text>
        </View>
        <Text style={[styles.titleNote, isTablet && styles.titleNoteTablet]}>{note.title}</Text>
        <Text style={styles.date}>{note.date}</Text>
        <ScrollView style={ orientation === ORIENTATION.PORTRAIT ? styles.scrollView : styles.scrollViewLandscape}>
        <RichEditor
            key={editorKey}  // Utilisation de l'état `editorKey` pour forcer le re-rendu
            initialContentHTML={note.content}
            disabled
            style={[styles.richTextEditor, isTablet && styles.richTextEditorTablet]}
          />
        </ScrollView>

      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={handleEditPress} style={[styles.buttonED, isTablet && styles.buttonEDTablet]}>
        <AntDesign name="edit" size={isTablet ? styles.iconSizeTablet : styles.iconSize} color="white" />
      </TouchableOpacity>
        
        <TouchableOpacity onPress={handleDelete} style={[styles.buttonDelete, isTablet && styles.buttonEDTablet]}>
        <AntDesign name="delete" size={isTablet ? styles.iconSizeTablet : styles.iconSize} color="white" />
        </TouchableOpacity>
      </View>

      </View>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.LIGHT,
  },
  containerTablet: {
    flex: 1,
    //padding: 30,
  },
  containerLandscape: {
    backgroundColor: colors.LIGHT,
    paddingHorizontal: 50,
    paddingTop: 30,
    height: '100%'
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
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 4,
    borderRadius: 30,
    borderColor: colors.SECONDARY,
  },
  notesContainerLandscape: {
    flex : 1,
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 4,
    borderRadius: 30,
    borderColor: colors.SECONDARY,
    marginBottom: 20,
    
  },
  scrollView : {
   
  },
  scrollViewLandscape: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    color: colors.SECONDARY,
  },
  titleTablet: {
    fontSize: 36,
  },
  titleNote: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Montserrat',
    marginLeft: 10,
  },
  titleNoteTablet: {
    fontSize: 40,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
    marginLeft: 10,
    fontFamily: 'Montserrat',
  },
  content: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  contentTablet: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  priority: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Montserrat',
    color: colors.WHITE,
    
  },
  priorityTablet: {
    fontSize: 24,
  },
  priorityText : {
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius : 25,
    width: '50%',
    marginBottom: 20,
  },
  priorityTextTablet: {
    paddingHorizontal: 28,
  },
 
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 20,
  },
  buttonED: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: colors.TERTIARY,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonEDTablet: {
    padding: 30,
    borderRadius: 60,
  },
  buttonDelete: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: colors.ERROR,
    alignItems: 'center',
    marginHorizontal: 4,
  },
 
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
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

   // Taille des icônes pour les appareils mobiles
   iconSize: 30,
   // Taille des icônes pour les tablettes
   iconSizeTablet: 50,
});

export default Notes;
