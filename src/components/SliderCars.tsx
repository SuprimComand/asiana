// eslint-disable react-native/no-inline-styles
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Box } from 'native-base';
import React, { FC, useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { connect } from 'react-redux';
import { setLoading } from '../../actions';
import { API_URL, COLORS, token } from '../constants';
import { useAsyncStorage } from '../hooks/asyncStorage';
import Button from './Button';
import Modal from './Modal';

const SliderCars: FC<any> = ({ hideDetails, loading, setLoading }) => {
  const navigation = useNavigation();
  const [userData] = useAsyncStorage('userData');
  const [auth_id] = useAsyncStorage('auth_id');
  const [time] = useAsyncStorage('closedTime');
  const [isOpenDetail, setOpenDetail] = useState(false);
  // const [sliders] = useAsyncStorage('sliders', [], true);
  const [sliders, setCurrentSliders] = useState<any>([]);
  const [activeCar, setCar] = useState<any>(null);

  const getCars = () => {
    if (!userData) {
      return;
    }
    const user = JSON.parse(userData);
    const f = new FormData();
    f.append('user_id', user.id);

    fetch(`${API_URL}/1/mobile/car/user_cars/?token=${token}`, {
      method: 'post',
      body: f,
    })
      .then((r) => r.json())
      .then((d) => {
        setCurrentSliders(d.data);
      })
      .catch((err) => console.log(err, 'err'));
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    getCars();
  }, [userData, loading]);

  const handleDelete = (idCar: any) => {
    if (!userData) {
      return;
    }
    console.log(idCar);
    const user = JSON.parse(userData);
    const f = new FormData();
    f.append('user_car_id', idCar);
    f.append('user_id', user.id);

    fetch(`${API_URL}/1/mobile/car/delete_car?token=${token}`, {
      method: 'post',
      body: f,
    })
      .then((data) => {
        getCars();
        return data.json();
      })
      .then((result) => console.log('result', result))
      .catch((err) => console.log(err));
  };

  // const [sliders, setSliders] = useState<any>([
  //   {
  //     id: 1,
  //     title: 'Автомобиль',
  //     subtitle: 'AUDI A6',
  //     content: 'H 553 PO 178',
  //   },
  //   {
  //     id: 2,
  //     title: 'Автомобиль',
  //     subtitle: 'AUDI A6',
  //     content: 'H 553 PO 178',
  //   },
  //   {
  //     id: 3,
  //     addButton: true,
  //   },
  // ]);

  const setOpenAddModal = () => {
    navigation.navigate('AddAuto');
  };

  const slides = Array.isArray(sliders)
    ? [...sliders, { addButton: true }]
    : [{ addButton: true }];

  return (
    <>
      <Modal isVisible={isOpenDetail} onCancel={() => setOpenDetail(false)}>
        <View>
          <Text
            style={[
              styles.title,
              { fontSize: 18, textAlign: 'center', marginBottom: 40 },
            ]}>
            ИНФОРМАЦИЯ ОБ АВТОМОБИЛЕ
          </Text>
          <View style={{ alignItems: 'center' }}>
            <Text>{activeCar?.model || activeCar?.title}</Text>
            {/* <Text>{activeCar?.subtitle}</Text> */}
            <Button
              onClick={async () => {
                handleDelete(activeCar?.id);
                setOpenDetail(false);
              }}
              label="Удалить"
              customStyles={{
                width: 100,
                borderRadius: 4,
                height: 35,
                marginTop: 10,
              }}
            />
          </View>
        </View>
      </Modal>
      <Carousel
        data={slides}
        renderItem={({ item }: any) => {
          if (item.addButton) {
            return (
              <Box
                bg="white"
                style={{
                  margin: 8,
                  marginRight: 20,
                  padding: 6,
                  height: 80,
                }}
                shadow={2}
                rounded="lg">
                <TouchableOpacity
                  style={{ height: '100%', justifyContent: 'center' }}
                  onPress={() => setOpenAddModal()}>
                  <Text style={{ color: 'blue', textAlign: 'center' }}>
                    Добавить автомобиль
                  </Text>
                </TouchableOpacity>
              </Box>
            );
          }
          return (
            <Box
              bg="white"
              width={Dimensions.get('screen').width - 120}
              style={{ marginVertical: 8, padding: 10, height: 80 }}
              shadow={2}
              rounded="lg">
              <TouchableOpacity
                onPress={() => {
                  setOpenDetail(item.id);
                  setCar(item);
                }}
                style={{ height: '100%' }}>
                <Text>{item.model || item.title}</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  Марка: {item.mark || 'Пока нет информации'}
                </Text>
                <Text style={{ fontWeight: 'bold' }}>
                  Госномер: {item.car_number || 'Пока нет информации'}
                </Text>
              </TouchableOpacity>
            </Box>
          );
        }}
        sliderWidth={Dimensions.get('screen').width}
        itemWidth={Dimensions.get('screen').width - 100}
      />
      {!hideDetails ? (
        sliders?.length ? (
          <View style={styles.infoContainer}>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 4,
                fontWeight: 'bold',
                fontFamily: 'gothammedium.ttf',
              }}>
              Последнее посещение СТО:
            </Text>
            <Text style={[styles.text, { marginBottom: 10 }]}>
              Информация появится после обслуживания на СТО
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 4,
                fontWeight: 'bold',
                fontFamily: 'gothammedium.ttf',
              }}>
              Пробег:
            </Text>
            <Text style={styles.text}>
              Информация появится после обслуживания на СТО
            </Text>
          </View>
        ) : (
          <Text>Нет выбранного авто</Text>
        )
      ) : null}
    </>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state: any) => ({
  loading: state.loading,
});

export default connect(mapStateToProps, { setLoading })(SliderCars);
