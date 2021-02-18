import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
// @ts-ignore
import AutoScroll from 'react-native-auto-scroll';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Button from '../components/Button';
import HeaderProject from '../components/HeaderProject';
import { COLORS } from '../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import StarRating from 'react-native-star-rating';
import { useNavigation } from '@react-navigation/native';
import { NotifierRoot } from 'react-native-notifier';
import FormField from '../components/FormField';
import { CREATE_REVIEW } from '../graph/mutations/createReview';
import { useMutation } from '@apollo/client';
import { useAsyncStorage } from '../hooks/asyncStorage';
import Loader from '../components/Loader';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Feedback: FC<IProps> = () => {
  const navigation = useNavigation();
  const [starCount, setStarCount] = useState(0);
  const [date, setDate] = useState<any>(new Date());
  const [feedback, setFeedback] = useState('');
  const [userId] = useAsyncStorage('userId');
  const [createReview, { data, loading }] = useMutation(CREATE_REVIEW);
  const notifier = useRef<any>(null);

  useEffect(() => {
    if (data) {
      notifier.current?.showNotification({
        title: 'Отзыв успешно отправлен!!',
      });
      setFeedback('');
      setDate(new Date());
      setStarCount(0);
    }
  }, [data]);

  const onGoBach = useCallback(() => {
    navigation.navigate('Main');
  }, []);

  const handleChangeRating = useCallback(
    (count: number) => {
      setStarCount(count);
    },
    [setStarCount, starCount],
  );

  const handleChangeFeedback = useCallback(
    (value: string) => {
      setFeedback(value);
    },
    [setFeedback, feedback],
  );

  const handleCreateReview = useCallback(() => {
    if (!userId) {
      return;
    }
    if (!feedback) {
      notifier.current?.showNotification({
        title: 'Пожалуйста заполните поле отзыва!',
      });
      return;
    }
    const input = {
      userId,
      comment: feedback,
      rating: starCount,
      date,
    };
    createReview({
      variables: {
        input,
      },
    });
  }, [createReview]);

  const handleChangeDate = useCallback(
    (_: string, value: string) => {
      setDate(value);
    },
    [setDate, date],
  );

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <Loader />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.keyboard}>
      <AutoScroll style={styles.container}>
        <NotifierRoot ref={notifier} />
        <HeaderProject
          leftIcon={
            <Icon size={28} name="arrowleft" color={COLORS.darkOrange} />
          }
          onPressLeftAction={onGoBach}
          content={<Text style={styles.title}>Отзыв</Text>}
        />
        <View style={[styles.content, styles.flexContent]}>
          <View>
            <Text style={styles.subtitle}>
              Оставьте, пожалуйста, отзыв о посещении автосервиса Кореаны
            </Text>
            <View style={styles.form}>
              <StarRating
                starStyle={{ marginHorizontal: 5 }}
                containerStyle={{ marginBottom: 15 }}
                emptyStarColor={COLORS.orange}
                disabled={false}
                maxStars={5}
                rating={starCount}
                selectedStar={handleChangeRating}
                fullStarColor={COLORS.orange}
              />
              <FormField
                editable
                placeholder="Date"
                dateFormat="hh:mm DD.MM.YYYY"
                type="date"
                value={date}
                onChange={handleChangeDate}
              />
              <View style={styles.inputBlock}>
                <FormField
                  editable
                  multiline
                  numberOfLines={6}
                  placeholder="Отзыв"
                  type="text"
                  value={feedback}
                  onChange={handleChangeFeedback}
                  underlineColorAndroid={COLORS.transparent}
                />
              </View>
            </View>
            <Button onClick={handleCreateReview} label="Отправить" />
          </View>
        </View>
      </AutoScroll>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 8,
  },
  flexContent: {
    justifyContent: 'space-between',
  },
  keyboard: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  form: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 50,
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    paddingTop: 30,
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    height: Dimensions.get('screen').height - 400,
    alignItems: 'flex-start',
  },
  container: {
    height: Dimensions.get('screen').height,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  inputBlock: {
    marginBottom: 10,
  },
});

export default Feedback;
