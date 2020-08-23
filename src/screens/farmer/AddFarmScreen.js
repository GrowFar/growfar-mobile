import React, { useState, useEffect } from 'react';
import {
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const AddFarmScreen = ({ navigation }) => {
  const [coord, setCoord] = useState({
    latitude: -6.175392,
    longitude: 106.827153,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

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
    getCurrentPosition();
  }, []);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.textContainer}>
        <SafeAreaView>
          <Text style={styles.sectionText}>Tandai Lokasi Peternakanmu</Text>
          <Text style={styles.descriptionText}>
            Pilih salah satu tempat pada peta, tekan layar untuk menandai lokasi
            mu.
          </Text>
          <TextInput
            style={styles.inputLokasi}
            placeholder="Cari lokasi peternakan"
          />
        </SafeAreaView>
      </View>
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          showsUserLocation
          showsMyLocationButton={false}
          onMapReady={() => requestPermissionsOnMapReady}
          region={coord}
          onPress={onPressMapView}>
          <Marker coordinate={coord} title="EKA" description="Ini deskripsi" />
        </MapView>
        <TouchableHighlight
          style={styles.plusButton}
          underlayColor="#FFBA49CC"
          onPress={() => getCurrentPosition()}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableHighlight>
      </View>
      <TouchableHighlight style={styles.lokasiButton} underlayColor="#FFBA49CC">
        <Text style={styles.lokasiButtonText}>Simpan Lokasi</Text>
      </TouchableHighlight>
    </View>
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
    paddingVertical: 8,
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
});

export default AddFarmScreen;
