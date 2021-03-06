import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren, useEffect } from 'react';
import { Text, View } from 'react-native';

interface IProps {}

const AuthProvider = ({ children }: PropsWithChildren<IProps>) => {
  const navigation = useNavigation();

  const handleCheckToken = async () => {
    const user = await AsyncStorage.getItem('userData');
    if (user) {
      navigation.navigate('Project');
    } else {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    setTimeout(handleCheckToken, 3000);
  }, []);

  return (
    children || (
      <View>
        <Text>Error..</Text>
      </View>
    )
  );
};

export default AuthProvider;
