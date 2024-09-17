import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { theme } from '../utils/theme';


interface BoxProps {
  children: ReactNode;
}

export const Box = ({ children }: BoxProps) => (
  <View style={theme.box}>{children}</View>
);
