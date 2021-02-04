import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Starter from '../screens/Starter';
import Login from '../screens/Login';
import SmsCodeNotification from '../screens/SmsCodeNotification';
import AddAuto from '../screens/AddAuto';
import Stock from '../screens/Stock';
import HistoryMaintenance from '../screens/HistoryMaintenance';
import TabNavigation from './tabNavigation';

const Stack = createStackNavigator();

function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Starter" component={Starter} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="SmsCodeNotification"
        component={SmsCodeNotification}
      />
      <Stack.Screen name="Project" component={TabNavigation} />
      <Stack.Screen name="AddAuto" component={AddAuto} />
      <Stack.Screen name="StockDetails" component={Stock} />
      <Stack.Screen name="HistoryMaintenance" component={HistoryMaintenance} />
    </Stack.Navigator>
  );
}

export default StackNavigation;
