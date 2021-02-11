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
import iconMarker from '../assets/autoservice.png';
import { useQuery } from '@apollo/client';
import { GET_ADDRESSES } from '../graph/queries/getAddresses';
import { AddressType } from '../typings/graphql';
import AddressModalContent from '../components/AddressModalContent';
import navigator from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import { NotifierRoot } from 'react-native-notifier';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const AutoService: FC<IProps> = () => {
  const navigation = useNavigation();
  const [toDrawCoordinates, setDrawCoordinates] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [address, setAddress] = useState<AddressType | null>(null);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const { data: addressesData } = useQuery(GET_ADDRESSES, {
    variables: {
      addressType: 'СТО',
    },
  });
  const addresses: AddressType[] = addressesData?.addresses || [];
  const notifier = useRef<any>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        console.log(auth);
      }
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if ('granted' === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(PermissionsAndroid.RESULTS.GRANTED);
      }
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
    return addresses.map((item) => {
      const coordinates = item.coordinates.split(',');
      return (
        <Marker
          key={item.id}
          onPress={handleSelectAddress(item)}
          image={iconMarker}
          coordinate={{
            latitude: Number(coordinates[0]),
            longitude: Number(coordinates[1]),
          }}
        />
      );
    });
  }, [addresses]);

  const handleClickDrawCoordinates = useCallback(() => {
    setDrawCoordinates(true);
    handleCancel();
  }, [setDrawCoordinates]);

  const addressCoordinates = address?.coordinates.split(',') || [];

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
        content={<Text style={styles.title}>Автосервисы</Text>}
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

export default AutoService;
