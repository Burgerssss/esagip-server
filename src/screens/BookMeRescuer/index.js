import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';
import axios from "axios";
import { HomeIcon } from "react-native-heroicons/outline";
import { useNavigation } from '@react-navigation/native';

// Custom Marker Components
const CustomMarkerPinned = () => (
  <Image source={require('../../../assets/icons/pin3.png')} style={{ height: 30, width: 30 }} />
);

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
  loadingText: {
    fontSize: 16,
    color: "gray",
  },
});

export default function RescuerSide() {
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [requests, setRequests] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      } catch (error) {
        console.error("Error getting current location:", error);
      } finally {
        setLoadingLocation(false);
      }
    };
    getPermissions();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://your-server.com/get-rescue-requests');
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching rescue requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const mapRef = useRef(null);

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

          {requests.map((request, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: request.latitude, longitude: request.longitude }}
              title="Rescue Request"
            />
          ))}
        </MapView>
        
      )}
      <View style={{ height: 0, marginHorizontal: 5, marginTop: 30 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Dashboard3")}
          style={{
            borderRadius: 9999,
            padding: 12,
            margin: 4,
            position: 'absolute',
            bottom: -835,
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
    </View>
  );
}