import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState, useCallback } from 'react';

export const useAsyncStorage = (key: string): any => {
  const navigation = useNavigation();
  const [state, setState] = useState<any>(null);
  const [attempt, setAttempt] = useState(0);

  const getAsyncStorage = useCallback(async () => {
    const result = await AsyncStorage.getItem(key);
    if (result) {
      setState(result);
    } else {
      if (attempt < 3) {
        setState(undefined);
        setAttempt(attempt + 1);
      }
    }
  }, [state, setState, attempt]);

  useFocusEffect(() => {
    getAsyncStorage();
  });

  useEffect(() => {
    getAsyncStorage();
  }, [attempt, navigation.isFocused()]);

  return [state, setState];
};
