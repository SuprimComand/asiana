import React, { FC, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { CarType } from '../typings/graphql';

interface IExternalProps {
  onPress?: (id: CarType['id']) => void;
}

interface IProps extends IExternalProps, CarType {}

const CarItem: FC<IProps> = ({ model, complectation, id, onPress }) => {
  const handleClick = useCallback(() => {
    if (onPress) {
      onPress(id);
    }
  }, [id, onPress]);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.button}
      onPress={handleClick}>
      <Text style={styles.title}>{model}</Text>
      <Text style={styles.subTitle}>{complectation}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  subTitle: {
    color: COLORS['gray-200'],
  },
});

export default CarItem;
