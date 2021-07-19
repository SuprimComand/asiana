import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useMutation, useQuery } from '@apollo/client';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import FormField from '../components/FormField';
import HeaderProject from '../components/HeaderProject';
import SelectButtonGroup, { Action } from '../components/SelectButtonGroup';
import { COLORS } from '../constants';
import Loader from '../components/Loader';
import ErrorBoundry from '../components/ErrorBoundry';
import { UserMock } from '../typings/userProfile';
import { useAsyncStorage } from '../hooks/asyncStorage';
import { CREATE_USER_PROFILE } from '../graph/mutations/createUser';
import { GET_USER_PROFILES } from '../graph/queries/getProfiles';
import { GET_ADDRESSES } from '../graph/queries/getAddresses';
import { AddressType, ProfileType } from '../typings/graphql';
import { AuthService } from '../services/AuthService';
import { Box } from 'native-base';
import Modal from '../components/Modal';
import TextInputMask from 'react-native-text-input-mask';
import { textAlign } from 'styled-system';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const defaultData: Action[] = [
  {
    id: 0,
    label: 'Женщина',
  },
  {
    id: 1,
    label: 'Мужчина',
  },
];

const User: FC<IProps> = () => {
  const navigation = useNavigation();
  const [editable, setEditable] = useState(true);
  const [userId] = useAsyncStorage('userId');
  const [profileId] = useAsyncStorage('profileId');
  const [token] = useAsyncStorage('token');
  const [gender, setGender] = useState<number>(0);
  const [selectedAddress, setAddress] = useState<number | null>(null);
  const [isOpenDetail, setOpenDetail] = useState(false);
  const [
    createUserRequest,
    { data: createUser, loading: createUserLoading },
  ] = useMutation(CREATE_USER_PROFILE);
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILES, {
    variables: { userId: Number(userId) },
    skip: !userId,
  });
  const { data: addressesData } = useQuery(GET_ADDRESSES);
  const [user, setUser] = useState<any>(UserMock);
  const addresses: AddressType[] = addressesData?.addresses || [];
  const selectedGender = useMemo(
    () => defaultData.find((item) => item.id === gender),
    [gender],
  );
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [locations, setLocations] = useState<any>([]);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    fetch(
      'https://test-rest-api.site/api/1/mobile/location/cities/?token=b4831f21df6202f5bacade4b7bbc3e5c',
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.data) {
          setLocations([]);
          return;
        }
        setLocations(
          data.data?.map((item: any) => ({
            ...item.City,
            label: item.City.name,
            value: item.City.id,
          })),
        );
      });
  }, []);

  const addressesList = useMemo(() => {
    if (!Array.isArray(addresses)) {
      return [];
    }

    return addresses
      .map((item: AddressType) => ({
        ...item,
        label: item.address,
        value: String(item.id),
      }))
      .filter((item) => item.type === 'СТО');
  }, [addresses]);

  useEffect(() => {
    if (!createUserLoading && createUser) {
      refetch();
    }
  }, [createUser]);

  useEffect(() => {
    if (data && data.profiles?.length) {
      if (profileId) {
        const profile = data.profiles.find(
          (item: ProfileType) => profileId === item.id,
        );
        if (profile) {
          setUser(profile);
          setGender(profile.gender || 0);
          setAddress(profile.address?.id);
          setEditable(false);
          return;
        }
      }
      setUser(data.profiles[0]);
      setGender(data.profiles[0].gender || 0);
      setAddress(data.profiles[0].address?.id);
      setEditable(false);
    }
  }, [data]);

  const handleSubmit = useCallback(() => {
    const { id, address, __typename, birthday, ...restUser } = user;
    createUserRequest({
      variables: {
        input: {
          ...restUser,
          profileId: id,
          userId: Number(userId),
          addressId: selectedAddress,
          gender,
          birthday: birthday.replace(/\./g, '-'),
        },
      },
    });
    setEditable(false);
  }, [user, selectedAddress, gender]);

  const handleChangeEditable = useCallback(() => {
    if (editable) {
      handleSubmit();
    } else {
      setEditable(!editable);
    }
  }, [editable, user, handleSubmit, selectedAddress]);

  const styleForm: ViewStyle = {
    alignItems: !editable ? 'flex-start' : 'center',
    paddingHorizontal: !editable ? 15 : 0,
  };

  const handleChangeGender = useCallback(
    (gender: Action) => {
      setGender(gender.id);
    },
    [gender],
  );

  const handleChangeAddress = useCallback(
    (address: string | number) => {
      setAddress(Number(address));
    },
    [addresses, selectedAddress],
  );

  const onGoBach = useCallback(() => {
    navigation.navigate('Main');
  }, []);

  const color = editable ? COLORS.orange : COLORS.green;
  const label = editable ? 'Сохранить' : 'Изменить';

  const handleChangeForm = useCallback(
    (key: any) => {
      return (value: any) => {
        setUser({ ...user, [key]: value });
      };
    },
    [user, setUser],
  );

  const renderGenderSelection = useCallback(() => {
    if (editable) {
      return (
        <SelectButtonGroup
          onSelect={handleChangeGender}
          actions={defaultData}
          selectedAction={selectedGender}
        />
      );
    }

    return <Text>{selectedGender?.label}</Text>;
  }, [editable, gender]);

  const renderAddresses = useCallback(() => {
    if (editable) {
      return (
        <Dropdown
          selectedValue={String(selectedAddress)}
          onSelect={handleChangeAddress}
          list={addressesList}
        />
      );
    }
    const findAddress = addressesList.find(
      (address) => Number(selectedAddress) === Number(address.id),
    );

    return (
      <View>
        <Text style={styles.dropdownLabel}>СТО</Text>
        <Text>{findAddress?.address}</Text>
      </View>
    );
  }, [addressesList, editable]);

  if (!token || !userId || loading || createUserLoading) {
    return (
      <View style={styles.containerLoading}>
        <Loader size={50} />
      </View>
    );
  }

  // if (!data || error) {
  //   const title = !data
  //     ? 'Ошибка загрузки данных'
  //     : 'Произошла ошибка уже исправляем';
  //   return <ErrorBoundry title={title} />;
  // }

  let birthday = null;
  if (!editable && user.birthday) {
    if (user.birthday.includes('-')) {
      birthday = user.birthday.split('-').reverse().join('.');
    } else {
      birthday = user.birthday.split('.').reverse().join('.');
    }
  }

  const callbackLogout = () => {
    navigation.navigate('Login');
  };

  const handleLogout = () => {
    AuthService.logout(callbackLogout);
  };

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        onPressLeftAction={onGoBach}
        onPressRightAction={!editable ? handleLogout : () => {}}
        rightIcon={
          !editable && <Icon size={20} name="logout" color={COLORS.gray} />
        }
        content={<Text style={styles.title}>Профиль</Text>}
      />
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
      <Modal isVisible={isOpenAddModal} onCancel={() => setOpenAddModal(false)}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <TextInputMask
              style={{
                borderWidth: 1,
                height: 40,
                borderRadius: 5,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                width: 80,
                textAlign: 'center',
              }}
              // style={[styles.input, styles.inputField, customStyles, style]}
              // value={String(value || '')}
              onChangeText={() => {}}
              mask={'{E} [000] КХ'}
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
        </View>
      </Modal>
      <View style={styles.content}>
        <ScrollView>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            <Box
              bg="white"
              style={{ margin: 8, marginLeft: 20, padding: 6 }}
              shadow={2}
              rounded="lg">
              <TouchableOpacity
                onPress={() => setOpenDetail(true)}
                style={{ height: '100%' }}>
                <Text>Автомабиль</Text>
                <Text style={{ fontWeight: 'bold' }}>AUDI A6</Text>
                <Text style={{ fontWeight: 'bold' }}>H 553 PO 178</Text>
              </TouchableOpacity>
            </Box>
            <Box
              bg="white"
              style={{ margin: 8, padding: 6 }}
              shadow={2}
              rounded="lg">
              <TouchableOpacity
                onPress={() => setOpenDetail(true)}
                style={{ height: '100%' }}>
                <Text>Автомабиль</Text>
                <Text style={{ fontWeight: 'bold' }}>AUDI A6</Text>
                <Text style={{ fontWeight: 'bold' }}>H 553 PO 178</Text>
              </TouchableOpacity>
            </Box>
            <Box
              bg="white"
              style={{ margin: 8, padding: 6 }}
              shadow={2}
              rounded="lg">
              <TouchableOpacity
                onPress={() => setOpenDetail(true)}
                style={{ height: '100%' }}>
                <Text>Автомабиль</Text>
                <Text style={{ fontWeight: 'bold' }}>AUDI A6</Text>
                <Text style={{ fontWeight: 'bold' }}>H 553 PO 178</Text>
              </TouchableOpacity>
            </Box>
            <Box
              bg="white"
              style={{ margin: 8, marginRight: 20, padding: 6 }}
              shadow={2}
              rounded="lg">
              <TouchableOpacity
                onPress={() => setOpenDetail(true)}
                style={{ height: '100%' }}>
                <Text>Автомабиль</Text>
                <Text style={{ fontWeight: 'bold' }}>AUDI A6</Text>
                <Text style={{ fontWeight: 'bold' }}>H 553 PO 178</Text>
              </TouchableOpacity>
            </Box>
            <Box
              bg="white"
              style={{ margin: 8, marginRight: 20, padding: 6 }}
              shadow={2}
              rounded="lg">
              <TouchableOpacity
                style={{ height: '100%', justifyContent: 'center' }}
                onPress={() => setOpenAddModal(true)}>
                <Text style={{ color: 'blue' }}>Добавить автомобиль</Text>
              </TouchableOpacity>
            </Box>
          </ScrollView>
          <View style={styles.field}>
            <View style={[styles.form, styleForm]}>
              <View style={styles.flex}>
                <FormField
                  type="text"
                  customTextStyle={{ fontSize: 24 }}
                  value={user.name || ''}
                  editable={editable}
                  placeholder="Фамилия"
                  onChange={handleChangeForm('surname')}
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  type="text"
                  customTextStyle={{ fontSize: 24 }}
                  value={user.name || ''}
                  editable={editable}
                  placeholder="Имя"
                  onChange={handleChangeForm('name')}
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  type="text"
                  customTextStyle={{ fontSize: 24 }}
                  value={user.name || ''}
                  editable={editable}
                  placeholder="Отчество"
                  onChange={handleChangeForm('lastname')}
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  editable={editable}
                  placeholder="Дата и год рождения"
                  type="date"
                  value={!editable ? birthday : user.birthday}
                  onChange={handleChangeForm('birthday')}
                />
              </View>
              <TextInputMask
                autoFocus
                value={user.number}
                mask={'+7 ([000]) [000] [00] [00]'}
                placeholder="(___) ___ __ __"
                style={styles.formField}
                onChangeText={(value: any, value2?: any) => {
                  handleChangeForm('number')(value2 || value);
                }}
                onSubmitEditing={handleSubmit}
              />
              <View style={styles.flex}>
                <FormField
                  type="text"
                  editable={editable}
                  customTextStyle={{ fontSize: 16 }}
                  placeholder="Email"
                  value={user.email || ''}
                  onChange={handleChangeForm('email')}
                />
              </View>
              <Text
                style={[styles.titleMin, { marginLeft: 40, marginTop: 10 }]}>
                Выбрать регион
              </Text>
              <Dropdown
                onSelect={(id: any) => setLocation(id)}
                selectedValue={location}
                list={locations}
              />
              <View style={[styles.flex, { paddingTop: 25 }]}>
                {renderGenderSelection()}
              </View>
              <View style={styles.hr} />
              {renderAddresses()}
            </View>
          </View>
        </ScrollView>
        <View style={styles.center}>
          <Button
            bgColor={color}
            onClick={handleChangeEditable}
            label={label}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginRight: 10,
    elevation: 1,
    padding: 5,
  },
  formField: {
    width: Dimensions.get('screen').width - 40,
    minHeight: 50,
    fontSize: 18,
    marginBottom: 5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: COLORS.bgColorLight,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingLeft: 20,
    marginTop: 25,
  },
  titleMin: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
    fontFamily: 'gothammedium.ttf',
    textAlign: 'left',
    width: '100%',
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingTop: 20,
  },
  hr: {
    height: 2,
    width: Dimensions.get('screen').width - 40,
    backgroundColor: COLORS.lightGray,
    marginVertical: 30,
  },
  dropdownLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  form: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  center: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  label: {},
  value: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  flex: {},
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  field: {
    paddingVertical: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default User;
