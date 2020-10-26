import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery } from '@apollo/client';
import { FIND_FARM_WORKER_TASK_PROGRESS } from '../graphql/Queries';
import ProfileBackground from '../assets/ProfileBackground.svg';
import ClockIcon from '../assets/ClockIcon.svg';
import CardTask1 from '../assets/CardTask1.svg';
import CardTask2 from '../assets/CardTask2.svg';
import CardTask3 from '../assets/CardTask3.svg';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [taskList, setTaskList] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.farm) {
        setTaskList(null);
        getWorkerTask({
          variables: {
            farmId: user.farm.id,
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

  const [getWorkerTask] = useLazyQuery(FIND_FARM_WORKER_TASK_PROGRESS, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findFarmWorkerTaskProgress;
      setTaskList(result);
    },
    onError(data) {
      console.log(data);
    },
  });

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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#267D77" />
      {user ? (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            user.role === 'FARMER' ? null : (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            )
          }>
          <View style={styles.containerBackground}>
            <ProfileBackground />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.deskripsiContainer}>
              <View style={styles.infoContainer}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: `https://api.adorable.io/avatars/${user.uid}`,
                  }}
                />
                <View style={styles.profileContainer}>
                  <Text style={styles.profileName}>{user.fullname}</Text>
                  <Text style={styles.profileRole}>
                    {user.role === 'FARMER'
                      ? 'Pemilik Peternakan'
                      : 'Pekerja Peternakan'}
                  </Text>
                  {user.role === 'FARMER' ? (
                    <View>
                      {user.commodity ? (
                        <Text style={styles.extraText}>
                          2000 Ekor Hewan Ternak
                        </Text>
                      ) : null}
                      <Text style={styles.extraText}>4 Pekerja</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {user.role === 'FARMER' ? (
                user.farm.address && user.commodity ? (
                  <Text style={styles.deskripsiText}>
                    Peternakan anda terletak pada {user.farm.address}.
                    Peternakan anda berfokus pada komoditas{' '}
                    {user.commodity[0].name}
                  </Text>
                ) : null
              ) : null}
              <TouchableHighlight
                style={styles.editButton}
                underlayColor="#FFBA4933">
                <Text style={styles.editButtonText}>Ubah Data</Text>
              </TouchableHighlight>
            </View>
            {user.role === 'FARMER' ? (
              <View>
                <Text style={styles.subText}>Biaya Peternakan</Text>
                <View style={styles.schedulePeternakContainer}>
                  <View style={styles.titleContainer}>
                    <View style={styles.cardContainer}>
                      <CardTask1 />
                      <Text style={styles.cardText}>K</Text>
                    </View>
                    <View style={styles.textDescriptionPekerja}>
                      <Text style={styles.namaTugas}>Kebutuhan Pekerja</Text>
                      <Text style={styles.deskripsiTextSub}>
                        Dari 20 slot yang anda sediakan saat ini anda memiliki
                        12 pekerja aktif
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.extraTextSub}>
                    Gaji pekerja yang anda tentukan
                  </Text>
                  <Text style={styles.hargaText}>
                    Rp. 500.000,-/orang/bulan
                  </Text>
                  <TouchableHighlight
                    style={styles.editButton}
                    underlayColor="#FFBA4933">
                    <Text style={styles.editButtonText}>Ubah Data</Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.schedulePeternakContainer}>
                  <View style={styles.titleContainer}>
                    <View style={styles.cardContainer}>
                      <CardTask1 />
                      <Text style={styles.cardText}>K</Text>
                    </View>
                    <View style={styles.textDescriptionPekerja}>
                      <Text style={styles.namaTugas}>
                        Kebutuhan Pakan Campur
                      </Text>
                      <Text style={styles.deskripsiTextSub}>
                        Saat ini anda memiliki 2000 ekor ayam, dengan kebutuhan
                        pakan 100kg/hari
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.extraTextSub}>
                    Harga pakan tiap kilogramnya
                  </Text>
                  <Text style={styles.hargaText}>Rp. 6.000,-/Kg</Text>
                  <TouchableHighlight
                    style={styles.editButton}
                    underlayColor="#FFBA4933">
                    <Text style={styles.editButtonText}>Ubah Data</Text>
                  </TouchableHighlight>
                </View>
              </View>
            ) : (
              <View style={styles.scheduleContainer}>
                <Text style={styles.textSub}>Jadwal Kerja</Text>
                {taskList ? (
                  taskList.length > 0 ? (
                    taskList.map((value, index) => (
                      <View
                        key={value.id}
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
                            <Text style={styles.namaTugas}>{value.title}</Text>
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
            )}
            <TouchableHighlight
              style={styles.logoutButton}
              underlayColor="#FFBA49CC"
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
              <Text style={styles.logoutButtonText}>Keluar</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  containerBackground: {
    backgroundColor: '#2F9C95',
    position: 'absolute',
    zIndex: -999,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  contentContainer: {
    marginTop: 64,
    paddingHorizontal: 16,
  },
  deskripsiContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 5,
    backgroundColor: '#2F9C95',
  },
  profileContainer: {
    marginLeft: 16,
  },
  profileName: {
    color: '#2E4057',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileRole: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  extraText: {
    color: '#2E4057',
  },
  deskripsiText: {
    marginTop: 16,
    color: '#2E4057',
  },
  editButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#FFBA49',
    borderRadius: 10,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
  subText: {
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 32,
  },
  textSub: {
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  schedulePeternakContainer: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
    borderRadius: 10,
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
  titleContainer: {
    flexDirection: 'row',
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
    textTransform: 'capitalize',
    alignSelf: 'flex-start',
  },
  deskripsiTextSub: {
    color: '#2E4057',
  },
  extraTextSub: {
    marginTop: 12,
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hargaText: {
    marginTop: 2,
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
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
  logoutButton: {
    marginVertical: 24,
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
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
  deskripsiTugas: {
    marginTop: 4,
    color: '#2E4057',
  },
});

export default HomeScreen;
