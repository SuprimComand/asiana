import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../components/Button';
import { API_URL, COLORS, token } from '../constants';
import { AuthService } from '../services/AuthService';
import AsyncStorage from '@react-native-community/async-storage';
import FormField from '../components/FormField';
import HeaderProject from '../components/HeaderProject';
import { useAsyncStorage } from '../hooks/asyncStorage';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const SmsCodeNotification: FC<IProps> = () => {
  const [code, setCode] = useState('');
  const [hasError, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasFocus, setFocus] = useState(false);
  // const [code] = useAsyncStorage('code');
  const [auth_id] = useAsyncStorage('auth_id');
  let [timer, setTimer] = useState(240);
  const [error, setErrorMessage] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleChangeTimer = () => {
    setInterval(() => {
      if (timer) {
        setTimer(--timer);
      }
    }, 1000);
  };

  const handleCheckSms = async () => {
    if (code.length < 4) {
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('auth_id', auth_id);
      formData.append('code', code);
      const response = await fetch(
        `${API_URL}/1/mobile/user/check_code?token=${token}`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await response.json();
      setLoading(false);
      if (!data.data) {
        return;
      }
      await AsyncStorage.setItem('auth_id', data.data.auth_id);
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.data));
      return navigation.navigate('Project');
    } catch (err) {
      console.log('err', err);
      setErrorMessage('Не верный код');
    }
  };

  useEffect(() => {
    if (timer === 240) {
      handleChangeTimer();
    }
  }, [timer]);

  const onGoBack = useCallback(() => {
    navigation.navigate('Login');
  }, []);

  const handleChangeCode = useCallback((value: string) => {
    if (value.length <= 4 || value.length < code.length) {
      setCode(value);
    }
  }, []);

  // const handleSendCode = useCallback(async () => {
  //   if (code.length === 4) {
  //     setLoading(true);
  //     const data = await AuthService.sendCode(code);
  //     setTimeout(() => setLoading(false), 1000);
  //     // TODO: fix
  //     if (data) {
  //       setError(false);
  //       const { refresh, token } = data;
  //       await AsyncStorage.setItem('refresh', refresh);
  //       await AsyncStorage.setItem('token', token);
  //       return navigation.navigate('Project');
  //     }
  //     setError(true);
  //   }
  // }, [code]);

  const reSendPhone = async () => {
    const phone = await AsyncStorage.getItem('phone');
    const status = await AuthService.login({ phone: `7${phone}` });
    if (status) {
      setTimer(240);
    }
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const disableSendButton = code.length < 4;

  const errorStyle = hasError && { borderColor: COLORS.red };

  return (
    <KeyboardAvoidingView style={styles.keyboard}>
      <View style={styles.container}>
        <HeaderProject
          customStyles={styles.header}
          leftIcon={<Icon size={32} name="arrowleft" color={COLORS.orange} />}
          onPressLeftAction={onGoBack}
        />
        <View style={styles.form}>
          <Text style={styles.label}>Подтвердите код из SMS</Text>
          <View style={styles.container_form}>
            <View style={styles.inputBlock}>
              <FormField
                onFocus={handleFocus}
                textContentType="oneTimeCode"
                onBlur={handleBlur}
                autoFocus
                onSubmitEditing={handleCheckSms}
                customStyles={{ ...styles.formField, ...errorStyle }}
                onChange={handleChangeCode}
                mask="[0000]"
                keyboardType="number-pad"
                editable
              />
              {(Boolean(hasError) || Boolean(error)) && (
                <Text style={styles.errorText}>{error || 'Не верный код'}</Text>
              )}
            </View>
            <Button
              customStyles={[
                styles.button,
                !disableSendButton ? styles.activeButton : {},
                hasError || Boolean(error) ? styles.errorButton : {},
              ]}
              loading={loading}
              disabled={disableSendButton}
              label={loading ? '' : 'OK'}
              onClick={handleCheckSms}
            />
          </View>
          {timer ? (
            <Text style={styles.timerText}>Отправить повторно.. {timer}</Text>
          ) : (
            <Button
              bgColor={COLORS.transparent}
              color={COLORS.gray}
              label="Отправить повторно"
              onClick={reSendPhone}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
  },
  errorButton: { top: 26 },
  formField: {
    // width: Dimensions.get('screen').width - 120,
  },
  activeButton: { backgroundColor: '#048417' },
  button: {
    paddingHorizontal: 10,
    minWidth: 55,
    maxWidth: 85,
    height: 40,
    borderRadius: 6,
    position: 'absolute',
    backgroundColor: '#b5b5b5',
    right: 20,
  },
  timerText: {
    color: COLORS.gray,
    marginTop: 20,
  },
  form: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: Dimensions.get('screen').width,
    paddingTop: 150,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent: 'flex-start',
    textAlign: 'center',
  },
  keyboard: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    paddingBottom: 50,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  errorText: {
    color: COLORS.red,
  },
  container_form: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputBlock: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    paddingHorizontal: 10,
    borderColor: COLORS.lightGray,
    width: Dimensions.get('screen').width - 40,
    fontSize: 20,
    marginBottom: 5,
  },
});

export default SmsCodeNotification;
