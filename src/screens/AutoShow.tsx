import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, { Marker, Polyline } from 'react-native-maps';
import HeaderProject from '../components/HeaderProject';
import { COLORS } from '../constants';
import Modal from '../components/Modal';
import iconMarker from '../assets/autoshow.png';
import { GET_ADDRESSES } from '../graph/queries/getAddresses';
import { useQuery } from '@apollo/client';
import { AddressType } from '../typings/graphql';
import navigator from '@react-native-community/geolocation';
import { NotifierRoot } from 'react-native-notifier';
import Geolocation from 'react-native-geolocation-service';
import AddressModalContent from '../components/AddressModalContent';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const AutoShow: FC<IProps> = () => {
  const navigation = useNavigation();
  const [address, setAddress] = useState<any>(null);
  const [toDrawCoordinates, setDrawCoordinates] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [addressesData, setAddresses] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const addresses = Array.isArray(addressesData?.data)
    ? addressesData.data
    : [];
  const notifier = useRef<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch(
      'https://test-rest-api.site/api/1/mobile/location/list/?token=b4831f21df6202f5bacade4b7bbc3e5c&location_type=dealer',
    )
      .then((response) => response.json())
      .then((data) => setAddresses(data))
      .finally(() => setLoading(false));
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  };

  const getCurrentPosition = useCallback(() => {
    requestPermissions().then(() => {
      navigator.getCurrentPosition(
        (position) => {
          setCurrentPosition(position.coords);
        },
        (err) => {
          if (err.PERMISSION_DENIED === 1) {
            notifier.current?.showNotification({
              title: 'Нет доступа к геолокации',
            });
            return;
          }
        },
      );
    });
  }, []);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const handleClickDrawCoordinates = useCallback(() => {
    setDrawCoordinates(true);
    handleCancel();
  }, [setDrawCoordinates]);

  const onGoBach = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleClickMarker = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleCancel = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleSelectAddress = useCallback(
    (address: AddressType) => {
      return () => {
        setAddress(address);
        handleClickMarker();
      };
    },
    [address],
  );

  const renderMarkers = useCallback(() => {
    return addresses?.map(({ Location: item }: any) => {
      return (
        <Marker
          key={item.id}
          onPress={handleSelectAddress(item)}
          image={iconMarker}
          coordinate={{
            latitude: Number(item.lat),
            longitude: Number(item.lon),
          }}
        />
      );
    });
  }, [addresses]);

  const addressCoordinates = address?.Location
    ? [Number(address.Location.lat), Number(address.Location.lon)]
    : [];

  const handleSubmit = useCallback(() => {
    if (!address) {
      return;
    }
    navigation.navigate('EntrySto', { addressId: address?.id });
  }, [address]);

  return (
    <View style={styles.container}>
      <NotifierRoot ref={notifier} />
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        onPressLeftAction={onGoBach}
        content={<Text style={styles.title}>Автосалоны</Text>}
      />
      <View style={styles.content}>
        <MapView
          style={styles.map}
          region={{
            latitude: 60,
            longitude: 30.4,
            latitudeDelta: 0,
            longitudeDelta: 0.6,
          }}>
          {renderMarkers()}
          {currentPosition && toDrawCoordinates && (
            <Polyline
              strokeWidth={6}
              strokeColor={COLORS.primary}
              coordinates={[
                {
                  latitude: currentPosition.latitude,
                  longitude: currentPosition.longitude,
                },
                {
                  latitude: Number(addressCoordinates[0]) || 0,
                  longitude: Number(addressCoordinates[1]) || 0,
                },
              ]}
            />
          )}
        </MapView>
      </View>
      <Modal
        defaultHeight="70%"
        isVisible={isOpenModal}
        onCancel={handleCancel}>
        <AddressModalContent
          onPressSend={handleClickDrawCoordinates}
          address={address}
          onSubmit={handleSubmit}
        />
      </Modal>
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

export default AutoShow;
