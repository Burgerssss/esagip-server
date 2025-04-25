import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "../../config/constants";
import Constants from "expo-constants";
import MapViewDirections from "react-native-maps-directions";
import { HomeIcon } from "react-native-heroicons/outline";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons'; // Or your icon library of choice

const CustomMarkerPinned = () => (
  <Image source={require('../../../assets/icons/pin3.png')} style={{ height: 30, width: 30 }} />
);

const styles = StyleSheet.create({
  // ... (existing styles)
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    height: "100%",
    width: "100%",
  },

  search1: {
    zIndex: 1,
    flex: 0.5,
    marginLeft: 15,
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
  },
  mapButtonContainer: {
    position: "absolute",
    bottom: 10,
    left: 16,
  },
  mapButtonIconContainer: {
    backgroundColor: "transparent",
  },
  mapButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 100,
    padding: 12,
    margin: 1,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  routeButtonContainer: {
    position: "absolute",
    bottom: 80,
    right: 16,
  },
  routeButtonContainer2: {
    position: "absolute",
    bottom: 10,
    right: 16,
  },
  routeButtonIconContainer: {
    backgroundColor: "transparent",
  },
  routeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 12,
    margin: 1,
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  // Add a new style for the loading text
  loadingText: {
    fontSize: 16,
    color: "gray",
  },
});

const getStreetWaterLevelInfo = (waterLevel) => {
  if (waterLevel === 1) {
    return { levelRange: "1 - 2 ft", color: "yellow" };
  } else if (waterLevel === 2) {
    return { levelRange: "2.1 - 5 ft", color: "orange" };
  } else if (waterLevel === 3) {
    return { levelRange: "5.1 ft above", color: "red" };
  } else if (waterLevel === 0) {
    return { levelRange: "None", color: "Green" };
  } else {
    return { levelRange: "Unknown", color: "black" };
  }
};




export default function Map({ navigation }) {
  const [street1Data, setStreet1Data] = useState([]);
  const [street2Data, setStreet2Data] = useState([]);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true); // New state
  const [userData, setUserData] = useState(null);
  const [rescuerLocation, setRescuerLocation] = useState(null);

  const [airData, setAirData] = useState(null);
  const [showAirQualityLevels, setShowAirQualityLevels] = useState(false);
  

useEffect(() => {
  fetch('https://esagip.com/PHPtomob/Pm210.php')
    .then(res => res.json())
    .then(data => setAirData(data))
    .catch(err => console.error(err));
}, []);

const getAirQualityColor = (pmValue) => {
  if (pmValue >= 0 && pmValue <= 50) {
    return 'green'; // GOOD
  } else if (pmValue >= 51 && pmValue <= 100) {
    return 'yellow'; // FAIR
  } else if (pmValue >= 101 && pmValue <= 150) {
    return 'orange'; // UNHEALTHY
  } else if (pmValue >= 151 && pmValue <= 200) {
    return 'red'; // VERY UNHEALTHY
  } else if (pmValue >= 201 && pmValue <= 300) {
    return 'violet'; // ACUTELY UNHEALTHY
  } else if (pmValue >= 301 && pmValue <= 500) {
    return 'brown'; // EMERGENCY
  } else {
    return 'gray'; // Default color if the value is out of range
  }
};

const airQualityLevelsTopRow = [
  { level: 'GOOD', range: '0-50', color: 'green' },
  { level: 'FAIR', range: '51-100', color: 'yellow' },
  { level: 'UNHEALTHY', range: '101-150', color: 'orange' },
];

