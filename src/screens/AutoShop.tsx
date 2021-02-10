import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, { Marker } from 'react-native-maps';
import HeaderProject from '../components/HeaderProject';
import { COLORS } from '../constants';
import Modal from '../components/Modal';
import iconMarker from '../assets/autoshop.png';
import { useQuery } from '@apollo/client';
import { GET_ADDRESSES } from '../graph/queries/getAddresses';
import { AddressType } from '../typings/graphql';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const AutoShop: FC<IProps> = () => {
  const navigation = useNavigation();
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const { data: addressesData } = useQuery(GET_ADDRESSES, {
    variables: {
      addressType: 'Магазин',
    },
  });
  const addresses: AddressType[] = addressesData?.addresses || [];

  const onGoBach = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleClickMarker = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleCancel = useCallback(() => {
    setOpenModal(false);
  }, []);

  const renderMarkers = useCallback(() => {
    return addresses.map((item) => {
      const coordinates = item.coordinates.split(',');
      return (
        <Marker
          key={item.id}
          onPress={handleClickMarker}
          image={iconMarker}
          coordinate={{
            latitude: Number(coordinates[0]),
            longitude: Number(coordinates[1]),
          }}
        />
      );
    });
  }, [addresses]);

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        onPressLeftAction={onGoBach}
        content={<Text style={styles.title}>Магазины</Text>}
      />
      <View style={styles.content}>
        <MapView
          style={styles.map}
          region={{
            latitude: 59,
            longitude: 30,
            latitudeDelta: 3,
            longitudeDelta: 2,
          }}>
          {renderMarkers()}
        </MapView>
      </View>
      <Modal
        defaultHeight="70%"
        isVisible={isOpenModal}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  map: {
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default AutoShop;
