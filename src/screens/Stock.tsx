import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../components/Button';
import ErrorBoundry from '../components/ErrorBoundry';
import HeaderProject from '../components/HeaderProject';
import Loader from '../components/Loader';
import { COLORS } from '../constants';
import { GET_ACTION } from '../graph/queries/getAction';

interface IExternalProps {
  route: any; // TODO: fix this
}

interface IProps extends IExternalProps {}

const Stock: FC<IProps> = ({ route }) => {
  const navigation = useNavigation();
  const { stockId } = route.params;
  const { data, error, loading } = useQuery(GET_ACTION, {
    variables: {
      id: stockId,
    },
  });

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

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
              source={{ uri: String(data.action.image) }}
            />
            <View style={styles.dataContent}>
              <Text style={styles.stockTitle}>{data.action.title}</Text>
              <Text style={styles.text}>{data.action.body}</Text>
            </View>
          </View>
        </ScrollView>
        {Boolean(data.action.button) && <Button label="Записаться в СТО" />}
      </View>
    );
  }, [data, loading, error]);

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
