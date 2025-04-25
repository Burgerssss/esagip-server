import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Image } from 'react-native';
import { theme } from "../../../theme/Index"; // import theme here
import axios from 'axios';
import { BackHandler } from "react-native";
import Draggable from 'react-native-draggable';
import { CalendarDaysIcon, MagnifyingGlassCircleIcon, MapIcon, SparklesIcon, EllipsisHorizontalCircleIcon, EllipsisHorizontalIcon } from 'react-native-heroicons/outline';
import { MapPinIcon, ExclamationTriangleIcon, UserIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from 'react-native-heroicons/solid';

export default function Login({ navigation }) {

  const [weatherData, setWeatherData] = useState(null);
  const [pressureData, setPressureData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://tuplikas.com/testcode/dht.php');
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchPressureData = async () => {
    const pressureurl = "https://tuplikas.com/testcode/pressure.php";
    try {
      const response = await axios.get(pressureurl);
      setPressureData(response.data);
    } catch (error) {
      console.error("Error fetching water level data:", error.message);
    }
  };

  useEffect(() => {
    fetchData(); // call the fetchData function when the component mounts
    const intervalId = setInterval(fetchData, 1000);
    fetchPressureData();
    const interval = setInterval(fetchPressureData, 1000);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
      clearInterval(interval);
    };
  }, [])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  const getWindDirection = (degrees) => {
    if (degrees >= -22.5 && degrees < 22.5) {
      return "N";
    } else if (degrees >= 22.5 && degrees < 67.5) {
      return "NE";
    } else if (degrees >= 67.5 && degrees < 112.5) {
      return "E";
    } else if (degrees >= 112.5 && degrees < 157.5) {
      return "SE";
    } else if (degrees >= 157.5 && degrees < 202.5) {
      return "S";
    } else if (degrees >= 202.5 && degrees < 247.5) {
      return "SW";
    } else if (degrees >= 247.5 && degrees < 292.5) {
      return "W";
    } else if (degrees >= 292.5 && degrees < 337.5) {
      return "NW";
    } else {
      return "N"; // Default to North if degrees are not in any specific range
    }
  };

  const [showButtons, setShowButtons] = useState(false);

  const handleButtonPress = () => {
    setShowButtons(!showButtons);
  };

  const handleOutsidePress = () => {
    if (showButtons) {
      setShowButtons(false);
    }
    Keyboard.dismiss(); // Dismiss the keyboard if active
  };

  const handleNavigation = (destination) => {
    // Implement the logic for navigating to the specified destination
    console.log(`Navigate to: ${destination}`);
  };

  const [profileDropdown, setProfileDropdown] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
  };

  const [multiDropdown, setMultiDropdown] = useState(false);

  const toggleMultiDropdown = () => {
    setMultiDropdown(!multiDropdown);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={{ flex: 1, position: 'relative' }}>
        <StatusBar style="light" />
        <Image
          blurRadius={0}
          source={require('../../../assets/bg07.jpg')}
          style={{ position: 'absolute', height: '100%', width: '100%' }}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ position: 'absolute', top: 60, right: 10 }}>
            <TouchableOpacity
              onPress={toggleProfileDropdown}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 9999,
                padding: 10,
              }}
            >
              <UserIcon size={20} color="white" />
              <ChevronDownIcon size={20} color="white" />
            </TouchableOpacity>

            {profileDropdown && (
              <View
                style={{
                  position: 'absolute',
                  top: 45,
                  right: 0,
                  backgroundColor: 'lightblue',
                  borderRadius: 10,
                  padding: 10,
                  width: 140,
                  zIndex: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                >
                  <UserIcon size={20} color="black" />
                  <Text style={{ marginLeft: 8 }}>My Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Starter")}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 5, marginTop: 5 }}
                >
                  <ArrowRightOnRectangleIcon size={20} color="black" />
                  <Text style={{ marginLeft: 8 }}>Log Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ position: 'absolute', top: 60, left: 10 }}>
            <TouchableOpacity
              onPress={toggleMultiDropdown}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 9999,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ChevronDownIcon size={25} color="white" />
            </TouchableOpacity>

            {multiDropdown && (
              <View
                style={{
                  position: 'absolute',
                  top: 45,
                  left: 0,
                  backgroundColor: 'lightblue',
                  borderRadius: 10,
                  padding: 10,
                  width: 160,
                  zIndex: 10,
                }}
              >
                <TouchableOpacity onPress={() => navigation.navigate("Map")} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                  <MapIcon size={20} color="black" />
                  <Text style={{ marginLeft: 8 }}>Map</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Alerts")} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                  <ExclamationTriangleIcon size={20} color="black" />
                  <Text style={{ marginLeft: 8 }}>Alerts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowButtons(!showButtons)}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                >
                  <Image source={require('../../../assets/icons/flood.png')} style={{ height: 20, width: 20 }} />
                  <Text style={{ marginLeft: 8 }}>Flood Info</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("BookMeRescuer")} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                  <Image source={require('../../../assets/icons/drone.png')} style={{ height: 20, width: 20 }} />
                  <Text style={{ marginLeft: 8 }}>Drone</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Conditionally render additional buttons when "Flood" is clicked */}
            {showButtons && (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Flood")}
                  style={{
                    backgroundColor: '#57A0D3',
                    borderRadius: 10,
                    padding: 10,
                    margin: 10,
                    position: 'absolute',
                    top: 80,
                    left: 10,
                    width: 140,
                    flexDirection: 'row',
                    alignItems: 'center',
                    zIndex: 10,
                  }}
                >
                  <MapPinIcon size={20} color="black" />
                  <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>Molino Dam</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Flood1")}
                  style={{
                    backgroundColor: '#57A0D3',
                    borderRadius: 10,
                    padding: 10,
                    margin: 10,
                    position: 'absolute',
                    top: 125,
                    left: 10,
                    width: 140,
                    flexDirection: 'row',
                    alignItems: 'center',
                    zIndex: 10,
                  }}
                >
                  <MapPinIcon size={20} color="black" />
                  <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>Prinza Dam</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Forecast section */}
          <View style={{ bottom: 230, marginBottom: -10, left: 20, justifyContent: 'center' }}>
            <Image
              source={require('../../../assets/logo1.png')}
              style={{ width: 100, height: 100, resizeMode: 'contain' }}
            />
          </View>
          <View style={{ marginHorizontal: 16, flex: 1, justifyContent: 'space-around', marginBottom: 50, marginTop: -150 }}>
            {/* Movable Weather Image */}
            <Draggable x={150} y={325}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image
                  source={require('../../../assets/icons/partlycloudy.png.png')}
                  style={{ width: 110, height: 80 }}
                />
              </View>
            </Draggable>

            {/* Movable Location Text */}
            <Draggable x={120} y={170}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 40, fontWeight: 'bold', marginLeft: -22 }}>
                  Bacoor City
                </Text>
                <Text style={{ color: 'lightgray', fontSize: 25, fontWeight: '600', marginLeft: -25 }}>
                  Cavite
                </Text>
              </View>
            </Draggable>

            {/* Movable Degree Celsius and Weather description */}
            <Draggable x={95} y={460}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 90, marginLeft: -5 }}>
                  {weatherData?.temperature} &#176;C
                </Text>
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 24, letterSpacing: 1, marginLeft: 5 }}>
                  Partly Cloudy
                </Text>
              </View>
            </Draggable>

            {/* Other stats */}
            <View style={{ flex: 0, flexDirection: 'column', marginBottom: -625 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 0, marginBottom: 10 }}>
                <View style={{ flex: 1, alignItems: 'flex-start', padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 1000, marginRight: 10 }}>
                  <Text style={{ color: 'lightblue', fontWeight: 'bold', fontSize: 10 }}>
                    Humidity
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../../assets/icons/humidity_icon.png')} style={{ height: 28, width: 28 }} />
                    <Text style={{ color: 'white', fontWeight: '400', fontSize: 15, marginLeft: 6 }}>
                      {weatherData?.humidity}%
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-start', padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 1000 }}>
                  <Text style={{ color: 'lightblue', fontWeight: 'bold', fontSize: 10, marginBottom: 6 }}>
                    Wind Speed & Direction
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../../assets/icons/air.png')} style={{ height: 28, width: 28 }} />
                    <Text style={{ color: 'white', fontWeight: '400', fontSize: 15, marginLeft: 4 }}>
                      {weatherData?.wind_speed * 3.6} km/hr {getWindDirection(weatherData?.wind_direction)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 1000, marginRight: 10 }}>
                  <Text style={{ color: 'lightblue', fontWeight: 'bold', fontSize: 10, marginBottom: 6 }}>
                    Pressure
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../../assets/icons/apressure.png')} style={{ height: 28, width: 28 }} />
                    <Text style={{ color: 'white', fontWeight: '400', fontSize: 15, marginLeft: 6 }}>
                      {pressureData?.pressure} hPa
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 1000 }}>
                  <Text style={{ color: 'lightblue', fontWeight: 'bold', fontSize: 10, marginBottom: 6 }}>
                    Rain Intensity
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 0 }}>
                    <Image source={require('../../../assets/icons/drop.png')} style={{ height: 26, width: 26 }} />
                    <Text style={{ color: 'white', fontWeight: '400', fontSize: 15, marginLeft: 6 }}>
                      {weatherData?.rain_intensity} mm/hr
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Forecast for next days */}
          <View style={{ marginBottom: 5, marginTop: -50 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 4 }}>
              <CalendarDaysIcon size={22} color="white" />
              <Text style={{ color: 'white', fontSize: 16 }}>For Hourly Forecast</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Param")}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 100,
                  width: '90%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: 20,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Press Here</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}