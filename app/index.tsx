import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundIconBtn from '@/components/RoundIconBtn';
import colors from '../misc/colors';
import { useDeviceType } from '../hooks/useDeviceType'; // Assurez-vous du bon chemin

const Index = () => {
  const [name, setName] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { isTabletOrMobileDevice } = useDeviceType(); 

  const handleOnChangeText = (text: string) => {
    setName(text);
    setButtonVisible(text.trim().length > 2);
  };

  const handleSubmit = async () => {
    if (name.trim().length > 0) {
      const user = { name: name };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.navigate('dashboard');
    }
  };

  useEffect(() => {
    if (buttonVisible) {
      showButton();
      animateGradient(1);
    } else {
      hideButton();
      animateGradient(0);
    }
  }, [buttonVisible]);

  useEffect(() => {
    const resetStateOnFocus = navigation.addListener('focus', () => {
      setName('');
      setButtonVisible(false);
      colorAnim.setValue(0);
      fadeAnim.setValue(0);
      translateYAnim.setValue(20);
    });

    return resetStateOnFocus;
  }, [navigation]);

  const showButton = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideButton = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateGradient = (toValue: number) => {
    Animated.timing(colorAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      <StatusBar hidden />
      <View style={[styles.main, isTabletOrMobileDevice && styles.mainTablet]}>
        <Text style={[styles.title, isTabletOrMobileDevice && styles.tabletTitle]}>MyNotes</Text>
        <View>
          <Image source={require('../assets/images/mynotes1.png')}  style={[styles.image, isTabletOrMobileDevice && styles.tabletImage]} />
        </View>
        <Text  style={[styles.subtitle, isTabletOrMobileDevice && styles.tabletSubtitle]}>Enter your name to continue</Text>
        <TextInput
          value={name}
          onChangeText={handleOnChangeText}
          placeholder='Enter Name'
          style={[styles.textInput, isTabletOrMobileDevice && styles.tabletTextInput]}
        />
        <Animated.View style={[styles.btnContainer, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
          {buttonVisible && (
            <TouchableOpacity onPress={handleSubmit}>
              <RoundIconBtn antIconName='arrowright' color={colors.PRIMARY}  onPress={handleSubmit} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </>
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
  title: {
    fontFamily: 'Montserrat',
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    padding: 20,
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
  tabletTextInput : {
    width: '60%',
    fontSize: 28,
    height: 65,
    borderRadius: 20,
  },
});

export default Index;
