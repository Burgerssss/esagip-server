import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

export default function RescuerScreen({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!name || !password) {
      Alert.alert('Error', 'Please enter both name and password');
      return;
    }

    try {
      const response = await fetch('https://esagip.com/loginmob_rescuer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      const result = await response.json();
      console.log(result); // Debugging response

      if (result.success) {
        navigation.navigate('Dashboard3'); // Navigate if successful
      } else {
        Alert.alert('Error', 'Invalid name or password'); // Show error message
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={require('../../../assets/bg05.jpg')} style={styles.backgroundImage} />

      <View style={styles.overlay}>
        <Text style={styles.title}>WELCOME BACK RESCUER</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Adjusts image size to cover the entire screen
    position: 'absolute', // Ensures the image is behind other elements
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // Adjust text color to contrast with the background
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#004b75',
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 22,
    paddingLeft: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adds a semi-transparent background for readability
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#004aad',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});