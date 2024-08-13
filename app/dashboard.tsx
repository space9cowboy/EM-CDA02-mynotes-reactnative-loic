import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDeviceType } from '../hooks/useDeviceType'; 
import AddButton from '@/components/AddButton';

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'Important' | 'Normal' | 'Pense bête';
  createdAt: string;
}

const Dashboard = () => {
  const [greet, setGreet] = useState('Evening');
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [user, setUser] = useState<{ name: string }>({ name: '' });
  const navigation = useNavigation();
  const { isTabletOrMobileDevice } = useDeviceType();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      }
    };

    fetchUser();
  }, []);

  const fetchNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const notesArray = JSON.parse(storedNotes);
        notesArray.sort((a: Note, b: Note) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotes(notesArray);
        setFilteredNotes(notesArray);
      }
    } catch (error) {
      console.error('Failed to load notes', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreet('Morning');
    } else if (currentHour < 18) {
      setGreet('Afternoon');
    } else {
      setGreet('Evening');
    }
  }, []);

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

  // Fonction pour supprimer les balises HTML avec une regex
  const stripHTML = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handlePress = () => {
    navigation.navigate('formulaire');
  };

  const navigateToNoteDetails = (noteId: string) => {
    navigation.navigate('notes', { noteId });
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'All') {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(notes.filter(note => note.priority === filter));
    }
  };

  const countNotesByPriority = (priority: string) => {
    if (priority === 'All') return notes.length;
    return notes.filter(note => note.priority === priority).length;
  };

  return (
    <View style={[styles.container, isTabletOrMobileDevice && styles.containerTablet]}>
      <Text style={[styles.title, isTabletOrMobileDevice && styles.titleTablet]}>
        {`Good ${greet}, ${user.name}`}
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={[styles.filterScrollView, isTabletOrMobileDevice && styles.filterScrollViewTablet]}
      >
        <View style={[styles.filterContainer, isTabletOrMobileDevice && styles.filterContainerTablet]}>
          {['All', 'Important', 'Normal', 'Pense bête'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                isTabletOrMobileDevice && styles.filterButtonTablet,
                selectedFilter === filter && styles.selectedFilterButton,
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isTabletOrMobileDevice && styles.filterButtonTextTablet,
                  selectedFilter === filter && styles.selectedFilterButtonText,
                ]}
              >
                {filter} ({countNotesByPriority(filter)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {filteredNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.noNotesText, isTabletOrMobileDevice && styles.noNotesTextTablet]}>
            No notes available
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredNotes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={[styles.card, isTabletOrMobileDevice && styles.cardTablet]}
              onPress={() => navigateToNoteDetails(note.id)}
            >
              <View style={{ ...styles.priorityIndicator, backgroundColor: getPriorityColor(note.priority) }} />
              <View style={styles.cardContent}>
                <Text style={[styles.noteTitle, isTabletOrMobileDevice && styles.noteTitleTablet]}>
                  {note.title}
                </Text>
                <Text style={[styles.noteDate, isTabletOrMobileDevice && styles.noteDateTablet]}>
                  {note.date}
                </Text>
                <Text style={[styles.noteContent, isTabletOrMobileDevice && styles.noteContentTablet]} numberOfLines={1}>
                  {stripHTML(note.content)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <TouchableOpacity onPress={handlePress} style={styles.addButton}>
        <AddButton onPress={handlePress}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#456990',
    justifyContent: 'space-between',
  },
  containerTablet: {
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Montserrat',
    alignSelf: 'center',
    color: 'white',
  },
  titleTablet: {
    fontSize: 34,
    marginBottom: 26,
  },
  filterScrollView: {
    marginBottom: 16,
  },
  filterScrollViewTablet: {
    marginBottom: 19,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterContainerTablet: {
    justifyContent: 'center',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#114B5F',
    marginRight: 16,
    height: 40,
    alignItems: 'center',
  },
  filterButtonTablet: {
    paddingVertical: 20,
    paddingHorizontal: 29,
    borderRadius: 10,
    backgroundColor: '#114B5F',
    marginRight: 18,
    height: 65,
    alignItems: 'center',
  },
  selectedFilterButton: {
    backgroundColor: '#7EE4EC',
  },
  filterButtonText: {
    color: 'white',
    fontFamily: 'Montserrat',
  },
  filterButtonTextTablet: {
    fontSize: 21,
  },
  selectedFilterButtonText: {
    fontWeight: 'bold',
  },
  scrollView: {
    height: '70%',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  cardTablet: {
    padding: 15,
    marginVertical: 11,
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  priorityIndicator: {
    width: 20,
    height: '100%',
    borderRadius: 4,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  noteTitleTablet: {
    fontSize: 28,
  },
  noteDate: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
    fontFamily: 'Montserrat',
  },
  noteDateTablet: {
    fontSize: 18,
  },
  noteContent: {
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  noteContentTablet: {
    fontSize: 24,
  },
  emptyContainer: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotesText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Montserrat',
  },
  noNotesTextTablet: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'Montserrat',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#114B5F',
    borderRadius: 50,
    marginBottom: 32,
  },
});

export default Dashboard;
