import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType';

const AddButton = ({ size, onPress, text, iconName, iconLib }) => {
  const { isTabletOrMobileDevice } = useDeviceType();

  // Ajustement dynamique de la taille de l'icône
  const iconSize = isTabletOrMobileDevice ? (size || 55) : (size || 35);

  // Sélection dynamique de la bibliothèque d'icônes
  const IconComponent = iconLib === 'MaterialIcons' ? MaterialIcons : Ionicons;

  return (
    <TouchableOpacity
      style={[styles.addButton, isTabletOrMobileDevice && styles.addButtonTablet]}
      onPress={onPress}
    >
      <View style={styles.addButtonContainer}>
        <IconComponent name={iconName} size={iconSize} color="white" />
        <Text style={[styles.addButtonText, isTabletOrMobileDevice && styles.addButtonTextTablet]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginBottom: 30,
    width: '100%',
    backgroundColor: '#114B5F',
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.WHITE,
  },
  addButtonTablet: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 60,
  },
  addButtonText: {
    alignSelf: 'center',
    color: colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButtonTextTablet: {
    
    fontSize: 26,
  },
  addButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 10,
  },
});

export default AddButton;
