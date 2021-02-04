/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants';
import User from '../screens/User';
import Main from '../screens/Main';
import EtrySto from '../screens/EntrySto';
import Stocks from '../screens/Stocks';
import { useAsyncStorage } from '../hooks/asyncStorage';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILES } from '../graph/queries/getProfiles';
import Loader from '../components/Loader';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const [userId] = useAsyncStorage('userId');

  const { data, loading } = useQuery(GET_USER_PROFILES, {
    variables: { userId: Number(userId) },
    skip: !userId,
  });

  useEffect(() => {
    if (data && data.profiles?.length) {
      AsyncStorage.setItem('profileId', data.profiles[0].id);
    }
  }, [data]);

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <Loader size={50} />
      </View>
    );
  }

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

          if (route.name === 'EntrySto') {
            iconName = 'plus';
          }

          if (route.name === 'Stocks') {
            iconName = 'pay-circle-o1';
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
      sceneContainerStyle={{ borderColor: COLORS.gray, borderTopWidth: 2 }}>
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="EntrySto" component={EtrySto} />
      <Tab.Screen name="User" component={User} />
      <Tab.Screen name="Stocks" component={Stocks} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabNavigation;
