import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoundIconBtn from '@/components/RoundIconBtn';
import colors from '../misc/colors';



export default function Page() {
  const [name, setName] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

 
  /**
   * The function `handleOnChangeText` updates the name state and toggles the visibility of a button
   * based on the length of the input text.
   * @param text - The `text` parameter is a string value that is passed to the `handleOnChangeText`
   * function.
   */
  const handleOnChangeText = (text: string) => {
    setName(text);
    setButtonVisible(text.trim().length > 2);
  };

  
  const handleSubmit = async () => {
    console.log("Submit button pressed");
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
      // Reset state immediately
      setName('');
      setButtonVisible(false);

      // Reset color animation immediately
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

  const interpolateColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.SECONDARY, colors.TERTIARY],
  });

  return (
    <>
      <StatusBar hidden />
      <AnimatedLinearGradient
        colors={[colors.LIGHT, interpolateColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.main}>
          <Text style={styles.title}>MyNotes</Text>
          <View>
          <Image source={require('../assets/images/mynotes1.png')} 
           style={styles.image}
           />
          </View>
          <Text style={styles.subtitle}>Enter your name to continue</Text>
          <TextInput
            value={name}
            onChangeText={handleOnChangeText}
            placeholder='Enter Name'
            style={styles.textInput}
          />
          <Animated.View style={[styles.btnContainer, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
            {buttonVisible && (
              <TouchableOpacity onPress={handleSubmit} >
                <RoundIconBtn antIconName='arrowright' color={colors.PRIMARY} size={20} onPress={handleSubmit} />
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </AnimatedLinearGradient>
    </>
  );
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  main: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    padding: 20,
  },

  image : {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 14,
    // color: '#38434D',
    padding: 14,
    // marginBottom: 10,
    color: 'white',
    fontFamily: 'Montserrat',
    
  },
  textInput: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#000',
    fontSize: 18,
    height: 45,
    backgroundColor: 'white',
    paddingLeft: 5,
    //opacity: 0.5,
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  btnContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 50,
    height: 50,
  },
 
});
