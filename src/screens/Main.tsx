import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  BackHandler,
  Alert,
  Dimensions,
} from 'react-native';

import TextInputMask from 'react-native-text-input-mask';
import HeaderProject from '../components/HeaderProject';
import logo from '../assets/asiana-logotype.png';
import loadingCard from '../assets/loading-row.gif';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useMutation, useQuery } from '@apollo/client';
import { useAsyncStorage } from '../hooks/asyncStorage';
import { GET_PROFILE_CAR } from '../graph/queries/getProfileCar';
import Loader from '../components/Loader';
import {
  ProfileCarType,
  ProfileType,
  RequestStoType,
} from '../typings/graphql';
import CarItem from '../components/CarItem';
import { UPDATE_PROFILE_CAR } from '../graph/mutations/updateProfileCar';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_REQUEST_STO } from '../graph/queries/getRequestSto';
import moment from 'moment';
import { GET_USER_PROFILES } from '../graph/queries/getProfiles';
import Button from '../components/Button';
import { Box, Modal as ModalNative } from 'native-base';
import Carousel from 'react-native-snap-carousel';

interface IExternalProps {}

interface IProps extends IExternalProps {
  navigation: any;
}

const Main: FC<IProps> = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const navigation = useNavigation();
  const [profileId] = useAsyncStorage('profileId');
  const [userId] = useAsyncStorage('userId');
  const [isOpenList, setOpenList] = useState(false);
  const { data, loading, refetch } = useQuery(GET_PROFILE_CAR, {
    variables: { profileId: Number(profileId) },
    skip: !profileId,
  });
  const { data: profiles, loading: loadingProfile } = useQuery(
    GET_USER_PROFILES,
    {
      variables: { userId: Number(userId) },
      skip: !userId,
    },
  );
  const { data: requestStoData, loading: requestStoLoading } = useQuery(
    GET_REQUEST_STO,
    {
      variables: { userId: Number(userId), profileId: Number(profileId) },
      skip: !userId || !profileId,
    },
  );
  const profile = profiles?.profiles.find(
    (item: ProfileType) => item.id === profileId,
  );

  const [isOpenAddModal, setOpenAddModal] = useState(false);

  const requestStoList = requestStoData?.requestSto || [];
  const [
    updateProfileCar,
    { loading: profileCarLoading, data: profileCar },
  ] = useMutation(UPDATE_PROFILE_CAR);

  const profileCars: ProfileCarType[] = data?.profileCars || [];
  const activeProfileCar = profileCars.find((car) => Boolean(car.active));
  const withoutActiveProfileCar = profileCars.filter((car) => !car.active);
  const [isOpenDetail, setOpenDetail] = useState(false);
  const routeNameRef = navigation.isFocused;
  const [sliders, setSliders] = useState<any>([
    {
      id: 1,
      title: 'Автомобиль',
      subtitle: 'AUDI A6',
      content: 'H 553 PO 178',
    },
    {
      id: 2,
      title: 'Автомобиль',
      subtitle: 'AUDI A6',
      content: 'H 553 PO 178',
    },
    {
      id: 3,
      addButton: true,
    },
  ]);

  const notification = () =>
    Alert.alert(
      '',
      'Для продолжения установки необходимо согласиться с политикой обработки персональных данных',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('User'),
        },
      ],
    );

  useEffect(() => {
    notification();
  }, []);

  useEffect(() => {
    const logout = async () => {
      BackHandler.exitApp();
    };

    const backAction = () => {
      if (routeNameRef()) {
        logout();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (profileCar) {
      refetch();
    }
  }, [profileCar]);

  const handleLeftActionClick = useCallback(() => {
    navigation.navigate('User');
  }, []);

  const handleOpenModal = useCallback(() => {
    if (activeProfileCar) {
      setOpenModal(true);
    }
  }, [activeProfileCar]);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleClickEntrySto = useCallback(() => {
    handleCloseModal();
    navigation.navigate('EntrySto');
  }, []);

  const handleClickAddAuto = useCallback(() => {
    navigation.navigate('AddAuto');
  }, []);

  const handleClickHistory = useCallback(() => {
    handleCloseModal();
    navigation.navigate('HistoryMaintenance');
  }, []);

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
    [updateProfileCar, profileCar],
  );

  const renderAutoCard = useCallback(
    ({ item }) => {
      return <CarItem {...item.car} onPress={handleChangeActiveCar(item.id)} />;
    },
    [data, isOpenList],
  );

  const handleClickAddSto = useCallback(() => {
    navigation.navigate('EntrySto');
  }, []);

  const renderRequestSto = useCallback(() => {
    return requestStoList.map((requestSto: RequestStoType, index: number) => {
      const first = index === 0;
      return (
        <View style={styles.requestStoCard} key={requestSto.id}>
          <View style={styles.cardHeader}>
            {first && (
              <>
                <Text style={styles.cardTitle}>Запись в СТО</Text>
                <TouchableOpacity onPress={handleClickAddSto}>
                  <Icon color={COLORS.darkOrange} size={20} name="plus" />
                </TouchableOpacity>
              </>
            )}
          </View>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.fontBold}>
                {requestSto?.address.address || 'Нет адреса'}
              </Text>
              <Text style={styles.subTitle}>
                {requestSto?.date
                  ? moment(requestSto?.date).format('hh:mm DD.MM.YYYY')
                  : 'Нет рабочего времени'}
              </Text>
            </View>
            <View style={styles.dataContent}>
              <Text style={styles.title}>
                {`${requestSto?.car.brand || 'Нет автомобиля'} ${
                  requestSto?.car.model || ''
                }`}
              </Text>
              <Text style={styles.subTitle}>
                {requestSto?.car.complectation || 'Нет комплектации'}
              </Text>
            </View>
            <Text>{requestSto?.workKind}</Text>
          </Card>
        </View>
      );
    });
  }, [requestStoList, userId]);

  const renderBonusCard = useCallback(() => {
    if (loadingProfile) {
      return <Image style={styles.loadingRow} source={loadingCard} />;
    }
    return (
      <View>
        <Text style={styles.title}>{profile?.bonus} Азкоин</Text>
        <Text style={styles.subTitle}>Сегодня +1 Азкоин</Text>
        <Text style={[styles.title, { marginTop: 10 }]}>
          Ваша скидка: {profile?.percents}%
        </Text>
      </View>
    );
  }, [activeProfileCar, userId]);

  const renderActiveCard = useCallback(() => {
    if (profileCarLoading) {
      return <Image style={styles.loadingRow} source={loadingCard} />;
    }

    return (
      <View>
        <Text style={styles.title}>
          {`${activeProfileCar?.car.brand || 'Нет данных'} ${
            activeProfileCar?.car.model || ''
          }`}
        </Text>
        <Text style={styles.subTitle}>
          {activeProfileCar?.car.complectation || 'Нет комплектации'}
        </Text>
      </View>
    );
  }, [activeProfileCar, userId]);

  const handleChangeOpenList = useCallback(
    (status: boolean) => {
      return () => setOpenList(status);
    },
    [setOpenList, isOpenList],
  );

  if (loading || requestStoLoading || !userId) {
    return (
      <View style={styles.containerLoading}>
        <Loader size={50} />
      </View>
    );
  }

  const arrowIcon = isOpenList ? 'arrowdown' : 'arrowright';

  return (
    <View style={styles.container}>
      <HeaderProject
        customStyles={{ paddingHorizontal: 0, width: '100%' }}
        content={
          <View style={styles.header}>
            <Image source={logo} />
          </View>
        }
      />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>Ваша скидка:</Text>
            <Text style={styles.text}>действительна при налиции стикера</Text>
            <View style={styles.row}>
              <Text style={styles.orange}>- 10% </Text>
              <Text style={styles.text}>на услуги наших СТО</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.orange}>- 7% </Text>
              <Text style={styles.text}>на покупку автозапчастей</Text>
            </View>
            <View style={styles.getInfoBlock}>
              <TouchableOpacity style={styles.getInfoButton}>
                <Text style={styles.getInfoLabel}>ПОДРОБНЕЕ</Text>
              </TouchableOpacity>
            </View>
          </View>

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
                  onClick={() => {
                    setOpenDetail(false);
                    setSliders(
                      sliders.filter((item: any) => item.id !== isOpenDetail),
                    );
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

          <ModalNative
            isOpen={isOpenAddModal}
            onClose={() => setOpenAddModal(false)}>
            <ModalNative.Content
              style={{
                backgroundColor: 'white',
                height: Dimensions.get('screen').height - 400,
                padding: 20,
                width: Dimensions.get('screen').width - 20,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ModalNative.CloseButton />
              <View style={{ flexDirection: 'row' }}>
                <TextInputMask
                  style={{
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 5,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    width: 100,
                    textAlign: 'center',
                  }}
                  // style={[styles.input, styles.inputField, customStyles, style]}
                  // value={String(value || '')}
                  onChangeText={() => {}}
                  mask={'a [000] aa'}
                  placeholder="Номер"
                  autoFocus={true}
                />
                <TextInputMask
                  style={{
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 5,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeftWidth: 0,
                  }}
                  // style={[styles.input, styles.inputField, customStyles, style]}
                  // value={String(value || '')}
                  onChangeText={() => {}}
                  mask={'[00]'}
                  autoFocus={true}
                />
                <Button
                  label="ОК"
                  customStyles={{
                    width: 50,
                    borderRadius: 4,
                    height: 40,
                    marginLeft: 10,
                  }}
                />
              </View>
            </ModalNative.Content>
          </ModalNative>

          <Carousel
            data={sliders}
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
                      onPress={() => setOpenAddModal(item.id)}>
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
                  width={Dimensions.get('screen').width - 100}
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

          <View style={styles.infoContainer}>
            <Text style={styles.title}>Последнее посещение СТО:</Text>
            <Text style={[styles.text, { marginBottom: 10 }]}>
              24.06.2021 г.
            </Text>
            <Text style={styles.title}>Пробег:</Text>
            <Text style={styles.text}>81242 км</Text>
          </View>

          <View style={[styles.infoContainer, styles.infoContainerGray]}>
            <Text style={styles.title}>Наши рекомендации:</Text>
            <Text style={[styles.text, { fontSize: 8 }]}>
              Замена передних колодок, обслуживание передних суппортов, замена
              катушки зажигания 3 цилиндра, замена свечей зажигания
            </Text>
            <View style={styles.getInfoBlockCenter}>
              <TouchableOpacity>
                <Text style={styles.getInfoLink}>посмотреть полностью</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.getInfoBlockCenter, { marginVertical: 10 }]}>
            <Button customStyles={styles.button} label="ЗАПИСАТЬСЯ НА СЕРВИС" />
          </View>

          {/* <View style={[styles.cardBlock, { marginBottom: 20 }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Бонусный счёт</Text>
            </View>
            <Card>{renderBonusCard()}</Card>
          </View>

          <View style={styles.cardBlock}>
            <View style={styles.cardHeader}>
              <TouchableOpacity
                onPress={handleChangeOpenList(!isOpenList)}
                style={styles.flex}>
                <Text style={styles.cardTitle}>Мои авто</Text>
                <Icon color={COLORS.darkOrange} size={20} name={arrowIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClickAddAuto}>
                <Icon color={COLORS.darkOrange} size={20} name="plus" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleOpenModal}>
              <Card>{renderActiveCard()}</Card>
            </TouchableOpacity>
            {Boolean(isOpenList) && (
              <FlatList
                data={withoutActiveProfileCar}
                renderItem={renderAutoCard}
              />
            )}
          </View>
          {renderRequestSto()} */}
        </View>
      </ScrollView>
      <Modal onCancel={handleCloseModal} isVisible={isOpenModal}>
        <TouchableOpacity
          onPress={handleClickEntrySto}
          style={styles.cardBlock}>
          <Text style={[styles.fontBold, styles.modalContentTitle]}>
            Записаться в СТО
          </Text>
          <Text style={styles.modalContentText}>
            подать заявку на посещение СТО Кореана
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClickHistory} style={styles.cardBlock}>
          <Text style={[styles.fontBold, styles.modalContentTitle]}>
            История обслуживания
          </Text>
          <Text style={styles.modalContentText}>
            доступна для автомобилей, которые ранее обслуживались в СТО Кореана
          </Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 6,
  },
  infoContainerGray: {
    backgroundColor: COLORS.lightGray,
  },
  infoContainer: {
    paddingLeft: 30,
    paddingVertical: 15,
    fontFamily: 'gotham',
  },
  text: {
    fontFamily: 'gotham',
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
  getInfoBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 30,
  },
  getInfoButton: {
    backgroundColor: COLORS.darkOrange,
    padding: 3,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  getInfoLabel: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: 'gotham',
  },
  requestStoCard: {
    marginBottom: 10,
  },
  header: {
    backgroundColor: 'orange',
    width: '100%',
    alignItems: 'center',
    padding: 15,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  loadingRow: {
    width: 100,
    height: 30,
  },
  modalContentTitle: {
    color: COLORS.gray,
    fontSize: 18,
    marginBottom: 10,
  },
  modalContentText: {
    color: COLORS.gray,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  dataContent: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
    fontFamily: 'gothammedium.ttf',
  },
  subTitle: {
    color: COLORS['gray-200'],
  },
  cardBlock: {
    marginBottom: 50,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingTop: 40,
  },
  orange: {
    color: COLORS.darkOrange,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 8,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    // paddingHorizontal: 20,
    // paddingTop: 20,
    paddingTop: 10,
  },
});

export default Main;
