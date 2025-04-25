import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Image } from 'react-native'
import { theme } from "../../../theme/Index"; // import theme here

import { CalendarDaysIcon, MagnifyingGlassCircleIcon, MapIcon, SparklesIcon, SunIcon, CameraIcon, ArrowUturnLeftIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';

export default function Cam({navigation}) {

    return (
            <View style={{ flex: 1, position: 'relative' }}>
                <StatusBar style="light" />
                <Image
                    blurRadius={0}
                    source={require('../../../assets/gradientbg3.png')}
                    style={{ position: 'absolute', height: '100%', width: '100%' }}
                />
                <SafeAreaView style={{ flex: 1 }}>
                    {/* Map */}
                    <View style={{ height: 70, marginHorizontal: 5, marginTop: 50, marginBottom:30, }}>
                        
                        <TouchableOpacity
                        onPress={() => navigation.navigate("Flood")}
                        style={{
                           
                            borderRadius: 9999,
                            padding: 12,
                            margin: 4,
                            position: 'absolute',
                            bottom: 10,
                            left: 0,
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
                                <ArrowUturnLeftIcon size={25} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* Forecast section */}
                    
                    {/* Forecast for next days */}
                    <View style={{ marginBottom: 10, marginTop: -50 }}>
                        <View style={{ flexDirection: 'center', alignItems: 'center', marginHorizontal: 5, marginBottom: 4 }}>
                            <Text style={{ color: 'white', fontSize: 30 }}> Surveillance Footage</Text>
                            <View style={{ marginBottom: 10, marginTop: 20 }}>
                                <Text style={{ color: 'lightblue', fontSize: 30 }}> Panapaan III </Text> 
                            </View>
                        </View>
                        <ScrollView
                            vertical
                            contentContainerStyle={{ paddingVertical: 10,
                                paddingHorizontal: 10,
                                height:1350,
                                alignItems: 'center',
                             }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ height:1100 }}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 340,
                                    borderRadius: 30,
                                    paddingVertical: 12,
                                    marginRight: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    marginBottom:10
                                }}
                            >
                               
                                <Text style={{ color: 'white', fontSize: 50, fontWeight:'bold', marginBottom:30,marginTop:-50, }}>Street 1</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'bottom' }}>
                                    <TouchableOpacity>
                                        <Image
                                        source={require('../../../assets/flood1.png')}
                                        style={{ width: 300, height: 350, borderRadius:25, marginBottom:-50 }}
                                        />
                                    </TouchableOpacity>
                                </View>

                            </View>
                            
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'top',
                                    alignItems: 'center',
                                    width: 340,
                                    borderRadius: 30,
                                    paddingVertical: 12,
                                    marginRight: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    marginBottom:10
                                }}
                            >
                               
                               <Text style={{ color: 'white', fontSize: 50, fontWeight:'bold', marginBottom:30,marginTop:0, }}>Street 2</Text>
                               <View style={{ flexDirection: 'row', justifyContent: 'bottom' }}>
                                    <TouchableOpacity>
                                        <Image
                                        source={require('../../../assets/flood2.png')}
                                        style={{ width: 300, height: 350, borderRadius:25, marginBottom:-50 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                            
                            </View>
                            

                        </ScrollView>
                    </View>
                </SafeAreaView>
            </View>
    );
}
