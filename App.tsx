import React from 'react';
import {
  SafeAreaView,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { withIAPContext } from 'react-native-iap';
import Home from './src/modules/Home';
import { IndexApp } from './src';


function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
      {/* <Home /> */}
      <IndexApp />
      {/* </GestureHandlerRootView> */}
    </SafeAreaView>
  );
}

export default withIAPContext(App);
