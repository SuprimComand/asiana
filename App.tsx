/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useRef } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import StackNavigation from './src/navigations/stackNavigation';
import configureApolloo from './src/configureApollo';
import { ApolloProvider, useMutation } from '@apollo/client';
import { NotifierWrapper } from 'react-native-notifier';
import ErrorBoundry from './src/components/ErrorBoundry';
import PushNotification from 'react-native-push-notification';
import { BackHandler, Platform, PushNotificationIOS } from 'react-native';
import { NotifierRoot } from 'react-native-notifier';
import { CREATE_PUSH_TOKEN } from './src/graph/mutations/createPushToken';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeBaseProvider } from 'native-base';

console.disableYellowBox = true;
// @ts-ignore
if (Text.defaultProps == null) {
  // @ts-ignore
  Text.defaultProps = {};
}
Text.defaultProps.allowFontScaling = false;

export const client = configureApolloo();

const deviceId = DeviceInfo.getDeviceId();

export const Notification = () => {
  const notifier = useRef<any>(null);

  const [createPushToken] = useMutation(CREATE_PUSH_TOKEN);

  useEffect(() => {
    // PushNotification.localNotification({
    //   autoCancel: true,
    //   largeIcon: "ic_launcher",
    //   smallIcon: "ic_notification",
    //   bigText: "My big text that will be shown when notification is expanded",
    //   subText: "This is a subText",
    //   color: "green",
    //   vibrate: true,
    //   vibration: 300,
    //   title: "Notification Title",
    //   message: "Notification Message",
    //   playSound: true,
    //   soundName: 'default',
    //   actions: ["Accept", "Reject"],
    // });
    PushNotification.configure({
      onRegister: function (token) {
        createPushToken({
          variables: {
            input: {
              value: token,
              deviceId,
            },
          },
        });
      },

      onNotification: function (notification: any) {
        console.log('NOTIFICATION:', notification);

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      // Android only
      // @ts-ignore
      senderID: '301674512111',
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return <NotifierRoot ref={notifier} />;
};

class App extends React.Component {
  state = {
    error: null,
  };

  componentDidCatch(err: any) {
    this.setState({ error: JSON.stringify(err.message) });
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <ErrorBoundry title={String(error)} />;
    }

    return (
      <ApolloProvider client={client}>
        <NotifierWrapper>
          <NativeBaseProvider>
            <NavigationContainer>
              <StackNavigation />
            </NavigationContainer>
          </NativeBaseProvider>
        </NotifierWrapper>
      </ApolloProvider>
    );
  }
}

export default App;
