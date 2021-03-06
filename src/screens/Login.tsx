import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  BackHandler,
  CheckBox,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import { API_URL, COLORS, token } from '../constants';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthService } from '../services/AuthService';
import AsyncStorage from '@react-native-community/async-storage';
import FormField from '../components/FormField';
import TextInputMask from 'react-native-text-input-mask';
import Dropdown from '../components/Dropdown';
import { useAsyncStorage } from '../hooks/asyncStorage';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Login: FC<IProps> = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [regionId] = useAsyncStorage('regionId');
  const [isSelected, setSelection] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);
  const [hasFocus, setFocus] = useState(false);
  const [location, setLocation] = useState<any>(regionId || null);
  const [locations, setLocations] = useState<any>([]);
  const [closed, setClosed] = useState(false);
  const ref = useRef<any>(null);
  const routeNameRef = navigation.isFocused;

  const disabled = phone.length < 10 || !isSelected;

  const handleSubmitAuth = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('phone', `8${phone}`);
      const response = await fetch(
        `${API_URL}/1/mobile/user/auth/?token=${token}`,
        {
          method: 'POST',
          body: formData,
        },
      );
      console.log(response);
      const data = await response.json();
      setLoading(false);
      if (!data?.data) {
        return;
      }
      await AsyncStorage.setItem('phone', phone);
      await AsyncStorage.setItem('auth_id', data.data.auth_id);
      return navigation.navigate('SmsCodeNotification', { phone });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/1/mobile/location/cities/?token=${token}`)
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

  const handleChangeNumber = useCallback((formatted: any, value?: string) => {
    setPhone(value || formatted);
  }, []);

  // const handleSubmit = useCallback(async () => {
  //   if (disabled) {
  //     return;
  //   }
  //   setLoading(true);
  //   const status = await AuthService.login({ phone: `7${phone}` });
  //   setTimeout(() => setLoading(false), 1000);

  //   if (status) {
  //     Keyboard.dismiss();
  //     setError(false);
  //     setTimeout(() => {
  //       AsyncStorage.setItem('phone', phone);
  //       return navigation.navigate('SmsCodeNotification', { phone });
  //     }, 100);
  //   } else {
  //     setError(true);
  //   }
  // }, [phone, disabled]);

  const handleFocus = useCallback(
    (status: boolean) => {
      return () => {
        setFocus(status);
      };
    },
    [hasFocus],
  );

  const notification = () =>
    Alert.alert(
      '',
      '?????? ?????????????????????? ?????????????????? ???????????????????? ?????????????????????? ?? ?????????????????? ?????????????????? ???????????????????????? ????????????',
      [
        {
          text: '????????????',
          onPress: () => {},
          style: 'cancel',
        },
        { text: '????', onPress: () => setSelection(true) },
      ],
    );

  useEffect(() => {
    if (!isSelected && phone.length === 10 && !hasError) {
      notification();
    }
  }, [isSelected, phone, hasError]);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>?????????????? ?????? ?????????? ????????????????</Text>
        <View style={styles.container_form}>
          <View style={styles.inputBlock}>
            <View style={styles.container_input}>
              <View style={styles.phone}>
                <Text style={styles.phone_text}>
                  +7 <Text style={{ color: phone ? 'black' : 'gray' }}>(</Text>
                </Text>
              </View>
              <TextInputMask
                keyboardType="number-pad"
                onFocus={handleFocus(true)}
                onBlur={handleFocus(false)}
                autoFocus
                value={String(phone || '')}
                mask={'[000]) [000] [00] [00]'}
                placeholder="___) ___ __ __"
                style={styles.formField}
                onChangeText={(value: any, value2?: any) => {
                  if (handleChangeNumber) {
                    handleChangeNumber(value, value2);
                  }
                }}
                onSubmitEditing={handleSubmitAuth}
              />
              <Button
                customStyles={[
                  styles.button,
                  !disabled ? styles.activeButton : {},
                  hasError || (!isSelected && phone.length === 10 && !hasError)
                    ? styles.errorButton
                    : {},
                ]}
                loading={loading}
                disabled={disabled || !isSelected}
                label={loading ? '' : 'OK'}
                onClick={handleSubmitAuth}
              />
            </View>
          </View>
        </View>
        <View style={{ paddingLeft: 10 }}>
          {Boolean(hasError) && (
            <Text style={styles.errorText}>???? ???????????????? ??????????</Text>
          )}
        </View>
        {/* <Text style={[styles.titleMin, { paddingLeft: 25 }]}>
          ?????????????? ????????????
        </Text>
        <Dropdown
          onSelect={(id: any) => {
            setLocation(id);
            AsyncStorage.setItem('regionId', id);
          }}
          selectedValue={location}
          list={locations}
        /> */}
        <View style={styles.checkbox}>
          <CheckBox value={isSelected} onValueChange={setSelection} />
          <Text>???????????????? ???? ??????????????????</Text>
          <Text> ???????????????????????? ????????????</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formField: {
    // width: Dimensions.get('screen').width - 120,
    width: '65%',
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginBottom: 0,
    height: 50,
    fontSize: 17,
  },
  titleMin: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
    fontFamily: 'gothammedium.ttf',
  },
  container_input: {
    width: Dimensions.get('screen').width - 40,
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: COLORS.bgColorLight,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  labelCheckbox: {},
  activeButton: { backgroundColor: '#048417' },
  button: {
    paddingHorizontal: 10,
    width: '20%',
    height: 40,
    borderRadius: 6,
    backgroundColor: '#b5b5b5',
  },
  errorButton: {},
  phone_text: {
    fontSize: 17,
  },
  phone: {
    paddingLeft: 10,
  },
  container_form: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  header: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    height: '30%',
  },
  errorText: {
    color: COLORS.red,
    paddingRight: 5,
  },
  title: {
    color: COLORS.black,
    fontSize: 24,
  },
  form: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 10,
    height: Dimensions.get('screen').height / 2.5,
    width: Dimensions.get('screen').width,
  },
  keyboard: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent: 'flex-start',
    width: Dimensions.get('screen').width - 200,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    paddingTop: 150,
    paddingBottom: 120,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: Dimensions.get('screen').width - 120,
    height: Dimensions.get('screen').width - 120,
  },
  inputBlock: {
    marginBottom: 20,
    height: 50,
  },
  input: {
    width: Dimensions.get('screen').width - 40,
    height: 50,
    fontSize: 18,
    marginBottom: 5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: COLORS.lightGray,
  },
});

export default Login;
