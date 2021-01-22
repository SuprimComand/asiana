import React, { FC, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import HeaderProject from '../components/HeaderProject';
import UserSvg from '../assets/icons/User';
import NotificationSvg from '../assets/icons/Notification';
import logo from '../assets/asiana-logotype.png';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Main:FC<IProps> = () => {
  const navigation = useNavigation();

  const handleLeftActionClick = useCallback(() => {
    navigation.navigate('User');
  }, []);

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<UserSvg />}
        rightIcon={<NotificationSvg />}
        onPressLeftAction={handleLeftActionClick}
        content={<Image source={logo} />}
      />
      <Text>
        Main
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40
  },
  logo: {
  }
});

export default Main;