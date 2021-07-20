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
  textContentType?: any;
  editable?: boolean;
  onChange?: (event: any, value2?: any) => void;
  value?: string | Date;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'date' | 'selecter';
  customTextStyle?: { [key: string]: string | number };
  listSelecter?: SelecterItem[];
  customStyles?: { [key: string]: string | number };
  style?: { [key: string]: string | number };
  autoFocus?: boolean;
  keyboardType?: ReactNative.KeyboardTypeOptions;
  maxLength?: number;
  mask?: string;
  dateFormat?: string;
  multiline?: boolean;
  numberOfLines?: number;
  underlineColorAndroid?: ColorValue;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyPress?: (e: any) => void;
  onSubmitEditing?: () => void;
  labelStyles?: any;
}

interface IProps extends IExternalProps {}

const FormField: FC<IProps> = ({
  customStyles,
  onChange,
  dateFormat,
  value,
  editable,
  label,
  placeholder,
  type,
  customTextStyle,
  listSelecter,
  autoFocus,
  style,
  labelStyles,
  onKeyPress,
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
          style={[styles.input, styles.inputField, customStyles, style]}
          value={String(value || '')}
          onChangeText={handleChange}
          mask={'[000]) [000] [00] [00]'}
          placeholder="___) ___ __ __"
          autoFocus={autoFocus}
          onKeyPress={onKeyPress}
          {...props}
        />
      );
    }

    if (type === 'date') {
      return (
        <>
          {/* <Text style={styles.titleMin}>Выбрать желаемое время и дату</Text> */}
          <DatePicker
            style={[styles.input, styles.inputField, customStyles, style]}
            date={value}
            mode="date"
            androidMode="spinner"
            placeholder={placeholder}
            format={dateFormat || 'YYYY.MM.DD'}
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
            onKeyPress={onKeyPress}
            {...props}
          />
        </>
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
          onKeyPress={onKeyPress}
          {...props}
        />
      );
    }

    return (
      <TextInputMask
        textContentType="oneTimeCode"
        style={[styles.input, styles.inputField, customStyles, style]}
        value={String(value || '')}
        onChangeText={handleChange}
        autoFocus={autoFocus}
        onKeyPress={onKeyPress}
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
      <Text style={[styles.titleMin, labelStyles]}>{label}</Text>
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
    // marginBottom: 5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: COLORS.bgColorLight,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingLeft: 20,
  },
  titleMin: {
    fontSize: 16,
    // marginBottom: 4,
    fontWeight: 'bold',
    fontFamily: 'gothammedium.ttf',
    paddingLeft: 25,
  },
  text: {
    fontSize: 18,
    width: '100%',
  },
});

export default FormField;
