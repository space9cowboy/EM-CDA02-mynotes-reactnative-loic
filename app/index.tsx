import { StyleSheet, Text, View, TextInput, StatusBar} from "react-native";
import { useState } from "react";
import { Link } from 'expo-router';
import colors from "@/misc/colors";
import RoundIconBtn from "@/components/RoundIconBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Page() {
  const [name, setName] = useState('')
  const handleOnChangeText = text => setName(text);

  const handleSubmit = () => {
    const user = { name: name}
    AsyncStorage.setItem('user', JSON.stringify(user))
  }
 
  
  return (
    <>
    <StatusBar hidden/>
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>MyNotes!</Text>
        <Text style={styles.subtitle}>Enter your name to continue</Text>
        <TextInput 
        // récuperation des données inscrites dans le textinput (async/Usestate)
        value={name} 
        onChangeText={handleOnChangeText} 
        placeholder='Enter Name' 
        style={styles.textinput}/>

{(name.trim().length > 2) ? <RoundIconBtn antIconName='arrowright' onPress={handleSubmit}/> : null}

        
        <Link
        href="/dashboard">Go to dashboard</Link>
        
      
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.LIGHT
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#38434D",
    paddingLeft: 5,
    paddingBottom: 5,
  },
  textinput : {
    borderWidth: 2,
    borderRadius: 15,
    borderColor: colors.SECONDARY,
    fontSize: 18,
    height: 45, 
    backgroundColor: 'white',
    paddingLeft: 5,
    opacity: 0.5,
  }
  
});
