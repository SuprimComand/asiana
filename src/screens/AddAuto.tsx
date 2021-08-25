import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import HeaderProject from '../components/HeaderProject';
import Icon from 'react-native-vector-icons/AntDesign';
import { API_URL, COLORS, token } from '../constants';
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
import Dropdown from '../components/Dropdown';
import { setLoading } from '../../actions';
import { connect } from 'react-redux';

interface IExternalProps {
  setLoading: any;
}

interface IProps extends IExternalProps {}

const AddAuto: FC<IProps> = ({ setLoading }) => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  // const [profileId] = useAsyncStorage('profileId');
  const [
    createCarRequest,
    { data: createCar, loading: createCarLoading },
  ] = useMutation(CREATE_PROFILE_CAR, {
    refetchQueries: ['profileCars'],
  });
  // const [car, setCar] = useState<CarType>(CarMock);
  const notifier = useRef<any>(null);
  const [valueCar, setCarValue] = useState('');
  const [regionCar, setRegionCar] = useState('');
  const [marks, setMarks] = useState([]);
  const [activeMark, setActiveMark] = useState(null);
  const [userData] = useAsyncStorage('userData');
  const [activeModel, setActiveModel] = useState(null);
  const [sliders] = useAsyncStorage('sliders', [], true);
  const [error, setError] = useState(null);
  const [auth_id] = useAsyncStorage('auth_id');
  const [models, setModels] = useState([]);
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

  useEffect(() => {
    fetch(`${API_URL}/1/mobile/car/brands/?token=${token}`)
      .then((r) => r.json())
      .then((d) => setMarks(d.data.brands))
      .catch((e) => console.log(JSON.stringify(e)));
  }, []);
  useEffect(() => {
    if (!activeMark) {
      return;
    }
    fetch(`${API_URL}/1/mobile/car/${activeMark}/models/?token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        setModels(data.data.model);
      })
      .catch((e) => console.log(e));
  }, [activeMark]);

  const handleSaveAuto = () => {
    if (!activeMark || !activeModel || !userData) {
      return;
    }
    const user = JSON.parse(userData);
    const f = new FormData();
    f.append(
      'car_number',
      valueCar.replace(/\s/g, '') + ' ' + regionCar.replace(/\s/g, ''),
    );
    f.append('model_id', activeModel);
    f.append('mark_id', activeMark);
    f.append('user_id', user.id);

    setLoading(true);

    fetch(`${API_URL}/1/mobile/car/add_car/?token=${token}`, {
      method: 'POST',
      body: f,
    })
      .then((response) => response.json())
      .then(async (d) => {
        if (Array.isArray(d) && d[0] === 'empty user_id') {
          return;
        }
        await AsyncStorage.setItem('user', JSON.stringify(user));
        Alert.alert('Успешно сохранено', '', [
          { text: 'Ok', onPress: () => navigation.goBack() },
        ]);
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  };

  const cleateAuto = async () => {
    if (valueCar.length < 6 || regionCar.length < 3) {
      setErrorMessage('Не все поля заполнены');
      return;
    }
    const newCar = {
      id: Date.now(),
      title: 'Автомобиль',
      // subtitle: 'AUDI A' + Math.floor(Math.random() * 10),
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

  // if (error) {
  //   return (
  //     <ErrorBoundry title={`Ошибка добавления ${JSON.stringify(error)}`} />
  //   );
  // }

  return (
    <View style={styles.container}>
      <NotifierRoot ref={notifier} />
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Добавить авто</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
        <View>
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
            {errorMessage ? (
              <Text style={{ color: 'tomato', marginTop: 10 }}>
                {errorMessage}
              </Text>
            ) : null}
            <Button
              label="ОК"
              onClick={handleSaveAuto}
              customStyles={{
                width: 50,
                borderRadius: 4,
                height: 40,
                marginLeft: 10,
              }}
            />
          </View>
          <View>
            <Text style={{ marginTop: 10 }}>Марка</Text>
            <Dropdown
              onSelect={(i: any) => setActiveMark(i)}
              selectedValue={activeMark}
              list={marks.map((item: any) => ({
                ...item,
                label: item.name,
                value: item.id,
              }))}
            />
            <Text style={{ marginTop: 10 }}>Модель</Text>
            <Dropdown
              onSelect={(i: any) => setActiveModel(i)}
              selectedValue={activeModel}
              list={models.map((item: any) => ({
                ...item,
                label: item.name,
                value: item.id,
              }))}
            />
          </View>
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

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps, { setLoading })(AddAuto);
