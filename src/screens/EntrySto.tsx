/* eslint-disable react-native/no-inline-styles */
import React, {
  FC,
  useCallback,
  useEffect,
  // useMemo,
  useRef,
  useState,
} from 'react';
// import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // CheckBox,
  ScrollView,
  // Platform,
  FlatList,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import Modal from '../components/Modal';
import HeaderProject from '../components/HeaderProject';
import Icon from 'react-native-vector-icons/AntDesign';
import { API_URL, COLORS, token } from '../constants';
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
// import { Box, Modal as ModalNative } from 'native-base';
// import TextInputMask from 'react-native-text-input-mask';
import SliderCars from '../components/SliderCars';
import { connect } from 'react-redux';
import { setLocation } from '../../actions';
import moment from 'moment';
// import { marginTop } from 'styled-system';

interface IExternalProps {
  route: any;
}

interface IProps extends IExternalProps {
  setLocation: any;
  activeLocation: any;
}

const EntrySto: FC<IProps> = ({
  route,
  setLocation,
  activeLocation: location,
}) => {
  const navigation = useNavigation();
  const [address, setAddress] = useState<AddressType['id']>(
    route?.params?.addressId || 0,
  );
  const [userId] = useAsyncStorage('userId');
  const [profileId] = useAsyncStorage('profileId');
  const [date, setDate] = useState<any>(new Date());
  const [workKind, setWorkKind] = useState('');
  const [activeCar] = useAsyncStorage('activeCar');
  const [other] = useState(false);
  // const [enterTO, setTO] = useState(false);
  // const [oilChange, setOil] = useState(false);
  // const [diagnostics, setDiagnostics] = useState(false);
  // const [tireService, setTireService] = useState(false);
  // const [show, setShow] = useState(false);
  const [comment, setComment] = useState('');
  const [updatedForm, setForm] = useState(false);
  const [
    createRequest,
    { loading: loadingCreateRequest, data: createSto },
  ] = useMutation(CREATE_REQUEST_STO);
  const [
    updateProfileCar,
    // { loading: profileCarLoading, data: profileCar },
  ] = useMutation(UPDATE_PROFILE_CAR);
  const { data: cars, loading } = useQuery(GET_PROFILE_CAR, {
    variables: { profileId: Number(profileId) },
    skip: !profileId,
  });
  const { data: addressesData } = useQuery(GET_ADDRESSES);
  // const [time, setTime] = useState(new Date(1598051730000));
  const addresses: AddressType[] = addressesData?.addresses || [];
  const [isOpenList, setOpenList] = useState(false);
  const carsArr = cars?.profileCars || [];
  const [loadEntry, setLoadEntry] = useState(false);
  const [regionId] = useAsyncStorage('regionId');
  const notifier = useRef<any>(null);
  const withoutActiveProfileCar = carsArr.filter((car: any) => !car.active);
  const [locations, setLocations] = useState<any>([]);
  const [userData] = useAsyncStorage('userData');
  // const [location, setLocation] = useState<any>(regionId || null);
  const [isOpenAny, setOpenAny] = useState(false);
  const [customService, setCustomService] = useState('');
  const [addressesList, setAddresses] = useState<any>([]);
  useEffect(() => {
    if (regionId !== location && regionId) {
      setLocation(regionId);
    }
  }, [regionId]);

  const handleChangeLocation = (l: any) => {
    setLocation(l);
    setForm(true);
    (async () => {
      await AsyncStorage.setItem('regionId', l);
    })();
  };

  useEffect(() => {
    if (other) {
      setOpenAny(true);
    }
  }, [other]);

  useEffect(() => {
    fetch(
      `${API_URL}/1/mobile/location/list/?token=${token}&location_type=sto${
        location || regionId ? `&city_id=${location || regionId}` : ''
      }`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.data) {
          setAddresses([]);
          return;
        }
        setAddresses(
          data.data.map((item: any) => ({
            ...item.Location,
            label: item.Location.address,
            value: item.Location.id,
          })),
        );
      });
  }, [location, regionId]);

  useEffect(() => {
    fetch(`${API_URL}/1/mobile/location/cities/?token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.data) {
          setLocations([]);
          return;
        }
        setLocations(
          data.data?.reduce((arr: any, item: any) => {
            if (
              item.City.name === 'Москва' ||
              item.City.name === 'Санкт-Петербург'
            ) {
              return [
                {
                  ...item.City,
                  label: item.City.name,
                  value: item.City.id,
                },
                ...arr,
              ];
            }

            return arr;
          }, []),
        );
      })
      .catch((err) => console.log(err, 'error locations'));
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
    setForm(true);
    setDate(value);
  }, []);

  const handleSelectAddress = useCallback(
    (id) => {
      setForm(true);
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
    const user = JSON.parse(userData);
    const activeCarRes = JSON.parse(activeCar);

    if (!address) {
      notifier.current?.showNotification({
        title: 'Не выбран адрес',
      });
    }
    if (!activeCarRes?.id) {
      notifier.current?.showNotification({
        title: 'Не выбран автомобиль',
      });
    }

    setLoadEntry(true);

    const f = new FormData();
    f.append('user_id', user?.id);
    f.append('sto_id', address);
    f.append('comment', comment);
    f.append('car_id', activeCarRes?.id);
    f.append(
      'service_datetime',
      moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'),
    );

    fetch(`${API_URL}/1/mobile/sto/add_service_record?token=${token}`)
      .then((response) => {
        if (Number(response.status) === 200) {
          notifier.current?.showNotification({
            title: 'Ваша заявка была отправлена!',
          });
        } else {
          notifier.current?.showNotification({
            title: 'Произошла ошибка попробуйте позже!',
          });
        }

        setLoadEntry(false);

        setTimeout(() => {
          navigation.navigate('Main');
        }, 1000);
      })
      .catch((_err) => {
        setLoadEntry(false);
        notifier.current?.showNotification({
          title: 'Произошла ошибка попробуйте позже!',
        });
      });
    // .then((data) => console.log(data));
    // createRequest({
    //   variables: {
    //     input: {
    //       userId,
    //       profileId,
    //       addressId: address,
    //       carId: car.id,
    //       date,
    //       workKind,
    //     },
    //   },
    //   refetchQueries: ['requestSto'],
    // });
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
          <View style={[styles.infoContainer]}>
            <SliderCars hideDetails />
            <Modal
              defaultHeight={200}
              onCancel={() => setOpenAny(false)}
              isVisible={isOpenAny}>
              <FormField
                type="text"
                autoFocus
                placeholder="Название услуги"
                labelStyles={{ paddingLeft: 0 }}
                customStyles={{ marginBottom: 10 }}
                editable
                numberOfLines={2}
                multiline
                maxLength={50}
                value={customService}
                label="Введите услугу"
                onChange={(text) => {
                  setCustomService(text);
                  setForm(true);
                }}
              />
              {/* <FormField
                  type="text"
                  maxLength={50}
                  placeholder="Второе поле"
                  labelStyles={{ paddingLeft: 0 }}
                  customStyles={{ marginBottom: 10 }}
                  editable
                  value={secondCustomService}
                  label="Второе поле"
                  onChange={setSecondCustomService}
                /> */}
              <Button
                onClick={() => setOpenAny(false)}
                disabled={!customService}
                label="Сохранить"
              />
            </Modal>
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
          {(!regionId || !addressesList.length) && (
            <>
              <Text style={[styles.titleMin, { paddingLeft: 25 }]}>
                Выбрать регион
              </Text>
              <Dropdown
                onSelect={handleChangeLocation}
                selectedValue={location}
                list={locations}
              />
            </>
          )}
          {location || regionId ? (
            Boolean(addressesList.length) ? (
              <>
                <Text
                  style={[styles.titleMin, { paddingLeft: 25, marginTop: 10 }]}>
                  Выбрать автосервис
                </Text>
                <Dropdown
                  onSelect={handleSelectAddress}
                  selectedValue={address || addressesList[0]?.label}
                  list={addressesList}
                />
              </>
            ) : (
              <Text style={{ color: 'tomato', marginTop: 10 }}>
                В данном регионе не найдено поддразделений
              </Text>
            )
          ) : null}
          <View style={{ marginTop: 7 }}>
            <FormField
              type="date"
              label="Дата"
              placeholder="Date"
              customStyles={{ marginBottom: 10, marginTop: 3 }}
              onChange={handleChangeDate}
              dateFormat="DD.MM.YYYY"
              editable
              value={date}
            />
          </View>
          <View>
            <FormField
              type="text"
              label="Комментарий"
              multiline
              numberOfLines={6}
              placeholder="Комментарий"
              customStyles={{ marginBottom: 10 }}
              onChange={(value) => {
                setComment(value);
                setForm(true);
              }}
              value={comment}
              editable
            />
          </View>
          {/* <View style={styles.infoContainer}>
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
                <Text style={styles.label}>
                  Другое ({customService.split('').slice(0, 10).join('')}
                  {customService.length > 10 ? '...' : ''})
                </Text>
              </View>
            </View> */}
          {/* <View style={{ paddingBottom: 20 }}> */}
          {/* <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {car.brand || 'Нет авто'} {car.model}
                </Text>
                <Text style={styles.subTitle}>
                  {car.complectation || 'Нет комплектации'}
                </Text>
              </View> */}
          {/* <View
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
              )} */}
          {/* </View> */}
        </ScrollView>
        <Button
          onClick={handleSubmit}
          disabled={!updatedForm || loadEntry}
          label="ОТПРАВИТЬ ЗАЯВКУ"
        />
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

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps, { setLocation })(EntrySto);
