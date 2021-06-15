import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderProject from '../components/HeaderProject';
import { COLORS } from '../constants';
import CardStock from '../components/CardStock';
import { FlatList } from 'react-native-gesture-handler';
import Loader from '../components/Loader';
import { ActionType } from '../typings/graphql';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Stocks: FC<IProps> = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<ActionType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      'http://test-rest-api.site/api/1/mobile/action/list/?token=b4831f21df6202f5bacade4b7bbc3e5c',
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setItems(data.data);
      });
  }, []);

  const onGoBack = useCallback(() => {
    navigation.navigate('Stock');
  }, [navigation]);

  const handleSelectStock = useCallback(
    (id: number) => {
      navigation.navigate('StockDetails', { stockId: id });
    },
    [navigation],
  );

  const renderCard = useCallback(
    ({ item: { Action: item } }) => {
      return (
        <CardStock
          onPress={handleSelectStock}
          customStyles={styles.card}
          {...item}
        />
      );
    },
    [handleSelectStock],
  );

  // const handleSearch = useCallback(
  //   (value: string) => {
  //     setItems(
  //       data?.actions.filter((item: ActionType) =>
  //         item.title.toLowerCase().includes(value.toLowerCase()),
  //       ) || items,
  //     );
  //   },
  //   [items],
  // );

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <Loader size={50} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Акции</Text>}
        onPressLeftAction={onGoBack}
      />
      <View style={styles.content}>
        <ScrollView style={styles.dataContent}>
          <FlatList
            data={items}
            renderItem={renderCard}
            keyExtractor={({ Action: item }: any) => String(item.id)}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  dataContent: {
    flex: 1,
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
