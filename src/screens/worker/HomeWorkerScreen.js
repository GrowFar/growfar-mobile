import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery } from '@apollo/client';
import { FIND_FARM_BY_WORKER_ID } from '../../graphql/Queries';
import HomeWorkerBackground from '../../assets/HomeWorkerBackground.svg';
import HomeFarmBanner from '../../assets/HomeFarmBanner.svg';
import ClockIcon from '../../assets/ClockIcon.svg';

const HomeWorkerScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [isWorker, setIsWorker] = useState(null);
  const [heightScreen, setHeightScreen] = useState(0);

  useEffect(() => {
    const screenHeight = Dimensions.get('window').height;
    setHeightScreen(screenHeight);
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      getFarmByWorkerId({
        variables: {
          userId: user.id,
        },
      });
    }
  }, [user]);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const mergeUserData = async (value) => {
    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  const [getFarmByWorkerId] = useLazyQuery(FIND_FARM_BY_WORKER_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findFarmByWorkerId;
      if (result) {
        mergeUserData({
          farm: result,
        });
        setIsWorker(true);
      } else {
        setIsWorker(false);
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  return (
    <SafeAreaView style={styles.contentContainer}>
      {isWorker !== null ? (
        isWorker === true ? (
          <View style={styles.workerContainer}>
            <StatusBar backgroundColor="#C8C8C8" />
            <View style={styles.profileContainer}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Home')}>
                <Text style={styles.profileText}>Profile</Text>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: `https://api.adorable.io/avatars/${user.uid}`,
                  }}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <View style={styles.infoCard}>
                <View style={styles.containerBanner}>
                  <HomeFarmBanner style={styles.homeFarmBanner} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textHeader}>Jangan Lupa</Text>
                  <Text style={styles.textDescription}>
                    Hari ini anda memiliki jadwal bekerja di peternakan miliki
                    Pak Ngatemo dimulai pukul 05.00 AM
                  </Text>
                  <Text style={styles.textTask}>3 Tugas</Text>
                </View>
              </View>
              <TouchableHighlight
                style={styles.izinButton}
                underlayColor="#FFBA49CC"
                onPress={() => navigation.navigate('')}>
                <Text style={styles.izinButtonText}>
                  Ajukan Izin Tidak Hadir
                </Text>
              </TouchableHighlight>
              <View style={styles.scheduleContainer}>
                <Text style={styles.textSub}>Jadwal Kerja</Text>
                <View style={styles.schedulePekerjaContainer}>
                  <Image
                    style={styles.profileImagePekerja}
                    source={{
                      uri: 'https://api.adorable.io/avatars/1',
                    }}
                  />
                  <View style={styles.textDescriptionPekerja}>
                    <Text style={styles.namaTugas}>Catat Kehadiran</Text>
                    <Text style={styles.deskripsiTugas}>
                      Jam kedatangan dibebaskan, namun jangan melebihi jadwal ya
                    </Text>
                    <View style={styles.timePekerjaContainer}>
                      <ClockIcon width="24" height="24" />
                      <Text style={styles.timePekerja}>05.00 - 06.00</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.schedulePekerjaContainer}>
                  <Image
                    style={styles.profileImagePekerja}
                    source={{
                      uri: 'https://api.adorable.io/avatars/1',
                    }}
                  />
                  <View style={styles.textDescriptionPekerja}>
                    <Text style={styles.namaTugas}>Catat Kehadiran</Text>
                    <Text style={styles.deskripsiTugas}>
                      Jam kedatangan dibebaskan, namun jangan melebihi jadwal ya
                    </Text>
                    <View style={styles.timePekerjaContainer}>
                      <ClockIcon width="24" height="24" />
                      <Text style={styles.timePekerja}>05.00 - 06.00</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.schedulePekerjaContainer}>
                  <Image
                    style={styles.profileImagePekerja}
                    source={{
                      uri: 'https://api.adorable.io/avatars/1',
                    }}
                  />
                  <View style={styles.textDescriptionPekerja}>
                    <Text style={styles.namaTugas}>Catat Kehadiran</Text>
                    <Text style={styles.deskripsiTugas}>
                      Jam kedatangan dibebaskan, namun jangan melebihi jadwal ya
                    </Text>
                    <View style={styles.timePekerjaContainer}>
                      <ClockIcon width="24" height="24" />
                      <Text style={styles.timePekerja}>05.00 - 06.00</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.schedulePekerjaContainer}>
                  <Image
                    style={styles.profileImagePekerja}
                    source={{
                      uri: 'https://api.adorable.io/avatars/1',
                    }}
                  />
                  <View style={styles.textDescriptionPekerja}>
                    <Text style={styles.namaTugas}>Catat Kehadiran</Text>
                    <Text style={styles.deskripsiTugas}>
                      Jam kedatangan dibebaskan, namun jangan melebihi jadwal ya
                    </Text>
                    <View style={styles.timePekerjaContainer}>
                      <ClockIcon width="24" height="24" />
                      <Text style={styles.timePekerja}>05.00 - 06.00</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        ) : (
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
                Untuk menggunakan aplikasi secara penuh, hubungi pemilik
                peternakan anda. Atau mulai mencari peternakan yang tersedia
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
                  <Text style={styles.logoutButtonText}>
                    Keluar Dari Aplikasi
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        )
      ) : null}
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
  //
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
    backgroundColor: 'white',
    marginTop: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
    borderRadius: 10,
  },
  profileImagePekerja: {
    height: 48,
    width: 48,
    borderRadius: 5,
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

export default HomeWorkerScreen;
