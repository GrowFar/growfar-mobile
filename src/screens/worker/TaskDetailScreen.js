import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Platform,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  FIND_FARM_WORKER_TASK_BY_ID,
  FIND_WORKER_IS_ON_WORK_LOCATION,
} from '../../graphql/Queries';
import { CREATE_FARM_WORKER_TASK_ON_DONE } from '../../graphql/Mutations';
import Spinner from '../../components/Spinner';
import ClockIcon from '../../assets/ClockIcon.svg';
import CardTask1 from '../../assets/CardTask1.svg';
import CardTask2 from '../../assets/CardTask2.svg';
import CardTask3 from '../../assets/CardTask3.svg';

const TaskDetailScreen = ({ route, navigation, navigation: { goBack } }) => {
  const { taskId, cardType } = route.params;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [taskDetail, setTaskDetail] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [insideFarm, setInsideFarm] = useState(false);
  const [deskripsi, setDeskripsi] = useState();

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      onCheckLocation();
      getTaskDetail({
        variables: {
          taskId: taskId,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTaskDetail(null);
      readUserDataFromStorage();
    });
    return unsubscribe;
  }, [navigation]);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

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

  const [getTaskDetail] = useLazyQuery(FIND_FARM_WORKER_TASK_BY_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setTaskDetail(null);
      const result = data.findFarmWorkerTaskById;
      setTaskDetail(result);
    },
    onError(data) {
      console.log(data);
    },
  });

  const [setTaskDone] = useMutation(CREATE_FARM_WORKER_TASK_ON_DONE, {
    onCompleted(data) {
      setLoading(false);
      if (data.createFarmWorkerTaskOnDone) {
        goBack();
      }
    },
    onError(data) {
      setLoading(false);
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

  const onFinishTask = () => {
    setModalVisible(false);
    setTaskDone({
      variables: {
        userId: user.id,
        workerTaskId: taskId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {taskDetail ? (
            <View style={styles.scheduleContainer}>
              <View style={styles.schedulePekerjaContainer}>
                <View style={styles.cardContainer}>
                  {renderCard(cardType)}
                  <Text style={styles.cardText}>
                    {taskDetail.title.substring(0, 1)}
                  </Text>
                </View>
                <View style={styles.textDescriptionPekerja}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.namaTugas}>{taskDetail.title}</Text>
                  </View>
                  <Text style={styles.deskripsiTugas}>
                    {taskDetail.description}
                  </Text>
                  <View style={styles.timePekerjaContainer}>
                    <ClockIcon width="24" height="24" />
                    <Text style={styles.timePekerja}>
                      {convertTime(taskDetail.started_at)} -{' '}
                      {convertTime(taskDetail.ended_at)}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableHighlight
                disabled={!insideFarm}
                style={
                  insideFarm
                    ? styles.finishTaskButton
                    : styles.finishTaskDisabledButton
                }
                underlayColor="#FFBA49CC"
                onPress={() => setModalVisible(true)}>
                <Text
                  style={
                    insideFarm
                      ? styles.finishTaskButtonText
                      : styles.finishTaskDisabledButtonText
                  }>
                  Selesai Dikerjakan
                </Text>
              </TouchableHighlight>
              <Text style={styles.subText}>Butuh Penjelasan</Text>
              <Text>
                Berikan salam, dan tinggalkan pertanyaan untuk Pak Ngatemo.
                Sehingga nanti dapat dijawab
              </Text>
              <TextInput
                style={styles.textArea}
                autoCorrect={false}
                multiline={true}
                numberOfLines={5}
                minHeight={Platform.OS === 'ios' ? 20 * 5 : null}
                maxLength={300}
                placeholder="Deskripsi"
                textAlignVertical="top"
                onChangeText={(text) => setDeskripsi(text)}
              />
              <Text style={styles.textAreaLength}>
                {deskripsi ? deskripsi.length : '0'}/300
              </Text>
              <TouchableHighlight
                style={styles.izinButton}
                underlayColor="#FFBA49CC"
                onPress={() => console.log('cek')}>
                <Text style={styles.izinButtonText}>Kirim Pesan</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.contactButton}
                activeOpacity={0.3}
                underlayColor="#FAFAFA"
                onPress={() => Linking.openURL(`tel:${user.farm.user.phone}`)}>
                <Text style={styles.contactButtonText}>
                  Atau Hubungi Langsung
                </Text>
              </TouchableHighlight>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <TouchableWithoutFeedback
                  onPress={() => (loading ? null : setModalVisible(false))}>
                  <View style={styles.bottomView}>
                    <View style={styles.modalView}>
                      <Text style={styles.confirmText}>
                        Apakah anda yakin sudah menyelesaikan pekerjaan ini?
                      </Text>
                      <View style={styles.containerConfirm}>
                        <TouchableHighlight
                          style={styles.confirmPositiveButton}
                          underlayColor="#FFBA49CC"
                          onPress={onFinishTask}>
                          <Text style={styles.confirmPositiveButtonText}>
                            Ya, yakin
                          </Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                          style={styles.confirmNegativeButton}
                          underlayColor="#FFBA49CC"
                          onPress={() => setModalVisible(false)}>
                          <Text style={styles.confirmNegativeButtonText}>
                            Batal
                          </Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          ) : (
            <View style={styles.loadingTaskContainer}>
              <ActivityIndicator size="large" color="#2F9C95" />
            </View>
          )}
        </View>
      </ScrollView>
      {loading ? <Spinner /> : null}
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
    marginBottom: 22,
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
  loadingTaskContainer: {
    marginTop: 8,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
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
  finishTaskButton: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  finishTaskButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  finishTaskDisabledButton: {
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: '#EAE9E9',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 10,
  },
  finishTaskDisabledButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#B5B5B5',
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(78, 78, 78, 0.58)',
  },
  modalView: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  confirmText: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerConfirm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  confirmPositiveButton: {
    width: '45%',
    padding: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  confirmPositiveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  confirmNegativeButton: {
    width: '45%',
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#FFBA49',
    borderRadius: 10,
  },
  confirmNegativeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
  textArea: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  textAreaLength: {
    marginTop: 4,
    textAlign: 'right',
    fontSize: 12,
  },
  izinButton: {
    marginTop: 18,
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
  contactButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
  subText: {
    marginTop: 32,
    marginBottom: 4,
    color: '#2E4057',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default TaskDetailScreen;
