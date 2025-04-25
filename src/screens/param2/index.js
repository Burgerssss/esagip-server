import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { CalendarDaysIcon, HomeIcon } from 'react-native-heroicons/outline';
import { WebSocketProvider } from 'react-native-websocket';
import axios from 'axios';

// Function to convert degrees to cardinal direction
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

export default function Param({ navigation }) {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [windSpeedData, setWindSpeedData] = useState([]);
  const [rainIntensityData, setRainIntensityData] = useState([]);
  const [windDirectionData, setWindDirectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (parameter, setData) => {
    const url = `https://tuplikas.com/jupyter/forecast/weather.php`;
    try {
      const response = await axios.get(url, { timeout: 5000 });
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${parameter} data:`, error.message);
      setError(`Error fetching ${parameter} data: ${error.message}`);
    }
  };

  const fetchAllData = async () => {
    await fetchData('temperature', setTemperatureData);
    await fetchData('humidity', setHumidityData);
    await fetchData('wind_speed', setWindSpeedData);
    await fetchData('rain_intensity', setRainIntensityData);
    await fetchData('wind_direction', setWindDirectionData);
    // Add more calls for other parameters
  };

  useEffect(() => {
    const fetchDataForParameter = async (parameter, setData) => {
      setLoading(true);
      await fetchData(parameter, setData);
      setLoading(false);
    };

    // Initial fetch
    fetchAllData();

    // Set up continuous data fetching
    const interval = setInterval(fetchAllData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const renderData = (data, parameter, unit) => {
    console.log(`Rendering data for ${parameter}:`, data);

    if (error) {
      return <Text style={{ color: 'red' }}>{error}</Text>;
    }

    const currentTime = new Date();

    return (
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 15 }}
        showsHorizontalScrollIndicator={false}
      >
        {data.slice().reverse().map((entry, index) => {
          const blockTime = new Date(currentTime);
          blockTime.setHours(currentTime.getHours() + index + 1);

          // Multiply wind speed by 3.6 to convert from m/s to km/h
          const displayValue = parameter === 'wind_speed' ? entry[parameter.toLowerCase()] * 3.6 : entry[parameter.toLowerCase()];
          // For wind direction, get cardinal direction
          const displayDirection = parameter === 'wind_direction' ? getWindDirection(entry[parameter.toLowerCase()]) : null;


          return (
            <View
              key={index}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: 90,
                height: 100, // Increased height to accommodate time
                borderRadius: 21,
                paddingVertical: 15,
                marginLeft: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: 10,
              }}
            >
              <Text style={{ color: 'white',fontWeight:'bold', fontSize: 18 }}>
                {blockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={{ color: 'white', fontSize: 15, }}>
                {displayDirection ? `${displayDirection}` : displayValue} {unit}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  console.log(`Rendering data for temperature:`, temperatureData);
  console.log(`Rendering data for humidity:`, humidityData);
  console.log(`Rendering data for wind speed:`, windSpeedData);
  // Add more logs for other parameters

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <StatusBar style="light" />
      <Image
        blurRadius={0}
        source={require('../../../assets/gradientbg3.png')}
        style={{ position: 'absolute', height: '100%', width: '100%' }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ height: 0, marginHorizontal: 5, marginTop: 70, marginBottom: 0 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard2")}
            style={{
              borderRadius: 9999,
              padding: 15,
              margin: 4,
              position: 'absolute',
              bottom: -30,
              right: 0,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 9999,
                width: 47,
                height: 47,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <HomeIcon size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          vertical
          contentContainerStyle={{ paddingHorizontal: 15 }}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20 }}
        >
          {temperatureData.length > 0 && (
            <View style={{ marginBottom: 20, marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 4 }}>
                <Image source={require('../../../assets/icons/Tempearture_icon.png')} style={{ height: 28, width: 28 }} />
                <Text style={{ color: 'white', fontSize: 13 }}> Temperature Forecast</Text>
              </View>
              {renderData(temperatureData, 'temperature', '°C')}
            </View>
          )}

          {humidityData.length > 0 && (
            <View style={{ marginBottom: 20, marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 4 }}>
                <Image source={require('../../../assets/icons/humidity_icon.png')} style={{ height: 28, width: 28 }} />
                <Text style={{ color: 'white', fontSize: 13 }}> Humidity Forecast</Text>
              </View>
              {renderData(humidityData, 'humidity', '%')}
            </View>
          )}

          {rainIntensityData.length > 0 && (
            <View style={{ marginBottom: 20, marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 4 }}>
                <Image source={require('../../../assets/icons/drop.png')} style={{ height: 26, width: 26 }} />
                <Text style={{ color: 'white', fontSize: 13 }}> Rain Intensity Forecast</Text>
              </View>
              {renderData(rainIntensityData, 'rain_intensity', 'mm/hr')}
            </View>
          )}

          {windSpeedData.length > 0 && (
            <View style={{ marginBottom: 20, marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 4 }}>
                <Image source={require('../../../assets/icons/air.png')} style={{ height: 28, width: 28 }} />
                <Text style={{ color: 'white', fontSize: 13 }}> Wind Speed Forecast</Text>
              </View>
              {renderData(windSpeedData, 'wind_speed', 'km/hr')} 
            </View>
          )}


          {windDirectionData.length > 0 && (
            <View style={{ marginBottom: 20, marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 4 }}>
                <Image source={require('../../../assets/icons/Compass_icon.png')} style={{ height: 28, width: 28 }} />
                <Text style={{ color: 'white', fontSize: 13 }}> Wind Direction Forecast</Text>
              </View>
              {renderData(windDirectionData, 'wind_direction')}
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
