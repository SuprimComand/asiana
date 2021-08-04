import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useState, useCallback } from 'react';

export const useAsyncStorage = (
  key: string,
  defaultResult?: any,
  parseJson?: boolean,
): any => {
  const [state, setState] = useState<any>(defaultResult ?? null);
  const [attempt, setAttempt] = useState(0);

  const getAsyncStorage = useCallback(async () => {
    const result = await AsyncStorage.getItem(key);

    if (result) {
      const data = parseJson ? JSON.parse(result) : result;
      if (result === (parseJson ? JSON.stringify(state) : state)) {
        return;
      }
      setAttempt(3);
      setState(data);
    } else {
      if (attempt < 3) {
        setAttempt(attempt + 1);
      }
    }
  }, [state, setState, attempt, parseJson]);

  useFocusEffect(() => {
    getAsyncStorage();
  });

  useEffect(() => {
    getAsyncStorage();
  }, [attempt]);

  return [state, setState];
};
