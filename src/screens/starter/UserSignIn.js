import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Pressable 
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserSignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [showGuestOption, setShowGuestOption] = useState(false); // State to show/hide "Continue as Guest"
  const [modalVisible, setModalVisible] = useState(false); // State for the custom modal visibility

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert("Permission Denied", "Location access is required for this feature.");
          return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = location.coords;
        console.log("User Location:", latitude, longitude);
        setUserLocation({ latitude, longitude });
      } catch (error) {
        alert("Location Error", "Unable to retrieve your location. Please enable GPS.");
        console.error(error);
      }
    };

    getUserLocation();
  }, []);

  // Function to check if location is within the defined area
  const checkLocation = (latitude, longitude) => {
    return latitude >= 14.41 && latitude <= 14.80 && longitude >= 120.9 && longitude <= 121.000;
  };

  // Trigger alert if location is outside scope
  useEffect(() => {
    if (userLocation && !checkLocation(userLocation.latitude, userLocation.longitude)) {
      setModalVisible(true); // Show the modal
    }
  }, [userLocation]);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('https://esagip.com/loginmob.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log(result); // Debugging response

      if (result.success) {
        await AsyncStorage.setItem('userData', JSON.stringify(result.user)); // save user data
        navigation.navigate('Dashboard');
      } else {
        alert('Error', result.message); // Show error message
      }
    } catch (error) {
      alert('Error', 'An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/bg05.jpg')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>WELCOME BACK</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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

        {showGuestOption ? (
          // Show "Continue as Guest" button if user dismissed the alert
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard2')}>
            <Text style={[styles.boldText, styles.largeText, { marginTop: 20 }]}>Continue as Guest</Text>
          </TouchableOpacity>
        ) : (
          // Otherwise, show the normal "Sign Up" button
          <View style={styles.signupContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.boldText, styles.underlineText, styles.largeText]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close modal on back press
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Out of Coverage!</Text>
            <Text style={styles.modalMessage}>
              Your location is outside the supported area. Please contact the nearest NDRRMO for assistance.
              {'\n\n'}
              📍 Imus Cavite: (046) 472-2618/23/25
              {'\n'}
              📍 Kawit Cavite: (046) 4440-0722
              {'\n'}
              📍 Dasmariñas Cavite: (046) 435-0183 / (046) 481-0555
              {'\n'}
              📍 Las Piñas: (02) 8290-6500
              {'\n\n'}
              You may also Continue as Guest.
            </Text>
            <View style={styles.modalButtons}>
            <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setModalVisible(false); // Close the modal
            setShowGuestOption(true); // Change the text to "Continue as Guest"
          }}
        >
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.confirmButton]}
          onPress={() => {
            setModalVisible(false); // Close the modal
            setShowGuestOption(true); // Change the text to "Continue as Guest"
            navigation.navigate('Dashboard2'); // Navigate to Dashboard2 as Guest
          }}
        >
          <Text style={styles.buttonText}>Continue as Guest</Text>
        </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
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
    color: 'black',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#004b75',
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 22,
    paddingLeft: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#004b75',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  largeText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'red', // Title in red for attention
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#3d3c49',
    borderWidth: 2,
    borderColor: '#ccc',
    paddingHorizontal: 20,  // Horizontal padding to make the button wider
    paddingVertical: 5,    // Vertical padding to make the button taller
    borderRadius: 10,      // Rounded corners for a cleaner look
    width: '45%',          // Adjust the width (you can use a percentage or specific value)
    alignItems: 'center',  // Center text inside the button
    justifyContent: 'center', // Center text vertically
  },
  confirmButton: {
    backgroundColor: '#1c98ed',
    borderWidth: 2,
    borderColor: '#ccc',
    paddingHorizontal: 20,  // Horizontal padding to make the button wider
    paddingVertical: 5,    // Vertical padding to make the button taller
    borderRadius: 10,      // Rounded corners for a cleaner look
    width: '45%',          // Adjust the width (you can use a percentage or specific value)
    alignItems: 'center',  // Center text inside the button
    justifyContent: 'center', // Center text vertically
  },
});

