import AsyncStorage from '@react-native-community/async-storage';
import { useEffect, useState, useCallback } from 'react';

export const useAsyncStorage = (key: string): any => {
  const [state, setState] = useState<any>(null);
  const [attempt, setAttempt] = useState(0);

  const getAsyncStorage = useCallback(async () => {
    const result = await AsyncStorage.getItem(key);
    if (result) {
      setState(result);
    } else {
      if (attempt < 3) {
        setAttempt(attempt + 1);
      }
    }
  }, [state, setState, attempt]);

  useEffect(() => {
    getAsyncStorage();
  }, [attempt]);

  return [state];
};
