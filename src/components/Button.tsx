import React, { FC } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants';

interface IExternalProps {
  color?: string;
  bgColor?: string;
  onClick?: () => void;
  customStyles?: { [key: string]: any };
  label?: any;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

interface IProps extends IExternalProps {}

const Button: FC<IProps> = ({
  onClick,
  label,
  bgColor,
  color,
  disabled,
  customStyles,
  loading,
  icon,
}) => {
  const colorDisabled = disabled && COLORS.lightOrange;
  const backgroundColor =
    colorDisabled || bgColor || styles.button.backgroundColor;
  const style = { backgroundColor };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        style,
        customStyles,
        { flexDirection: loading ? 'row' : 'column' },
      ]}
      onPress={onClick}>
      {Boolean(label) ? (
        <Text
          style={[
            styles.label,
            {
              color: color || styles.label.color,
              marginRight: loading ? 10 : 0,
            },
          ]}>
          {String(label)}
        </Text>
      ) : null}
      {Boolean(icon) && !loading && icon}
      {Boolean(loading) && <ActivityIndicator color={COLORS.white} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.orange,
    width: Dimensions.get('screen').width - 40,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    height: 50,
  },
  label: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Button;
