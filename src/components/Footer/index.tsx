import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
  Product,
  type ProductPurchase,
  type SubscriptionPurchase,
  type PurchaseError,
  Subscription,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  getProducts,
  getPurchaseHistory,
  getSubscriptions,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  requestSubscription,
  validateReceiptAndroid,
  finishTransaction,
} from 'react-native-iap';
import { images } from '../../assets';
import PriceCard from '../PriceCard';
import {
  isAndroid,
  productIds,
  string,
  subscriptionIds,
} from '../../constants';
import { Colors } from '../../theme';
import { styles } from './styles';

type FooterProps = {
  setIsLoading?: (value?: boolean) => void;
  isPurchased?: boolean;
  setIsPurchased?: (value?: boolean) => void;
};


const SELECTED_PLAN = {
  "one_month": 1,
  "one_year": 12,
  "four_month": 4
}

const Footer = ({
  setIsLoading = () => { },
  isPurchased,
  setIsPurchased = () => { },
}: FooterProps) => {
  const [subscription, setSubscription] = useState<Subscription[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [connection, setConnection] = useState<boolean>(false);
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState<number>(SELECTED_PLAN.one_year)

  useEffect(() => {
    initializeIAP();

    return () => {
      endConnection();
    };
  }, []);

  useEffect(() => {
    if (connection) {
      console.log("=====")
      getSubscriptionInfo();
      getPurchaseInfo();
      getPurchaseHistoryIap();
      getCurrentPurchases();
    }
  }, [connection]);

  console.log("subscription======", subscription)

  console.log("connection========", connection)

  console.log("products=======", products)

  // Purchase Update Listener 
  useEffect(() => {
    const subscriptionListener = purchaseUpdatedListener(
      (purchase: SubscriptionPurchase | ProductPurchase) => {
        console.log(purchase, '<==purchase');

        const receipt = purchase.transactionReceipt;

        /**
         *
         *
          if (receipt) {
            yourAPI
              .deliverOrDownloadFancyInAppPurchase(
                purchase.transactionReceipt,
              )
              .then(async (deliveryResult) => {
                if (isSuccess(deliveryResult)) {
                  // Tell the store that you have delivered what has been paid for.
                  // Failure to do this will result in the purchase being refunded on Android and
                  // the purchase event will reappear on every relaunch of the app until you succeed
                  // in doing the below. It will also be impossible for the user to purchase consumables
                  // again until you do this.

                  // If consumable (can be purchased again)
                  await finishTransaction({ purchase, isConsumable: true });
                  // If not consumable
                  await finishTransaction({ purchase, isConsumable: false });
                } else {
                  // Retry / conclude the purchase is fraudulent, etc...
                }
              });

          }
        *
        *
        **/
      },
    );

    return () => {
      subscriptionListener?.remove();
    };
  }, []);

  // Purchase Error Listener
  useEffect(() => {
    const subscriptionErrorListener = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log(error);
      }
    );

    return () => {
      subscriptionErrorListener?.remove();
    };
  }, []);

  // Promoted Product Listener
  // useEffect(() => {
  //   if (!isAndroid) {
  //     const productListener = promotedProductListener((productId: string) => {
  //       console.log(productId);
  //     });

  //     return () => {
  //       productListener?.remove();
  //     };
  //   }
  // }, []);


  const initializeIAP = async () => {
    try {
      await initConnection().then(async (value: boolean) => {
        setConnection(value);
        isAndroid && (await flushFailedPurchasesCachedAsPendingAndroid());
      });
    } catch (err) {
      console.error('Error initializing IAP: ', err);
    }
  };


  const validatePurchaseReceipt = async () => {
    const response = await validateReceiptAndroid({
      packageName: "purchase.packageNameAndroid",
      productId: "purchase.productId",
      productToken: "purchase.purchaseToken",
      accessToken: 'your-access-token',
      isSub: true
    });
    console.log("response=====", response)
  }

  // used only when you purchase a non-consumable product
  const getCurrentPurchases = async () => {
    try {
      const purchases = await getAvailablePurchases();
      console.log(
        'Current Purchases:',
        purchases?.map(item => {
          return { productId: item?.productId, date: item?.transactionDate };
        }),
      );
    } catch (error) {
      console.error('Error getting purchases:', error);
    }
  };

  const getPurchaseInfo = async () => {
    try {
      const productsInfo = await getProducts({ skus: productIds });
      setProducts(productsInfo);
      console.log(productsInfo); // get products information
    } catch (err) {
      console.error('Error fetching products: ', err);
    }
  };

  const getSubscriptionInfo = async () => {
    try {
      const subscriptions = await getSubscriptions({
        skus: subscriptionIds,
      });

      // console.log(subscriptions);
      setSubscription(subscriptions);
    } catch (err) {
      console.error('Error fetching products: ', err);
    }
  };

  const getPurchaseHistoryIap = async () => {
    try {
      const purchaseHistory = await getPurchaseHistory();
      console.log('purchase history', purchaseHistory); // purchase history
    } catch (err) {
      console.error('Error fetching purchase history: ', err);
    }
  };

  const onSubscription = async (sku: Subscription) => {
    if (isPurchased) {
      return;
    }
    try {
      setIsLoading(true);
      const offerToken = {}

      // isAndroid
      //   ? sku?.subscriptionOfferDetails[0]?.offerToken
      //   : null;

      const purchaseData = await requestSubscription({
        sku: sku?.productId,
        ...(offerToken && {
          subscriptionOffers: [{ sku: sku?.productId, offerToken }],
        }),
      });

      console.log(purchaseData, '<==purchaseData');

      if (purchaseData) {
        setIsPurchased(true);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log('Error subscription item: ', err);
    }
  };

  const onPurchase = async (sku: Product) => {
    try {
      await requestPurchase({
        sku: sku?.productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
        skus: productIds,
      });
    } catch (err) {
      console.log('Error purchasing item: ', err);
    }
  };

  return (
    <>
      <View style={styles.cardSuccessContainer}>
        {isPurchased ? (
          <View style={styles.purchaseContainer}>
            <Image source={images.circleCheck} style={styles.circleCheckImg} />
            <Text style={styles.unlockedMessage}>{string.proUnlocked}</Text>
          </View>
        ) : (
          <View style={styles.priceContainer}>
            <TouchableOpacity onPress={() => setCurrentSelectedPlan(SELECTED_PLAN.one_month)}>
              <PriceCard
                number={1}
                days={string.monthly}
                price={string.monthlyPrice}
                isCenter={currentSelectedPlan === SELECTED_PLAN.one_month}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentSelectedPlan(SELECTED_PLAN.one_year)}>
              <PriceCard
                number={1}
                days={string.yearly}
                price={string.yearlyPrice}
                isCenter={currentSelectedPlan === SELECTED_PLAN.one_year}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentSelectedPlan(SELECTED_PLAN.four_month)}>
              <PriceCard
                number={1}
                days={string.quarterly}
                price={string.fourMonthlyPrice}
                isCenter={currentSelectedPlan === SELECTED_PLAN.four_month}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.upgradeContainer}>
        <TouchableOpacity
          style={[
            styles.upgradeButton,
            { backgroundColor: isPurchased ? Colors.green : Colors.gold },
          ]}
          onPress={() => onSubscription(subscription[0])}>
          <Text
            style={styles.upgradeTitle}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {isPurchased ? string.musicZone : string.upgradeToPro}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Footer;
