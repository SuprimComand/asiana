import React, { FC } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
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
      <TouchableOpacity onPress={onPressLeftAction}>
        {leftIcon}
      </TouchableOpacity>
      {content}
      <TouchableOpacity onPress={onPressRightAction}>
        {rightIcon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default HeaderProject;
