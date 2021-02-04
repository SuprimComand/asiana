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
import { COLORS } from '../constants';
import { AuthService } from '../services/AuthService';
import AsyncStorage from '@react-native-community/async-storage';
import FormField from '../components/FormField';
import HeaderProject from '../components/HeaderProject';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const SmsCodeNotification: FC<IProps> = () => {
  const [code, setCode] = useState('');
  const [hasError, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [timer, setTimer] = useState(60);
  const navigation = useNavigation();

  const handleChangeTimer = () => {
    setInterval(() => {
      if (timer) {
        setTimer(--timer);
      }
    }, 1000);
  };

  useEffect(() => {
    if (timer === 60) {
      handleChangeTimer();
    }
  }, [timer]);

  const onGoBack = useCallback(() => {
    navigation.navigate('Login');
  }, []);

  const handleChangeCode = useCallback((value: string) => {
    if (value.length <= 4 || value.length < code.length) setCode(value);
  }, []);

  const handleSendCode = useCallback(async () => {
    if (code.length === 4) {
      setLoading(true);
      const data = await AuthService.sendCode(code);
      setTimeout(() => setLoading(false), 1000);
      // TODO: fix
      if (data) {
        setError(false);
        const { refresh, token } = data;
        await AsyncStorage.setItem('refresh', refresh);
        await AsyncStorage.setItem('token', token);
        return navigation.navigate('Project');
      }
      setError(true);
    }
  }, [code]);

  const reSendPhone = async () => {
    const phone = await AsyncStorage.getItem('phone');
    const status = await AuthService.login({ phone: `7${phone}` });
    if (status) {
      setTimer(60);
    }
  };

  const disableSendButton = code.length < 4;

  const errorStyle = hasError && { borderColor: COLORS.red };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
      <View style={styles.container}>
        <HeaderProject
          customStyles={styles.header}
          leftIcon={<Icon size={32} name="arrowleft" color={COLORS.orange} />}
          onPressLeftAction={onGoBack}
        />
        <View style={styles.form}>
          <Text style={styles.label}>Подтвердите код из SMS</Text>
          <View style={styles.inputBlock}>
            <FormField
              autoFocus
              customStyles={{ ...styles.formField, ...errorStyle }}
              onChange={handleChangeCode}
              mask="[0000]"
              keyboardType="number-pad"
              editable
            />
            {hasError && <Text style={styles.errorText}>Не верный код</Text>}
          </View>
          <Button
            loading={loading}
            disabled={disableSendButton}
            customStyles={styles.button}
            label="Подтвердить смс"
            onClick={handleSendCode}
          />
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
  formField: {
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent: 'flex-start',
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
  button: {
    marginBottom: 10,
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
