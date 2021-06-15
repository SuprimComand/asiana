import React, { FC, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../constants';

export interface IStockType {
  title: string;
  content: string;
  preview: string;
  id: number;
  image_url: string;
  item: any;
}

interface IExternalProps extends IStockType {
  onPress?: (id: number) => void;
  customStyles?: { [key: string]: string | number };
}

interface IProps extends IExternalProps {}

const CardStock: FC<IProps> = ({
  title,
  preview,
  id,
  onPress,
  image_url,
  customStyles,
  item,
}) => {
  const handleClick = useCallback(() => {
    if (onPress) {
      onPress(id);
    }
  }, [id, onPress]);

  return (
    <TouchableOpacity
      style={customStyles}
      onPress={handleClick}
      activeOpacity={0.8}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: item.image_url?.includes('http://')
              ? item.image_url
              : `http://${item.image_url}`,
          }}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text>{preview}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: COLORS.lightGray,
    borderBottomColor: COLORS['gray-200'],
    borderBottomWidth: 4,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  image: {
    height: 200,
    width: '100%',
  },
  content: {
    padding: 15,
  },
});

export default CardStock;
