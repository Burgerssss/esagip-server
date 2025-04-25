import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput, FlatList } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "../../config/constants";
import Constants from "expo-constants";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import { HomeIcon } from "react-native-heroicons/outline";
import io from 'socket.io-client';
// Custom Marker Components
const CustomMarkerPinned = () => (
  <Image source={require('../../../assets/icons/pin3.png')} style={{ height: 30, width: 30 }} />
);

// Styles
const styles = StyleSheet.create({
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
  loadingText: {
    fontSize: 16,
    color: "gray",
  },
});

export default function Map({ navigation }) {
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [rescuers, setRescuers] = useState([]);
  const [nearestRescuer, setNearestRescuer] = useState(null);

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        moveToLocation(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error("Error getting current location:", error);
      } finally {
        setLoadingLocation(false);
      }
    };
    getPermissions();
  }, []);

  useEffect(() => {
    const fetchRescuers = async () => {
      try {
        const response = await axios.get('https://your-backend-api.com/rescuers');
        setRescuers(response.data);
      } catch (error) {
        console.error("Error fetching rescuers:", error);
      }
    };
    fetchRescuers();
  }, []);

  const mapRef = useRef(null);

  const moveToLocation = (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      2000
    );
  };

  const calculateNearestRescuer = () => {
    if (!currentLocation || rescuers.length === 0) return;

    let closestRescuer = null;
    let minDistance = Number.MAX_VALUE;

    rescuers.forEach((rescuer) => {
      const distance = Math.sqrt(
        Math.pow(rescuer.latitude - currentLocation.coords.latitude, 2) +
        Math.pow(rescuer.longitude - currentLocation.coords.longitude, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestRescuer = rescuer;
      }
    });

    setNearestRescuer(closestRescuer);
    setDestination({
      latitude: closestRescuer.latitude,
      longitude: closestRescuer.longitude,
    });
  };

  return (
    <View style={styles.container}>
      {loadingLocation ? (
        <Text style={styles.loadingText}>Loading Location...</Text>
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          ref={mapRef}
          showsUserLocation
          followsUserLocation
          initialRegion={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          {currentLocation && (
            <Marker coordinate={{ latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude }}>
              <CustomMarkerPinned />
            </Marker>
          )}

          {origin && destination && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_API_KEY}
              strokeWidth={10}
              strokeColor="blue"
            />
          )}

          {nearestRescuer && (
            <Marker coordinate={{ latitude: nearestRescuer.latitude, longitude: nearestRescuer.longitude }}>
              <CustomMarkerPinned />
            </Marker>
          )}
        </MapView>
      )}

      <View style={{ height: 0, marginHorizontal: 5, marginTop: 30 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Dashboard")}
          style={{
            borderRadius: 9999,
            padding: 12,
            margin: 4,
            position: 'absolute',
            bottom: -100,
            left: 0,
          }}
        >
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 255, 0.3)',
              borderRadius: 9999,
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <HomeIcon size={25} color="blue" />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 50,  // Adjust vertical position
          right: 20,   // Adjust horizontal position
        }}
        onPress={calculateNearestRescuer}
      >
        <View style={styles.routeButton}>
          <Text style={{
            color: "white",
            fontWeight: "bold"
          }}>Sagipin</Text>
        </View>
      </TouchableOpacity>

              {/* Chat Button */}
      <View style={{ position: 'absolute', bottom: 125, right: 35 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatScreen")} // Replace "ChatScreen" with the actual screen name
          style={{
            backgroundColor: 'rgb(0, 0, 0)',
            borderRadius: 50,
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../../assets/icons/chatbox3.png')} // Path to your PNG
            style={{ width: 30, height: 30, tintColor: 'white' }} // Apply tintColor to change color to white
          />
        </TouchableOpacity>
      </View>

    </View>
  );
}