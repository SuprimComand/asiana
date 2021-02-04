import React, { FC, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderProject from '../components/HeaderProject';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../constants';
import FormField from '../components/FormField';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const EntrySto: FC<IProps> = () => {
  const navigation = useNavigation();

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Запись в СТО</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>КIA Optima</Text>
            <Text style={styles.subTitle}>1.4 Turbo 160 л.с</Text>
          </View>
          <FormField
            type="date"
            placeholder="Date"
            editable
            value="15.12.2020"
          />
          <FormField
            customStyles={styles.formField}
            type="text"
            placeholder="Укажите вид работ"
            editable
          />
          <Dropdown list={[{ label: 'Дальневосточный 49', value: '49' }]} />
        </View>
        <Button label="Отправить" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formField: {
    marginBottom: 23,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  subTitle: {
    color: COLORS['gray-200'],
  },
  card: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
});

export default EntrySto;
