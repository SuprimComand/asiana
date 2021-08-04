import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
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
import { NotifierRoot } from 'react-native-notifier';
import TextInputMask from 'react-native-text-input-mask';
import AsyncStorage from '@react-native-community/async-storage';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const AddAuto: FC<IProps> = () => {
  const navigation = useNavigation();
  // const [profileId] = useAsyncStorage('profileId');
  const [
    createCarRequest,
    { data: createCar, loading: createCarLoading, error },
  ] = useMutation(CREATE_PROFILE_CAR, {
    refetchQueries: ['profileCars'],
  });
  // const [car, setCar] = useState<CarType>(CarMock);
  const notifier = useRef<any>(null);
  const [valueCar, setCarValue] = useState('');
  const [regionCar, setRegionCar] = useState('');
  const [sliders] = useAsyncStorage('sliders', [], true);
  const refReg = useRef<any>(null);

  // const handleChange = useCallback(
  //   (key: keyof CarType) => {
  //     return (value: string) => {
  //       setCar({ ...car, [key]: value });
  //     };
  //   },
  //   [car],
  // );

  // const handleSubmit = useCallback(() => {
  //   const { id, profilecarSet, requeststoSet, ...userCar } = car;
  //   if (!userCar.model || !userCar.brand) {
  //     return notifier?.current.showNotification({
  //       title: 'Заполните все поля!',
  //     });
  //   }
  //   createCarRequest({
  //     variables: {
  //       input: {
  //         profileId: Number(profileId),
  //         car: userCar,
  //         active: 1,
  //         source: 'app',
  //       },
  //     },
  //     refetchQueries: ['profileCars'],
  //   });
  // }, [car, profileId]);

  useEffect(() => {
    if (createCar) {
      navigation.navigate('Main');
    }
  }, [createCar]);

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  useEffect(() => {
    if (valueCar.replace(/\s/g, '').length === 6 && refReg.current) {
      refReg.current.focus();
    }
  }, [valueCar]);

  const cleateAuto = async () => {
    if (!valueCar || !regionCar) {
      return;
    }
    const newCar = {
      id: Date.now(),
      title: 'Автомобиль #' + Date.now(),
      subtitle: 'AUDI A6',
      content: valueCar + ' ' + regionCar,
    };

    const newArr = [...sliders, newCar];

    await AsyncStorage.setItem('sliders', JSON.stringify(newArr));
    navigation.goBack();
  };

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
      <NotifierRoot ref={notifier} />
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Добавить авто</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
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
            onChangeText={setCarValue}
            mask={'[A] [000] [AA]'}
            placeholder="Номер"
            value={valueCar}
            autoFocus={valueCar.replace(/\s/, '').length < 6}
          />
          <TextInput
            ref={refReg}
            keyboardType="number-pad"
            value={regionCar}
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
            onChangeText={setRegionCar}
            maxLength={3}
            autoFocus={valueCar.replace(/\s/, '').length === 6}
          />
          <Button
            label="ОК"
            onClick={cleateAuto}
            customStyles={{
              width: 50,
              borderRadius: 4,
              height: 40,
              marginLeft: 10,
            }}
          />
        </View>
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
    marginBottom: 5,
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
