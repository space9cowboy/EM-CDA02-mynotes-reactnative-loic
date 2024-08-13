// BackButton.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType'; // Import de useDeviceType

const AddButton = ({ size, onPress, color }) => {
  const { isTabletOrMobileDevice } = useDeviceType(); 

  // Ajustement dynamique de la taille et des styles
  const iconSize = isTabletOrMobileDevice ? (size || 40) : (size || 30); 
 

  return (
    <TouchableOpacity onPress={onPress}>
    <Ionicons name="arrow-back" size={iconSize} color={color} />
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    addButton: {
        marginTop: 150,
        marginBottom: 30,
        // paddingVertical: 20,
        // paddingHorizontal: 20,
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
        marginTop: 220,
        marginBottom: 30,
        // paddingVertical: 30,
        // paddingHorizontal: 30,
        padding: 30,
        borderRadius: 60,
      },
});

export default AddButton;
