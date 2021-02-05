import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderProject from '../components/HeaderProject';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../constants';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useAsyncStorage } from '../hooks/asyncStorage';
import { useMutation } from '@apollo/client';
import { CREATE_PROFILE_CAR } from '../graph/mutations/createProfileCar';
import { CarMock } from '../typings/car';
import { CarType } from '../typings/graphql';
import Loader from '../components/Loader';
import ErrorBoundry from '../components/ErrorBoundry';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const AddAuto: FC<IProps> = () => {
  const navigation = useNavigation();
  const [profileId] = useAsyncStorage('profileId');
  const [
    createCarRequest,
    { data: createCar, loading: createCarLoading, error },
  ] = useMutation(CREATE_PROFILE_CAR, {
    refetchQueries: ['profileCars'],
  });
  const [car, setCar] = useState<CarType>(CarMock);

  const handleChange = useCallback(
    (key: keyof CarType) => {
      return (value: string) => {
        setCar({ ...car, [key]: value });
      };
    },
    [car],
  );

  const handleSubmit = useCallback(() => {
    const { id, profilecarSet, ...userCar } = car;
    createCarRequest({
      variables: {
        input: {
          profileId: Number(profileId),
          car: userCar,
          active: 1,
          source: 'app',
        },
      },
    });
  }, [car, profileId]);

  useEffect(() => {
    if (createCar) {
      navigation.navigate('Main');
    }
  }, [createCar]);

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  if (createCarLoading) {
    return (
      <View style={styles.containerLoading}>
        <Loader size={50} />
      </View>
    );
  }

  if (error) {
    return (
      <ErrorBoundry title={`Ошибка добавления ${JSON.stringify(error)}`} />
    );
  }

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Добавить авто</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
        <View>
          <FormField
            customStyles={styles.formField}
            type="text"
            placeholder="Марка"
            editable
            onChange={handleChange('brand')}
            value={car.brand}
          />
          <FormField
            customStyles={styles.formField}
            type="text"
            placeholder="Модель"
            editable
            onChange={handleChange('model')}
            value={car.model}
          />
          <FormField
            customStyles={styles.formField}
            type="text"
            placeholder="Комплектация"
            editable
            onChange={handleChange('complectation')}
            value={car.complectation}
          />
        </View>
        <Button onClick={handleSubmit} label="Добавить" />
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

export default AddAuto;
