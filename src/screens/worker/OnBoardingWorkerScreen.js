import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import HomeWorkerBackground from '../../assets/HomeWorkerBackground.svg';

const OnBoardingWorkerScreen = ({ navigation }) => {
  const [heightScreen, setHeightScreen] = useState(0);

  useEffect(() => {
    const screenHeight = Dimensions.get('window').height;
    setHeightScreen(screenHeight);
  }, []);

  return (
    <SafeAreaView style={styles.contentContainer}>
      <View>
        <StatusBar backgroundColor="#267D77" />
        <View style={styles.containerBackground}>
          <HomeWorkerBackground height={heightScreen} />
        </View>
        <View style={styles.notWorkerContainer}>
          <Text style={styles.sectionText}>
            Terimakasih anda sudah terdaftar
          </Text>
          <Text style={styles.descriptionText}>
            Untuk menggunakan aplikasi secara penuh, hubungi pemilik peternakan
            anda. Atau mulai mencari peternakan yang tersedia
          </Text>
          <TouchableHighlight
            style={styles.findFarmButton}
            underlayColor="#FFBA49CC"
            onPress={() => navigation.navigate('FindFarmByWorker')}>
            <Text style={styles.findFarmButtonText}>Cari Peternakan</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.registerWorkerButton}
            activeOpacity={0.8}
            underlayColor="#94CFCFCF"
            onPress={() => navigation.navigate('RegisterWorker')}>
            <Text style={styles.registerWorkerButtonText}>
              Daftar Sebagai Pekerja
            </Text>
          </TouchableHighlight>
          <View style={styles.cek}>
            <TouchableHighlight
              style={styles.logoutButton}
              activeOpacity={0.8}
              underlayColor="#94CFCFCF"
              onPress={async () => {
                await auth().signOut();
                await AsyncStorage.removeItem('user');
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Register' }],
                  }),
                );
              }}>
              <Text style={styles.logoutButtonText}>Keluar Dari Aplikasi</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    position: 'relative',
  },
  containerBackground: {
    backgroundColor: '#2F9C95',
    position: 'absolute',
    zIndex: -999,
  },
  notWorkerContainer: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  sectionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 42,
    textAlign: 'center',
  },
  descriptionText: {
    backgroundColor: 'rgba(207, 207, 207, 0.42)',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 18,
    paddingVertical: 24,
    marginTop: 32,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  findFarmButton: {
    marginTop: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
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
  registerWorkerButton: {
    marginTop: 8,
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  registerWorkerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  cek: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    paddingHorizontal: 34,
  },
  logoutButton: {
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  workerContainer: {
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
    borderRadius: 5,
    backgroundColor: '#2F9C95',
  },
  infoCard: {
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
    marginBottom: 8,
    textAlign: 'center',
  },
  textDescription: {
    width: '85%',
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  textTask: {
    overflow: 'hidden',
    width: '75%',
    color: 'white',
    backgroundColor: 'rgba(207, 207, 207, 0.5)',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  izinButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  izinButtonText: {
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
  scheduleContainer: {
    marginBottom: 15,
  },
  schedulePekerjaContainer: {
    flexDirection: 'row',
    marginTop: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
    borderRadius: 10,
  },
  backgroundColorWhite: {
    backgroundColor: 'white',
  },
  backgroundColorGrey: {
    backgroundColor: '#EAE9E9',
  },
  noTaskContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
  },
  noTaskText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cardContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  cardText: {
    position: 'absolute',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textDescriptionPekerja: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  namaTugas: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deskripsiTugas: {
    marginTop: 4,
    color: '#2E4057',
  },
  timePekerjaContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  timePekerja: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
});

export default OnBoardingWorkerScreen;