const airQualityLevelsBottomRow = [
  { level: 'VERY UNHEALTHY', range: '151-200', color: 'red' },
  { level: 'ACUTELY UNHEALTHY', range: '201-300', color: 'violet' },
  { level: 'EMERGENCY', range: '301-500', color: 'brown' },
];
  const fetchStreet1Data = async () => {
    const street1Url = "https://esagip.com/PHPtomob/strt_air.php";
    try {
      const response = await axios.get(street1Url, { timeout: 5000 });
      if (response.data !== null) {
        const waterLevel = parseInt(response.data.level, 10); // Ensure water_level is a number
        setStreet1Data({ ...response.data, level: waterLevel });
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
    const street2Url = "https://esagip.com/PHPtomob/strt_air2.php";
    try {
      const response = await axios.get(street2Url, { timeout: 5000 });
      if (response.data !== null) {
        const waterLevel = parseInt(response.data.level, 10); // Ensure water_level is a number
        setStreet2Data({ ...response.data, level: waterLevel });
      } else {
        console.error("Street 2 water level data is null");
        setStreet2Data([]);
      }
    } catch (error) {
      console.error("Error fetching Street 2 water level data:", error.message);
      setStreet2Data([]);
    }
  };
  
   const fetchUserData = async () => {
    try {
      const response = await axios.get('https://yourphpadmin/api/getUserData'); // Replace with actual endpoint
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    fetchStreet1Data();
    const street1Interval = setInterval(fetchStreet1Data, 5000);

    fetchStreet2Data();
    const street2Interval = setInterval(fetchStreet2Data, 5000);

    return () => {
      clearInterval(street1Interval);
      clearInterval(street2Interval);
    };
  }, []);
  
   useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setRescuerLocation(currentLocation);
      } catch (error) {
        console.error("Error getting current location:", error);
      } finally {
        setLoadingLocation(false);
      }
    };
    getPermissions();
  }, []);

   const handleRoutePress = () => {
    const waypointMarker = street1Data.level < street2Data.level ? street1Data : street2Data;
    setRescuerLocation(waypointMarker);
    // Trigger real-time tracking and route planning
  };

  const mapRef = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [location, setLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [markerList, setMarkerList] = useState([
    // ... (existing marker list)
    {
      id: 1,
      latitude: 14.460966,
      longitude: 120.964365,
      title: "Aniban Central School",
      description: "Evacuation Center",
    },
    {
      id: 2,
      latitude: 14.460966,
      longitude: 120.964365,
      title: "Aniban Central School",
      description: "Evacuation Center",
    },
    {
      id: 3,
      latitude: 14.461109,
      longitude: 120.965949,
      title: "FLOOD NODE 2",
      description: "(Route 2)",
      
    },
    {
      id: 4,
      latitude: 14.461491,
      longitude: 120.966844,
      title: "FLOOD NODE 1",
      description: "(Route 1)",//`Water Level: ${anibanData?.water_level}`,
      
    }
  ]);

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setOrigin({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        moveToLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
      } catch (error) {
        console.error("Error getting current location:", error);
      } finally {
        setLoadingLocation(false);
      }
    };

    const setupLocation = async () => {
      try {
        await getPermissions();
      } catch (error) {
        console.error("Error setting up location:", error);
      }
    };

    setupLocation();
  }, []);

  // ... (existing code)
  const CustomMarkerOrigin = () => (
    <Image source={require('../../../assets/icons/pin2.png')} style={{ height: 30, width: 30 }} />
  );

  const CustomMarkerDestination = () => (
    <Image source={require('../../../assets/icons/pin1.png')} style={{ height: 50, width: 50 }} />
  );

  const CustomMarkerPinnedLocation = () => (
    <Image source={require('../../../assets/icons/pin1.png')} style={{ height: 50, width: 50 }} />
  );

  async function moveToLocation(latitude, longitude) {
    try {
      await mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        2000,
      );
    } catch (error) {
      console.error("Error moving to location:", error);
    }
  }

  const handleRoute1Press = () => {
    const waypointMarker = markerList.find((marker) => marker.id === 4);

    if (waypointMarker) {
      setDestination({
        latitude: markerList[0].latitude,
        longitude: markerList[0].longitude,
      });

      moveToLocation(waypointMarker.latitude, waypointMarker.longitude);
      setSelectedRoute(1);
      setShowRoute(true);
    } else {
      setShowRoute(false);
    }
  };

  const handleRoute2Press = () => {
    const waypointMarker = markerList.find((marker) => marker.id === 3);

    if (waypointMarker) {
      setDestination({
        latitude: markerList[0].latitude,
        longitude: markerList[0].longitude,
      });

      moveToLocation(waypointMarker.latitude, waypointMarker.longitude);
      setSelectedRoute(2);
      setShowRoute(true);
    } else {
      setShowRoute(false);
    }
  };

  useEffect(() => {
    if (showRoute) {
      setDestination(null);
    }
  }, [showRoute]);

  const MarkerDetailsModal = () => {
    return (
      <View>
        {/* Display the details from selectedMarkerData */}
        {selectedMarkerData && (
          <Text>{selectedMarkerData.level}</Text>
        )}
        {/* Add other details as needed */}
      </View>
    );
  };
  
  const handleSafestRoutePress = () => {
    const street1WaterLevel = street1Data?.level !== undefined ? street1Data.level : Infinity;
    const street2WaterLevel = street2Data?.level !== undefined ? street2Data.level : Infinity;
  
    if (street1WaterLevel === street2WaterLevel) {
      alert("Both routes have the same water level. You can choose either Route 1 or Route 2.");
    } else {
      const safestRoute = street1WaterLevel < street2WaterLevel ? 1 : 2;
  
      if (safestRoute === 1) {
        handleRoute1Press();
      } else {
        handleRoute2Press();
      }
    }
  };
  
  

 return (
  <View style={styles.container}>
    <View style={styles.search1}>
      {/* Origin */}
      <View style={{ marginBottom: 3 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Origin</Text>
      </View>
      <View style={{ flex: 0.5 }}>
        {loadingLocation ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <Text style={{ fontSize: 16 }}>
            {location ? "Current Location" : "Location Unavailable"}
          </Text>
        )}
      </View>

      {/* Destination */}
      <View style={{ marginBottom: 3 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Destination</Text>
      </View>
      <View style={{ flex: 0.5 }}>
        <Text style={{ fontSize: 16 }}>Aniban Central School</Text>
      </View>

      <View style={{ flexDirection: 'column', marginHorizontal: 0 }}>
  {/* Existing Row of Two Boxes */}
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    {/* 8th Street Box */}
    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: 8, backgroundColor: 'gray', borderRadius: 10, marginRight: 10 }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>8th Street</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '400', fontSize: 13 }}>
          Water level: {street1Data?.level}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 16 }}>
          Level Range: <Text style={{ color: getStreetWaterLevelInfo(street1Data?.level).color }}>
            {getStreetWaterLevelInfo(street1Data?.level).levelRange}
          </Text>
        </Text>
      </View>
    </View>

    {/* 5th Street Box */}
    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: 15, backgroundColor: 'gray', borderRadius: 10 }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>5th Street</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '400', fontSize: 13 }}>
          Water Level: {street2Data?.level}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 16 }}>
          Level Range: <Text style={{ color: getStreetWaterLevelInfo(street2Data?.level).color }}>
            {getStreetWaterLevelInfo(street2Data?.level).levelRange}
          </Text>
        </Text>
      </View>
    </View>
  </View>

  <View style={{ marginTop: 12, padding: 15, backgroundColor: 'gray', borderRadius: 10 }}>
  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>
    Air Quality Index
  </Text>

  {/* PM2.5 */}
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
    <Text style={{ color: 'white', fontSize: 14 }}>PM2.5: </Text>
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
      <View
        style={{
          backgroundColor: getAirQualityColor(airData?.pm25),
          paddingHorizontal: 5,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
          {airData?.pm25}
        </Text>
      </View>
    </Text>
  </View>

  {/* PM10 */}
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={{ color: 'white', fontSize: 14 }}>PM10: </Text>
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
      <View
        style={{
          backgroundColor: getAirQualityColor(airData?.pm10),
          paddingHorizontal: 5,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
          {airData?.pm10}
        </Text>
      </View>
    </Text>
  </View>
  {showAirQualityLevels && (
  <>
  {/* Air Quality Levels (Top Row: GOOD to UNHEALTHY) */}
  <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-evenly' }}>
  {airQualityLevelsTopRow.map((level, index) => (
    <View key={index} style={{ alignItems: 'center' }}>
      {/* Display the level and range */}
      <Text
        style={{
          color: level.color,
          fontWeight: 'bold',
          fontSize: 12,
          textAlign: 'center',
          marginBottom: -5, // Reduced margin between level name and range
        }}
      >
        {level.level.split(' ').map((word, i) => (
          <Text key={i} style={{ color: level.color, fontWeight: 'bold', fontSize: 12 }}>
            {word}{'\n'}
          </Text>
        ))}
      </Text>
      <Text style={{ color: 'white', fontSize: 10, marginTop: -3, textAlign: 'center' }}>
        {level.range}
      </Text>
    </View>
  ))}
</View>

  {/* Air Quality Levels (Bottom Row: VERY UNHEALTHY to EMERGENCY) */}
  <View style={{ marginTop: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
  {airQualityLevelsBottomRow.map((level, index) => (
    <View key={index} style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      {/* Display the level and range */}
      <Text
        style={{
          color: level.color,
          fontWeight: 'bold',
          fontSize: 12,
          textAlign: 'center', // Centering the level text
          marginBottom: -15, // Adjust margin to reduce space between level name and range
        }}
      >
        {level.level.split(' ').map((word, i) => (
          <Text key={i} style={{ color: level.color, fontWeight: 'bold', fontSize: 12 }}>
            {word}{'\n'}
          </Text>
        ))}
      </Text>
      <Text style={{ color: 'white', fontSize: 10, marginTop: 2, textAlign: 'center' }}>
        {level.range}
      </Text>
    </View>
  ))}
</View>
</>
)}
<TouchableOpacity
  style={{
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
  }}
  onPress={() => setShowAirQualityLevels(prev => !prev)}
>
  <Ionicons name="information-circle" size={24} color="black" />
</TouchableOpacity>

</View>
</View>


      

      <TouchableOpacity onPress={handleSafestRoutePress}>
        <View style={{ flex: 1, alignItems: 'center', padding: 15, backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 99, marginTop: 10 }}>
          <Text style={{ color: 'white', justifyContent: 'center' }}>Safest Route</Text>
        </View>
      </TouchableOpacity>
    </View>

    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={{
        latitude: 14.447435910188215,
        latitudeDelta: 0.0531234281300943,
        longitude: 120.9617610834539,
        longitudeDelta: 0.024686045944690704,
      }}
    >
      {/* Map Markers and Routes */}
      {origin !== null ? (
        <Marker coordinate={origin} title="Origin">
          <CustomMarkerOrigin />
        </Marker>
      ) : null}

      {destination !== null ? (
        <Marker coordinate={destination} title="Destination">
          <CustomMarkerDestination />
        </Marker>
      ) : null}

      {currentLocationMarker !== null ? (
        <Marker coordinate={currentLocationMarker.coordinate} title={currentLocationMarker.title}>
          <CustomMarkerOrigin />
        </Marker>
      ) : null}

      {origin !== null && destination !== null && showRoute ? (
        <MapViewDirections
          origin={origin}
          destination={destination}
          waypoints={[
            {
              latitude: selectedRoute === 1 ? markerList[3].latitude : markerList[2].latitude,
              longitude: selectedRoute === 1 ? markerList[3].longitude : markerList[2].longitude,
            },
          ]}
          strokeColor="aqua"
          strokeWidth={10}
          apikey={GOOGLE_API_KEY}
        />
      ) : null}

      {markerList.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          description={marker.description}
        >
          {marker.id === 3 || marker.id === 4 ? <CustomMarkerPinned /> : <CustomMarkerPinnedLocation />}
        </Marker>
      ))}

      {selectedMarkerData !== null && <MarkerDetailsModal />}
    </MapView>

    <View style={styles.mapButtonContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")} style={styles.mapButton}>
        <View style={styles.mapButtonIconContainer}>
          <HomeIcon size={40} color="white" />
        </View>
      </TouchableOpacity>
    </View>

    {/* Route 1 Button */}
    <View style={styles.routeButtonContainer}>
      <TouchableOpacity onPress={handleRoute1Press} style={styles.routeButton}>
        <Text style={{ color: "white", fontWeight: "bold" }}>8th</Text>
      </TouchableOpacity>
    </View>
    {/* Route 2 Button */}
<View style={styles.routeButtonContainer2}>
  <TouchableOpacity onPress={handleRoute2Press} style={styles.routeButton}>
    <Text style={{ color: "white", fontWeight: "bold" }}>5th</Text>
  </TouchableOpacity>
</View>

  </View>
);
}