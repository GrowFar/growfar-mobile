import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery } from '@apollo/client';
import {
  FIND_COMMODITY_BY_FARM_ID,
  FIND_FARM_MARKET_COMMODITY_NEARBY,
  FIND_LOG_ACTIVITY,
} from '../../graphql/Queries';
import HomeFarmBanner from '../../assets/HomeFarmBanner.svg';
import KomoditasButton from '../../assets/KomoditasButton.svg';
import PekerjaButton from '../../assets/PekerjaButton.svg';
import KomoditasIcon from '../../assets/KomoditasIcon.svg';
import PekerjaIcon from '../../assets/PekerjaIcon.svg';
import ClockIcon from '../../assets/ClockIcon.svg';

const HomeScreen = ({ navigation }) => {
  const [haveCommodities, setHaveCommodities] = useState(false);
  const [nearbyPrice, setNearbyPrice] = useState(0);
  const [user, setUser] = useState();
  const [avatar, setAvatar] = useState();
  const [logList, setLogList] = useState([]);
  const [page, setPage] = useState(null);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
    setAvatar(item.uid);
  };

  const mergeUserData = async (value) => {
    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  const convertTime = (time) => {
    return moment(moment(time, 'HH:mm:ss').toDate()).format('HH:mm');
  };

  // Cari komoditas berdasarkan id peternakan
  const [getCommodity] = useLazyQuery(FIND_COMMODITY_BY_FARM_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findCommodityByFarmId;
      if (result.length !== 0) {
        mergeUserData({
          commodity: result,
        });
        setUser({ ...user, commodity: result });
        setHaveCommodities(true);
      } else {
        setHaveCommodities(false);
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  const [getFarmMarketCommodityNearby] = useLazyQuery(
    FIND_FARM_MARKET_COMMODITY_NEARBY,
    {
      errorPolicy: 'ignore',
      fetchPolicy: 'network-only',
      onCompleted(data) {
        const result = data.findFarmMarketCommodityNearby;
        setNearbyPrice(result.nearbyPrice);
        setHaveCommodities(true);
      },
      onError(data) {
        console.log(data);
      },
    },
  );

  const [getLogActivity] = useLazyQuery(FIND_LOG_ACTIVITY, {
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const result = data.findLogActivity;
      let filteredResult = result.filter(
        (item) => item.notification_type === 'TASK',
      );
      setLogList(logList.concat(filteredResult));
    },
    onError(data) {
      console.log(data);
    },
  });

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLogList([]);
      setPage(0);
      readUserDataFromStorage();
    });
    return unsubscribe;
  }, [navigation]);

  // Ambil komoditas jika user sudah di set
  useEffect(() => {
    if (user) {
      console.log('nilai page ' + page);
      getLogActivity({
        variables: {
          userId: user.id,
          limit: 5,
          page: page + 1,
        },
      });
      if (!user.commodity) {
        getCommodity({ variables: { farmId: user.farm.id } });
      } else {
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
    }
  }, [user]);

  useEffect(() => {
    if (page > 0) {
      getLogActivity({
        variables: {
          userId: user.id,
          limit: 5,
          page: page + 1,
        },
      });
    }
  }, [page]);

  const getHeader = () => {
    return (
      <View>
        <View style={styles.infoHargaContainer}>
          <View style={styles.containerBanner}>
            <HomeFarmBanner style={styles.homeFarmBanner} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textHeader}>
              {haveCommodities
                ? 'Jangan Lewatkan'
                : 'Tentukan komoditas yang anda kelola terlebih dahulu'}
            </Text>
            <Text style={styles.textDescription}>
              {haveCommodities
                ? 'Pergerakan harga komoditas yang anda kelola'
                : 'Kemudian pantau pergerakan harganya disini '}
            </Text>
            {haveCommodities ? (
              <Text style={styles.textComodity}>{user.commodity[0].name}</Text>
            ) : null}
            <Text style={styles.textComodityPrice}>
              Rp {haveCommodities ? nearbyPrice : '0'},-
            </Text>
          </View>
        </View>
        {haveCommodities ? (
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
        ) : (
          <TouchableHighlight
            style={styles.setPriceButton}
            underlayColor="#FFBA49CC"
            onPress={() => navigation.navigate('Komoditas Tersedia')}>
            <Text style={styles.setPriceButtonText}>Cari Komoditas</Text>
          </TouchableHighlight>
        )}
        <Text style={styles.textSub}>Kelola Peternakanmu</Text>
        <View style={styles.manageContainer}>
          <TouchableHighlight
            style={styles.manageButton}
            onPress={() => {
              haveCommodities
                ? navigation.navigate('Komoditas')
                : navigation.navigate('Komoditas Tersedia');
            }}>
            <View style={styles.manageButtonContainer}>
              <KomoditasButton />
              <View style={styles.manageContentContainer}>
                <KomoditasIcon />
                <Text style={styles.manageText}>Komoditas</Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.manageButton}
            onPress={() => navigation.navigate('ManageWorker')}>
            <View style={styles.manageButtonContainer}>
              <PekerjaButton />
              <View style={styles.manageContentContainer}>
                <PekerjaIcon fill="red" />
                <Text style={styles.manageText}>Pekerja</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <Text style={styles.textSub}>Log Aktivitas</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.homeFarmContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.profileText}>Profile</Text>
            <Image
              style={styles.profileImage}
              source={{
                uri: `https://api.adorable.io/avatars/${avatar}`,
              }}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={logList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={getHeader}
          ListFooterComponent={
            <View style={styles.noLogContainer}>
              <ActivityIndicator size="large" color="#2F9C95" />
            </View>
          }
          onEndReachedThreshold={0.01}
          onEndReached={() => setPage(page + 1)}
          keyExtractor={(item, index) =>
            'informasi_' + item.information.data + '_index_' + index
          }
          renderItem={({ item, index }) => (
            <View key={index} style={styles.logPekerjaContainer}>
              <View style={styles.profileContainerPekerja}>
                <Image
                  style={styles.profileImagePekerja}
                  source={{
                    uri: `https://api.adorable.io/avatars/${
                      item.information.user_id ? item.information.user_id : '1'
                    }`,
                  }}
                />
                <View style={styles.textDescriptionPekerja}>
                  <Text style={styles.namaPekerja}>
                    {item.information.title}
                  </Text>
                  <View style={styles.timePekerjaContainer}>
                    <ClockIcon />
                    <Text style={styles.timePekerja}>
                      Selesai pada{' '}
                      {convertTime(item.information.task_finish_at)}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.logText}>{item.information.data}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeFarmContainer: {
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    height: '100%',
    paddingHorizontal: 16,
  },
  scrollContainer: {
    height: '100%',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    marginVertical: 9,
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileText: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  profileImage: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#2F9C95',
  },
  infoHargaContainer: {
    position: 'relative',
    marginTop: 15,
  },
  containerBanner: {
    overflow: 'hidden',
    width: '100%',
    borderRadius: 20,
  },
  homeFarmBanner: {
    backgroundColor: '#2F9C95',
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeader: {
    width: '85%',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  textDescription: {
    width: '55%',
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  textComodity: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  textComodityPrice: {
    overflow: 'hidden',
    width: '75%',
    color: 'white',
    backgroundColor: 'rgba(207, 207, 207, 0.5)',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  setPriceButton: {
    marginTop: 16,
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
  textSub: {
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  manageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 12,
  },
  manageButton: {
    marginRight: 12,
    borderRadius: 12,
  },
  manageButtonContainer: {
    overflow: 'hidden',
  },
  manageContentContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.14,
    marginTop: 8,
  },
  logPekerjaContainer: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
    borderRadius: 10,
  },
  profileContainerPekerja: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImagePekerja: {
    height: 48,
    width: 48,
    borderRadius: 5,
  },
  textDescriptionPekerja: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  namaPekerja: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timePekerjaContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePekerja: {
    color: '#2E4057',
    fontSize: 12,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  logText: {
    color: '#2E4057',
    marginTop: 8,
    fontSize: 16,
  },
  noLogContainer: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
  },
  noLogText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
