import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_FARM_WORKER_TASK_BY_FARM_ID } from '../../graphql/Queries';
import { DELETE_FARM_WORKER_TASK_BY_ID } from '../../graphql/Mutations';
import PlusIcon from '../../assets/PlusIcon.svg';
import ThreeDotIcon from '../../assets/ThreeDotIcon.svg';
import ClockIcon from '../../assets/ClockIcon.svg';
import CardTask1 from '../../assets/CardTask1.svg';
import CardTask2 from '../../assets/CardTask2.svg';
import CardTask3 from '../../assets/CardTask3.svg';
import Bell from '../../assets/Bell.svg';

const ManageWorkerScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [taskList, setTaskList] = useState();

  useEffect(() => {
    readUserDataFromStorage();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.notifButton}
          onPress={() => navigation.navigate('NotificationList')}>
          <Text style={styles.notifText}>Pemberitahuan</Text>
          <Bell />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTaskList(null);
      readUserDataFromStorage();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (user) {
      getWorkerTask({
        variables: {
          farmId: user.farm.id,
        },
      });
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

  const [getWorkerTask] = useLazyQuery(FIND_FARM_WORKER_TASK_BY_FARM_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const result = data.findFarmWorkerTaskByFarmId;
      setTaskList(result);
    },
    onError(data) {
      console.log(data);
    },
  });

  const [deleteWorkerTask] = useMutation(DELETE_FARM_WORKER_TASK_BY_ID, {
    onCompleted(data) {
      setTaskList(null);
      getWorkerTask({
        variables: {
          farmId: user.farm.id,
        },
      });
    },
    onError(data) {
      console.log(data);
    },
  });

  const onDeleteTask = (taskId) => {
    deleteWorkerTask({
      variables: {
        farmId: user.farm.id,
        taskId: taskId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.textHeader}>
            Kelola dan Sesuaikan Progress Pekerja Anda
          </Text>
          <Text style={styles.textDescription}>
            Definisikan secara rinci pekerjaan yang harus dilakukan untuk
            mempermudah tracking serta pengorganisasian kegiatan pekerja.
          </Text>
          <TouchableHighlight
            style={styles.addWorkerButton}
            underlayColor="#FFBA49CC"
            onPress={() => navigation.navigate('AddWorker')}>
            <Text style={styles.addWorkerButtonText}>Tambahkan Pekerja</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.manageButton}
            activeOpacity={0.3}
            underlayColor="#FAFAFA"
            onPress={() => navigation.navigate('Komoditas Tersedia')}>
            <Text style={styles.manageButtonText}>Lihat Pekerja</Text>
          </TouchableHighlight>
          <View style={styles.scheduleContainer}>
            <View style={styles.containerTextSub}>
              <Text style={styles.textSub}>Jadwal Pekerjaan</Text>
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={() => navigation.navigate('AddWorkerTask')}>
                <Text style={styles.addTaskButtonText}>Tambahkan Jadwal</Text>
                <PlusIcon />
              </TouchableOpacity>
            </View>
            {taskList ? (
              taskList.length > 0 ? (
                taskList.map((value, index) => (
                  <View key={value.id} style={styles.schedulePekerjaContainer}>
                    <View style={styles.cardContainer}>
                      {renderCard(index)}
                      <Text style={styles.cardText}>
                        {value.title.substring(0, 1)}
                      </Text>
                    </View>
                    <View style={styles.textDescriptionPekerja}>
                      <View style={styles.titleContainer}>
                        <Text style={styles.namaTugas}>{value.title}</Text>
                        <Menu>
                          <MenuTrigger style={styles.dotIcon}>
                            <ThreeDotIcon />
                          </MenuTrigger>
                          <MenuOptions
                            customStyles={{ optionsContainer: { width: 100 } }}>
                            <MenuOption
                              style={styles.menuOption}
                              onSelect={() =>
                                navigation.navigate('EditWorkerTask', {
                                  taskId: value.id,
                                })
                              }>
                              <Text style={styles.darkColorText}>Ubah</Text>
                            </MenuOption>
                            <MenuOption
                              style={styles.menuOption}
                              onSelect={() => onDeleteTask(value.id)}>
                              <Text style={styles.redColorText}>Hapus</Text>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
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
                    Kamu belum menambahkan jadwal pekerjaan
                  </Text>
                </View>
              )
            ) : loading ? (
              <View style={styles.noTaskContainer}>
                <ActivityIndicator size="large" color="#2F9C95" />
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    paddingHorizontal: 18,
    marginVertical: 22,
  },
  textHeader: {
    color: '#2E4057',
    fontSize: 28,
    fontWeight: 'bold',
  },
  textDescription: {
    width: '85%',
    color: '#2E4057',
    fontSize: 14,
    marginTop: 16,
  },
  addWorkerButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  addWorkerButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  manageButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
  containerTextSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
  },
  textSub: {
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addTaskButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskButtonText: {
    marginRight: 8,
    fontSize: 12,
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
  schedulePekerjaContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
    borderRadius: 10,
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  namaTugas: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    alignSelf: 'flex-start',
  },
  deskripsiTugas: {
    marginTop: 2,
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
  dotIcon: {
    padding: 8,
  },
  darkColorText: {
    color: '#2E4057',
  },
  redColorText: {
    color: 'red',
  },
  menuOption: {
    padding: 8,
  },
  notifButton: {
    flexDirection: 'row',
    marginRight: 18,
    padding: 4,
    borderRadius: 4,
  },
  notifText: {
    marginRight: 8,
    fontWeight: 'bold',
    color: '#2E4057',
  },
});

export default ManageWorkerScreen;
