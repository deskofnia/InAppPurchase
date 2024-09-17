import React from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { useIAP } from 'react-native-iap';

import { Box } from '../components/Box';
import { Heading } from '../components/Heading';
import { Row } from '../components/Row';
import { State } from '../components/State';
import { errorLog } from '../utils/logs';
import { contentContainerStyle } from '../utils/theme';

export const AvailablePurchases = () => {
  const { connected, availablePurchases, getAvailablePurchases } = useIAP();

  const handleGetAvailablePurchases = async () => {
    try {
      await getAvailablePurchases();
    } catch (error) {
      errorLog({ message: 'handleGetAvailablePurchases', error });
    }
  };

  return (
    <ScrollView contentContainerStyle={contentContainerStyle}>
      <State connected={connected} />

      <Box>
        <View style={styles.container}>
          <Heading copy="Available purchases" />

          {availablePurchases.map((availablePurchase, index) => (
            <Row
              key={availablePurchase.productId + `${index}`}
              fields={[
                {
                  label: 'Product Id',
                  value: availablePurchase.productId,
                },
              ]}
              isLast={availablePurchases.length - 1 === index}
            />
          ))}
        </View>

        <Button
          title="Get the available purchases"
          onPress={handleGetAvailablePurchases}
        />
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});
