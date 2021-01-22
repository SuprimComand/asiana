import React, { FC } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants';

interface IExternalProps {
  color?: string;
  bgColor?: string,
  onClick: () => void;
  customStyles?: { [key: string]: any };
  label: string;
  disabled?: boolean;
  loading?: boolean;
}

interface IProps extends IExternalProps {}

const Button:FC<IProps> = ({ onClick, label, bgColor, color, disabled, customStyles, loading }) => {
  const colorDisabled = disabled && COLORS.lightGray;
  const backgroundColor = colorDisabled || bgColor || styles.button.backgroundColor;
  const style = { backgroundColor };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, style, customStyles, { flexDirection: loading ? 'row' : 'column' }]}
      onPress={onClick}
    >
      <Text style={[styles.label, { color: color || styles.label.color, marginRight: loading ? 10 : 0 }]}>
        {label}
      </Text>
      {loading && <ActivityIndicator color={COLORS.white}/>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.orange,
    width: Dimensions.get('screen').width - 40,
    padding: 10,
    borderRadius: 16,
    justifyContent: 'center',
    height: 50
  },
  label: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 18
  }
});

export default Button;