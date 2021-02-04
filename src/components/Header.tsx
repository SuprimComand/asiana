import React, { FC } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';

interface IExternalProps {
  title: string;
}

interface IProps extends IExternalProps {}

const Header: FC<IProps> = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.orange,
    shadowColor: 'black',
    shadowOpacity: 0.9,
    elevation: 10,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
