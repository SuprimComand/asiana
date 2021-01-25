import React, { FC } from 'react';
import { View, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import AuthProvider from '../providers/AuthProvider';
import Loader from '../components/Loader';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Starter:FC<IProps> = () => {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <ImageBackground style={styles.image} source={require('../assets/logotype-bg.png')}>
          <View style={styles.content}>
            <Loader type="black" label="Loading.." />
          </View>
        </ImageBackground>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 30,
  },
  loader: {
    width: 30,
    height: 30
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