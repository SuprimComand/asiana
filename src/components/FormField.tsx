import React, { FC, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  ColorValue,
} from 'react-native';
import * as ReactNative from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import DatePicker from 'react-native-datepicker';
import { COLORS } from '../constants';
import Selecter, { SelecterItem } from './Selecter';

interface IExternalProps {
  editable?: boolean;
  onChange?: (event: any, value2?: any) => void;
  value?: string | Date;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'date' | 'selecter';
  customTextStyle?: { [key: string]: string | number };
  listSelecter?: SelecterItem[];
  customStyles?: { [key: string]: string | number };
  autoFocus?: boolean;
  keyboardType?: ReactNative.KeyboardTypeOptions;
  maxLength?: number;
  mask?: string;
  multiline?: boolean;
  numberOfLines?: number;
  underlineColorAndroid?: ColorValue;
}

interface IProps extends IExternalProps {}

const FormField: FC<IProps> = ({
  customStyles,
  onChange,
  value,
  editable,
  label,
  placeholder,
  type,
  customTextStyle,
  listSelecter,
  autoFocus,
  ...props
}) => {
  const handleChange = (value: any, value2?: any) => {
    if (onChange) onChange(value, value2);
  };

  const renderInput = useCallback(() => {
    if (type === 'number') {
      return (
        <TextInputMask
          keyboardType="number-pad"
          style={[styles.input, styles.inputField]}
          value={String(value || '')}
          onChangeText={handleChange}
          mask={'+7 ([000]) [000] [00] [00]'}
          placeholder="+7 (___) ___ __ __"
          autoFocus={autoFocus}
          {...props}
        />
      );
    }

    if (type === 'date') {
      return (
        <DatePicker
          style={[styles.input, styles.inputField]}
          date={value}
          mode="date"
          androidMode="spinner"
          placeholder={placeholder}
          format="YYYY.MM.DD"
          // minDate="2016-05-01"
          // maxDate="2016-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              right: 0,
              top: -3,
              marginLeft: 0,
            },
            dateInput: {
              width: '100%',
              marginTop: -15,
              alignItems: 'flex-start',
              marginLeft: -5,
              borderColor: COLORS.transparent,
            },
            dateText: {
              fontSize: 18,
            },
          }}
          onDateChange={handleChange}
          {...props}
        />
      );
    }

    if (type === 'selecter') {
      if (!listSelecter) {
        return null;
      }
      return <Selecter list={listSelecter} onChange={handleChange} />;
    }
    if (type === 'text') {
      return (
        <TextInput
          style={styles.input}
          value={String(value || '')}
          onChangeText={handleChange}
          autoFocus={autoFocus}
          placeholder={placeholder}
          {...props}
        />
      );
    }

    return (
      <TextInputMask
        style={[styles.input, styles.inputField]}
        value={String(value || '')}
        onChangeText={handleChange}
        autoFocus={autoFocus}
        {...props}
      />
    );
  }, [value, listSelecter, handleChange]);

  const render = useCallback(() => {
    if (editable) {
      return renderInput();
    }

    return <Text style={[styles.text, customTextStyle]}>{value}</Text>;
  }, [editable, renderInput]);

  return (
    <View style={[styles.field, customStyles]}>
      <Text style={styles.label}>{label}</Text>
      {render()}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    width: '100%',
  },
  field: {},
  inputField: {
    maxHeight: 50,
  },
  input: {
    width: Dimensions.get('screen').width - 40,
    minHeight: 50,
    fontSize: 18,
    marginBottom: 5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: COLORS.bgColorLight,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingLeft: 20,
  },
  text: {
    fontSize: 18,
    width: '100%',
  },
});

export default FormField;
