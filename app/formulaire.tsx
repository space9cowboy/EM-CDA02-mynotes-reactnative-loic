import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
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
        return { backgroundColor: '#7EE4EC', borderWidth: 1, borderColor: '#7EE4EC'  };
      default:
        return {};
    }
  };

  const renderPriorityButton = (priority: 'Important' | 'Normal' | 'Pense bête') => (
    <TouchableOpacity
      style={[
        styles.priorityButton, isTablet && styles.impriorityButtonTablet,
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

  return (
    <View style={[styles.container, isTabletOrMobileDevice && styles.containerTablet]}>
      <View style={styles.formHead}>
        <TouchableOpacity onPress={handlePress}>
          <BackButton onPress={handlePress} color={colors.WHITE} />
        </TouchableOpacity>
        <Text style={[styles.title, isTabletOrMobileDevice && styles.titleTablet]}>{noteId ? 'Edit Note' : 'Create Note'}</Text>
      </View>
      <TextInput
        style={[styles.inputTitle, isTabletOrMobileDevice && styles.inputTitleTablet]}
        placeholder="Title"
        value={note.title}
        onChangeText={(text) => setNote(prev => ({ ...prev, title: text }))}
      />
      <ScrollView style={[styles.richTextContainer, isTablet && styles.richTextContainerTablet]}>
        <RichEditor
          ref={richText}
          initialContentHTML={note.content}
          onChange={text => setNote(prev => ({ ...prev, content: text }))}
          placeholder="Write your cool content here :)"
          style={styles.richTextEditorStyle}
          initialHeight={250}
        />
        <RichToolbar
          editor={richText}
          selectedIconTint="#873c1e"
          iconTint="#312921"
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
          style={styles.richTextToolbarStyle}
        />
      </ScrollView>
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
      <TouchableOpacity onPress={handleSave}>
        <AddButton onPress={handleSave} />
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
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    fontFamily: 'Montserrat',
    fontSize: 15,
  },
  inputTitleTablet: {
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 25,
  },
  richTextContainer: {
    flex: 1,
    marginBottom: 16,
  },
  richTextContainerTablet: {
    height: 300,
  },
  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
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
  },
  richTextToolbarStyle: {
    backgroundColor: '#c6c3b3',
    borderColor: '#c6c3b3',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },
  rowLayoutTablet: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    marginRight: 20,
    color: 'white',
    fontFamily: 'Montserrat',
  },
  labelTablet: {
    fontSize: 26,
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 36,
    justifyContent: 'space-around',
  },
  priorityContainerTablet: {
    flexDirection: 'row',
    marginBottom: 36,
    justifyContent: 'center',
    marginTop: 20,
  },
  priorityButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    borderWidth: 1,
  },
  priorityButtonTablet: {
    padding: 15,
    marginHorizontal: 15,
  },
  priorityButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  priorityButtonTextTablet: {
    fontSize: 18,
  },
  selectedPriorityButtonText: {
    color: '#fff',
  },
});

export default Formulaire;
