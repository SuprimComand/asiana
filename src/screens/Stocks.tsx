import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderProject from '../components/HeaderProject';
import { API_URL, COLORS, token } from '../constants';
import CardStock from '../components/CardStock';
import { FlatList } from 'react-native-gesture-handler';
import Loader from '../components/Loader';
import { ActionType } from '../typings/graphql';
import Button from '../components/Button';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Stocks: FC<IProps> = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<ActionType[]>([]);
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState('');

  const request = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/1/mobile/action/list/?token=${token}`,
      );

      const data = await response.json();
      setItems(data.data);
    } catch (err: any) {
      setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    request();
  }, [navigation]);

  const onGoBack = useCallback(() => {
    navigation.navigate('Main');
  }, [navigation]);

  const handleSelectStock = useCallback(
    (id: number) => {
      navigation.navigate('StockDetails', { stockId: id });
    },
    [navigation],
  );

  const renderCard = useCallback(
    ({ item }) => {
      return (
        <CardStock
          onPress={handleSelectStock}
          customStyles={styles.card}
          {...item?.Action}
          item={item}
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

  if (error) {
    return <Text>Error: {error}</Text>;
  }

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
        <Button
          onClick={request}
          label="Обновить список"
          customStyles={styles.updateButton}
        />
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
  updateButton: {
    marginBottom: 30,
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
