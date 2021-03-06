import React, { FC } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '../constants';
import handle from '../assets/handle.png';

interface IExternalProps {
  onCancel?: () => void;
  isVisible: boolean;
  swipeDirection?: 'down' | 'up';
  defaultHeight?: string | number;
  onSwipeComplete?: () => void;
}

interface IProps extends IExternalProps {}

const ModalComponent: FC<IProps> = ({
  onCancel,
  isVisible,
  swipeDirection,
  children,
  defaultHeight,
}) => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const style = { height: defaultHeight };

  return (
    <Modal
      onBackdropPress={onCancel}
      onSwipeComplete={onCancel}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      swipeDirection={swipeDirection || 'down'}
      isVisible={isVisible}
      style={styles.modal}
      customBackdrop={
        <TouchableOpacity
          activeOpacity={1}
          onPress={onCancel}
          style={styles.customBackdrop}
        />
      }>
      <View style={[styles.content, style]}>
        <View style={styles.header}>
          <Image source={handle} />
        </View>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  content: {
    height: '40%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: COLORS.white,
    padding: 15,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  customBackdrop: {
    flex: 1,
    backgroundColor: COLORS.bgModal,
  },
});

export default ModalComponent;
