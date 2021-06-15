import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../components/Button';
import ErrorBoundry from '../components/ErrorBoundry';
import HeaderProject from '../components/HeaderProject';
import Loader from '../components/Loader';
import { COLORS } from '../constants';

interface IExternalProps {
  route: any; // TODO: fix this
}

interface IProps extends IExternalProps {}

const Stock: FC<IProps> = ({ route }) => {
  const navigation = useNavigation();
  const { stockId } = route.params;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://test-rest-api.site/api/1/mobile/action/${stockId}/get/?token=b4831f21df6202f5bacade4b7bbc3e5c`,
    )
      .then((response) => response.json())
      .then((dataRes) => {
        setData(dataRes.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }, [setLoading, setData, stockId]);

  const onGoBack = useCallback(() => {
    navigation.navigate('Stocks');
  }, [navigation]);

  const handleClickSto = useCallback(() => {
    navigation.navigate('EntrySto');
  }, [navigation]);

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.containerLoading}>
          <Loader size={50} />
        </View>
      );
    }

    if (error) {
      return <ErrorBoundry title="Ошибка загрузки" />;
    }

    return (
      <View style={styles.content}>
        <ScrollView>
          <View>
            <Image
              style={styles.image}
              source={{
                uri: data?.image_url?.includes('http://')
                  ? data?.image_url
                  : `http://${data?.image_url}`,
              }}
            />
            <View style={styles.dataContent}>
              <Text style={styles.stockTitle}>{data?.title}</Text>
              <Text style={styles.text}>{data?.content_text}</Text>
            </View>
          </View>
        </ScrollView>
        <Button onClick={handleClickSto} label="Записаться в СТО" />
      </View>
    );
  }, [data, loading, error, handleClickSto]);

  return (
    <View style={styles.container}>
      <HeaderProject
        leftIcon={<Icon size={28} name="arrowleft" color={COLORS.darkOrange} />}
        content={<Text style={styles.title}>Акция</Text>}
        onPressLeftAction={onGoBack}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    minHeight: 300,
  },
});

export default Stock;
