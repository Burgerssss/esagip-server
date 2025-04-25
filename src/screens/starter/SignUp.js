import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

export default function SignUp({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // Basic form validation
    if (!fullName || !age || !phoneNumber || !password || !confirmPassword) {
      alert('All fields are required!');
      return;
    }

    // Passwords match check
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Email validation (if provided)
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email');
      return;
    }

    // Age validation (only numeric input allowed)
    if (isNaN(age)) {
      alert('Age must be a number');
      return;
    }

    // Phone number validation (simple check for valid phone format)
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      alert('Phone number must be 10 digits');
      return;
    }

    try {
      const response = await fetch('https://esagip.com/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          age,
          phoneNumber,
          email,
          password,
        }),
      });

      const text = await response.text(); // Get raw text response for debugging
      console.log('Raw Response:', text);

      let result;
      try {
        result = JSON.parse(text); // Attempt to parse the response
        console.log('Parsed Response:', result);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        alert('An error occurred while processing the response.');
        return;
      }

      if (result.success) {
        Alert.alert('Success', 'User registered successfully', [
          { text: 'OK', onPress: () => navigation.navigate('UserSignIn') },
        ]);
      } else {
        alert(result.message); // Show error from API
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Error:', error); // Log the error to the console
      if (error instanceof Error) {
        console.error('Error Message:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={require('../../../assets/bg05.jpg')} style={styles.backgroundImage} />

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        keyboardType="numeric"
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        keyboardType="phone-pad"
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.signInContainer}>
        <Text>Have an account already? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserSignIn')}>
          <Text style={styles.boldText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    opacity: 0.4, // Optional: adjust the opacity to make it less distracting
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // You can change the text color to stand out from the background
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#004b75',
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 22,
    paddingLeft: 20,
    color: 'black', // Optional: Change text color
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#004aad',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#004aad',
  },
});
