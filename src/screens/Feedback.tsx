import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
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
import { API_URL, COLORS } from '../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import StarRating from 'react-native-star-rating';
import { useNavigation } from '@react-navigation/native';
import { NotifierRoot } from 'react-native-notifier';
import FormField from '../components/FormField';
import { CREATE_REVIEW } from '../graph/mutations/createReview';
import { useMutation, useQuery } from '@apollo/client';
import { useAsyncStorage } from '../hooks/asyncStorage';
import Loader from '../components/Loader';
import Dropdown from '../components/Dropdown';
import { GET_ADDRESSES } from '../graph/queries/getAddresses';
import { AddressType } from '../typings/graphql';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const Feedback: FC<IProps> = () => {
  const navigation = useNavigation();
  const [address, setAddress] = useState<any>(0);
  const [starCount, setStarCount] = useState(0);
  const [date, setDate] = useState<any>(new Date());
  const [feedback, setFeedback] = useState('');
  const [userId] = useAsyncStorage('userId');
  const [createReview, { data, loading }] = useMutation(CREATE_REVIEW);
  const notifier = useRef<any>(null);
  const [locations, setLocations] = useState<any>([]);
  const [location, setLocation] = useState<any>(null);
  const [addressesList, setAddresses] = useState<any>([]);

  useEffect(() => {
    fetch(
      `${API_URL}/1/mobile/location/list/?token=b4831f21df6202f5bacade4b7bbc3e5c&location_type=sto${
        location ? `&city_id=${location}` : ''
      }`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.data) {
          setAddresses([]);
        }
        setAddresses(
          data.data.map((item: any) => ({
            ...item.Location,
            label: item.Location.address,
            value: item.Location.id,
          })),
        );
      });
  }, [location]);

  useEffect(() => {
    fetch(
      `${API_URL}/1/mobile/location/cities/?token=b4831f21df6202f5bacade4b7bbc3e5c`,
    )
      .then((response) => response.json())
      .then((data) =>
        setLocations(
          data.data.map((item: any) => ({
            ...item.City,
            label: item.City.name,
            value: item.City.id,
          })),
        ),
      );
  }, []);

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

  const handleSelectAddress = useCallback(
    (id) => {
      setAddress(id);
    },
    [address],
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
          content={<Text style={styles.title}>МОИ ОБРАЩЕНИЯ</Text>}
        />
        <View style={[styles.content, styles.flexContent]}>
          <View>
            <Text style={styles.subtitle}>
              Оставьте, пожалуйста, отзыв о посещении автосервиса Кореаны
            </Text>
            <View style={styles.form}>
              {/* <FormField
                editable
                placeholder="Date"
                dateFormat="hh:mm DD.MM.YYYY"
                type="date"
                value={date}
                onChange={handleChangeDate}
              /> */}
              <View style={styles.inputBlock}>
                <FormField
                  labelStyles={styles.titleMin}
                  label="ОСТАВЬТЕ ПОЖАЛУЙСТА ОТЗЫВ О ВАШЕМ ВИЗИТЕ"
                  editable
                  multiline
                  numberOfLines={6}
                  placeholder="Отзыв"
                  type="text"
                  maxLength={255}
                  value={feedback}
                  onChange={handleChangeFeedback}
                  underlineColorAndroid={COLORS.transparent}
                />
              </View>
              <Text style={styles.titleMin}>ВЫБЕРИТЕ РЕГИОН</Text>
              <Dropdown
                onSelect={(id: any) => setLocation(id)}
                selectedValue={location}
                list={locations}
              />
              <Text style={[styles.titleMin, { marginTop: 10 }]}>
                ПОДРАЗДЕЛЕНИЕ О КОТОРОМ ОСТАВЛЕН ОТЗЫВ
              </Text>
              {/* <FormField
                customStyles={styles.formField}
                type="text"
                placeholder="Укажите вид работ"
                editable
                onChange={setWorkKind}
                value={workKind}
              /> */}
              <Dropdown
                onSelect={handleSelectAddress}
                selectedValue={address}
                list={addressesList}
              />

              <View
                style={{
                  marginTop: 50,
                  marginBottom: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    ОЦЕНКА УРОВНЯ СЕРВИСА
                  </Text>
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
                </View>
              </View>
              <Button onClick={handleCreateReview} label="Отправить" />
            </View>
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
  titleMin: {
    fontSize: 10,
    marginBottom: 4,
    fontWeight: 'bold',
    paddingLeft: 0,
    fontFamily: 'gothammedium.ttf',
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
