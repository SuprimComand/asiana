import CheckBox from '@react-native-community/checkbox';
import React, { FC, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface IExternalProps {
  title: string;
  checked?: boolean;
  id: number;
  index: number;
  onSelect?: (id: number) => void;
}

interface IProps extends IExternalProps {}

const AutoItem: FC<IProps> = ({ title, checked, index, onSelect, id }) => {
  const [isSelected, setSelected] = useState(checked);

  const handlePress = useCallback(() => {
    setSelected(!isSelected);
    if (onSelect) {
      onSelect(id);
    }
  }, [isSelected]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[styles.container, { borderTopWidth: index && 1 }]}>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <CheckBox
          value={isSelected}
          onValueChange={setSelected}
          style={styles.checkbox}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    paddingVertical: 10,
  },
  checkbox: {
    alignSelf: 'center',
  },
  title: {
    color: COLORS.gray,
    fontSize: 18,
  },
});

export default AutoItem;
