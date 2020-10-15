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
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery } from '@apollo/client';
import {
  FIND_FARM_BY_WORKER_ID,
  FIND_FARM_WORKER_TASK_BY_FARM_ID,
} from '../../graphql/Queries';
import HomeWorkerBackground from '../../assets/HomeWorkerBackground.svg';
import HomeFarmBanner from '../../assets/HomeFarmBanner.svg';
import ClockIcon from '../../assets/ClockIcon.svg';
import CardTask1 from '../../assets/CardTask1.svg';
import CardTask2 from '../../assets/CardTask2.svg';
import CardTask3 from '../../assets/CardTask3.svg';

const HomeWorkerScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [heightScreen, setHeightScreen] = useState(0);
  const [isWorker, setIsWorker] = useState(null);
  const [taskList, setTaskList] = useState();

  useEffect(() => {
    const screenHeight = Dimensions.get('window').height;
    setHeightScreen(screenHeight);
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isWorker) {
        setTaskList(null);
        getWorkerTask({
          variables: {
            farmId: user.farm.id,
          },
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (user) {
      getFarmByWorkerId({
        variables: {
          userId: user.id,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (isWorker) {
      setTaskList(null);
      getWorkerTask({
        variables: {
          farmId: user.farm.id,
        },
      });
    }
  }, [isWorker]);

  const renderCard = (index) => {
    let card;
    switch (index % 3) {
      case 0:
        card = <CardTask1 />;
        break;
      case 1:
        card = <CardTask2 />;
        break;
      case 2:
        card = <CardTask3 />;
        break;
    }
    return card;
  };

  const convertTime = (time) => {
    return moment(moment(time, 'HH:mm:ss').toDate()).format('HH:mm');
  };

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const mergeUserData = async (value) => {
    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(value));
      await readUserDataFromStorage();
    } catch (e) {
      console.log(e);
    }
  };

  const [getFarmByWorkerId] = useLazyQuery(FIND_FARM_BY_WORKER_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    async onCompleted(data) {
      const result = data.findFarmByWorkerId;
      if (result) {
        if (!user.farm) {
          await mergeUserData({
            farm: result,
          });
        }
        setIsWorker(true);
      } else {
        setIsWorker(false);
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  const [getWorkerTask] = useLazyQuery(FIND_FARM_WORKER_TASK_BY_FARM_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findFarmWorkerTaskByFarmId;
      setTaskList(result);
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
                  <Text style={styles.textTask}>
                    {taskList ? taskList.length : '0'} Tugas
                  </Text>
                </View>
              </View>
              <TouchableHighlight
                style={styles.izinButton}
                underlayColor="#FFBA49CC"
                onPress={() => navigation.navigate('AddPermit')}>
                <Text style={styles.izinButtonText}>
                  Ajukan Izin Tidak Hadir
                </Text>
              </TouchableHighlight>
              <View style={styles.scheduleContainer}>
                <Text style={styles.textSub}>Jadwal Kerja</Text>
                {taskList ? (
                  taskList.length > 0 ? (
                    taskList.map((value, index) => (
                      <TouchableOpacity
                        key={value.id}
                        onPress={() =>
                          navigation.navigate('TaskDetail', {
                            taskId: value.id,
                            cardType: index,
                          })
                        }>
                        <View style={styles.schedulePekerjaContainer}>
                          <View style={styles.cardContainer}>
                            {renderCard(index)}
                            <Text style={styles.cardText}>
                              {value.title.substring(0, 1)}
                            </Text>
                          </View>
                          <View style={styles.textDescriptionPekerja}>
                            <View style={styles.titleContainer}>
                              <Text style={styles.namaTugas}>
                                {value.title}
                              </Text>
                            </View>
                            <Text style={styles.deskripsiTugas}>
                              {value.description}
                            </Text>
                            <View style={styles.timePekerjaContainer}>
                              <ClockIcon width="24" height="24" />
                              <Text style={styles.timePekerja}>
                                {convertTime(value.started_at)} -{' '}
                                {convertTime(value.ended_at)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.noTaskContainer}>
                      <Text style={styles.noTaskText}>
                        Kamu belum mendapatkan jadwal pekerjaan
                      </Text>
                    </View>
                  )
                ) : loading ? (
                  <View style={styles.noTaskContainer}>
                    <ActivityIndicator size="large" color="#2F9C95" />
                  </View>
                ) : null}
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

export default HomeWorkerScreen;
