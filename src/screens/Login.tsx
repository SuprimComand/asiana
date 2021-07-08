import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  BackHandler,
  CheckBox,
  Alert,
} from 'react-native';
import { COLORS } from '../constants';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthService } from '../services/AuthService';
import AsyncStorage from '@react-native-community/async-storage';
import FormField from '../components/FormField';
import TextInputMask from 'react-native-text-input-mask';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Login: FC<IProps> = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [isSelected, setSelection] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);
  const [hasFocus, setFocus] = useState(false);
  const routeNameRef = navigation.isFocused;

  const disabled = phone.length < 10 || !isSelected;

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

  const handleSubmit = useCallback(async () => {
    if (disabled) {
      return;
    }
    setLoading(true);
    const status = await AuthService.login({ phone: `7${phone}` });
    setTimeout(() => setLoading(false), 1000);

    if (status) {
      setError(false);
      AsyncStorage.setItem('phone', phone);
      return navigation.navigate('SmsCodeNotification', { phone });
    }

    setError(true);
  }, [phone, disabled]);

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
      'Для продолжения установки необходимо согласиться с политикой обработки персональных данных',
      [
        {
          text: 'Отмена',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'Да', onPress: () => setSelection(true) },
      ],
    );

  useEffect(() => {
    if (!isSelected && phone.length === 10 && !hasError) {
      notification();
    }
  }, [isSelected, phone, hasError]);

  return (
    <KeyboardAvoidingView style={styles.keyboard}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Введите ваш номер телефона</Text>
          <View style={styles.container_form}>
            <View style={styles.inputBlock}>
              <View style={styles.container_input}>
                <View style={styles.phone}>
                  <Text style={styles.phone_text}>
                    +7{' '}
                    <Text style={{ color: phone ? 'black' : 'gray' }}>(</Text>
                  </Text>
                </View>
                <TextInputMask
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
                  onSubmitEditing={handleSubmit}
                />
                <Button
                  customStyles={[
                    styles.button,
                    !disabled ? styles.activeButton : {},
                    hasError ||
                    (!isSelected && phone.length === 10 && !hasError)
                      ? styles.errorButton
                      : {},
                  ]}
                  loading={loading}
                  disabled={disabled || !isSelected}
                  label={loading ? '' : 'OK'}
                  onClick={handleSubmit}
                />
              </View>
            </View>
          </View>
          <View style={{ paddingLeft: 10 }}>
            {Boolean(hasError) && (
              <Text style={styles.errorText}>Не валидный номер</Text>
            )}
          </View>
          <View style={styles.checkbox}>
            <CheckBox value={isSelected} onValueChange={setSelection} />
            <Text>Согласен на обработку</Text>
            <Text> персональных данных</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
