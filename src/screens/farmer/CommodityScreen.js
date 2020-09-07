import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery } from '@apollo/client';
import { FIND_FARM_MARKET_COMMODITY_NEARBY } from '../../graphql/Queries';
import KomoditasButton1 from '../../assets/KomoditasButton1.svg';
import KomoditasButton2 from '../../assets/KomoditasButton2.svg';

const CommodityScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [commodity, setCommodity] = useState({});

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  // Cari informasi terkait komoditas milik peternak
  const [getFarmMarketCommodityNearby] = useLazyQuery(
    FIND_FARM_MARKET_COMMODITY_NEARBY,
    {
      errorPolicy: 'ignore',
      fetchPolicy: 'network-only',
      onCompleted(data) {
        const result = data.findFarmMarketCommodityNearby;
        setCommodity(result);
      },
      onError(data) {
        console.log(data);
      },
    },
  );

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      getFarmMarketCommodityNearby({
        variables: {
          commodityId: user.commodity[0].id,
          userId: user.id,
          longitude: parseFloat(user.farm.longitude),
          latitude: parseFloat(user.farm.latitude),
          radius: parseFloat(3),
        },
      });
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.textHeader}>
            Kelola Komoditas Yang Anda Miliki
          </Text>
          <Text style={styles.textDescription}>
            Dari harga yang ditentukan oleh komunitas peternak disekitar
            anda,juga biaya pembelian pakan, dapatkan harga rekomendasi yang
            sesuai
          </Text>
          <View style={styles.categoryContainer}>
            <Image style={styles.categoryImage} />
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryTextName}>
                Harga yang anda tentukan
              </Text>
              <Text style={styles.categoryTextTotal}>
                Rp {commodity.currentPrice ? commodity.currentPrice : '0'},- /kg
              </Text>
            </View>
          </View>
          <TouchableHighlight
            style={styles.manageButton}
            activeOpacity={0.3}
            underlayColor="#FAFAFA"
            onPress={() => navigation.navigate('Komoditas Tersedia')}>
            <Text style={styles.manageButtonText}>
              Atur komoditas yang dikelola
            </Text>
          </TouchableHighlight>
          <View style={styles.commodityContainer}>
            <View style={styles.commodityBox}>
              <View style={styles.manageButtonContainer}>
                <View style={styles.containerBackground}>
                  <KomoditasButton1 />
                </View>
                <View>
                  <View style={styles.manageContentContainer}>
                    <Text style={styles.commodityHeaderBox}>
                      Komoditas Utama
                    </Text>
                    <Text style={styles.commodityNameBox}>
                      Harga{' '}
                      {commodity.commodityName ? commodity.commodityName : ''}
                    </Text>
                    <Text style={styles.commodityPriceBox}>
                      Rp {commodity.nearbyPrice ? commodity.nearbyPrice : '0'},-
                      /kg
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Terjadi Perubahan</Text>
                    <Text style={styles.pricePercentage}>
                      {commodity.percentage ? commodity.percentage : '0'}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.commodityBox}>
              <View style={styles.manageButtonContainer}>
                <View style={styles.containerBackground}>
                  <KomoditasButton2 />
                </View>
                <View>
                  <View style={styles.manageContentContainer}>
                    <Text style={styles.commodityHeaderBox}>
                      Komoditas Bergantung
                    </Text>
                    <Text style={styles.commodityNameBox}>Harga Pakan</Text>
                    <Text style={styles.commodityPriceBox}>Rp 5.790,- /kg</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Terjadi Perubahan</Text>
                    <Text style={styles.pricePercentageMinus}>-5%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <TouchableHighlight
            style={styles.setPriceButton}
            underlayColor="#FFBA49CC"
            onPress={() =>
              navigation.navigate('FarmMap', {
                type: 'set',
              })
            }>
            <Text style={styles.setPriceButtonText}>Pasang Harga</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.peternakButton}
            underlayColor="#FFBA4933"
            onPress={() =>
              navigation.navigate('FarmMap', {
                type: 'view',
              })
            }>
            <Text style={styles.peternakButtonText}>Lihat Peternak Lain</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  textHeader: {
    color: '#2E4057',
    fontSize: 28,
    fontWeight: 'bold',
  },
  textDescription: {
    width: '85%',
    color: '#2E4057',
    fontSize: 14,
    marginTop: 16,
  },
  categoryContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  categoryImage: {
    height: 48,
    width: 48,
    borderRadius: 4,
    backgroundColor: '#FFBA49',
  },
  categoryTextContainer: {
    marginLeft: 16,
  },
  categoryTextName: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryTextTotal: {
    color: '#2E4057',
    fontSize: 11,
  },
  manageButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
  commodityContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
  },
  commodityBox: {
    width: '46%',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: '#2F9C95',
  },
  manageButtonContainer: {
    position: 'relative',
  },
  containerBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  manageContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  commodityHeaderBox: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  commodityNameBox: {
    color: 'white',
    marginTop: '27%',
  },
  commodityPriceBox: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    backgroundColor: 'rgba(207, 207, 207, 0.4)',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  priceText: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  pricePercentage: {
    marginTop: 2,
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pricePercentageMinus: {
    marginTop: 2,
    color: '#FF4949',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  setPriceButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  setPriceButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  peternakButton: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#FFBA49',
    borderRadius: 10,
  },
  peternakButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
});

export default CommodityScreen;
