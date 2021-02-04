import React, { FC } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '../constants';
import handle from '../assets/handle.png';

interface IExternalProps {
  onCancel?: () => void;
  isVisible: boolean;
  swipeDirection?: 'down' | 'up';
}

interface IProps extends IExternalProps {}

const ModalComponent: FC<IProps> = ({
  onCancel,
  isVisible,
  swipeDirection,
  children,
}) => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  return (
    <Modal
      onSwipeComplete={onCancel}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      swipeDirection={swipeDirection || 'down'}
      isVisible={isVisible}
      style={styles.modal}
      customBackdrop={<View style={styles.customBackdrop} />}>
      <View style={styles.content}>
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
