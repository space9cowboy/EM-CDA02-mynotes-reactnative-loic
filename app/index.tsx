import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundIconBtn from '@/components/RoundIconBtn';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType';

import useOrientation from '../hooks/useOrientation';
import { ORIENTATION } from '../constants/orientation/index';


const Index = () => {
  const [name, setName] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation();
  const { isTabletOrMobileDevice } = useDeviceType();
  const orientation = useOrientation();


 /**
  * The function `handleOnChangeText` updates the name and visibility of a button based on the length
  * of the input text.
  * @param {string} text - The `text` parameter is a string that is passed to the `handleOnChangeText`
  * function. This function is responsible for updating the `name` state with the provided text and
  * determining whether a button should be visible based on the length of the trimmed text (between 3
  * and 8 characters).
  */
  const handleOnChangeText = (text: string) => {
    setName(text);
    setButtonVisible(text.trim().length >= 3 && text.trim().length <= 8);
  };

  type Navigation = {
    navigate: (screen: string) => void;
  };
  
 /**
  * The function `handleSubmit` takes a name input, validates its length, saves it to AsyncStorage, and
  * navigates to the dashboard if successful.
  * @param {string} name - The `name` parameter is a string that represents the user's name input.
  * @param {Navigation} navigation - Navigation is likely a navigation object that helps with
  * navigating between different screens or components in a mobile application. It is commonly used in
  * frameworks like React Navigation for managing navigation within the app. The `navigate` method is
  * typically used to switch to a different screen or route within the app based on the provided route
  */
  const handleSubmit = async (name: string, navigation: Navigation) => {
    if (name.trim().length > 0 && name.trim().length <= 8) {
      const user = { name };
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        navigation.navigate('dashboard');
      } catch (error) {
        console.error('Error saving user data', error);
        alert('Failed to save user data');
      }
    } else {
      alert('Name must be between 1 and 10 characters long');
    }
  };

  const onPressHandler = () => {
    handleSubmit(name, navigation);
  };

// Reinitialise la page apres son retour dessus
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
      style={styles.main}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        
        <View style={orientation === ORIENTATION.PORTRAIT ? styles.centeredView : styles.centredViewLandscape}>

          <Text style={[styles.title, isTabletOrMobileDevice && styles.tabletTitle]}>
            MyNotes
          </Text>

          <View>
            <Image
              source={require('../assets/images/mynotes1.png')}
              style={[orientation === ORIENTATION.PORTRAIT ? styles.image : styles.imageLandscape, isTabletOrMobileDevice && styles.tabletImage]}
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
            maxLength={8}
          />
          {buttonVisible && (
            <TouchableOpacity onPress={onPressHandler}>
              <RoundIconBtn antIconName="arrowright" color={colors.PRIMARY} onPress={onPressHandler} size={25} />
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
  centredViewLandscape: {
    backgroundColor: colors.TERTIARY,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 60,
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
  imageLandscape: {
    width: 80,
    height: 80,
    borderRadius: 15,
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
