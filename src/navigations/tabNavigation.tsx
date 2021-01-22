/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants';
import User from '../screens/User';
import Main from '../screens/Main';
import MyAuto from '../screens/MyAuto';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ color, size }: any) => {
          let iconName = '';

          if (route.name === 'Main') {
            iconName = 'home';
          }

          if (route.name === 'User') {
            iconName = 'user';
          }

          if (route.name === 'MyAuto') {
            iconName = 'auto';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: COLORS.orange,
        inactiveTintColor: COLORS.gray,
        showLabel: false,
        activeBackgroundColor: COLORS.white,
        inactiveBackgroundColor: COLORS.white,
      }}
      sceneContainerStyle={{ borderColor: COLORS.gray, borderTopWidth: 2 }}
    >
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="MyAuto" component={MyAuto} />
      <Tab.Screen name="User" component={User} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
