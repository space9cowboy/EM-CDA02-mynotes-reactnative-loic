// RoundIconBtn.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType'; // Import de useDeviceType

const RoundIconBtn = ({ antIconName, size, color, onPress }) => {
  const { isTabletOrMobileDevice } = useDeviceType(); 

  // Ajustement dynamique de la taille et des styles
  const iconSize = isTabletOrMobileDevice ? (size || 35) : (size || 25); 

  return (
    <TouchableOpacity 
      style={[
        styles.iconContainer, 
        isTabletOrMobileDevice && styles.tabletIconContainer
      ]} 
      onPress={onPress}
    >
      <Text style={[styles.btnName, isTabletOrMobileDevice && styles.tabletBtnName]}>ENTER</Text>
      <AntDesign name={antIconName} size={iconSize} color={colors.WHITE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: colors.SECONDARY,
    height: 45,
    width: 265,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    gap: 10,
  },
  tabletIconContainer: {
    width: 450,
    height: 65,
    borderRadius: 20,
    gap: 15,
  },
  btnName: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: 'white',
  },
  tabletBtnName: {
    fontSize: 24, // Taille de police plus grande pour les tablettes
  },
});

export default RoundIconBtn;
