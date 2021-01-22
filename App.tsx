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
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/navigations/stackNavigation';

class App extends React.Component {
  componentDidCatch(err: any) {
    console.log('err', err);
  }

  render() {
    return (
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    );
  }
}

export default App;
