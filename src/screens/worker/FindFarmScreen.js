import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  StatusBar,
  Modal,
  Linking,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useLazyQuery } from '@apollo/client';
import { FIND_FARM_LOCATION_WORKER } from '../../graphql/Queries';
import Spinner from '../../components/Spinner';
import GPSWhiteIcon from '../../assets/GPSWhiteIcon.svg';

const FindFarmScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [coord, setCoord] = useState({
    latitude: -6.175392,
    longitude: 106.827153,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [listFarm, setListFarm] = useState([]);
  const [farmInfo, setFarmInfo] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const requestPermissionsOnMapReady = () => {
    Platform.OS === 'android'
      ? PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
      : '';
  };

  const renderFarmList = (data) => {
    getFarmList({
      variables: {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        radius: parseFloat(3),
      },
    });
  };

  const onRegionChange = (data) => {
    setCoord({
      latitude: data.latitude,
      longitude: data.longitude,
      latitudeDelta: data.latitudeDelta,
      longitudeDelta: data.longitudeDelta,
    });
  };

  const [getFarmList] = useLazyQuery(FIND_FARM_LOCATION_WORKER, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findFarmLocationWorker;
      setListFarm(result);
    },
    onError(data) {
      console.log(data);
    },
  });

  const getCurrentPosition = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        renderFarmList({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setCoord({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        });
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  };

  const onSearchLocation = ({ nativeEvent }) => {
    setLoading(true);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?&address=${nativeEvent.text}&key=AIzaSyAybgKF9PEZ6nTPIdBUcV6k-mKKTBwWY3o`,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          renderFarmList({
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng,
          });
          setCoord({
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.contentContainer}>
        <StatusBar backgroundColor="#C8C8C8" />
        <View style={styles.textContainer}>
          <SafeAreaView>
            <Text style={styles.sectionText}>Cari Peternakanmu</Text>
            <Text style={styles.descriptionText}>
              Pilih salah satu peternakan pada peta untuk mengetahui informasi
              peternakan tersebut.
            </Text>
            <TextInput
              style={styles.inputLokasi}
              returnKeyType="search"
              placeholder="Cari lokasi peternakan"
              autoCorrect={false}
              onSubmitEditing={(event) => onSearchLocation(event)}
            />
          </SafeAreaView>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation
            showsMyLocationButton={false}
            zoomControlEnabled
            onMapReady={() => requestPermissionsOnMapReady}
            region={coord}
            onRegionChangeComplete={onRegionChange}>
            {listFarm.map((item) => (
              <Marker
                key={item.farm}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.farm}
                onPress={() => {
                  setFarmInfo({
                    name: item.farm,
                    commodity: item.commodity,
                    vacancy: item.vacancy,
                    phone: item.phone,
                  });
                  setModalVisible(true);
                }}
              />
            ))}
          </MapView>
          <TouchableOpacity
            style={styles.findNearbyButton}
            underlayColor="#FFBA49CC"
            onPress={() => {
              setLoading(true);
              renderFarmList({
                latitude: coord.latitude,
                longitude: coord.longitude,
              });
              setLoading(false);
            }}>
            <Text style={styles.findNearbyButtonText}>
              Cari di sekitar daerah ini
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusButton}
            underlayColor="#FFBA49CC"
            onPress={() => getCurrentPosition()}>
            <GPSWhiteIcon />
          </TouchableOpacity>
        </View>
        {farmInfo ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableWithoutFeedback
              onPress={() => (loading ? null : setModalVisible(false))}>
              <View style={styles.bottomView}>
                <View style={styles.modalView}>
                  <Text style={styles.farmName}>
                    Peternakan {farmInfo.name}
                  </Text>
                  <Text style={styles.farmDescription}>
                    Komoditas yang dikelola{' '}
                    <Text style={styles.bold}>{farmInfo.commodity}</Text>. Saat
                    ini sedang mencari pekerja.{' '}
                    <Text style={styles.bold}>
                      Tersedia {farmInfo.vacancy} lowongan.
                    </Text>
                  </Text>
                  <TouchableHighlight
                    style={styles.findFarmButton}
                    underlayColor="#FFBA49CC"
                    onPress={() => Linking.openURL(`tel:${farmInfo.phone}`)}>
                    <Text style={styles.findFarmButtonText}>
                      Hubungi Pemilik Peternakan
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : null}
        {loading ? <Spinner /> : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
  },
  textContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 18,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionText: {
    color: '#2E4057',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 22,
  },
  descriptionText: {
    fontSize: 15,
    color: '#2E4057',
    marginTop: 8,
    marginRight: 4,
  },
  inputLokasi: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  lokasiButton: {
    position: 'absolute',
    bottom: 32,
    left: 22,
    right: 22,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  lokasiButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
  plusButton: {
    position: 'absolute',
    top: 10,
    right: 22,
    padding: 8,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  findNearbyButton: {
    padding: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
  },
  findNearbyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  bottomView: {
    flex: 1,
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
  farmName: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  farmDescription: {
    color: '#2E4057',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  findFarmButton: {
    marginTop: 32,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  findFarmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default FindFarmScreen;
