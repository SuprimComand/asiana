import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Dimensions } from 'react-native';
// import Loader from '../components/Loader';
import AuthProvider from '../providers/AuthProvider';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Starter:FC<IProps> = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      // navigation.navigate('Login');
    }, 2000);
  }, [navigation]);

  return (
    <AuthProvider>
      <View style={styles.container}>
        <ImageBackground style={styles.image} source={require('../assets/logotype-bg-transform.jpg')}>
          {/* <View style={styles.content}>
            <Loader type="black" label="Загрузка.." />
          </View> */}
        </ImageBackground>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 50,
  },
  image: {
    height: '100%',
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});

export default Starter;