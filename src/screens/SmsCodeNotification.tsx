import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { COLORS } from '../constants';
import { AuthService } from '../services/AuthService';
import AsyncStorage from '@react-native-community/async-storage';

interface IExternalProps {}

interface IProps extends IExternalProps {
}

const SmsCodeNotification:FC<IProps> = () => {
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
  }

  useEffect(() => {
    handleChangeTimer();
  }, []);

  const handleChangeNumber = useCallback(() => {
    navigation.navigate('Login');
  }, []);

  const handleChangeCode = useCallback((value: string) => {
    if (value.length <= 4 || value.length < code.length) setCode(value);
  }, []);

  const handleSendCode = useCallback(async () => {
    if (code.length === 4) {
      setLoading(true);
      const status = await AuthService.sendCode(code);
      setTimeout(() => setLoading(false), 1000)
      // TODO: fix
      if (status || true) {
        setError(false);
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
      handleChangeTimer();
    }
  }

  const disableSendButton = code.length < 4;

  const errorStyle = hasError && { borderColor: COLORS.red }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.keyboard}
    >
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Авторизация по номеру</Text>
          <View style={styles.inputBlock}>
            <TextInput autoFocus keyboardType="number-pad" value={code} maxLength={4} onChangeText={handleChangeCode} style={[styles.input, errorStyle]} placeholder="1234" />
            {hasError && <Text style={styles.errorText}>Не верный код</Text>}
          </View>
          <Button loading={loading} disabled={disableSendButton} customStyles={styles.button} label="Подтвердить смс" onClick={handleSendCode} />
          <Button bgColor={COLORS.lightGray} color={COLORS.gray} customStyles={styles.button} label="Изменить номер" onClick={handleChangeNumber} />
          {
            timer ? <Text style={styles.timerText}>Отправить повторно.. {timer}</Text> :
            <Button bgColor={COLORS.transparent} color={COLORS.gray} label="Отправить повторно" onClick={reSendPhone} />
          }
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  timerText: {
    color: COLORS.gray,
    marginTop: 20
  },
  form: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: Dimensions.get('screen').width,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent: 'flex-start'
  },
  keyboard: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 100
  },
  errorText: {
    color: COLORS.red
  },
  button: {
    marginBottom: 10
  },
  inputBlock: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 2,
    paddingHorizontal: 10,
    borderColor: COLORS.lightGray,
    width: Dimensions.get('screen').width - 40,
    fontSize: 20,
    marginBottom: 5
  }
});

export default SmsCodeNotification;