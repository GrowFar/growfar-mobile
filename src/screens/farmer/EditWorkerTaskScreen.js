import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Platform,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useLazyQuery } from '@apollo/client';
import { UPDATE_FARM_WORKER_TASK } from '../../graphql/Mutations';
import { FIND_FARM_WORKER_TASK_BY_ID } from '../../graphql/Queries';
import Spinner from '../../components/Spinner';

const EditWorkerTaskScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [loading, setLoading] = useState(false);
  const [judul, setJudul] = useState();
  const [deskripsi, setDeskripsi] = useState();
  const [firstShift, setFirstShift] = useState({ start: null, end: null });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerUsedBy, setTimePickerUsedBy] = useState(null);
  const [isDisabledButton, setIsDisabledButton] = useState(true);

  useEffect(() => {
    getTaskDetail({
      variables: {
        taskId: taskId,
      },
    });
  }, []);

  useEffect(() => {
    if (judul && deskripsi && firstShift.start && firstShift.end) {
      setIsDisabledButton(false);
    } else {
      setIsDisabledButton(true);
    }
  }, [judul, deskripsi, firstShift]);

  const onChangeTimer = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      let time = moment(selectedDate).format('HH:mm') + ':00';
      switch (timePickerUsedBy) {
        case 'firstShiftStart':
          setFirstShift({
            ...firstShift,
            start: time,
          });
          break;
        case 'firstShiftEnd':
          setFirstShift({
            ...firstShift,
            end: time,
          });
          break;
      }
    }
  };

  const [getTaskDetail] = useLazyQuery(FIND_FARM_WORKER_TASK_BY_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findFarmWorkerTaskById;
      setJudul(result.title);
      setDeskripsi(result.description);
      setFirstShift({
        start: result.started_at,
        end: result.ended_at,
      });
    },
    onError(data) {
      console.log(data);
    },
  });

  const [updateWorkerTask] = useMutation(UPDATE_FARM_WORKER_TASK, {
    onCompleted(data) {
      setLoading(false);
      if (data.updateFarmWorkerTask) {
        navigation.goBack();
      }
    },
    onError(data) {
      setLoading(false);
      console.log(data);
    },
  });

  const onAddTask = () => {
    setLoading(true);
    let workerTask = {
      title: judul,
      description: deskripsi,
      started_at: firstShift.start,
      ended_at: firstShift.end,
    };
    updateWorkerTask({
      variables: {
        workerTaskId: taskId,
        farmWorkerTaskInput: workerTask,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.textHeader}>Ubah Pekerjaan</Text>
          <Text style={styles.textDescription}>
            Kamu dapat mengubah deskripsi singkat, dan kapan pekerjaan tersebut
            harus diselesaikan.
          </Text>
          <TextInput
            style={styles.inputFarm}
            autoCorrect={false}
            multiline={Platform.OS === 'android' ? true : false}
            placeholder="Berikan judul pekerjaan"
            value={judul}
            onChangeText={(text) => setJudul(text)}
          />
          <TextInput
            style={styles.textAreaFarm}
            autoCorrect={false}
            multiline={Platform.OS === 'android' ? true : false}
            numberOfLines={3}
            placeholder="Deskripsi"
            value={deskripsi}
            onChangeText={(text) => setDeskripsi(text)}
          />
          <View style={styles.shiftContainer}>
            <Text style={styles.switchText}>Jadwal Pekerjaan</Text>
            <Text
              style={
                firstShift.start
                  ? { ...styles.inputTimer, ...styles.blackColorText }
                  : { ...styles.inputTimer, ...styles.placeholderText }
              }
              onPress={() => {
                setTimePickerUsedBy('firstShiftStart');
                setShowTimePicker(true);
              }}>
              {firstShift.start ? firstShift.start : 'Jam mulai'}
            </Text>
            <Text
              style={
                firstShift.end
                  ? { ...styles.inputTimer, ...styles.blackColorText }
                  : { ...styles.inputTimer, ...styles.placeholderText }
              }
              onPress={() => {
                setTimePickerUsedBy('firstShiftEnd');
                setShowTimePicker(true);
              }}>
              {firstShift.end ? firstShift.end : 'Jam berakhir'}
            </Text>
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={true}
              onChange={onChangeTimer}
            />
          )}
          <TouchableHighlight
            disabled={isDisabledButton}
            style={
              isDisabledButton
                ? styles.addWorkerDisabledButton
                : styles.addWorkerButton
            }
            underlayColor="#FFBA49CC"
            onPress={onAddTask}>
            <Text
              style={
                isDisabledButton
                  ? styles.addWorkerDisabledButtonText
                  : styles.addWorkerButtonText
              }>
              Ubah Jadwal Pekerjaan
            </Text>
          </TouchableHighlight>
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
    paddingHorizontal: 16,
  },
  contentContainer: {
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
    marginTop: 4,
    marginBottom: 24,
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
  inputTimer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
  },
  inputTimerDisabled: {
    backgroundColor: '#EFEFEF',
    color: '#CDCDCD',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
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
  containerSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  switchText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shiftContainer: {
    marginTop: 8,
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
  addWorkerDisabledButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: '#EAE9E9',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 10,
  },
  addWorkerDisabledButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#B5B5B5',
  },
  blackColorText: {
    color: 'black',
  },
  placeholderText: {
    color: '#CDCDCD',
  },
});

export default EditWorkerTaskScreen;
