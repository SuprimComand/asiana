import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface IExternalProps {
  customStyles?: { [key: string]: string | number };
}

interface IProps extends IExternalProps {}

const Card: FC<IProps> = ({ children, customStyles }) => {
  return <View style={[styles.card, customStyles]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGray,
    borderBottomColor: COLORS['gray-200'],
    borderBottomWidth: 4,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default Card;
