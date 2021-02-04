import React, { FC, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RadioButton from './RadioButton';

export interface SelecterItem {
  label: string;
  checked?: boolean;
  id: number | string;
}

interface IExternalProps {
  list: Array<SelecterItem>;
  onChange?: (id: number | string) => void;
}

interface IProps extends IExternalProps {}

const Selecter: FC<IProps> = ({ list, onChange }) => {
  const handleChange = (id: number | string) => () => {
    if (!onChange) {
      return;
    }
    onChange(id);
  };

  const renderItems = useCallback(() => {
    return list.map((item) => (
      <View key={item.id}>
        <TouchableOpacity style={styles.button} onPress={handleChange(item.id)}>
          <View>
            <Text>{item.label}</Text>
          </View>
          <RadioButton selected={item.checked} />
        </TouchableOpacity>
      </View>
    ));
  }, [list]);

  return <View style={styles.container}>{renderItems()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width - 40,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
  },
});

export default Selecter;
