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
import ErrorBoundry from './src/components/ErrorBoundry';

export const client = configureApolloo();

class App extends React.Component {
  state = {
    error: null,
  };

  componentDidCatch(err: any) {
    this.setState({ error: JSON.stringify(err) });
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <ErrorBoundry title={String(error)} />;
    }

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
