/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/AntDesign';
import { useMutation, useQuery } from '@apollo/client';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import FormField from '../components/FormField';
import HeaderProject from '../components/HeaderProject';
import { Action } from '../components/SelectButtonGroup';
import { API_URL, COLORS, token } from '../constants';
import Loader from '../components/Loader';
import { UserMock } from '../typings/userProfile';
import { useAsyncStorage } from '../hooks/asyncStorage';
import { CREATE_USER_PROFILE } from '../graph/mutations/createUser';
import { GET_USER_PROFILES } from '../graph/queries/getProfiles';
import { GET_ADDRESSES } from '../graph/queries/getAddresses';
import { AddressType, ProfileType } from '../typings/graphql';
import { AuthService } from '../services/AuthService';
import { Box, Modal as ModalNative } from 'native-base';
import Modal from '../components/Modal';
import TextInputMask from 'react-native-text-input-mask';
import AsyncStorage from '@react-native-community/async-storage';
import SliderCars from '../components/SliderCars';
import { connect } from 'react-redux';
import { setLocation } from '../../actions';

interface IExternalProps {}

interface IProps extends IExternalProps {
  setLocation: any;
  activeLocation: any;
}

// const defaultData: Action[] = [
//   {
//     id: 0,
//     label: 'Женщина',
//   },
//   {
//     id: 1,
//     label: 'Мужчина',
//   },
// ];

