import React, { FC } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import smile from '../assets/smile.png';
import { COLORS } from '../constants';

interface IExternalProps {
  title: string;
}

interface IProps extends IExternalProps {}

const ErrorBoundry: FC<IProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={smile} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: COLORS.red,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightOrange,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
});

export default ErrorBoundry;
