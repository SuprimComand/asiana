import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderProject from '../components/HeaderProject';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../constants';
import FormField from '../components/FormField';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useAsyncStorage } from '../hooks/asyncStorage';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_REQUEST_STO } from '../graph/mutations/createRequestSto';
import { NotifierRoot } from 'react-native-notifier';
import { AddressType, ProfileCarType } from '../typings/graphql';
import { GET_ADDRESSES } from '../graph/queries/getAddresses';
import { GET_PROFILE_CAR } from '../graph/queries/getProfileCar';
import Loader from '../components/Loader';
import { ProfileCarMock } from '../typings/profileCarMock';

interface IExternalProps {
  route: any;
}

interface IProps extends IExternalProps {}

const EntrySto: FC<IProps> = ({ route }) => {
  const navigation = useNavigation();
  const [address, setAddress] = useState<AddressType['id']>(
    route?.params?.addressId || 0,
  );
  const [userId] = useAsyncStorage('userId');
  const [profileId] = useAsyncStorage('profileId');
  const [date, setDate] = useState<any>(new Date());
  const [workKind, setWorkKind] = useState('');
  const [
    createRequest,
    { loading: loadingCreateRequest, data: createSto },
  ] = useMutation(CREATE_REQUEST_STO);
  const { data: cars, loading } = useQuery(GET_PROFILE_CAR, {
    variables: { profileId: Number(profileId) },
    skip: !profileId,
  });
  const { data: addressesData } = useQuery(GET_ADDRESSES);
  const addresses: AddressType[] = addressesData?.addresses || [];
  const carsArr = cars?.profileCars || [];
  const car =
    carsArr.find((car: ProfileCarType) => car.active)?.car || ProfileCarMock;
  const notifier = useRef<any>(null);

  useEffect(() => {
    if (createSto) {
      setDate(new Date());
      setWorkKind('');
      navigation.navigate('Main');
    }
  }, [createSto]);

  useEffect(() => {
    if (route?.params?.addressId) {
      setAddress(route?.params?.addressId);
    } else if (addresses.length && !address) {
      setAddress(addresses[0].id);
    }
  }, [route, addresses]);

  const onGoBack = useCallback(() => {
    navigation.navigate('Main');
  }, []);

  const handleChangeDate = useCallback((_: string, value: string) => {
    setDate(value);
  }, []);

  const addressesList = useMemo(() => {
    if (!Array.isArray(addresses)) {
      return [];
    }

    return addresses
      .map((item: AddressType) => ({
        ...item,
        label: item.address,
        value: String(item.id),
      }))
      .filter((item) => item.type === 'СТО');
  }, [addresses]);

  const handleSelectAddress = useCallback(
    (id) => {
      setAddress(id);
    },
    [address],
  );

  const handleSubmit = () => {
    if (!address) {
      notifier.current?.showNotification({
        title: 'Не выбран адрес',
      });
    }
    if (!car.id) {
      notifier.current?.showNotification({
        title: 'Не выбран автомобиль',
      });
    }
    createRequest({
      variables: {
        input: {
          userId,
          profileId,
          addressId: address,
          carId: car.id,
          date,
          workKind,
        },
      },
      refetchQueries: ['requestSto'],
    });
  };

  if (loading || loadingCreateRequest) {
    return (
      <View style={styles.containerLoading}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NotifierRoot ref={notifier} />
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Запись в СТО</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {car.brand || 'Нет авто'} {car.model}
            </Text>
            <Text style={styles.subTitle}>
              {car.complectation || 'Нет комплектации'}
            </Text>
          </View>
          <FormField
            type="date"
            placeholder="Date"
            onChange={handleChangeDate}
            dateFormat="hh:mm DD.MM.YYYY"
            editable
            value={date}
          />
          <FormField
            customStyles={styles.formField}
            type="text"
            placeholder="Укажите вид работ"
            editable
            onChange={setWorkKind}
            value={workKind}
          />
          <Dropdown
            onSelect={handleSelectAddress}
            selectedValue={address}
            list={addressesList}
          />
        </View>
        <Button onClick={handleSubmit} label="Отправить" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formField: {
    marginBottom: 23,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  subTitle: {
    color: COLORS['gray-200'],
  },
  card: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
});

export default EntrySto;
