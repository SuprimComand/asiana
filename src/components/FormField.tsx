import React, { FC, useCallback } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, View, TextInput } from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import DatePicker from 'react-native-datepicker';
import { COLORS } from '../constants';
import Selecter, { SelecterItem } from './Selecter';

interface IExternalProps {
    editable?: boolean;
    onChange?: (event: string | number) => void;
    value?: string | Date;
    label?: string;
    placeholder?: string;
    type?: 'default' | 'number' | 'date' | 'selecter';
    customTextStyle?: { [key: string]: string | number };
    listSelecter?: SelecterItem[];
}

interface IProps extends IExternalProps {}

const FormField:FC<IProps> = ({ onChange, value, editable, label, placeholder, type, customTextStyle, listSelecter }) => {
    const handleChange = (value: string | number) => {
        if (onChange) onChange(value);
    }

    const renderInput = useCallback(() => {
        if (type === 'number') {
            return (
                <TextInputMask
                    keyboardType="number-pad"
                    style={styles.input}
                    value={String(value)}
                    onChangeText={handleChange}
                    mask={"+7 ([000]) [000] [00] [00]"}
                    placeholder="+7 (999) 999 99 99"
                />
            );
        }

        if (type === 'date') {
            return (
                <DatePicker
                    style={{ width: Dimensions.get('screen').width - 40 }}
                    date={value}
                    mode="date"
                    androidMode="spinner"
                    placeholder={placeholder}
                    format="YYYY-MM-DD"
                    // minDate="2016-05-01"
                    // maxDate="2016-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                    }}
                    onDateChange={handleChange}
                />
            )
        }

        if (type === 'selecter') {
            if (!listSelecter) {
                return null;
            }
            return <Selecter list={listSelecter} onChange={handleChange} />
        }

        return <TextInput value={String(value)} placeholder={placeholder} style={styles.input} onChangeText={handleChange} />;
    }, [value, listSelecter]);

    const render = useCallback(() => {
        if (editable) {
            return renderInput();
        }

        return <Text style={[styles.text, customTextStyle]}>{value}</Text>;
    }, [editable, renderInput]);

  return (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        {render()}
    </View>
  );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        width: '100%'
    },
    field: {
    },
    input: {
        borderBottomWidth: 2,
        padding: 10,
        borderColor: COLORS.lightGray,
        width: Dimensions.get('screen').width - 40,
        maxHeight: 40,
        fontSize: 18
    },
    text: {
        fontSize: 18,
        width: '100%'
    }
});

export default FormField;