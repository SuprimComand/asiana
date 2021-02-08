import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, Picker, Dimensions } from 'react-native';
import { COLORS } from '../constants';
// import Picker from '@react-native-community/picker';

interface DropDownItem {
  label: string;
  value: string | number;
}

interface IExternalProps {
  list: DropDownItem[];
  onSelect?: (value: string | number) => void;
  selectedValue?: string | number;
}

interface IProps extends IExternalProps {}

const Dropdown: FC<IProps> = ({ list, onSelect, selectedValue }) => {
  const [selected, setSelected] = useState<string | number | null>(
    selectedValue || null,
  );

  const handleSelect = (value: string | number) => {
    if (onSelect) {
      onSelect(value);
    }
    setSelected(value);
  };

  return (
    <View style={styles.viewStyle}>
      <View style={{ flex: 1 }}>
        <Picker
          itemStyle={styles.itemStyle}
          mode="dropdown"
          style={styles.pickerStyle}
          selectedValue={selected}
          onValueChange={handleSelect}>
          {list.map((item) => (
            <Picker.Item
              color={COLORS.gray}
              label={item.label}
              value={item.value}
              key={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    width: Dimensions.get('screen').width - 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.bgColorLight,
    minHeight: 48,
    paddingLeft: 10,
    borderRadius: 8,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
  },
  itemStyle: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: COLORS.lightGray,
    flexDirection: 'row',
  },
  pickerStyle: {
    width: '100%',
    minHeight: 40,
    color: COLORS.black,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
});

export default Dropdown;
