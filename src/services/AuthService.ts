import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
const URL = 'https://app.asianaauto.ru/v1.1';

const deviceId = DeviceInfo.getDeviceId();
const deviceType = Platform.OS;

type ILoginType = {
  phone: string;
};

export class AuthService {
  static login = async ({ phone }: ILoginType) => {
    const response = await fetch(`${URL}/auth/phone`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ phone, deviceId, type: deviceType }),
    });

    const data = await response.json();
    if (String(data.status) === '401') {
      const refresh = await AsyncStorage.getItem('refresh');
      AuthService.refreshToken(refresh || undefined);
      return false;
    }
    if (String(data.status) === '200') {
      return true;
    }
  };

  static sendCode = async (code: string) => {
    const response = await fetch(`${URL}/auth/code`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ code, deviceId, type: deviceType }),
    });
    const data = await response.json();

    if (String(data.status) === '200') {
      const { refresh, token, id } = data;
      await AsyncStorage.setItem('refresh', refresh);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', String(id));
      return data;
    }

    return false;
  };

  static logout = async (callback?: () => void) => {
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('userId', '');
    await AsyncStorage.setItem('refresh', '');
    if (callback) {
      callback();
    }
  };

  static refreshToken = async (refresh?: string) => {
    if (!refresh) {
      return null;
    }
    const response = await fetch(`${URL}/token/refresh`);
    const data = await response.json();
    if (data.status === 200) {
      return data;
    }

    return false;
  };
}
