// RoundIconBtn.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors'; // Assurez-vous que colors contient vos couleurs

const RoundIconBtn = ({ antIconName, size, color, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.iconContainer, { backgroundColor: colors.SECONDARY }]} 
      onPress={onPress}
    >
       <Text style={styles.btnName}>ENTER</Text>
      <AntDesign name={antIconName} size={size || 30} color={colors.WHITE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
     height: 50,
    width: 310,
    // padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    //shadowOpacity: 1,
    gap: 10,
    
  },
  btnName: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: 'white',
  },
});

export default RoundIconBtn;
