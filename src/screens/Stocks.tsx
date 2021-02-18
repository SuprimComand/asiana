import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderProject from '../components/HeaderProject';
import { COLORS } from '../constants';
import Input from '../components/Input';
import CardStock from '../components/CardStock';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from '@apollo/client';
import { GET_ACTIONS } from '../graph/queries/getActions';
import Loader from '../components/Loader';
import { ActionType } from '../typings/graphql';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Stocks: FC<IProps> = () => {
  const navigation = useNavigation();
  const { data, loading } = useQuery(GET_ACTIONS);
  const [items, setItems] = useState<ActionType[]>([]);

  useEffect(() => {
    if (data) {
      setItems(data.actions);
    }
  }, [data]);

  const onGoBack = useCallback(() => {
    navigation.navigate('Stock');
  }, []);

  const handleSelectStock = useCallback((id: number) => {
    navigation.navigate('StockDetails', { stockId: id });
  }, []);

  const renderCard = useCallback(
    ({ item }) => {
      return (
        <CardStock
          onPress={handleSelectStock}
          customStyles={styles.card}
          {...item}
        />
      );
    },
    [items],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setItems(
        data?.actions.filter((item: ActionType) =>
          item.title.toLowerCase().includes(value.toLowerCase()),
        ) || items,
      );
    },
    [items],
  );

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
            keyExtractor={(item: ActionType) => String(item.id)}
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
