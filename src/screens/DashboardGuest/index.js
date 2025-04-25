import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Image } from 'react-native';
import { theme } from "../../../theme/Index"; // import theme here
import axios from 'axios';
import { BackHandler } from "react-native";
import { ArrowLeftIcon } from 'react-native-heroicons/solid';


import { CalendarDaysIcon, MagnifyingGlassCircleIcon, MapIcon, SparklesIcon, EllipsisHorizontalCircleIcon, EllipsisHorizontalIcon,  } from 'react-native-heroicons/outline';
import { MapPinIcon, ExclamationTriangleIcon } from 'react-native-heroicons/solid';

export default function Login({navigation}) {

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

    // Set up an interval to periodically fetch data (adjust the interval as needed)
    
    const interval = setInterval(fetchPressureData, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const backAction = () => {
      return true; // This disables the back button
    };
  
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
  
    return () => backHandler.remove(); // Cleanup on unmount
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

    //
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
                <TouchableOpacity
    onPress={() => navigation.navigate("UserSignIn")}
    style={{
        position: 'absolute',
        top: 50, // Adjust based on your UI
        left: 10,
        zIndex: 10,
        padding: 10,
    }}
>
    <ArrowLeftIcon size={30} color="white" />
</TouchableOpacity>

                    
                    <View style={{ height: 0, marginHorizontal: 5, marginTop: 31 }}>
                    <TouchableOpacity
                        onPress={handleButtonPress}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent blue
                            borderRadius: 9999,
                            padding: 12,
                            position: 'absolute',
                            bottom: -90,
                            right: 3,
                        }}
                        >
                            <View
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: 9999,
                                width: 48, // Adjust the width and height as needed
                                height: 48, // Adjust the width and height as needed
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            >
                              <Image source={require('../../../assets/icons/flood.png')} style={{ height: 50, width: 50, marginTop:2.5,}} />
                            </View>
                        </TouchableOpacity>

                        {/* Conditionally render three buttons based on showButtons state */}
                        {showButtons && (
  <>
    <TouchableOpacity
      onPress={() => navigation.navigate("Flood3")}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent green
        borderRadius: 10,
        padding: 10,
        margin: 10,
        position: 'absolute',
        bottom: -80,
        right: 10,
        width: 140,
        flexDirection: 'row', // Added flexDirection to arrange items horizontally
        alignItems: 'center', // Center items vertically
        zIndex: 1,
      }}
    >
      <MapPinIcon size={20} color="black" />
      <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>Molino Dam</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => navigation.navigate("Flood4")}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent orange
        borderRadius: 10,
        padding: 10,
        margin: 10,
        position: 'absolute',
        bottom: -80 - 45,
        right: 10,
        width: 140,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
      }}
    >
      <MapPinIcon size={20} color="black" />
      <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>Prinza Dam</Text>
    </TouchableOpacity>
  </>
)}

  
                    </View>

                    <View style={{ height: 68, marginHorizontal: 5, marginTop: -15 }}>
                        <TouchableOpacity
                        onPress={() => navigation.navigate("Alerts2")}
                        style={{
                            
                            borderRadius: 9999,
                            padding: 12,
                            margin: 4,
                            position: 'absolute',
                            top: 80,
                            right: 0,
                        }}
                        >
                            <View
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: 9999,
                                width: 48, // Adjust the width and height as needed
                                height: 48, // Adjust the width and height as needed
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            >
                                <ExclamationTriangleIcon size={25} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    
                    {/* Forecast section */}
                    <View style={{ bottom:230, marginBottom:-10, left:20, justifyContent: 'center' }}>
                            <Image
                                source={require('../../../assets/logo1.png')}
                                style={{ width: 100, height: 100, resizeMode: 'contain' }}
                            />
                    </View>
                    <View style={{ marginHorizontal: 16, flex: 1, justifyContent: 'space-around', marginBottom: 50, marginTop:-150 }}>
                        {/* Location */}
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 32, fontWeight: 'bold' }}>
                                Bacoor City
                            </Text>
                            <Text style={{ color: 'lightgray', fontSize: 20, fontWeight: '600' }}>
                                Cavite
                            </Text>
                        </View>
                        {/* Weather image */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={require('../../../assets/icons/partlycloudy.png.png')}
                                style={{ width: 110, height: 80 }}
                            />
                        </View>
                        {/* Degree Celsius */}
                        <View style={{ marginBottom: 10, marginTop:-20 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 72, marginLeft: 20 }}>
                                {weatherData?.temperature} &#176;C
                            </Text>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 24, letterSpacing: 1 }}>
                                Partly Cloudy
                            </Text>
                        </View>
                        {/* Other stats */}
                    <View style={{flex:0, flexDirection:'column' }}>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 0, }}>

                            <View style={{ flex:1, alignItems: 'flex-start', padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 1000, marginRight:10 }}>
                                <Text style={{ color: 'lightblue', fontWeight: 'bold', fontSize: 10, marginBottom: 6 }}>
                                    Humidity
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../../../assets/icons/humidity_icon.png')} style={{ height: 28, width: 28 }} />
                                    <Text style={{ color: 'white', fontWeight: '400', fontSize: 15, marginLeft: 6 }}>
                                        {weatherData?.humidity}%
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flex:1, alignItems: 'flex-start', padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 1000 }}>
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


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:10 }}>

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
                      
                            <TouchableOpacity onPress={() => navigation.navigate("Param2")}>
                            <View
                                style={{
                                    
                                    padding:10,
                                    borderRadius:100,
                                    width:'90%',
                                    marginLeft:'auto',
                                    marginRight:'auto',
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
