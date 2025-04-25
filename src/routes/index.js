import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all the screens
import Starter from '../screens/starter/index';
import Starter2 from '../screens/starter2/index';
import UserSignIn from '../screens/starter/UserSignIn';
import SignUp from '../screens/starter/SignUp';
import RescuerScreen from '../screens/starter/RescuerScreen';
import Dashboard from '../screens/DashboardUser/index';
import Dashboard2 from '../screens/DashboardGuest/index';
import Dashboard3 from '../screens/DashboardRescuer/index';
import Map from '../screens/map/index';
import Param from '../screens/param/index';
import Param2 from '../screens/param2/index';
import Alerts from '../screens/alerts/index';
import Alerts2 from '../screens/alerts2/index';
import Cam1 from '../screens/cam1/index';
import Cam2 from '../screens/cam2/index';
import Flood from '../screens/flood/index';
import Flood1 from '../screens/flood1/index';
import Flood2 from '../screens/flood2/index';
import Flood3 from '../screens/Flood3(Guest)/index';
import Flood4 from '../screens/Flood4(Guest)/index';
import BookMeUser from '../screens/BookMeUser/index';
import BookMeRescuer from '../screens/BookMeRescuer/index';
import Profile from '../screens/profileuser/index';
import ChatScreen from '../screens/Chatbox/index';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator initialRouteName="Starter">
      {/* Starter Screen */}
      <Stack.Screen
        name="Starter"
        component={Starter}
        options={{ headerShown: false }}
      />

       <Stack.Screen
        name="Starter2"
        component={Starter2}
        options={{ headerShown: false }}
      />

      {/* User Sign-In Screen */}
      <Stack.Screen
        name="UserSignIn"
        component={UserSignIn}
        options={{ headerShown: false }}
      />

      {/* Sign-Up Screen */}
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />

      {/* Rescuer Screen */}
      <Stack.Screen
        name="RescuerScreen"
        component={RescuerScreen}
        options={{ headerShown: false }}
      />

      {/* Dashboard Screen */}
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />

      {/* Dashboard2 Screen */}
      <Stack.Screen
        name="Dashboard2"
        component={Dashboard2}
        options={{ headerShown: false }}
      />

      {/* Dashboard3 Screen */}
      <Stack.Screen
        name="Dashboard3"
        component={Dashboard3}
        options={{ headerShown: false }}
      />

      {/* Map Screen */}
      <Stack.Screen
        name="Map"
        component={Map}
        options={{ headerShown: false }}
      />

      {/* Flood Screen */}
      <Stack.Screen
        name="Flood"
        component={Flood}
        options={{ headerShown: false }}
      />

      {/* Alerts Screen */}
      <Stack.Screen
        name="Alerts"
        component={Alerts}
        options={{ headerShown: false }}
      />

      {/* Alerts Screen2 */}
      <Stack.Screen
        name="Alerts2"
        component={Alerts2}
        options={{ headerShown: false }}
      />

      {/* Param */}
      <Stack.Screen
        name="Param"
        component={Param}
        options={{ headerShown: false }}
      />

      {/* Param2 */}
      <Stack.Screen
        name="Param2"
        component={Param2}
        options={{ headerShown: false }}
      />

       {/* Cam1 */}
      <Stack.Screen
        name="Cam1"
        component={Cam1}
        options={{ headerShown: false }}
      />

       {/* Cam2 */}
      <Stack.Screen
        name="Cam2"
        component={Cam2}
        options={{ headerShown: false }}
      />

      
       {/* Flood1 */}
      <Stack.Screen
        name="Flood1"
        component={Flood1}
        options={{ headerShown: false }}
      />

       {/* Flood2 */}
      <Stack.Screen
        name="Flood2"
        component={Flood2}
        options={{ headerShown: false }}
      />

        {/* Flood2 */}
        <Stack.Screen
        name="Flood3"
        component={Flood3}
        options={{ headerShown: false }}
      />

      {/* Flood2 */}
      <Stack.Screen
        name="Flood4"
        component={Flood4}
        options={{ headerShown: false }}
      />

        {/* BookMe */}
      <Stack.Screen
        name="BookMeUser"
        component={BookMeUser}
        options={{ headerShown: false }}
      />

        {/* BookMe1 */}
      <Stack.Screen
        name="BookMeRescuer"
        component={BookMeRescuer}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Routes;
