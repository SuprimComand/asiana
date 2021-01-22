import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import loader from '../assets/loading.gif';
import blackLoader from '../assets/loading-black.gif';
import { COLORS } from '../constants';

interface IExternalProps {
  type?: 'black',
  label?: string;
}

interface IProps extends IExternalProps {}

const Loader:FC<IProps> = ({ type, label }) => {
  const loaderBlack = type === 'black' && blackLoader;
  const color = loaderBlack ? COLORS.black : COLORS.orange;

  return (
    <View style={styles.container}>
      <Image style={styles.loader} source={loaderBlack || loader} />
      {label && <Text style={[styles.title, { color }]}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    marginTop: 5
  },
  loader: {
    width: 30,
    height: 30
  },
})

export default Loader;