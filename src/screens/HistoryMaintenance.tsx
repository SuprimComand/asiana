import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Card from '../components/Card';
import HeaderProject from '../components/HeaderProject';
import { COLORS } from '../constants';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const HistoryMaintenance: FC<IProps> = () => {
  const navigation = useNavigation();

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>История обслуживания</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
        <Card customStyles={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.fontBold}>Дальновосточный 49</Text>
            <Text style={styles.subTitle}>14:30 14.01.2021</Text>
          </View>
          <View style={styles.dataContent}>
            <Text style={styles.titleCard}>Kia Optima</Text>
            <Text style={styles.subTitle}>1.4 Turbo 160 л.с</Text>
          </View>
          <Text>
            Замена масла в двигателе, замена фильтра, плановое ТО ....
          </Text>
        </Card>
        <Card customStyles={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.fontBold}>Дальновосточный 49</Text>
            <Text style={styles.subTitle}>14:30 14.01.2021</Text>
          </View>
          <View style={styles.dataContent}>
            <Text style={styles.titleCard}>Kia Optima</Text>
            <Text style={styles.subTitle}>1.4 Turbo 160 л.с</Text>
          </View>
          <Text>
            Замена масла в двигателе, замена фильтра, плановое ТО ....
          </Text>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.lightGray,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  dataContent: {
    paddingVertical: 10,
  },
  titleCard: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  subTitle: {
    color: COLORS['gray-200'],
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default HistoryMaintenance;
