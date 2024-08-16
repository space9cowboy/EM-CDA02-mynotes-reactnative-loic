import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType'; 
import BackButton from '@/components/BackButton';
import AddButton from '@/components/AddButton';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

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
  const { isTabletOrMobileDevice, isTablet } = useDeviceType();
  const richText = useRef<RichEditor>(null);

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
        const newNote = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() };
        await AsyncStorage.setItem('notes', JSON.stringify([...notes, newNote]));
      }
  
      // Assurez-vous de naviguer en arrière après la mise à jour réussie
      navigation.navigate('dashboard');
    } catch (error) {
      console.error('Failed to save note', error);
      Alert.alert('Error', 'Failed to save note.');
    }
  };
  

  const getSelectedPriorityButtonStyle = (priority) => {
    switch (priority) {
      case 'Important':
        return { backgroundColor: '#F45B69', borderWidth: 1, borderColor: '#F45B69'  };
      case 'Normal':
        return { backgroundColor: '#114B5F', borderWidth: 1, borderColor: '#114B5F'  };
      case 'Pense bête':
        return { backgroundColor: colors.LIGHT, borderWidth: 1, borderColor: colors.LIGHT  };
      default:
        return {};
    }
  };

  const renderPriorityButton = (priority: 'Important' | 'Normal' | 'Pense bête') => (
    <TouchableOpacity
      style={[
        styles.priorityButton, isTablet && styles.priorityButtonTablet,
        note.priority === priority && getSelectedPriorityButtonStyle(priority),
      ]}
      onPress={() => setNote(prevNote => ({ ...prevNote, priority }))}
    >
      <Text style={[
        styles.priorityButtonText,
        isTablet && styles.priorityButtonTextTablet,
        note.priority === priority && styles.selectedPriorityButtonText
      ]}>{priority}</Text>
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
    style={[styles.container, isTabletOrMobileDevice && styles.containerTablet]}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
  >
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.formHead}>
        <TouchableOpacity onPress={handlePress}>
          <BackButton onPress={handlePress} color={colors.WHITE} />
        </TouchableOpacity>
        <Text style={[styles.title, isTabletOrMobileDevice && styles.titleTablet]}>{noteId ? 'Edit Note' : 'Create Note'}</Text>
      </View>
      </TouchableWithoutFeedback>
      <ScrollView
        style={[styles.scrollView, isTablet && styles.scrollViewTablet]}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={dismissKeyboard} // Dismiss keyboard when scrolling starts
      >
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
         
          initialHeight={isTablet ? 600 : 370}  // Change the initial height based on the device type
        />
        
        <RichToolbar
          editor={richText}
          selectedIconTint="grey"
          iconTint={colors.WHITE}
          actions={[
            actions.insertImage,
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
      <View style={isTablet ? styles.rowLayoutTablet : null}>
        <Text style={[styles.label, isTablet && styles.labelTablet]}>
          Priority:
        </Text>
        <View style={[styles.priorityContainer, isTablet && styles.priorityContainerTablet]}>
          {renderPriorityButton('Important')}
          {renderPriorityButton('Normal')}
          {renderPriorityButton('Pense bête')}
        </View>
      </View>
      </ScrollView>
      <TouchableOpacity onPress={handleSave}>
        <AddButton onPress={handleSave} />
      </TouchableOpacity>
    
  </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#456990',
  },
  containerTablet: {
    padding: 20,
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
    //borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.SECONDARY,
    color: 'white',
    //borderRadius: 10,
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
    //flex: 1,
    marginBottom: 16,
    //height: 400,
    fontFamily: 'Montserrat',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  richTextContainerTablet: {
    //height: 750,
  },
  richTextEditorStyle: {
    marginTop: -10,
    //borderWidth: 1,
    borderColor: '#ccaf9b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
    fontFamily: 'Montserrat',
    //height: 200,
    //
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
    //marginBottom: 100,
  },
  label: {
    fontSize: 16,
    marginBottom: 13,
    marginRight: 20,
    color: 'white',
    fontFamily: 'Montserrat',
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
  priorityContainerTablet: {
    flexDirection: 'row',
    marginBottom: 36,
    justifyContent: 'center',
    marginTop: 20,
  },
  priorityButton: {
    //padding: 12,
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'white',
    
  },
  priorityButtonTablet: {
    
    marginHorizontal: 15,
    paddingHorizontal: 27,
    paddingVertical: 20,
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
//   richTextScrollView: {
//     maxHeight: 370,
//     fontFamily: 'Montserrat', // Ajuste cette valeur selon tes besoins
// },
// richTextScrollViewTablet: {
//   maxHeight: 750,  // Adjusted max height for tablet
// },
scrollViewTablet: {
  height: 400,
},

});

export default Formulaire;
