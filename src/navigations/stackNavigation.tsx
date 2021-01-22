import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Starter from '../screens/Starter';
import Login from '../screens/Login';
import SmsCodeNotification from '../screens/SmsCodeNotification';
import TabNavigation from './tabNavigation';


const Stack = createStackNavigator();

function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Starter" component={Starter} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SmsCodeNotification" component={SmsCodeNotification} />
      <Stack.Screen name="Project" component={TabNavigation} />
    </Stack.Navigator>
  );
}

export default StackNavigation;
