import React, { FC } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import AutoItem from '../components/AutoItem';
import Header from '../components/Header';
import { COLORS } from '../constants';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const defaultData: any = [
  { id: 1, title: 'Mersedens Bens', checked: false },
  { id: 2, title: 'BMW M5', checked: false }
]

const MyAuto:FC<IProps> = () => {
  const renderItem = ({ item }: any) => {
    return <AutoItem {...item} key={item.id} />
  }

  return (
    <View style={styles.container}>
      <Header title="Личный кабинет" />
      <View style={styles.searchBlock}>
        <Text>Search</Text>
      </View>
      <ScrollView style={styles.content}>
        <FlatList renderItem={renderItem} data={defaultData} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: COLORS.gray
  },
  searchBlock: {
    padding: 10
  }
});

export default MyAuto;