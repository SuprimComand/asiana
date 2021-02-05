import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { gql, useMutation, useQuery } from '@apollo/client';
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
  const [
    createUserRequest,
    { data: createUser, loading: createUserLoading },
  ] = useMutation(CREATE_USER_PROFILE);
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILES, {
    variables: { userId: Number(userId) },
    skip: !userId,
  });
  const { data: addressesData } = useQuery(GET_ADDRESSES);
  const [user, setUser] = useState<ProfileType>(UserMock);
  const addresses: AddressType[] = addressesData?.addresses || [];
  const selectedGender = useMemo(
    () => defaultData.find((item) => item.id === gender),
    [gender],
  );

  const addressesList = useMemo(() => {
    if (!Array.isArray(addresses)) {
      return [];
    }

    return addresses.map((item: AddressType) => ({
      ...item,
      label: item.address,
      value: String(item.id),
    }));
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
    const { id, address, __typename, ...restUser } = user;

    createUserRequest({
      variables: {
        input: {
          ...restUser,
          profileId: id,
          userId: Number(userId),
          addressId: selectedAddress,
          gender,
        },
      },
    });
    setEditable(false);
  }, [user, selectedAddress]);

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
    navigation.goBack();
  }, []);

  const color = editable ? COLORS.orange : COLORS.green;
  const label = editable ? 'Сохранить' : 'Изменить';

  const handleChangeForm = useCallback(
    (key: keyof ProfileType) => {
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

  if (!data || error) {
    const title = !data
      ? 'Ошибка загрузки данных'
      : 'Произошла ошибка уже исправляем';
    return <ErrorBoundry title={title} />;
  }

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        onPressLeftAction={onGoBach}
        rightIcon={<Icon size={20} name="logout" color={COLORS.gray} />}
        content={<Text style={styles.title}>Профиль</Text>}
      />
      <View style={styles.content}>
        <ScrollView>
          <View style={styles.field}>
            <View style={[styles.form, styleForm]}>
              <View style={styles.flex}>
                <FormField
                  type="text"
                  customTextStyle={{ fontSize: 24 }}
                  value={user.name || ''}
                  editable={editable}
                  placeholder="ФИО"
                  onChange={handleChangeForm('name')}
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
              <View style={styles.flex}>
                <FormField
                  editable={editable}
                  placeholder="Date"
                  type="date"
                  value={user.birthday}
                  onChange={handleChangeForm('birthday')}
                />
              </View>
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
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingTop: 40,
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
