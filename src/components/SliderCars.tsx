// eslint-disable react-native/no-inline-styles
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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

const SliderCars: FC<any> = ({
  hideDetails,
  loading,
  setLoading,
  handleSelectAuto,
}) => {
  const navigation = useNavigation();
  const [activeCarDefault] = useAsyncStorage('activeCar');
  const [userData] = useAsyncStorage('userData');
  const [auth_id] = useAsyncStorage('auth_id');
  const [time] = useAsyncStorage('closedTime');
  const [isOpenDetail, setOpenDetail] = useState(false);
  // const [sliders] = useAsyncStorage('sliders', [], true);
  const [sliders, setCurrentSliders] = useState<any>([]);
  const [activeCar, setCar] = useState<any>(null);
  let defaultActiveCar = null;

  if (activeCarDefault) {
    defaultActiveCar = JSON.parse(activeCarDefault);
  }

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

  useFocusEffect(() => {
    console.log('get cars');
    if (loading) {
      setLoading(false);
    }
    getCars();
  }, [userData, loading]);

  const handleDelete = (idCar: any) => {
    if (!userData) {
      return;
    }
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
  //     title: '????????????????????',
  //     subtitle: 'AUDI A6',
  //     content: 'H 553 PO 178',
  //   },
  //   {
  //     id: 2,
  //     title: '????????????????????',
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
            ???????????????????? ???? ????????????????????
          </Text>
          <View style={{ alignItems: 'center' }}>
            <Text>{activeCar?.model || activeCar?.title}</Text>
            {/* <Text>{activeCar?.subtitle}</Text> */}
            {defaultActiveCar?.id !== activeCar?.id ? (
              <Button
                onClick={() => {
                  handleSelectAuto && handleSelectAuto(activeCar);
                  setOpenDetail(false);
                }}
                label="?????????????? ????????????????????"
                customStyles={{
                  width: 240,
                  borderRadius: 4,
                  height: 35,
                  marginTop: 10,
                  backgroundColor: 'green',
                }}
              />
            ) : null}
            <Button
              onClick={async () => {
                handleDelete(activeCar?.id);
                setOpenDetail(false);
              }}
              label="??????????????"
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
                    ???????????????? ????????????????????
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
                onPress={async () => {
                  setOpenDetail(item.id);
                  setCar(item);
                  await AsyncStorage.setItem('activeCar', JSON.stringify(item));
                }}
                style={{ height: '100%' }}>
                <Text
                  style={{
                    color:
                      defaultActiveCar?.id === item.id ? 'orange' : 'black',
                  }}>
                  {item.model || item.title}
                </Text>
                <Text style={{ fontWeight: 'bold' }}>
                  ??????????: {item.mark || '???????? ?????? ????????????????????'}
                </Text>
                <Text style={{ fontWeight: 'bold' }}>
                  ????????????????: {item.car_number || '???????? ?????? ????????????????????'}
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
              ?????????????????? ?????????????????? ??????:
            </Text>
            <Text style={[styles.text, { marginBottom: 10 }]}>
              ???????????????????? ???????????????? ?????????? ???????????????????????? ???? ??????
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 4,
                fontWeight: 'bold',
                fontFamily: 'gothammedium.ttf',
              }}>
              ????????????:
            </Text>
            <Text style={styles.text}>
              ???????????????????? ???????????????? ?????????? ???????????????????????? ???? ??????
            </Text>
          </View>
        ) : (
          <Text>?????? ???????????????????? ????????</Text>
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
