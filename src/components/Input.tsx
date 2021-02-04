import React, { FC } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface IExternalProps {
  icon?: React.ReactNode;
  onChange?: (event: string) => void;
  placeholder?: string;
  value?: string;
  customStyles?: { [key: string]: string | number };
}

interface IProps extends IExternalProps {}

const Input: FC<IProps> = ({
  icon,
  onChange,
  placeholder,
  value,
  customStyles,
}) => {
  const inputStyle = icon ? { marginLeft: 10 } : {};

  return (
    <View style={[styles.container, customStyles]}>
      {icon}
      <TextInput
        style={[styles.input, inputStyle]}
        onChangeText={onChange}
        placeholder={placeholder}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: COLORS['gray-200'],
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});

export default Input;
