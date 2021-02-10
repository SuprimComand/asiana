import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderProject from '../components/HeaderProject';
import { COLORS } from '../constants';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Contacts: FC<IProps> = () => {
  const navigation = useNavigation();

  const onGoBach = useCallback(() => {
    navigation.goBack();
  }, []);

  const goToService = useCallback(() => {
    navigation.navigate('AutoService');
  }, []);

  const goToShop = useCallback(() => {
    navigation.navigate('AutoShop');
  }, []);

  const goToShow = useCallback(() => {
    navigation.navigate('AutoShow');
  }, []);

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        onPressLeftAction={onGoBach}
        content={<Text style={styles.title}>Контакты</Text>}
      />
      <View style={styles.content}>
        <TouchableOpacity onPress={goToService} style={styles.link}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Автосервисы</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToShop} style={styles.link}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Магазины</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToShow} style={styles.link}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Автосалоны</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    marginBottom: 30,
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingTop: 40,
  },
  content: {
    padding: 20,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 2, height: 10 },
    borderRadius: 4,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Contacts;
