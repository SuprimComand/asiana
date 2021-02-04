import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import HeaderProject from '../components/HeaderProject';
import UserSvg from '../assets/icons/User';
import NotificationSvg from '../assets/icons/Notification';
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
import { CarType, ProfileCarType } from '../typings/graphql';
import CarItem from '../components/CarItem';
import { UPDATE_PROFILE_CAR } from '../graph/mutations/updateProfileCar';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Main: FC<IProps> = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const navigation = useNavigation();
  const [profileId] = useAsyncStorage('profileId');
  const [isOpenList, setOpenList] = useState(false);
  const { data, loading, refetch } = useQuery(GET_PROFILE_CAR, {
    variables: { profileId: Number(profileId) },
    skip: !profileId,
  });

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
    setOpenModal(true);
  }, []);

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

  const handleChangeActiveCar = useCallback((id: CarType['id']) => {
    updateProfileCar({
      variables: {
        id,
        input: {
          active: 1,
        },
      },
    });
  }, []);

  const renderAutoCard = useCallback(
    ({ item }) => {
      return <CarItem {...item.car} onPress={handleChangeActiveCar} />;
    },
    [data, isOpenList],
  );

  const renderActiveCard = useCallback(() => {
    if (profileCarLoading || !activeProfileCar) {
      return <Image style={styles.loadingRow} source={loadingCard} />;
    }

    return (
      <>
        <Text style={styles.title}>{activeProfileCar?.car.model}</Text>
        <Text style={styles.subTitle}>
          {activeProfileCar?.car.complectation}
        </Text>
      </>
    );
  }, [profileCarLoading, activeProfileCar]);

  const handleChangeOpenList = useCallback(
    (status: boolean) => {
      return () => setOpenList(status);
    },
    [setOpenList, isOpenList],
  );

  if (loading) {
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
        leftIcon={<UserSvg />}
        rightIcon={<NotificationSvg />}
        onPressLeftAction={handleLeftActionClick}
        content={<Image source={logo} />}
      />
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
          {isOpenList && (
            <FlatList
              data={withoutActiveProfileCar}
              renderItem={renderAutoCard}
            />
          )}
        </View>
        <View>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Запись ев СТО</Text>
            <TouchableOpacity>
              <Icon color={COLORS.darkOrange} size={20} name="plus" />
            </TouchableOpacity>
          </View>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.fontBold}>Дальновосточный 49</Text>
              <Text style={styles.subTitle}>14:30 14.01.2021</Text>
            </View>
            <View style={styles.dataContent}>
              <Text style={styles.title}>Kia Optima</Text>
              <Text style={styles.subTitle}>1.4 Turbo 160 л.с</Text>
            </View>
            <Text>Замера заднего амортизатора</Text>
          </Card>
        </View>
      </View>
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
