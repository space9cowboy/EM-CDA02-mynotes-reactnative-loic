// RoundIconBtn.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors'; // Assurez-vous que colors contient vos couleurs

const RoundIconBtn = ({ antIconName, size, color, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.iconContainer, { backgroundColor: colors.ERROR }]} 
      onPress={onPress}
    >
      <AntDesign name={antIconName} size={size || 24} color={colors.WHITE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    //shadowOpacity: 1,
    
  },
});

export default RoundIconBtn;
