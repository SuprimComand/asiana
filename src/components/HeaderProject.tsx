import React, { FC } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IExternalProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  content?: React.ReactNode;
  onPressLeftAction?: () => void;
  onPressRightAction?: () => void;
  customStyles?: { [key: string]: string | number };
}

interface IProps extends IExternalProps {}

const HeaderProject: FC<IProps> = ({
  leftIcon,
  rightIcon,
  content,
  onPressLeftAction,
  onPressRightAction,
  customStyles,
}) => {
  return (
    <View style={[styles.container, customStyles]}>
      {leftIcon && (
        <TouchableOpacity style={styles.button} onPress={onPressLeftAction}>
          {leftIcon}
        </TouchableOpacity>
      )}
      <View style={styles.content}>{content}</View>
      {rightIcon && (
        <TouchableOpacity style={styles.button} onPress={onPressRightAction}>
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('screen').width,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default HeaderProject;
