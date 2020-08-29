import React, { useState, useEffect } from 'react';
import {
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  StyleSheet,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { useMutation } from '@apollo/client';
import { CREATE_NEW_FARM } from '../../graphql/Mutations';
import Spinner from '../../components/Spinner';

const AddFarmScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [namaFarm, setNamaFarm] = useState(false);
  const [alamatFarm, setAlamatFarm] = useState(false);
  const [coord, setCoord] = useState({
    latitude: -6.175392,
    longitude: 106.827153,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [user, setUser] = useState();

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        setUser(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const mergeUserData = async (value) => {
    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  const requestPermissionsOnMapReady = () => {
    Platform.OS === 'android'
      ? PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
      : '';
  };

  const onPressMapView = (data) => {
    let coordinate = data.nativeEvent.coordinate;
    setCoord({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });
  };

  const getCurrentPosition = () =>
    Geolocation.getCurrentPosition(
      (position) => {
        setCoord({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );

  useEffect(() => {
    getData();
    getCurrentPosition();
  }, []);

  const onSearchLocation = ({ nativeEvent }) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?&address=${nativeEvent.text}&key=AIzaSyAybgKF9PEZ6nTPIdBUcV6k-mKKTBwWY3o`,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          setCoord({
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSave = () => {
    setLoading(true);
    addNewFarm({
      variables: {
        name: namaFarm,
        user_id: user.id,
        address: alamatFarm,
        longitude: coord.longitude,
        latitude: coord.latitude,
      },
    });
  };

  const [addNewFarm] = useMutation(CREATE_NEW_FARM, {
    onCompleted(data) {
      setLoading(false);
      mergeUserData({
        farm: {
          id: data.createNewFarm.id,
          name: data.createNewFarm.name,
          address: data.createNewFarm.address,
          longitude: data.createNewFarm.longitude,
          latitude: data.createNewFarm.latitude,
        },
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeFarm' }],
        }),
      );
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <SafeAreaView>
            <Text style={styles.sectionText}>Tandai Lokasi Peternakanmu</Text>
            <Text style={styles.descriptionText}>
              Pilih salah satu tempat pada peta, tekan layar untuk menandai
              lokasi mu.
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
            onMapReady={() => requestPermissionsOnMapReady}
            region={coord}
            onPress={onPressMapView}>
            <Marker coordinate={coord} />
          </MapView>
          <TouchableOpacity
            style={styles.plusButton}
            underlayColor="#FFBA49CC"
            onPress={() => getCurrentPosition()}>
            <Text style={styles.plusButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableHighlight
          style={styles.lokasiButton}
          underlayColor="#FFBA49CC"
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.lokasiButtonText}>Lanjutkan</Text>
        </TouchableHighlight>
        <Modal
          style={styles.modal}
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.textHeaderModal}>
                Berikan Informasi Peternakan Anda
              </Text>
              <Text style={styles.textModal}>Nama Peternakan</Text>
              <TextInput
                style={styles.inputFarm}
                autoCorrect={false}
                multiline={Platform.OS === 'android' ? true : false}
                placeholder="Berikan nama peternakan"
                onChangeText={(nama) => setNamaFarm(nama)}
              />
              <Text style={styles.textModal}>Alamat Lengkap Peternakan</Text>
              <TextInput
                style={styles.textAreaFarm}
                autoCorrect={false}
                multiline={Platform.OS === 'android' ? true : false}
                numberOfLines={3}
                placeholder="Berikan alamat lengkap peternakan"
                onChangeText={(alamat) => setAlamatFarm(alamat)}
              />
              <View style={styles.containerButtonModal}>
                <TouchableHighlight
                  style={styles.cancelButton}
                  underlayColor="#B9B9B9CC"
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Batal</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.saveButton}
                  underlayColor="#FFBA49CC"
                  onPress={onSave}>
                  <Text style={styles.modalButtonText}>Simpan</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          {loading ? <Spinner /> : null}
        </Modal>
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
    paddingHorizontal: 22,
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
    marginTop: 32,
  },
  descriptionText: {
    fontSize: 16,
    color: '#2E4057',
    marginTop: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  plusButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
  centeredView: {
    flex: 1,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textHeaderModal: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  textModal: {
    marginBottom: 4,
  },
  inputFarm: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
  },
  textAreaFarm: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  containerButtonModal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: '#B9B9B9',
    borderWidth: 1.5,
    borderColor: '#898989',
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
  },
});

export default AddFarmScreen;
