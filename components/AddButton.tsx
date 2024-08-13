// AddButton.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType'; // Import de useDeviceType

const AddButton = ({ size, onPress }) => {
  const { isTabletOrMobileDevice } = useDeviceType(); 

  // Ajustement dynamique de la taille et des styles
  const iconSize = isTabletOrMobileDevice ? (size || 55) : (size || 40); 

  return (
    <TouchableOpacity style={[styles.addButton, isTabletOrMobileDevice && styles.addButtonTablet]} onPress={onPress}>
    <Ionicons name="add" size={iconSize} color="white" />
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    addButton: {
        
        marginBottom: 30,
        
        backgroundColor: '#114B5F',
        padding: 15,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        fontFamily: 'Montserrat',
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
          width: 0.8,
          height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      addButtonTablet: {
       
        marginBottom: 30,
       
        padding: 30,
        borderRadius: 60,
      },
});

export default AddButton;
