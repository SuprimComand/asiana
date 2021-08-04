// eslint-disable react-native/no-inline-styles
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Box } from 'native-base';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { COLORS } from '../constants';
import { useAsyncStorage } from '../hooks/asyncStorage';
import Button from './Button';
import Modal from './Modal';

const SliderCars = () => {
  const navigation = useNavigation();
  const [isOpenDetail, setOpenDetail] = useState(false);
  const [sliders] = useAsyncStorage('sliders', [], true);
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

  const setSliders = async (newArr: any) => {
    await AsyncStorage.setItem('sliders', JSON.stringify(newArr));
  };

  const setOpenAddModal = () => {
    navigation.navigate('AddAuto');
  };

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
            <Text>АВТОМОБИЛЬ KIA RIO</Text>
            <Button
              onClick={async () => {
                const newArr = sliders.filter(
                  (item: any) => item.id !== isOpenDetail,
                );
                setOpenDetail(false);
                setSliders(newArr);
                await AsyncStorage.setItem('sliders', newArr);
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
        data={[...sliders, { addButton: true }]}
        renderItem={({ item }: any) => {
          if (item.addButton) {
            return (
              <Box
                bg="white"
                style={{
                  margin: 8,
                  marginRight:
                    sliders.length > 0
                      ? 20
                      : Dimensions.get('screen').width / 4,
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
                onPress={() => setOpenDetail(item.id)}
                style={{ height: '100%' }}>
                <Text>{item.title}</Text>
                <Text style={{ fontWeight: 'bold' }}>{item.subtitle}</Text>
                <Text style={{ fontWeight: 'bold' }}>{item.content}</Text>
              </TouchableOpacity>
            </Box>
          );
        }}
        sliderWidth={Dimensions.get('screen').width}
        itemWidth={Dimensions.get('screen').width - 100}
      />
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

export default SliderCars;
