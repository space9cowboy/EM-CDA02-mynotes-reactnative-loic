import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType'; 
import BackButton from '@/components/BackButton';
import AddButton from '@/components/AddButton';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import useOrientation from '../hooks/useOrientation';
import { ORIENTATION } from '../constants/orientation/index';

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'Important' | 'Normal' | 'Reminder';
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
  const { isTabletOrMobileDevice, isTablet } = useDeviceType();
  const richText = useRef<RichEditor>(null);
  const orientation = useOrientation();


  //Fonction pour fetch les notes
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

  //Fonction pour sauvegarder ue note/ redirection sur le dashboard et placement de la note n fonction de la date de création
  const handleSave = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? (JSON.parse(storedNotes) as Note[]) : [];
  
      if (noteId) {
        const updatedNotes = notes.map(n => (n.id === noteId ? note : n));
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      } else {
        const newNote = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() };
        await AsyncStorage.setItem('notes', JSON.stringify([...notes, newNote]));
      }
  
      navigation.navigate('dashboard');
    } catch (error) {
      console.error('Failed to save note', error);
      Alert.alert('Error', 'Failed to save note.');
    }
  };

 /**
  * The function `getSelectedPriorityButtonStyle` returns different styles based on the priority input.
  * @param {'Important' | 'Normal' | 'Reminder'} priority - The `priority` parameter in the
  * `getSelectedPriorityButtonStyle` function can have one of three values: 'Important', 'Normal', or
  * 'Reminder'. The function returns an object containing styles based on the priority value provided.
  * @returns The function `getSelectedPriorityButtonStyle` returns an object containing the background
  * color, border width, and border color based on the priority input. If the priority is 'Important',
  * it returns an object with the background color, border width, and border color set to values from
  * the `colors.ERROR` object. If the priority is 'Normal', it returns values from the
  * `colors.SECONDARY`
  */
  const getSelectedPriorityButtonStyle = (priority: 'Important' | 'Normal' | 'Reminder') => {
    switch (priority) {
      case 'Important':
        return { backgroundColor: colors.ERROR, borderWidth: 1, borderColor: colors.ERROR  };
      case 'Normal':
        return { backgroundColor: colors.SECONDARY, borderWidth: 1, borderColor: colors.SECONDARY  };
      case 'Reminder':
        return { backgroundColor: colors.PRIMARY, borderWidth: 1, borderColor: colors.PRIMARY };
      default:
        return {};
    }
  };

 /* The above code is a TypeScript React function that renders a priority button component based on the
 priority value provided. The function takes a priority value of either 'Important', 'Normal', or
 'Reminder' as an argument. It returns a TouchableOpacity component with styles based on the
 priority value and the current state of the note. */
  const renderPriorityButton = (priority: 'Important' | 'Normal' | 'Reminder') => (
    <TouchableOpacity
      style={[
        styles.priorityButton, 
        isTablet && styles.priorityButtonTablet,
        note.priority === priority && getSelectedPriorityButtonStyle(priority),
      ]}
      onPress={() => setNote(prevNote => ({ ...prevNote, priority }))}
    >
      <Text style={[
        styles.priorityButtonText,
        isTablet && styles.priorityButtonTextTablet,
        note.priority === priority && priority === 'Reminder' ? styles.selectedPenseBeteText : styles.defaultPriorityText,
        note.priority === priority && priority !== 'Reminder' && styles.selectedPriorityButtonText,
      ]}>
        {priority}
      </Text>
    </TouchableOpacity>
  );

  const handlePress = () => {
    if (noteId) {
      navigation.navigate('notes');
    } else {
      navigation.navigate('dashboard');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
    style={[orientation === ORIENTATION.PORTRAIT ? styles.container : styles.containerLandscape, isTabletOrMobileDevice && styles.containerTablet]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.formHead}>
          <TouchableOpacity onPress={handlePress}>
            <BackButton onPress={handlePress} color={colors.WHITE} size={30}/>
          </TouchableOpacity>
          <Text style={[styles.title, isTabletOrMobileDevice && styles.titleTablet]}>
            {noteId ? 'Edit Note' : 'Create Note'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={dismissKeyboard} // Dismiss keyboard when scrolling starts
      >
        <View style={isTablet ? styles.rowLayoutTablet : null}>
          <Text style={[styles.label, isTablet && styles.labelTablet]}>
            Priority
          </Text>
          <View style={[orientation === ORIENTATION.PORTRAIT ? styles.priorityContainer : styles.priorityContainerLandscape, isTablet && styles.priorityContainerTablet]}>
            {renderPriorityButton('Important')}
            {renderPriorityButton('Normal')}
            {renderPriorityButton('Reminder')}
          </View>
        </View>
        <View style={[styles.richTextContainer, isTablet && styles.richTextContainerTablet]}>
          

          <TextInput
            style={[styles.inputTitle, isTabletOrMobileDevice && styles.inputTitleTablet]}
            placeholder="Write your title here !"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={note.title}
            onChangeText={(text) => setNote(prev => ({ ...prev, title: text }))}
          />
          <RichEditor
            ref={richText}
            initialContentHTML={note.content}
            onChange={(text) => setNote(prev => ({ ...prev, content: text }))}
            placeholder="Write your cool content here :)"
            style={styles.richTextEditorStyle}
            initialHeight={isTablet ? 660 : 440}
           
          />
          <RichToolbar
            editor={richText}
            selectedIconTint="grey"
            iconTint={colors.WHITE}
            actions={[
              
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.setStrikethrough,
              actions.setUnderline,
            ]}
            style={[styles.richTextToolbarStyle, isTablet && styles.richTextToolbarStyleTablet]}
          />
        </View>

        
      
      <TouchableOpacity >
        <AddButton onPress={handleSave}  iconName="save-alt" 
          iconLib="MaterialIcons" text={'SAVE NOTE'} size={30} />
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#456990',
  },
  containerTablet: {
    paddingHorizontal: 30,
  },
  containerLandscape: {
    backgroundColor: '#456990',
    paddingHorizontal: 50,
    paddingTop: 30,
    height: '100%'
  },
  formHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    alignSelf: 'center',
    color: 'white',
  },
  titleTablet: {
    fontSize: 34,
  },
  inputTitle: {
    height: 45,
    borderColor: '#ccc',
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.SECONDARY,
    color: 'white',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  inputTitleTablet: {
    height: 70,
    marginBottom: 20,
    paddingHorizontal: 8,
    backgroundColor: colors.SECONDARY,
    borderRadius: 5,
    fontSize: 25,
  },
  richTextContainer: {
    marginBottom: 16,
    fontFamily: 'Montserrat',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  richTextContainerTablet: {
    
  },
  richTextEditorStyle: {
    marginTop: -10,
    borderColor: '#ccaf9b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
    fontFamily: 'Montserrat',
  },
  richTextToolbarStyle: {
    backgroundColor: colors.SECONDARY,
    borderColor: '#c6c3b3',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
  },
  richTextToolbarStyleTablet: {
    height: 70,
  },
  rowLayoutTablet: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 13,
    marginRight: 20,
    color: 'white',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  labelTablet: {
    fontSize: 26,
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
    gap: 10,
  },
  priorityContainerLandscape:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  priorityContainerTablet: {
    flexDirection: 'row',
    marginBottom: 36,
    justifyContent: 'center',
    marginTop: 20,
  },
  priorityButton: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'white',
  },
  priorityButtonTablet: {
    marginHorizontal: 10,
    paddingHorizontal: 35,
    paddingVertical: 20,
    borderRadius: 40,
  },
  priorityButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Montserrat',
  },
  priorityButtonTextTablet: {
    fontSize: 24,
  },
  selectedPriorityButtonText: {
    color: '#fff',
  },
  selectedPenseBeteText: {
    color: '#000',
  },
  defaultPriorityText: {},
  
 
});

export default Formulaire;