const User: FC<IProps> = (props) => {
  const navigation = useNavigation();
  const [editable, setEditable] = useState(true);
  const [userId] = useAsyncStorage('userId');
  const [userData] = useAsyncStorage('userData');
  const [profileId] = useAsyncStorage('profileId');
  const [gender, setGender] = useState<number>(0);
  const [selectedAddress, setAddress] = useState<number | null>(null);
  const [disabledPhone, setDisabledPhone] = useState(false);
  const [regionId] = useAsyncStorage('regionId');
  const [
    createUserRequest,
    { data: createUser, loading: createUserLoading },
  ] = useMutation(CREATE_USER_PROFILE);
  const { data, loading, refetch } = useQuery(GET_USER_PROFILES, {
    variables: { userId: Number(userId) },
    skip: !userId,
  });
  const { data: addressesData } = useQuery(GET_ADDRESSES);
  const [user, setUser] = useState<any>({});
  const [load, setLoading] = useState(false);
  const addresses: AddressType[] = addressesData?.addresses || [];
  const [locations, setLocations] = useState<any>([]);
  // const [location, setLocation] = useState<any>(regionId || null);
  const { setLocation, activeLocation: location } = props;

  useEffect(() => {
    if (regionId !== location && regionId) {
      setLocation(regionId);
    }
  }, [regionId]);

  const handleChangeLocation = (l: any) => {
    setLocation(l);
    (async () => {
      await AsyncStorage.setItem('regionId', l);
    })();
  };
  const getUser = () => {
    const user = JSON.parse(userData);
    if (!user) {
      return;
    }
    const f = new FormData();
    f.append('user_id', user.id);

    fetch(`${API_URL}/1/mobile/user/profile/?token=${token}`, {
      body: f,
      method: 'POST',
    })
      .then((response) => console.log(response))
      .then(async (data) => {
        console.log(data);
        const phone = await AsyncStorage.getItem('phone');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    (async () => {
      getUser();
      setLoading(true);
      const phone = await AsyncStorage.getItem('phone');
      if (phone && !user.phone) {
        if (userData) {
          setUser({
            ...JSON.parse(userData),
            number: phone,
          });
        } else {
          setUser({
            ...user,
            number: phone,
          });
        }

        setLoading(false);
      } else {
        if (userData) {
          setUser(JSON.parse(userData));
        }
        setLoading(false);
      }
    })();
  }, [userData]);

  useEffect(() => {
    fetch(`/1/mobile/location/cities/?token`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.data) {
          setLocations([]);
          return;
        }
        setLocations(
          data.data?.reduce((arr: any, item: any) => {
            if (
              item.City.name === 'Москва' ||
              item.City.name === 'Санкт-Петербург'
            ) {
              return [
                {
                  ...item.City,
                  label: item.City.name,
                  value: item.City.id,
                },
                ...arr,
              ];
            }

            return arr;
          }, []),
        );
      });
  }, []);

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
    const { id, address, __typename, date_of_birth, ...restUser } = user;
    createUserRequest({
      variables: {
        input: {
          ...restUser,
          profileId: id,
          userId: Number(userId),
          addressId: selectedAddress,
          gender,
          date_of_birth: date_of_birth.replace(/\./g, '-'),
        },
      },
    });
    setEditable(false);
  }, [user, selectedAddress, gender]);

  const saveUserData = async () => {
    if (!userData) {
      return;
    }
    setLoading(true);
    const userD = JSON.parse(userData);
    const formData = new FormData();
    const userDataForm = {
      user_id: userD.id,
      city_id: location,
      ...user,
    };

    await AsyncStorage.setItem('userData', JSON.stringify(userDataForm));
    Object.entries(userDataForm).forEach(([key, value]) =>
      formData.append(key, value),
    );
    fetch(`${API_URL}/1/mobile/user/save_profile/?token=${token}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'result');
      })
      .finally(() => setLoading(false));
  };

  const styleForm: ViewStyle = {
    alignItems: !editable ? 'flex-start' : 'center',
    paddingHorizontal: !editable ? 15 : 0,
  };

  const onGoBach = useCallback(() => {
    navigation.navigate('Main');
  }, []);

  // const color = editable ? COLORS.orange : COLORS.green;
  // const label = editable ? 'Сохранить' : 'Изменить';

  const handleChangeForm = useCallback(
    (key: any) => {
      return (value: any) => {
        setUser({ ...user, [key]: value });
      };
    },
    [user, setUser],
  );

  if (load) {
    return (
      <View style={styles.containerLoading}>
        <Loader size={50} />
      </View>
    );
  }

  let date_of_birth = null;
  if (!editable && user.date_of_birth) {
    if (user.date_of_birth.includes('-')) {
      date_of_birth = user.date_of_birth.split('-').reverse().join('.');
    } else {
      date_of_birth = user.date_of_birth.split('.').reverse().join('.');
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
      <View style={styles.content}>
        <ScrollView>
          <SliderCars hideDetails />
          <View style={[styles.field, { marginTop: 10 }]}>
            <View style={[styles.form, styleForm]}>
              <View style={{ flexDirection: 'row' }}>
                <TextInputMask
                  editable={disabledPhone}
                  autoFocus
                  value={user.number}
                  mask={'+7 ([000]) [000] [00] [00]'}
                  placeholder="(___) ___ __ __"
                  style={[styles.formField, { width: '72%', marginRight: 10 }]}
                  onChangeText={(value: any, value2?: any) => {
                    handleChangeForm('number')(value2 || value);
                  }}
                  onSubmitEditing={saveUserData}
                />
                <Button
                  onClick={() => setDisabledPhone(!disabledPhone)}
                  customStyles={{
                    width: '15%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 200,
                    backgroundColor: COLORS.lightOrange,
                  }}
                  icon={
                    disabledPhone ? (
                      <MaterialIcon name="pencil-outline" size={20} />
                    ) : (
                      <MaterialIcon name="pencil-off-outline" size={20} />
                    )
                  }
                />
              </View>
              <Text
                style={[styles.titleMin, { marginLeft: 40, marginTop: 10 }]}>
                Выбрать регион
              </Text>
              <Dropdown
                onSelect={handleChangeLocation}
                selectedValue={location}
                list={locations}
              />
              <View style={styles.flex}>
                <FormField
                  type="text"
                  customTextStyle={{ fontSize: 24 }}
                  value={user.lastname || ''}
                  editable={editable}
                  placeholder="Фамилия"
                  onChange={handleChangeForm('lastname')}
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  type="text"
                  customTextStyle={{ fontSize: 24 }}
                  value={user.firstname || ''}
                  editable={editable}
                  placeholder="Имя"
                  onChange={handleChangeForm('firstname')}
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  type="text"
                  customTextStyle={{ fontSize: 24 }}
                  value={user.middlename || ''}
                  editable={editable}
                  placeholder="Отчество"
                  onChange={handleChangeForm('middlename')}
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  editable={editable}
                  placeholder="Дата и год рождения"
                  type="date"
                  value={!editable ? date_of_birth : user.bday}
                  onChange={handleChangeForm('bday')}
                />
              </View>
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
              {/* <View style={[styles.flex, { paddingTop: 25 }]}>
                {renderGenderSelection()}
              </View> */}
              {/* <View style={styles.hr} />
              {renderAddresses()} */}
            </View>
          </View>
        </ScrollView>
        <View style={styles.center}>
          <Button onClick={saveUserData} label="Сохранить" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('screen').width - 100,
  },
  formField: {
    width: Dimensions.get('screen').width - 40,
    minHeight: 50,
    fontSize: 18,
    // marginBottom: 5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: COLORS.bgColorLight,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingLeft: 20,
    // marginTop: 25,
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
    paddingTop: 10,
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
    // paddingVertical: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps, { setLocation })(User);
