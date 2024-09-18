import React from 'react';
import {
  SafeAreaView,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { withIAPContext } from 'react-native-iap';
import { IndexApp } from './src';


function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <IndexApp />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default withIAPContext(App);
