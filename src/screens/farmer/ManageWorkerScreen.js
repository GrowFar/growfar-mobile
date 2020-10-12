import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const ManageWorkerScreen = ({ navigation }) => {
  const [user, setUser] = useState();

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  return (
    <SafeAreaView style={styles.contentContainer}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 18,
    paddingVertical: 22,
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
});

export default ManageWorkerScreen;
