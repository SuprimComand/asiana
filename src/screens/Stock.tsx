import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../components/Button';
import { IStockType } from '../components/CardStock';
import HeaderProject from '../components/HeaderProject';
import Loader from '../components/Loader';
import { COLORS } from '../constants';
import { DATA_STOCKS } from './Stocks';

interface IExternalProps {
  route: any; // TODO: fix this
}

interface IProps extends IExternalProps {}

const Stock: FC<IProps> = ({ route }) => {
  const [stock, setStock] = useState<IStockType | null>(null);
  const navigation = useNavigation();

  const { stockId } = route.params;

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  useEffect(() => {
    const findStock = DATA_STOCKS.find((item) => item.id === stockId);
    setStock(findStock || null);
  }, [stockId]);

  const renderContent = useCallback(() => {
    if (!stock) {
      return <Loader />;
    }

    return (
      <View style={styles.content}>
        <ScrollView>
          <View>
            <Image style={styles.image} source={stock.image} />
            <View style={styles.dataContent}>
              <Text style={styles.stockTitle}>{stock.title}</Text>
              <Text style={styles.text}>{stock.content}</Text>
            </View>
          </View>
        </ScrollView>
        <Button label="Записаться в СТО" />
      </View>
    );
  }, [stock]);

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Акции</Text>}
        onPressLeftAction={onGoBack}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  dataContent: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  text: {
    fontSize: 16,
  },
  content: {
    paddingTop: 20,
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width,
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  stockTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width: Dimensions.get('screen').width,
  },
});

export default Stock;
