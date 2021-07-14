import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  CheckBox,
  ScrollView,
  Platform,
  FlatList,
} from 'react-native';
import Modal from '../components/Modal';
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
import CarItem from '../components/CarItem';
import AsyncStorage from '@react-native-community/async-storage';
import { UPDATE_PROFILE_CAR } from '../graph/mutations/updateProfileCar';

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
  const [other, setOther] = useState(false);
  const [enterTO, setTO] = useState(false);
  const [oilChange, setOil] = useState(false);
  const [diagnostics, setDiagnostics] = useState(false);
  const [tireService, setTireService] = useState(false);
  const [show, setShow] = useState(false);
  const [
    createRequest,
    { loading: loadingCreateRequest, data: createSto },
  ] = useMutation(CREATE_REQUEST_STO);
  const [
    updateProfileCar,
    { loading: profileCarLoading, data: profileCar },
  ] = useMutation(UPDATE_PROFILE_CAR);
  const { data: cars, loading } = useQuery(GET_PROFILE_CAR, {
    variables: { profileId: Number(profileId) },
    skip: !profileId,
  });
  const { data: addressesData } = useQuery(GET_ADDRESSES);
  const [time, setTime] = useState(new Date(1598051730000));
  const addresses: AddressType[] = addressesData?.addresses || [];
  const [isOpenList, setOpenList] = useState(false);
  const carsArr = cars?.profileCars || [];
  const car =
    carsArr.find((car: ProfileCarType) => car.active)?.car || ProfileCarMock;
  const notifier = useRef<any>(null);
  const withoutActiveProfileCar = carsArr.filter((car: any) => !car.active);
  const [locations, setLocations] = useState<any>([]);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    fetch(
      'https://test-rest-api.site/api/1/mobile/location/cities/?token=b4831f21df6202f5bacade4b7bbc3e5c',
    )
      .then((response) => response.json())
      .then((data) =>
        setLocations(
          data.data.map((item: any) => ({
            ...item.City,
            label: item.City.name,
            value: item.City.id,
          })),
        ),
      );
  }, []);

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

  const handleChangeActiveCar = useCallback(
    (id: ProfileCarType['id']) => {
      return () => {
        AsyncStorage.setItem('carId', id);
        updateProfileCar({
          variables: {
            id,
            input: {
              active: 1,
            },
          },
          refetchQueries: ['profileCars'],
        });
      };
    },
    [updateProfileCar],
  );

  const renderAutoCard = useCallback(
    ({ item }) => {
      return <CarItem {...item.car} onPress={handleChangeActiveCar(item.id)} />;
    },
    [isOpenList],
  );

  const renderRegion = ({ item }: any) => {
    return (
      <View>
        <Text>{item.label}</Text>
      </View>
    );
  };

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
        content={<Text style={styles.title}>Запись на сервис</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
        <ScrollView style={styles.scroll}>
          <View style={[styles.infoContainer, styles.infoContainerGray]}>
            <Text style={styles.titleMin}>Ваши автомобили:</Text>
            {car.brand ? <Text style={styles.text}>{car.brand}</Text> : null}
            {car.model ? <Text style={styles.text}>{car.model}</Text> : null}
            <Text style={styles.text}>
              {car.complectation || 'Нет комплектации'}
            </Text>
            <View style={styles.getInfoBlockCenter}>
              <TouchableOpacity onPress={() => setOpenList(true)}>
                <Text style={styles.getInfoLink}>
                  выбрать другой автомобиль
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              defaultHeight={200}
              onCancel={() => setOpenList(false)}
              isVisible={Boolean(isOpenList)}>
              {withoutActiveProfileCar?.length ? (
                <View>
                  <FlatList
                    data={withoutActiveProfileCar}
                    renderItem={renderAutoCard}
                  />
                  <Button label="Указать автомобиль не из списка" />
                </View>
              ) : (
                <Text>Нет данных о машинах</Text>
              )}
            </Modal>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.titleMin}>Выбрать услугу:</Text>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={enterTO}
                onValueChange={setTO}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Пройти регламентное ТО</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={oilChange}
                onValueChange={setOil}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Замена масла</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={diagnostics}
                onValueChange={setDiagnostics}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Диагностика</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={tireService}
                onValueChange={setTireService}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Шиномонтаж</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={other}
                onValueChange={setOther}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Другое</Text>
            </View>
          </View>
          <View style={{ paddingBottom: 20 }}>
            {/* <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {car.brand || 'Нет авто'} {car.model}
              </Text>
              <Text style={styles.subTitle}>
                {car.complectation || 'Нет комплектации'}
              </Text>
            </View> */}
            <FormField
              type="date"
              label="Выбрать желаемое время и дату"
              placeholder="Date"
              customStyles={{ marginBottom: 10 }}
              onChange={handleChangeDate}
              dateFormat="DD.MM.YYYY"
              editable
              value={date}
            />
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
                alignItems: 'center',
                paddingLeft: 25,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'tomato',
                  padding: 10,
                  marginRight: 10,
                }}
                onPress={() => setShow(true)}>
                <Text style={{ color: 'white' }}>Выбрать время</Text>
              </TouchableOpacity>
              <Text style={{ color: 'blue', fontSize: 20 }}>
                {String(
                  new Date(time).getHours() + ':' + new Date(time).getMinutes(),
                )}
              </Text>
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="time"
                is24Hour={true}
                onChange={(event: any, selectedDate: any) => {
                  const currentDate = selectedDate || date;
                  setShow(Platform.OS === 'ios');
                  setTime(currentDate);
                }}
              />
            )}
            <Text style={[styles.titleMin, { paddingLeft: 25 }]}>
              Выбрать регион
            </Text>
            <Dropdown
              onSelect={(id: any) => setLocation(id)}
              selectedValue={location}
              list={locations}
            />
            {console.log(locations)}
            <Text style={[styles.titleMin, { paddingLeft: 25, marginTop: 10 }]}>
              Выбрать автосервис
            </Text>
            {/* <FormField
              customStyles={styles.formField}
              type="text"
              placeholder="Укажите вид работ"
              editable
              onChange={setWorkKind}
              value={workKind}
            /> */}
            <Dropdown
              onSelect={handleSelectAddress}
              selectedValue={address}
              list={addressesList}
            />
          </View>
        </ScrollView>
        <Button onClick={handleSubmit} label="Отправить" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 20,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginLeft: -6,
  },
  titleMin: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
    fontFamily: 'gothammedium.ttf',
  },
  getInfoLink: {
    color: COLORS.darkOrange,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkOrange,
    fontFamily: 'gothambookitalic',
  },
  getInfoBlockCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'gotham',
  },
  infoContainer: {
    paddingLeft: 23,
    paddingVertical: 15,
    fontFamily: 'gotham',
    marginBottom: 10,
  },
  infoContainerGray: {
    backgroundColor: COLORS.lightGray,
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
