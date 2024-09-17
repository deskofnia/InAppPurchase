import React from 'react';
import { setup } from 'react-native-iap';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './navigators/StackNavigator';
import "react-native-gesture-handler";

// import { StackNavigator } from './navigators';
setup({ storekitMode: 'STOREKIT2_MODE' });

export const MyApp = () => (
  <NavigationContainer>
    <StackNavigator />
  </NavigationContainer>
);
