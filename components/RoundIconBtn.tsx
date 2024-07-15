import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import colors from '@/misc/colors'


const RoundIconBtn = ({antIconName, size, color, style, onPress}) => {
  return (
   <AntDesign name={antIconName} size={size || 24} color={color || colors.LIGHT} style={[styles.icon, {...style}]} onPress={onPress}/>
  )
}

export default RoundIconBtn

const styles = StyleSheet.create({
    icon: {
        backgroundColor: colors.ERROR,
        alignSelf: 'center',
        padding: 13,
        borderRadius: 15,
        marginTop: 15,
        elevation: 9,
        shadowRadius: 6 
    }
})