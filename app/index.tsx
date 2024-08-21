import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundIconBtn from '@/components/RoundIconBtn';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType';

const Index = () => {
  const [name, setName] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation();
  const { isTabletOrMobileDevice } = useDeviceType(); 

  const handleOnChangeText = (text) => {
    setName(text);
    setButtonVisible(text.trim().length >= 3 && text.trim().length <= 10);
  };

  const handleSubmit = async () => {
    if (name.trim().length > 0 && name.trim().length <= 10) {
      const user = { name };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.navigate('dashboard');
    } else {
      alert('Name must be between 1 and 10 characters long');
    }
  };

  useEffect(() => {
    const resetStateOnFocus = navigation.addListener('focus', () => {
      setName('');
      setButtonVisible(false);
      setKeyboardVisible(false);
      Keyboard.dismiss();
    });

    return resetStateOnFocus;
  }, [navigation]);

  // Gestion du clavier
  useEffect(() => {
    const keyboardDidShow = () => setKeyboardVisible(true);
    const keyboardDidHide = () => setKeyboardVisible(false);

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={[styles.main, isTabletOrMobileDevice && styles.mainTablet]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.centeredView}>
          <Text style={[styles.title, isTabletOrMobileDevice && styles.tabletTitle]}>
            MyNotes
          </Text>
          <View>
            <Image
              source={require('../assets/images/mynotes1.png')}
              style={[styles.image, isTabletOrMobileDevice && styles.tabletImage]}
            />
          </View>
          <Text style={[styles.subtitle, isTabletOrMobileDevice && styles.tabletSubtitle]}>
            Enter your name to continue
          </Text>
          <TextInput
            value={name}
            onChangeText={handleOnChangeText}
            placeholder="Enter Name"
            style={[styles.textInput, isTabletOrMobileDevice && styles.tabletTextInput]}
            maxLength={10}
          />
          {buttonVisible && (
            <TouchableOpacity onPress={handleSubmit}>
              <RoundIconBtn antIconName="arrowright" color={colors.PRIMARY} onPress={handleSubmit} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.TERTIARY,
    padding: 32,
  },
  mainTablet: {
    padding: 32,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    padding: 20,
    textAlign: 'center',
  },
  tabletTitle: {
    fontSize: 90,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  tabletImage: {
    width: 300,
    height: 300,
    borderRadius: 35,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    padding: 14,
    color: 'white',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  tabletSubtitle: {
    fontSize: 20,
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#000',
    fontSize: 18,
    height: 45,
    backgroundColor: 'white',
    paddingLeft: 5,
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  tabletTextInput: {
    width: '60%',
    fontSize: 28,
    height: 65,
    borderRadius: 20,
  },
});

export default Index;
