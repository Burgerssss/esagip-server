import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import { MapIcon, CameraIcon, HomeIcon } from 'react-native-heroicons/outline';
import axios from 'axios';

export default function Flood1({ navigation }) {
  const [waterLevelData, setWaterLevelData] = useState([]);
  const [forecastData, setForecastData] = useState(null); // Initialize as null since we expect a single object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWaterLevelData = async () => {
    const url = "https://tuplikas.com/testcode/molino.php";
    try {
      const response = await axios.get(url, { timeout: 5000 });
      setWaterLevelData(response.data);
    } catch (error) {
      console.error("Error fetching water level data:", error.message);
      setError(`Error fetching water level data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastData = async () => {
    const forecastUrl = "https://tuplikas.com/jupyter/forecast/molino.php";
    try {
      const response = await axios.get(forecastUrl, { timeout: 5000 });
      setForecastData(response.data);
    } catch (error) {
      console.error("Error fetching forecast data:", error.message);
      setForecastData(null);
    }
  };

  useEffect(() => {
    // Initial fetch for water level data
    fetchWaterLevelData();

    // Set up continuous data fetching for water level data
    const waterLevelInterval = setInterval(fetchWaterLevelData, 5000);

    // Initial fetch for forecast data
    fetchForecastData();

    // Set up continuous data fetching for forecast data
    const forecastInterval = setInterval(fetchForecastData, 5000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(waterLevelInterval);
      clearInterval(forecastInterval);
    };
  }, []);

  const renderForecastData = () => {
    console.log("Rendering water level data:", forecastData);

    if (error) {
      return <Text style={{ color: 'red' }}>{error}</Text>;
    }

    if (!Array.isArray(forecastData)) {
      return null; // Return null if waterLevelData is not an array
    }

    const currentTime = new Date();

    return (
      <ScrollView
        vertical
        contentContainerStyle={{ paddingHorizontal: 10, alignItems: 'center', marginTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {forecastData.slice().reverse().map((entry, index) => {
          // Calculate time for each block based on index
          const blockTime = new Date(currentTime);
          blockTime.setHours(currentTime.getHours() + index + 1);

          return (
            <View
              key={index}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: 340,
                borderRadius: 30,
                paddingVertical: 12,
                marginRight: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                marginBottom: 12
              }}
            >
              {/* Include the time part here */}
              <Text style={{ color: 'white', fontSize: 16 }}>
                {blockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {/* Rest of the content */}
              <Text style={{ color: 'white', fontSize: 16 }}>Water Level:</Text>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: '600' }}>
                {entry.water_level}cm
              </Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <StatusBar style="light" />
      <Image
        blurRadius={0}
        source={require('../../../assets/bg07.jpg')}
        style={{ position: 'absolute', height: '100%', width: '100%' }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Map */}
        <View style={{ height: 70, marginHorizontal: 5, marginTop: 30 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Map")}
            style={{
              borderRadius: 9999,
              padding: 12,
              margin: 4,
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
          </TouchableOpacity>
        </View>
        
        {/* Home Button */}
        <View style={{ height: 0, marginHorizontal: 5, marginTop: 30 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard2")}
            style={{
              borderRadius: 9999,
              padding: 12,
              margin: 4,
              position: 'absolute',
              bottom: 20,
              left: 0,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 9999,
                width: 48,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <HomeIcon size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Camera Button 
        <View style={{ height: 0, marginHorizontal: 5, marginTop: 30 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Cam1")}
            style={{
              borderRadius: 9999,
              padding: 12,
              margin: 4,
              position: 'absolute',
              bottom: -5,
              right: 0,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 9999,
                width: 48,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CameraIcon size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        */}

        {/* Forecast section */}
        {/* Forecast for next days */}
        <View style={{ marginBottom: 10, marginTop: -50 }}>
          <View style={{ flexDirection: 'center', alignItems: 'center', marginHorizontal: 5, marginBottom: 4 }}>
            <Text style={{ color: 'white', fontSize: 30 }}> Hourly Flood </Text>
            <Text style={{ color: 'white', fontSize: 30 }}> Forecast</Text>
            <View style={{ marginBottom: 10, marginTop: 25 }}>
              <Text style={{ color: 'lightblue', fontSize: 30 }}> Molino Dam </Text>
            </View>

            <Text style={{ color: 'white', fontSize: 20 }}> Water level status as of now </Text>
            
            <View
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                borderRadius: 30,
                paddingVertical: 10,
                marginRight: 4,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                marginBottom: 12
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Water Level:</Text>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: '600' }}>
                {waterLevelData?.water_level} cm
              </Text>
            </View>

            <Text style={{ color: 'white', fontSize: 20 }}> Water Level Forecast: </Text>
          </View>
          <ScrollView
            vertical
            contentContainerStyle={{ 
              paddingVertical: 0,
              paddingHorizontal: 2,
              height: 1150,
              alignItems: 'center',
              marginTop: 10, 
            }}
            showsVerticalScrollIndicator={false}
          >
            {renderForecastData()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
