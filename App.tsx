/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigations/stackNavigation';
import configureApolloo from './src/configureApollo';
import { ApolloProvider } from '@apollo/client';

export const client = configureApolloo();

class App extends React.Component {
  componentDidCatch(err: any) {
    console.log('err', err);
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </ApolloProvider>
    );
  }
}

export default App;
