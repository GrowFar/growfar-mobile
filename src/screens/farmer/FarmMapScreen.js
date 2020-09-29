import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_FARM_MARKET_NEARBY } from '../../graphql/Queries';
import { CREATE_NEW_MARKET } from '../../graphql/Mutations';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from '../../components/Spinner';
import ArrowUpIcon from '../../assets/ArrowUpIcon.svg';
import ArrowDownIcon from '../../assets/ArrowDownIcon.svg';

const FarmMapScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [user, setUser] = useState();
  const [coord, setCoord] = useState({
    longitude: 106.827153,
    latitude: -6.175392,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [dataPeternakan, setDataPeternakan] = useState([]);
  const [hargaSekitar, setHargaSekitar] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const { type } = route.params;

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  // Cari peternak dengan komoditas yang sama disekitar
  const [getFarmMarketNearby] = useLazyQuery(FIND_FARM_MARKET_NEARBY, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findFarmMarketNearby;
      setDataPeternakan(result.data);
      setHargaSekitar({
        mingguIni: result.currentPrice,
        persentaseMingguIni: result.currentPercentage,
        mingguLalu: result.previousPrice,
        persentaseMingguLalu: result.previousPercentage,
      });
    },
    onError(data) {
      console.log(data);
    },
  });

  // Simpan harga komoditas yang dimasukkan
  const [addNewMarket] = useMutation(CREATE_NEW_MARKET, {
    onCompleted() {
      getFarmMarketNearby({
        variables: {
          commodityId: user.commodity[0].id,
          longitude: parseFloat(user.farm.longitude),
          latitude: parseFloat(user.farm.latitude),
          radius: parseFloat(3),
        },
      });
      setLoading(false);
      setModalVisible(false);
    },
    onError(data) {
      console.log(data);
    },
  });

  useEffect(() => {
    readUserDataFromStorage();
    if (type === 'set') {
      setModalVisible(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setCoord({
        longitude: user.farm.longitude,
        latitude: user.farm.latitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
      getFarmMarketNearby({
        variables: {
          commodityId: user.commodity[0].id,
          longitude: parseFloat(user.farm.longitude),
          latitude: parseFloat(user.farm.latitude),
          radius: parseFloat(3),
        },
      });
    }
  }, [user]);

  const onSetPrice = () => {
    setLoading(true);
    addNewMarket({
      variables: {
        price: parseInt(price, 10),
        farmId: user.farm.id,
        commodityId: user.commodity[0].id,
      },
    });
  };

  return (
    <View style={styles.farmMapContainer}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={coord}>
        {dataPeternakan.length !== 0
          ? dataPeternakan.map((value) => (
              <Marker
                key={value.farm.id}
                coordinate={{
                  latitude: value.farm.latitude,
                  longitude: value.farm.longitude,
                }}
                pinColor={value.farm.id === user.farm.id ? 'red' : 'linen'}
                title={
                  value.farm.id === user.farm.id
                    ? 'Peternakanmu'
                    : value.farm.name
                }
                description={'Rp ' + value.price.toString() + ',- /kg'}
              />
            ))
          : null}
        {dataPeternakan.some(
          (value) => value.farm.id === user.farm.id,
        ) ? null : user ? (
          <Marker
            key={user.farm.id}
            coordinate={{
              latitude: user.farm.latitude,
              longitude: user.farm.longitude,
            }}
            pinColor={'red'}
            title={'Peternakanmu'}
            description={'Anda belum menentukan harga!'}
          />
        ) : null}
      </MapView>
      <View style={styles.contentContainer}>
        <View style={styles.pakanContainer}>
          <Text style={styles.namaPakan}>Harga Pakan Jagung</Text>
          <ArrowUpIcon />
          <Text style={{ ...styles.persentasePakan, ...styles.colorGreen }}>
            5%
          </Text>
          <Text>Rp 5.790,- /kg</Text>
        </View>
        <View style={styles.komoditasContainer}>
          <View style={styles.hargaContainer}>
            <Text>Minggu ini</Text>
            <Text style={styles.hargaDisekitar}>
              Rp {hargaSekitar.mingguIni},- /kg
            </Text>
            {hargaSekitar.mingguIni >= hargaSekitar.mingguLalu ? (
              <View style={styles.persentaseContainer}>
                <ArrowUpIcon />
                <Text style={styles.colorGreen}>
                  {hargaSekitar.persentaseMingguIni}%
                </Text>
              </View>
            ) : (
              <View style={styles.persentaseContainer}>
                <ArrowDownIcon />
                <Text style={styles.colorRed}>
                  {hargaSekitar.persentaseMingguIni}%
                </Text>
              </View>
            )}
          </View>
          <View style={styles.hargaContainer}>
            <Text>Minggu sebelumnya</Text>
            <Text style={styles.hargaDisekitar}>
              Rp {hargaSekitar.mingguLalu},- /kg
            </Text>
            {hargaSekitar.persentaseMingguLalu >= 0 ? (
              <View style={styles.persentaseContainer}>
                <ArrowUpIcon />
                <Text style={styles.colorGreen}>
                  {hargaSekitar.persentaseMingguLalu}%
                </Text>
              </View>
            ) : (
              <View style={styles.persentaseContainer}>
                <ArrowDownIcon />
                <Text style={styles.colorRed}>
                  {hargaSekitar.persentaseMingguLalu}%
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableHighlight
          style={styles.setPriceButton}
          underlayColor="#FFBA49CC"
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.setPriceButtonText}>Pasang Harga</Text>
        </TouchableHighlight>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback
          onPress={() => (loading ? null : setModalVisible(false))}>
          <View style={styles.bottomView}>
            <View style={styles.modalView}>
              <Text style={styles.rekomendasiText}>
                Harga yang direkomendasikan
              </Text>
              <View style={styles.rekomendasiContainer}>
                <Text style={styles.rekomendasiHarga}>Rp 18.600,-</Text>
                <Text>sd</Text>
                <Text style={styles.rekomendasiHarga}>Rp 19.600,-</Text>
              </View>
              <TextInput
                style={styles.inputPrice}
                placeholder="Berikan harga"
                onChangeText={(value) => setPrice(value)}
              />
              <TouchableHighlight
                style={styles.setPriceButton}
                underlayColor="#FFBA49CC"
                onPress={() => onSetPrice()}>
                <Text style={styles.setPriceButtonText}>Pasang Harga</Text>
              </TouchableHighlight>
              {loading ? <Spinner /> : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  farmMapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 32,
    paddingHorizontal: 16,
  },
  pakanContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    elevation: 2,
  },
  namaPakan: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E4057',
    marginRight: 8,
  },
  persentasePakan: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: '7%',
  },
  colorRed: {
    color: '#FF4949',
  },
  colorGreen: {
    color: '#40C9A2',
  },
  komoditasContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  hargaContainer: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    elevation: 2,
  },
  hargaDisekitar: {
    marginTop: 4,
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  persentaseContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  setPriceButton: {
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
  bottomView: {
    flex: 1,
    backgroundColor: 'rgba(78, 78, 78, 0.58)',
    justifyContent: 'flex-end',
  },
  modalView: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  rekomendasiText: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rekomendasiContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rekomendasiHarga: {
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputPrice: {
    marginVertical: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
  },
});

export default FarmMapScreen;
