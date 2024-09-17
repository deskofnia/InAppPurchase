import React from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { useIAP } from 'react-native-iap';

import { Box } from '../components/Box';
import { Heading } from '../components/Heading';
import { Row } from '../components/Row';
import { State } from '../components/State';
import { errorLog } from '../utils/logs';
import { contentContainerStyle } from '../utils/theme';

export const PurchaseHistory = () => {
  const { connected, purchaseHistory, getPurchaseHistory } = useIAP();

  const handleGetPurchaseHistory = async () => {
    try {
      await getPurchaseHistory();
    } catch (error) {
      errorLog({ message: 'handleGetPurchaseHistory', error });
    }
  };

  return (
    <ScrollView contentContainerStyle={contentContainerStyle}>
      <State connected={connected} />

      <Box>
        <View style={styles.container}>
          <Heading copy="Purchase histories" />

          {purchaseHistory.map((purchase, index) => (
            <Row
              key={purchase.productId}
              fields={[
                {
                  label: 'Product Id',
                  value: purchase.productId,
                },
              ]}
              isLast={purchaseHistory.length - 1 === index}
            />
          ))}
        </View>

        <Button
          title="Get the purchase histories"
          onPress={handleGetPurchaseHistory}
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
