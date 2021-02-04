import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderProject from '../components/HeaderProject';
import { COLORS } from '../constants';
import Input from '../components/Input';
import CardStock from '../components/CardStock';
import stockImage from '../assets/stock-image.png';
import { FlatList } from 'react-native-gesture-handler';

export const DATA_STOCKS = Array.from({ length: 5 }).map((_, index) => ({
  id: index,
  title: `${index} Правильный шиномонтаж`,
  content: `Предлагаем на выбор два варианта данного спецпредложения: Шиномонтаж 4-х колес с балансировкой, проверкой углов установки колёс + сезонное хранение колёс)– 3700 руб. Шиномонтаж 4-х колес с балансировкой + сезонное хранение колёс + скидка 50% на проверку и регулировку углов установки колёс (по предварительной записи) – 3000 руб. `,
  image: stockImage,
}));

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Stocks: FC<IProps> = () => {
  const [items, setItems] = useState(DATA_STOCKS);
  const navigation = useNavigation();

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleSelectStock = useCallback((id: number) => {
    navigation.navigate('StockDetails', { stockId: id });
  }, []);

  const renderCard = useCallback(({ item }) => {
    return (
      <CardStock
        onPress={handleSelectStock}
        customStyles={styles.card}
        {...item}
      />
    );
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setItems(
        DATA_STOCKS.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    },
    [items],
  );

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Акции</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
        <Input
          onChange={handleSearch}
          placeholder="Поиск акций"
          icon={<Icon name="search1" size={20} color={COLORS.gray} />}
        />
        <ScrollView style={styles.dataContent}>
          <FlatList
            data={items}
            renderItem={renderCard}
            keyExtractor={(item) => String(item.id)}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  dataContent: {
    flex: 1,
    marginTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    flex: 1,
    paddingBottom: 10,
  },
});

export default Stocks;
