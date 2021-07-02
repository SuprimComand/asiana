import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants';
import { AddressType } from '../typings/graphql';
import Button from './Button';

interface IExternalProps {
  address?: any | null;
  onPressSend?: () => void;
  onSubmit?: (address?: AddressType | null) => void;
  hideButton?: boolean;
}

interface IProps extends IExternalProps {}

const AddressModalContent: FC<IProps> = ({
  address,
  onPressSend,
  onSubmit,
  hideButton,
}) => {
  return (
    <View style={styles.modal}>
      <View style={styles.contentModal}>
        <View>
          <View style={[styles.field, styles.flex]}>
            <View style={styles.address}>
              <Text style={styles.label}>Адрес</Text>
              <Text style={styles.value}>
                {address?.Location?.address || 'Нет адреса'}
              </Text>
            </View>
            <TouchableOpacity onPress={onPressSend} style={styles.sendButton}>
              <Image source={require('../assets/send.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Телефон</Text>
            <Text style={styles.value}>
              {address?.Location?.phones || 'Нет телефона'}
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Часы работы</Text>
            <Text style={styles.value}>{address?.workTime}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>
              {address?.Location?.email || 'Нет имейла'}
            </Text>
          </View>
        </View>
      </View>
      {!hideButton && <Button onClick={onSubmit} label="Записаться в СТО" />}
    </View>
  );
};

const styles = StyleSheet.create({
  address: {
    paddingRight: 30,
  },
  modal: {
    paddingBottom: 10,
    flex: 1,
  },
  sendButton: {},
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  field: {
    marginBottom: 30,
  },
  contentModal: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  label: {
    color: COLORS.gray,
    marginBottom: 5,
  },
  value: {
    color: COLORS['gray-200'],
  },
});

export default AddressModalContent;
