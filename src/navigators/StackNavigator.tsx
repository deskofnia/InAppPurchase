import React from 'react';
import { withIAPContext } from 'react-native-iap';
import { createStackNavigator } from '@react-navigation/stack';


import { AvailablePurchases } from '../screens/AvailablePurchases';
import { ClassSetup } from '../screens/ClassSetup';
import { Examples } from '../screens/Examples';
import { Products } from '../screens/Products';
import { PurchaseHistory } from '../screens/PurchaseHistory';
import { Subscriptions } from '../screens/Subscriptions';
import Home from '../modules/Home';

export const examples = [
  {
    name: 'Products',
    label: 'With success and error listeners.',
    component: withIAPContext(Products),
    section: 'Context',
    color: '#47d371',
    emoji: '💵',
  },
  {
    name: 'Subscriptions',
    component: withIAPContext(Subscriptions),
    section: 'Context',
    color: '#cebf38',
    emoji: '💳',
  },
  {
    name: 'AvailablePurchases',
    component: withIAPContext(AvailablePurchases),
    section: 'Context',
    color: '#475ed3',
    emoji: '🧾',
  },
  {
    name: 'PurchaseHistory',
    component: withIAPContext(PurchaseHistory),
    section: 'Context',
    color: '#c241b3',
    emoji: '📄',
  },

  {
    name: 'PremiumMusic',
    component: Home,
    section: 'Subscription',
    color: '#b52240',
    emoji: '🎧',
  },
  {
    name: 'ClassSetup',
    component: ClassSetup,
    section: 'Others',
    color: '#0cb3b3',
    emoji: '©️',
  },

] as const;

export type Screens = {
  Examples: undefined;
  Products: undefined;
  Subscriptions: undefined;
  PurchaseHistory: undefined;
  AvailablePurchases: undefined;
  Listeners: undefined;
  ClassSetup: undefined;
  PremiumMusic: undefined;
};

const Stack = createStackNavigator<Screens>();


export const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ title: 'React Native IAP' }}>
    <Stack.Screen name="Examples" component={Examples} />

    {examples.map(({ name, component }) => (
      <Stack.Screen
        key={name}
        name={name}
        component={component}
        options={{
          title: name,
          headerBackTitle: 'Examples',
        }}
      />
    ))}
  </Stack.Navigator>
);
