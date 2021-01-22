import {useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../components/Button';
import FormField from '../components/FormField';
import HeaderProject from '../components/HeaderProject';
import {SelecterItem} from '../components/Selecter';
import {COLORS} from '../constants';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const defaultData: SelecterItem[] = [
  {
    id: 0,
    label: 'Мужчина',
    checked: true,
  },
  {
    id: 1,
    label: 'Женщина',
    checked: false,
  },
];

const User: FC<IProps> = () => {
  const navigation = useNavigation();
  const [editable, setEditable] = useState(true);
  const [gender, setGender] = useState(0);
  const [genders, setGenders] = useState<SelecterItem[]>(defaultData);

  const handleChangeEditable = useCallback(() => {
    setEditable(!editable);
  }, [editable]);

  const styleForm: ViewStyle = {
    alignItems: !editable ? 'flex-start' : 'center',
    paddingHorizontal: !editable ? 15 : 0,
  };

  const handleChangeGender = useCallback(
    (id: number | string) => {
      setGender(Number(id));
      setGenders(
        genders.map((gender: SelecterItem) =>
          gender.id === Number(id)
            ? {...gender, checked: true}
            : {...gender, checked: false},
        ),
      );
    },
    [genders, gender],
  );

  const onGoBach = useCallback(() => {
    navigation.goBack();
  }, []);

  const genderValue = gender ? 'Женский' : 'Мужской';

  const color = editable ? COLORS.orange : COLORS.green;
  const label = editable ? 'Сохранить' : 'Изменить';

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={22} name="close" color={COLORS.darkOrange} />}
        onPressLeftAction={onGoBach}
        rightIcon={<Icon size={20} name="logout" color={COLORS.gray} />}
        content={<Text style={styles.title}>Профиль</Text>}
      />
      <View style={styles.content}>
        <ScrollView>
          <View style={styles.field}>
            <View style={[styles.form, styleForm]}>
              <View style={styles.flex}>
                <FormField
                  customTextStyle={{fontSize: 24}}
                  value="Камбаев Ахмед Русланович"
                  editable={editable}
                  placeholder="ФИО"
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  editable={editable}
                  placeholder="Date"
                  type="date"
                  value="15.12.2020"
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  onChange={handleChangeGender}
                  editable={editable}
                  listSelecter={genders}
                  placeholder="Пол"
                  type="selecter"
                  value={genderValue}
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  editable={editable}
                  placeholder="Телефон"
                  type="number"
                  value="79898926633"
                />
              </View>
              <View style={styles.flex}>
                <FormField
                  editable={editable}
                  placeholder="Email"
                  value="kambaevahmed@list.ru"
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.center}>
          <Button
            bgColor={color}
            onClick={handleChangeEditable}
            label={label}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingTop: 40,
  },
  form: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  center: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  label: {},
  value: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  flex: {
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  field: {
    paddingVertical: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 30,
  },
});

export default User;
