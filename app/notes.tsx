import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceType } from '../hooks/useDeviceType'; 
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '../misc/colors';
import BackButton from '@/components/BackButton';
import { RichEditor } from 'react-native-pell-rich-editor';

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
  const { isTabletOrMobileDevice, isTablet } = useDeviceType(); 
  const [editorKey, setEditorKey] = useState(0);

 

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
  

  const handleDelete = () => {
    Alert.alert(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer cette note ?",
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
        return colors.LIGHT; // Blue
      default:
        return '#000000'; // Black
    }
  };


  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <View style={styles.formHead}>
        <TouchableOpacity 
      onPress={handlePress}>
          <BackButton  onPress={handlePress} color={colors.WHITE}  />
        </TouchableOpacity>
        <Text style={[styles.title, isTablet && styles.titleTablet]}>My Note</Text>
      </View>

      <View style={styles.notesContainer}>
        <Text style={[styles.titleNote, isTablet && styles.titleNoteTablet]}>{note.title}</Text>
        <Text style={styles.date}>{note.date}</Text>
        <ScrollView style={styles.scrollView}>
        <RichEditor
            key={editorKey}  // Utilisation de l'état `editorKey` pour forcer le re-rendu
            initialContentHTML={note.content}
            disabled
            style={[styles.richTextEditor, isTablet && styles.richTextEditorTablet]}
          />
</ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={handleEditPress} style={[styles.buttonED, isTablet && styles.buttonEDTablet]}>
        <AntDesign name="edit" size={isTablet ? styles.iconSizeTablet : styles.iconSize} color="white" />
      </TouchableOpacity>
        <View style={{ ...styles.priorityText, backgroundColor: getPriorityColor(note.priority) }}>
          <Text style={[styles.priority, isTablet && styles.priorityTablet]}>
          {note.priority}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={[styles.buttonED, isTablet && styles.buttonEDTablet]}>
        <AntDesign name="delete" size={isTablet ? styles.iconSizeTablet : styles.iconSize} color="white" />
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.SECONDARY,
  },
  containerTablet: {
    flex: 1,
    padding: 22,
    backgroundColor: colors.SECONDARY,
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
    padding: 12,
    borderWidth: 1,
    borderRadius: 15,
  },
  scrollView : {
   
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    //marginBottom: 16,
    fontFamily: 'Montserrat',
    color: colors.WHITE,
    //marginRight : 120,
    
  },
  titleTablet: {
    fontSize: 36,
  },
  titleNote: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Montserrat',
  },
  titleNoteTablet: {
    fontSize: 40,
    
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
  contentTablet: {
    fontSize: 24,
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
  priorityTablet: {
    fontSize: 24,
  },
  priorityText : {
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius : 10,
  },
  priorityTextTablet: {
    paddingHorizontal: 28,
    
  },
 
  buttonContainer: {
    //width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 20,

  },
  buttonED: {
    //flex: 1,
    padding: 20,
    borderRadius: 50,

    backgroundColor: colors.TERTIARY,
    alignItems: 'center',
    marginHorizontal: 4,
    //width : 100,
   
  },
  buttonEDTablet: {
    padding: 30,
    borderRadius: 60,
  },
  buttonDelete: {
    //flex: 1,
    padding: 20,
    borderRadius: 50,
    backgroundColor: colors.TERTIARY,
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
  // richTextEditor: {
  //   fontSize: 40,
  //   fontFamily: 'Montserrat',
  // },
   // Taille des icônes pour les appareils mobiles
   iconSize: 30,
   // Taille des icônes pour les tablettes
   iconSizeTablet: 50,
});

export default Notes;
