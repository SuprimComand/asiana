import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface IExternalProps {
  customStyles?: { [key: string]: string | number };
  selected?: boolean;
}

interface IProps extends IExternalProps {}

const RadioButton:FC<IProps> = (props) => {
  return (
    <View style={[styles.button, props.customStyles]}>
      {
        props.selected ?
          <View style={styles.selectedIndicator}/>
          : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.green,
  }
});

export default RadioButton;