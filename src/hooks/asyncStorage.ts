import AsyncStorage from '@react-native-community/async-storage';
import { useEffect, useState, useCallback } from 'react';

export const useAsyncStorage = (key: string): any => {
  const [state, setState] = useState<any>(null);

  const getAsyncStorage = useCallback(async () => {
    const result = await AsyncStorage.getItem(key);
    setState(result);
  }, [state, setState]);

  useEffect(() => {
    getAsyncStorage();
  }, []);

  return [state];
};
