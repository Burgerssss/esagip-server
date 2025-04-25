import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Image } from 'react-native';
import { theme } from "../../../theme/Index"; // import theme here
import Constants from "expo-constants";
import axios from 'axios';

import { CalendarDaysIcon, MagnifyingGlassCircleIcon, MapIcon, SparklesIcon, SunIcon, CameraIcon, HomeIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';

export default function Alerts({ navigation }) {

    const [anibanData, setAnibanData] = useState({ water_level: null });
    const [prinzaData, setPrinzaData] = useState({ water_level: null });
    const [street1Data, setStreet1Data] = useState([]);
    const [street2Data, setStreet2Data] = useState([]);

    const [weatherData, setWeatherData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnibanData = async () => {
        const anibanUrl = "https://tuplikas.com/testcode/molino.php";
        try {
            const response = await axios.get(anibanUrl, { timeout: 5000 });
            setAnibanData(response.data);
        } catch (error) {
            console.error("Error fetching aniban water level data:", error.message);
            setAnibanData({ water_level: null });
        }
    };

    const fetchPrinzaData = async () => {
        const prinzaUrl = "https://tuplikas.com/testcode/prinza.php";
        try {
            const response = await axios.get(prinzaUrl, { timeout: 5000 });
            setPrinzaData(response.data);
        } catch (error) {
            console.error("Error fetching prinza water level data:", error.message);
            setPrinzaData({ water_level: null });
        }
    };

    const fetchStreet1Data = async () => {
        const street1Url = "https://tuplikas.com/testcode/street1.php";
        try {
          const response = await axios.get(street1Url, { timeout: 5000 });
          if (response.data !== null) {
            const waterLevel = parseInt(response.data.water_level, 10); // Ensure water_level is a number
            setStreet1Data({ ...response.data, water_level: waterLevel });
          } else {
            console.error("Street 1 water level data is null");
            setStreet1Data([]);
          }
        } catch (error) {
          console.error("Error fetching Street 1 water level data:", error.message);
          setStreet1Data([]);
        }
      };
      

      const fetchStreet2Data = async () => {
        const street2Url = "https://tuplikas.com/testcode/street2.php";
        try {
          const response = await axios.get(street2Url, { timeout: 5000 });
          if (response.data !== null) {
            const waterLevel = parseInt(response.data.water_level, 10); // Ensure water_level is a number
            setStreet2Data({ ...response.data, water_level: waterLevel });
          } else {
            console.error("Street 2 water level data is null");
            setStreet2Data([]);
          }
        } catch (error) {
          console.error("Error fetching Street 2 water level data:", error.message);
          setStreet2Data([]);
        }
      };
      

    const fetchData = async () => {
        try {
          const response = await axios.get('https://tuplikas.com/testcode/dht.php');
          setWeatherData(response.data);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    useEffect(() => {
        // Initial fetch for Aniban data
        fetchAnibanData();

        // Set up continuous data fetching for Aniban data
        const anibanInterval = setInterval(fetchAnibanData, 5000);

        // Initial fetch for Prinza data
        fetchPrinzaData();

        // Set up continuous data fetching for Prinza data
        const prinzaInterval = setInterval(fetchPrinzaData, 5000);

        fetchStreet1Data();
        const street1Interval = setInterval(fetchStreet1Data, 5000);

        fetchStreet2Data();
        const street2Interval = setInterval(fetchStreet2Data, 5000);

        fetchData(); // call the fetchData function when the component mounts

         const intervalId = setInterval(fetchData, 1000);

        // Clean up interval on component unmount
        return () => {
            clearInterval(anibanInterval);
            clearInterval(prinzaInterval);
            clearInterval(street1Interval);
            clearInterval(street2Interval);
            return () => clearInterval(intervalId);
        };
    }, []);

    const getWaterLevelInfo = (waterLevel) => {
        if (waterLevel === null) {
            return { message: "Loading...", color: "black" };
        } else if (waterLevel === 0) {
            return { message: "No Alert", color: "lightgreen" };
        } else if (waterLevel >= 1 && waterLevel <= 10) {
            return { message: "Water Level is Low", color: "green" };
        } else if (waterLevel > 11 && waterLevel <= 79) {
            return { message: "Water level is Normal", color: "yellow" };
        } else if (waterLevel > 80 && waterLevel <= 100) {
            return { message: "Water level is High", color: "orange" };
        } else if (waterLevel > 101) {
            return { message: "Water level is Critical", color: "red" };
        } else {
            return { message: "Invalid water level data", color: "black" };
        }
    };

    const getWaterLevel2Info = (waterLevel) => {
        if (waterLevel === null) {
            return { message: "Loading...", color: "black" };
        } else if (waterLevel === 0) {
            return { message: "No Alert", color: "lightgreen" };
        } else if (waterLevel >= 1 && waterLevel <= 50) {
            return { message: "Water Level is Low", color: "green" };
        } else if (waterLevel > 51 && waterLevel <= 100) {
            return { message: "Water level is Normal", color: "yellow" };
        } else if (waterLevel > 101 && waterLevel <= 150) {
            return { message: "Water level is High", color: "orange" };
        } else if (waterLevel > 151) {
            return { message: "Water level is Critical", color: "red" };
        } else {
            return { message: "Invalid water level data", color: "black" };
        }
    };

    const getStreetWaterLevelInfo = (waterLevel) => {
        if (waterLevel === 1) {
            return { levelRange: "1 - 2 ft", condition: "Mandatory Evacuation", color: "yellow" };
        } else if (waterLevel === 2) {
            return { levelRange: "2.1 - 5 ft", condition: "Forced Evacuation", color: "orange" };
        } else if (waterLevel === 3) {
            return { levelRange: "5.1 ft above", condition: "Further Movement", color: "red" };
        } else if (waterLevel === 0) {
            return { levelRange: "0 ft", condition: "Safe", color: "green" };
        } else {
            return { levelRange: "Unknown", condition: "Invalid data", color: "black" };
        }
    };

    const rainIntensity = weatherData?.rain_intensity;
    const windSpeed = weatherData?.wind_speed;

    // Call the getRainfallAdvisory function with rainIntensity and windSpeed as parameters
    
    const getRainfallAdvisory = (rainIntensity, windSpeed) => {
        // Check if rainIntensity and windSpeed are not undefined or null
        if (rainIntensity !== undefined && windSpeed !== undefined) {
            // Convert wind speed from m/s to km/h
            windSpeed *= 3.6;
    
            if (rainIntensity === 0) {
                if (windSpeed < 20) {
                    return "Light Wind Condition\n" +
                        `Wind speed (${windSpeed} km/hr) is less than 20 km/hr.\n` +
                        "Advisory: Enjoy the pleasant weather! The wind is gentle, with no rain.";
                } else if (windSpeed <= 40) {
                    return "Moderate Wind Condition\n" +
                        `Wind speed (${windSpeed} km/hr) is generally between 20 km/hr and 40 km/hr.\n` +
                        "Advisory: Enjoy the pleasant weather! The wind is moderate, with no rain.";
                } else {
                    return "Strong Wind Condition\n" +
                        `Wind speed (${windSpeed} km/hr) exceeds 40 km/hr.\n` +
                        "Advisory: Be cautious due to the presence of strong wind.";
                }
            } else if (rainIntensity > 0 && rainIntensity < 2.5) {
                if (windSpeed < 20) {
                    return "Light Condition\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is less than 2.5 mm/hr, and wind speed (${windSpeed} km/hr) is less than 20 km/hr.\n` +
                        "Advisory: Enjoy the pleasant weather! The rain is very light, and the wind is gentle.";
                } else if (windSpeed <= 40) {
                    return "Light Rainfall with Moderate Wind Condition\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is generally less than 2.5 mm/hr, and wind speed (${windSpeed} km/hr) is generally between 20 to 40 km/hr, indicating light rainfall with moderate wind conditions.\n` +
                        "Advisory: Take precautions for moderate wind. The rainfall is very light.";
                } else {
                    return "Light Rain with Strong Wind Condition\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is less than 2.5 mm/hr, and wind speed (${windSpeed} km/hr) exceeds 40 km/hr.\n` +
                        "Advisory: Please exercise cautions due to the presence of light rainfall with strong winds.";
                }
            } else if (rainIntensity >= 2.5 && rainIntensity <= 7.6) {
                if (windSpeed < 20) {
                    return "Moderate Rainfall with Light Wind Condition\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is generally between 2.5 to 7.6 mm/hr, and wind speed (${windSpeed} km/hr) is less than 20 km/hr, indicating moderate rainfall with light wind conditions.\n` +
                        "Advisory: Take precautions for moderate rainfall. The wind is gentle.";
                } else if (windSpeed <= 40) {
                    return "Moderate Condition\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is generally between 2.5 to 7.6 mm/hr, and wind speed (${windSpeed} km/hr) is between 20 to 40 km/hr.\n` +
                        "Advisory: Take necessary precautions. The rainfall is moderate, and the wind is picking up speed.";
                } else {
                    return "Moderate Rainfall with Strong Wind Condition\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is generally between 2.5 to 7.6 mm/hr, and wind speed (${windSpeed} km/hr) exceeds 40 km/hr or higher gusts.\n` +
                        "Advisory: Stay Safe and seek shelter. The rainfall is moderate, and the wind is strong.";
                }
            } else if (rainIntensity >= 7.6) {
                if (windSpeed < 20) {
                    return "Heavy Rainfall with Light Wind Condition\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is more than 7.6 mm/hr, and wind speed (${windSpeed} km/hr) is generally less than 20 km/hr.\n` +
                        "Advisory: Take necessary cautions due to the presence of heavy rainfall with light wind.";
                } else if (windSpeed <= 40) {
                    return "Heavy Rainfall with Moderate Wind\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is more than 7.6 mm/hr, and wind speed (${windSpeed} km/hr) is generally between 20 to 40 km/hr, indicating heavy rainfall with moderate wind conditions.\n` +
                        "Advisory: Stay Safe and seek shelter. The rainfall is heavy, and moderate winds mostly persist.";
                } else {
                    return "Heavy Rainfall with Strong Wind Condition\n" +
                        `Rainfall intensity (${rainIntensity} mm/hr) is more than 7.6 mm/hr, and wind speed (${windSpeed} km/hr) exceeds 40 km/hr or higher gusts.\n` +
                        "Advisory: Stay Safe and seek shelter. Please exercise cautions due to the presence of heavy rainfall with strong winds.";
                }
            } else {
                // Check for significant wind speed even without precipitation
                if (windSpeed < 20) {
                    return "Light Wind Condition\n" +
                        `Wind speed (${windSpeed} km/hr) is less than 20 km/hr.\n` +
                        "Advisory: Enjoy the pleasant weather! The wind is gentle, with no rain.";
                } else if (windSpeed <= 40) {
                    return "Moderate Wind Condition\n" +
                        `Wind speed (${windSpeed} km/hr) is generally between 20 km/hr and 40 km/hr.\n` +
                        "Advisory: Enjoy the pleasant weather! The wind is moderate, with no rain.";
                } else {
                    return "Strong Wind Condition\n" +
                        `Wind speed (${windSpeed} km/hr) exceeds 40 km/hr.\n` +
                        "Advisory: Be cautious due to the presence of strong wind.";
                }
            }
        }
        
        // Default message if no specific advisory is applicable
        return "No specific advisory. Weather conditions are currently stable.";
    };
    
    
    
    
    
    
    const advisoryMessage = getRainfallAdvisory(rainIntensity, windSpeed);

    
    const getHeatIndexAdvisory = (temperature) => {
        if (temperature >= 27 && temperature <= 32) {
            return "Heat Index: 27-32°C\n" +
                `Advisory: Caution! The temperature is (${temperature}°C). It is important to be aware that prolonged exposure to heat and continuous physical activity can lead to fatigue. It is recommended to stay hydrated and take breaks.`;
        } else if (temperature >= 33 && temperature <= 41) {
            return "Heat Index: 33-41°C (90-105°F)\n" +
                `Advisory: Extreme Caution! The temperature is (${temperature}°C). Heat cramps and heat exhaustion are possible if continuous physical activity is exerted in hot conditions. It is recommended to stay hydrated and limit physical activity.`;
        } else if (temperature >= 42 && temperature <= 51) {
            return "Heat Index: 42-51°C (106-124°F)\n" +
                `Advisory: Danger! The temperature is (${temperature}°C). Be cautious as heat cramps, heat exhaustion, and heat stroke are likely with prolonged exposure to heat and continuous physical activity. Please avoid outdoor activities and practice frequent hydration.`;
        } else if (temperature > 51) {
            return "Heat Index: Greater than 51°C (125°F+)\n" +
                `Advisory: Extreme Danger! The temperature is (${temperature}°C). Heat stroke is highly likely. Avoid continuous physical activity and prolonged exposure to heat. Avoid outdoor activities, ensure cooling measures, and hydrate continuously.`;
        } else {
            return "No specific advisory.";
        }
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

                {/* Weather */}
                <View style={{ height: 0, marginHorizontal: 5, marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Dashboard2")}
                        style={{
                            borderRadius: 9999,
                            padding: 12,
                            margin: 4,
                            position: 'absolute',
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
            </SafeAreaView>

            {/* Forecast section */}
            <View style={{ flex: 1, marginTop: -700 }}>
                {/* Forecast for next days */}
                <View>
                    <View style={{ flexDirection: 'center', alignItems: 'center', marginHorizontal: 5, marginBottom: 4, marginTop: 50, }}>
                        <Text style={{ color: 'white', fontSize: 30 }}> Advisories </Text>
                        <View style={{ marginBottom: 10, marginTop: 35 }}>
                            <Text style={{ color: 'white', fontSize: 30 }}> Bacoor City, Cavite </Text>
                        </View>
                    </View>

                    
                    <ScrollView
                        vertical
                        contentContainerStyle={{
                            paddingVertical: 0,
                            paddingHorizontal: 10,
                            height: 2700,
                            alignItems: 'center',
                            marginTop: 10,
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                     <View style={{ height:2500 }}>
                     <View
                        style={{
                            flex: 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 340,
                            height: 100,
                            borderRadius: 30,
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            marginRight: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            marginBottom: 12
                        }}
                    >
                        <Text style={{ color: '#000000', fontSize: 30, fontWeight: 'bold', alignItems: 'center' }}>Weather Alert</Text>

                        {/* Wrap the text content in a ScrollView */}
                        <ScrollView
                            style={{ flex: 1, width: '100%', maxHeight: 300 }}
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        >
                            <Text style={{ color: 'white', fontSize: 16, textAlign: 'left',  }}>
                             {advisoryMessage}   
                            </Text>
                        </ScrollView>

                    </View>

                    <View
                        style={{
                            flex: 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 340,
                            height: 70,
                            borderRadius: 30,
                            paddingVertical: 30,
                            paddingHorizontal: 10,
                            marginRight: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            marginBottom: 12
                        }}
                    >
                        <Text style={{ color: '#000000', fontSize: 30, fontWeight: 'bold', alignItems: 'center', }}>Heat Alert</Text>

                        {/* Wrap the text content in a ScrollView */}
                        <ScrollView
                            style={{ flex: 1, width: '100%', maxHeight: 300 }}
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={{ color: 'white', fontSize: 16, textAlign: 'left',  }}>
                                {getHeatIndexAdvisory(weatherData?.temperature)}
                            </Text>
                        </ScrollView>


                    </View>


                        
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height:100,
                                    width: 340,
                                    borderRadius: 30,
                                    paddingVertical: 20,
                                    paddingHorizontal: 10,
                                    marginRight: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    marginBottom: 12
                                }}
                            >
                                <Text style={{ color: 'aqua', fontSize: 30, fontWeight: 'bold', }}>Molino Dam Alert</Text>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ color: 'white', fontSize: 16, justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginTop: 3 }}>
                                       Current Water Level: {anibanData.water_level} cm
                                    </Text>
                                    <Text style={{ color: getWaterLevelInfo(anibanData?.water_level).color, fontSize: 16, justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginTop: 3 }}>
                                        {anibanData && anibanData.water_level !== null ? getWaterLevelInfo(anibanData.water_level).message : "Loading..."}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 340,
                                    borderRadius: 30,
                                    paddingVertical: 20,
                                    paddingHorizontal: 10,
                                    marginRight: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    marginBottom: 12
                                }}
                            >
                                <Text style={{ color: 'aqua', fontSize: 30, fontWeight: 'bold', }}>Prinza Dam Alert</Text>
                                    <Text style={{ color: 'white', fontSize: 16, justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginTop: 3 }}>
                                       Current Water Level: {prinzaData.water_level} cm
                                    </Text>
                                <Text style={{ color: getWaterLevel2Info(prinzaData?.water_level).color, fontSize: 16, justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginTop: 3 }}>
                                    {prinzaData && prinzaData.water_level !== null ? getWaterLevel2Info(prinzaData.water_level).message : "Loading..."}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 340,
                                    height: 100,
                                    borderRadius: 30,
                                    paddingVertical: 90,
                                    paddingHorizontal: 10,
                                    marginRight: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    marginBottom: 0
                                }}
                            >
                                <Text style={{ color: 'rgba(0, 0, 128, 255)', fontSize: 30, fontWeight: 'bold', }}>Aniban Street Alert</Text>

                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            width: 150,
                                            height: 200,
                                            borderRadius: 10,
                                            padding: 10,
                                            marginRight: 4,
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            marginBottom: 12
                                        }}
                                    >
                                        <Text style={{ color: '#191970', fontSize: 16, justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginTop: 3 }}>
                                            5th Street
                                        </Text>
                                        <Text style={{ color: 'white', fontSize: 16 }}>
                                            Water Level: {street1Data?.water_level}
                                        </Text>
                                        <Text style={{ color: 'white', fontSize: 16 }}>
                                            Level Range: {getStreetWaterLevelInfo(street1Data?.water_level).levelRange}
                                        </Text>
                                        <Text style={{ color: getStreetWaterLevelInfo(street1Data?.water_level).color }}>
                                            {street1Data.water_level !== null ? getStreetWaterLevelInfo(street1Data.water_level).condition : "Loading..."}
                                        </Text>

                                    </View>

                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            width: 150,
                                            height: 200,
                                            borderRadius: 10,
                                            padding: 10,
                                            marginRight: 4,
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            marginBottom: 12
                                        }}
                                    >
                                        <Text style={{ color: '#191970', fontSize: 16, justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginTop: 3 }}>
                                            8th Street
                                        </Text>
                                        <Text style={{ color: 'white', fontSize: 16 }}>
                                            Water Level: {street2Data?.water_level}
                                        </Text>
                                        <Text style={{ color: 'white', fontSize: 16 }}>
                                            Level Range: {getStreetWaterLevelInfo(street2Data?.water_level).levelRange}
                                        </Text>
                                        <Text style={{ color: getStreetWaterLevelInfo(street2Data?.water_level).color }}>
                                            {street2Data.water_level !== null ? getStreetWaterLevelInfo(street2Data.water_level).condition : "Loading..."}
                                        </Text>

                                    </View>
                                    
                                </View>
                            </View>

                            <View
                                style={{
                                    flex: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 340,
                                    height: 100,
                                    borderRadius: 30,
                                    paddingVertical: 30,
                                    paddingHorizontal: 10,
                                    marginRight: 4,
                                    marginTop:12,
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    marginBottom: 12
                                }}
                            >
                                <Text style={{ color: 'rgba(0, 0, 128, 255)', fontSize: 30, fontWeight: 'bold', alignItems: 'center' }}>5th Street</Text>
                                <ScrollView
                                    style={{ flex: 1, width: '100%', maxHeight: 300 }}
                                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16, textAlign: 'left',  }}>
                                        {getStreetWaterLevelInfo(street1Data?.water_level).condition === "Mandatory Evacuation" ?
                                            "Actions to Take:\n" +
                                            "•Residents in affected areas must evacuate to designated shelters immediately.\n" +
                                            "•Secure personal belongings and important documents.\n" +
                                            "•Follow evacuation routes and instructions provided by local authorities." :
                                        getStreetWaterLevelInfo(street1Data?.water_level).condition === "Forced Evacuation" ?
                                            "Actions to Take:\n" +
                                            "•All residents in the affected zones must evacuate immediately under the direction of emergency services.\n" +
                                            "•Emergency responders will assist in the evacuation process; comply with their instructions.\n" +
                                            "•Do not attempt to return to your homes until authorities declare it safe.\n" +
                                            "•Take essential supplies such as medications, water, food, and clothing." :
                                        getStreetWaterLevelInfo(street1Data?.water_level).condition === "Further Movement" ?
                                            "Actions to Take:\n" +
                                            "•All individuals in the affected areas must move to higher ground or shelters immediately.\n" +
                                            "•Do not wait for further instructions; the situation is critical.\n" +
                                            "•Follow directions from emergency personnel and use evacuation routes provided.\n" +
                                            "•Prioritize safety over belongings; take only essentials needed for survival.\n" +
                                            "•Stay away from floodwaters; they are extremely dangerous and can be life-threatening." :
                                        "No specific advisory."
                                    }
                                </Text>
                            </ScrollView>
                            </View>

                            <View
                                style={{
                                    flex: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 340,
                                    height: 100,
                                    borderRadius: 30,
                                    paddingVertical: 30,
                                    paddingHorizontal: 10,
                                    marginRight: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    marginBottom: 12
                                }}
                            >
                                <Text style={{ color: 'rgba(0, 0, 128, 255)', fontSize: 30, fontWeight: 'bold', alignItems: 'center' }}>8th Street</Text>
                                <ScrollView
                                    style={{ flex: 1, width: '100%', maxHeight: 300 }}
                                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16, textAlign: 'left',  }}>
                                        {getStreetWaterLevelInfo(street2Data?.water_level).condition === "Mandatory Evacuation" ?
                                            "Actions to Take:\n" +
                                            "•Residents in affected areas must evacuate to designated shelters immediately.\n" +
                                            "•Secure personal belongings and important documents.\n" +
                                            "•Follow evacuation routes and instructions provided by local authorities." :
                                        getStreetWaterLevelInfo(street2Data?.water_level).condition === "Forced Evacuation" ?
                                            "Actions to Take:\n" +
                                            "•All residents in the affected zones must evacuate immediately under the direction of emergency services.\n" +
                                            "•Emergency responders will assist in the evacuation process; comply with their instructions.\n" +
                                            "•Do not attempt to return to your homes until authorities declare it safe.\n" +
                                            "•Take essential supplies such as medications, water, food, and clothing." :
                                        getStreetWaterLevelInfo(street2Data?.water_level).condition === "Further Movement" ?
                                            "Actions to Take:\n" +
                                            "•All individuals in the affected areas must move to higher ground or shelters immediately.\n" +
                                            "•Do not wait for further instructions; the situation is critical.\n" +
                                            "•Follow directions from emergency personnel and use evacuation routes provided.\n" +
                                            "•Prioritize safety over belongings; take only essentials needed for survival.\n" +
                                            "•Stay away from floodwaters; they are extremely dangerous and can be life-threatening." :
                                        "No specific advisory."
                                    }
                                </Text>
                            </ScrollView>
                            </View>


                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}
