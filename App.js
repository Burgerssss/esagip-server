import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes'; // Import the Routes component

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}
