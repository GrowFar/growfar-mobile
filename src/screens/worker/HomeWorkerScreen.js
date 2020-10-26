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
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  FIND_FARM_BY_WORKER_ID,
  FIND_FARM_WORKER_TASK_PROGRESS,
  FIND_WORKER_IS_ALREADY_ATTENDANCE,
  FIND_WORKER_IS_ON_WORK_LOCATION,
} from '../../graphql/Queries';
import { CREATE_FARM_WORKER_ATTENDANCE } from '../../graphql/Mutations';
import HomeFarmBanner from '../../assets/HomeFarmBanner.svg';
import HomeWorkerBackground from '../../assets/HomeWorkerBackground.svg';
import ClockIcon from '../../assets/ClockIcon.svg';
import CardTask1 from '../../assets/CardTask1.svg';
import CardTask2 from '../../assets/CardTask2.svg';
import CardTask3 from '../../assets/CardTask3.svg';

const HomeWorkerScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [heightScreen, setHeightScreen] = useState(0);
  const [isAttend, setIsAttend] = useState(null);
  const [taskList, setTaskList] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [insideFarm, setInsideFarm] = useState(false);

  useEffect(() => {
    readUserDataFromStorage();
    const screenHeight = Dimensions.get('window').height;
    setHeightScreen(screenHeight);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      readUserDataFromStorage();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (user) {
      if (user.farm) {
        onCheckLocation();
        checkAttendance({
          variables: {
            farmId: user.farm.id,
            userId: user.id,
          },
        });
        setTaskList(null);
        getWorkerTask({
          variables: {
            farmId: user.farm.id,
            userId: user.id,
          },
        });
        setIsAttend(true);
      } else {
        getFarmByWorkerId({
          variables: {
            userId: user.id,
          },
        });
      }
    }
  }, [user]);

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
        await mergeUserData({
          farm: result,
        });
        await readUserDataFromStorage();
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  const [getWorkerTask] = useLazyQuery(FIND_FARM_WORKER_TASK_PROGRESS, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findFarmWorkerTaskProgress;
      console.log(result);
      setTaskList(result);
    },
    onError(data) {
      console.log(data);
    },
  });

  const [checkAttendance] = useLazyQuery(FIND_WORKER_IS_ALREADY_ATTENDANCE, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findWorkerIsAlreadyAttendance;
      if (result.attendance) {
        setIsAttend(true);
      } else {
        setIsAttend(false);
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  const [checkLocation] = useLazyQuery(FIND_WORKER_IS_ON_WORK_LOCATION, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findWorkerIsOnWorkLocation.inside_farm;
      setInsideFarm(result);
    },
    onError(data) {
      console.log(data);
    },
  });

  const [submitAttendance] = useMutation(CREATE_FARM_WORKER_ATTENDANCE, {
    onCompleted(data) {
      console.log(data);
      setIsAttend(true);
    },
    onError(data) {
      console.log(data);
    },
  });

  const onCheckLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        checkLocation({
          variables: {
            farmId: user.farm.id,
            userId: user.id,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          },
        });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  };

  const onRecordAttendance = () => {
    submitAttendance({
      variables: {
        farmId: user.farm.id,
        userId: user.id,
      },
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getWorkerTask({
      variables: {
        farmId: user.farm.id,
        userId: user.id,
      },
    });
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.contentContainer}>
      {isAttend !== null ? (
        isAttend === false ? (
          <View>
            <StatusBar backgroundColor="#267D77" />
            <View style={styles.containerBackground}>
              <HomeWorkerBackground height={heightScreen} />
            </View>
            <View style={styles.attendanceContainer}>
              <Text style={styles.sectionText}>
                Lakukan Absensi Terlebih Dahulu
              </Text>
              <Text style={styles.descriptionText}>
                Jangan lupa nyalakan GPS atau layanan lokasi. Sehingga anda
                dapat melakukan pencatatan kehadiran maupun tracking pekerjaan.
              </Text>
              <TouchableHighlight
                disabled={!insideFarm}
                style={
                  insideFarm
                    ? styles.attendanceButton
                    : styles.attendanceDisabledButton
                }
                underlayColor="#FFBA49CC"
                onPress={() => onRecordAttendance()}>
                <Text
                  style={
                    insideFarm
                      ? styles.attendanceButtonText
                      : styles.attendanceDisabledButtonText
                  }>
                  {insideFarm
                    ? 'Catat Kehadiran'
                    : 'Anda Tidak Berada Di Peternakan'}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        ) : (
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
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              <View style={styles.infoCard}>
                <View style={styles.containerBanner}>
                  <HomeFarmBanner style={styles.homeFarmBanner} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textHeader}>Jangan Lupa</Text>
                  <Text style={styles.textDescription}>
                    Hari ini anda memiliki jadwal bekerja di peternakan milik
                    Pak {user.farm.user.fullname} dimulai pukul 06.00 AM
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
                        disabled={value.is_done ? true : false}
                        key={value.id}
                        onPress={() =>
                          navigation.navigate('TaskDetail', {
                            taskId: value.id,
                            cardType: index,
                          })
                        }>
                        <View
                          style={
                            value.is_done
                              ? {
                                  ...styles.schedulePekerjaContainer,
                                  ...styles.backgroundColorGrey,
                                }
                              : {
                                  ...styles.schedulePekerjaContainer,
                                  ...styles.backgroundColorWhite,
                                }
                          }>
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
                ) : (
                  <View style={styles.noTaskContainer}>
                    <ActivityIndicator size="large" color="#2F9C95" />
                  </View>
                )}
              </View>
            </ScrollView>
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
  attendanceContainer: {
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
  attendanceButton: {
    marginTop: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  attendanceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  attendanceDisabledButton: {
    marginTop: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    backgroundColor: '#EAE9E9',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 10,
  },
  attendanceDisabledButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#B5B5B5',
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

export default HomeWorkerScreen;
