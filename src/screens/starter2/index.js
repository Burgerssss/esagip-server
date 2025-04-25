import React from 'react';
import { View, Text, Image, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

export default function Starter({navigation}) {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="light" />
      <Image style={{ position: 'absolute', height: '100%', width: '100%' }} source={require('../../../assets/bg02.jpg')} />

      {/* Your UI components here */}
      {/* lights */}
      <View style={{ bottom:100, marginTop:200, marginBottom:-350, flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={require('../../../assets/logo1.png')}
                                style={{ width: 300, height: 300 }}
                            />
      </View>
 
      {/* title and form */}
      <View style={{ flex: 1, justifyContent: 'center', paddingTop: 40, paddingBottom: 10, marginTop: 50, }}>

        {/* title */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 35,  fontFamily:"serif", fontWeight: 'bold', letterSpacing: 2 }}>
            Sign Up
          </Text>
        </View>

        {/* form */}
        
          
          <View style={{ marginTop:20, flexDirection:'row', justifyContent:'center'  }}>
            <Text style={{ fontSize: 10, fontFamily:"serif", fontWeight: 'bold', color:'white', marginRight:5}}>
                    Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Starter")}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0)', padding: 0, borderRadius: 10, marginBottom: 3 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'darkblue', textAlign: 'center' }}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    
  );
}
