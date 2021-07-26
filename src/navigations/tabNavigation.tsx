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
import Contacts from '../screens/Contacts';
import { useAsyncStorage } from '../hooks/asyncStorage';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILES } from '../graph/queries/getProfiles';
import Loader from '../components/Loader';
// import Feedback from '../screens/Feedback';
import { Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import build from '../assets/footer-icons/build.png';
import drive from '../assets/footer-icons/drive_eta.png';
import forum from '../assets/footer-icons/forum.png';
import pin_drop from '../assets/footer-icons/pin_drop.png';
import portrait from '../assets/footer-icons/portrait.png';
import whatshot from '../assets/footer-icons/whatshot.png';
import { Notification } from '../../App';

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
    <>
      <Notification />
      <Tab.Navigator
        screenOptions={({ route }: any) => ({
          tabBarIcon: ({ color, size }: any) => {
            let iconName = null;

            if (route.name === 'Main') {
              iconName = drive;
            }

            if (route.name === 'User') {
              iconName = portrait;
            }

            if (route.name === 'EntrySto') {
              iconName = build;
            }

            if (route.name === 'Stocks') {
              iconName = whatshot;
            }

            if (route.name === 'Feedback') {
              iconName = forum;
            }

            if (route.name === 'Contacts') {
              iconName = pin_drop;
            }

            return (
              <Image style={{ width: 30, height: 30 }} source={iconName} />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: COLORS.orange,
          inactiveTintColor: COLORS.gray,
          showLabel: false,
          activeBackgroundColor: COLORS.bgColorLight,
          inactiveBackgroundColor: COLORS.white,
        }}
        sceneContainerStyle={{ borderColor: COLORS.gray, borderTopWidth: 2 }}>
        <Tab.Screen name="Main" component={Main} />
        <Tab.Screen name="User" component={User} />
        <Tab.Screen name="Stocks" component={Stocks} />
        <Tab.Screen name="EntrySto" component={EtrySto} />
        {/* <Tab.Screen name="Feedback" component={Feedback} /> */}
        <Tab.Screen name="Contacts" component={Contacts} />
      </Tab.Navigator>
    </>
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
