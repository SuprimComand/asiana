import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
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
import { ProfileCarType, RequestStoType } from '../typings/graphql';
import CarItem from '../components/CarItem';
import { UPDATE_PROFILE_CAR } from '../graph/mutations/updateProfileCar';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_REQUEST_STO } from '../graph/queries/getRequestSto';
import moment from 'moment';

interface IExternalProps {}

interface IProps extends IExternalProps {}

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
  const { data: requestStoData, loading: requestStoLoading } = useQuery(
    GET_REQUEST_STO,
    {
      variables: { userId: Number(userId), profileId: Number(profileId) },
      skip: !userId || !profileId,
    },
  );

  const requestStoList = requestStoData?.requestSto || [];
  const [
    updateProfileCar,
    { loading: profileCarLoading, data: profileCar },
  ] = useMutation(UPDATE_PROFILE_CAR);

  const profileCars: ProfileCarType[] = data?.profileCars || [];
  const activeProfileCar = profileCars.find((car) => Boolean(car.active));
  const withoutActiveProfileCar = profileCars.filter((car) => !car.active);

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

  const renderActiveCard = useCallback(() => {
    if (profileCarLoading) {
      return <Image style={styles.loadingRow} source={loadingCard} />;
    }
    console.log(activeProfileCar, 'activeProfileCar');

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
      <HeaderProject content={<Image source={logo} />} />
      <ScrollView>
        <View style={styles.content}>
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
          {renderRequestSto()}
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
  requestStoCard: {
    marginBottom: 10,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingTop: 40,
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default Main;
