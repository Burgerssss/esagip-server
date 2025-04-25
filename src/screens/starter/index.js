import React from 'react';
import { View, Text, Image, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';

export default function Starter({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Image */}
      <Image source={require('../../../assets/bg04.jpg')} style={styles.backgroundImage} />

      {/* Logo and App Name */}
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/logo1.png')} style={styles.logo} />
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserSignIn")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>USER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("RescuerScreen")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>RESCUER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
    width: 300, // Define container size explicitly if necessary
    height: 300,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Ensures the logo fits without cropping
  },
  appName: {
    color: 'white',
    fontSize: 60,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#004aad',
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

