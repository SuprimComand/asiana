import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { COLORS } from '../constants';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthService } from '../services/AuthService';
import AsyncStorage from '@react-native-community/async-storage';
import FormField from '../components/FormField';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Login: FC<IProps> = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);
  const [hasFocus, setFocus] = useState(false);

  useEffect(() => {
    const backAction = () => {
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

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const status = await AuthService.login({ phone: `7${phone}` });
    setTimeout(() => setLoading(false), 1000);

    if (status) {
      setError(false);
      AsyncStorage.setItem('phone', phone);
      return navigation.navigate('SmsCodeNotification', { phone });
    }

    setError(true);
  }, [phone]);

  const handleFocus = useCallback(
    (status: boolean) => {
      return () => {
        setFocus(status);
      };
    },
    [hasFocus],
  );

  const disabled = !hasFocus && phone.length < 10;

  return (
    <KeyboardAvoidingView style={styles.keyboard}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Введите ваш номер телефона</Text>
          <View style={styles.inputBlock}>
            <FormField
              onFocus={handleFocus(true)}
              onBlur={handleFocus(false)}
              autoFocus
              customStyles={styles.formField}
              onChange={handleChangeNumber}
              type="number"
              editable
            />
            {Boolean(hasError) && (
              <Text style={styles.errorText}>Не валидный номер</Text>
            )}
          </View>
          <Button
            loading={loading}
            disabled={disabled}
            label="Отправить код по смс"
            onClick={handleSubmit}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formField: {
    marginBottom: 20,
  },
  header: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    height: '50%',
  },
  errorText: {
    color: COLORS.red,
  },
  title: {
    color: COLORS.black,
    fontSize: 24,
  },
  form: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 20,
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
    paddingBottom: 50,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: Dimensions.get('screen').width - 120,
    height: Dimensions.get('screen').width - 120,
  },
  inputBlock: {
    marginBottom: 20,
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
