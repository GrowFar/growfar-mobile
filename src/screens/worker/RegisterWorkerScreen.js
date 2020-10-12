import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Alert,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useMutation } from '@apollo/client';
import { REGISTER_NEW_WORKER } from '../../graphql/Mutations';

const RegisterWorkerScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [code, setCode] = useState();

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const [registerNewWorker] = useMutation(REGISTER_NEW_WORKER, {
    onCompleted(data) {
      console.log(data);
      if (data) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeWorker' }],
          }),
        );
      }
    },
    onError() {
      Alert.alert(
        null,
        'Kode tidak dapat digunakan, silahkan hubungi kembali peternak!',
      );
    },
  });

  const onChangeFarmCode = (text) => {
    setCode(text);
    if (text.length === 4) {
      registerNewWorker({
        variables: {
          userId: user.id,
          invitationCode: text,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.contentContainer}>
      <StatusBar backgroundColor="#C8C8C8" />
      <Text style={styles.sectionText}>Masukkan Kode Unik Peternakan</Text>
      <Text style={styles.descriptionText}>
        Minta pemilik peternakan untuk menunjukkan kode unik peternakan mereka.
        Hal tersebut untuk mendaftar sebagai pekerja disana.
      </Text>
      <TextInput
        style={styles.inputFarmCode}
        placeholder="Berikan kode unik"
        autoCapitalize={'characters'}
        maxLength={4}
        onChangeText={onChangeFarmCode}
        value={code}
      />
      <Text style={styles.atauText}>atau</Text>
      <TouchableHighlight
        style={styles.scanButton}
        underlayColor="#FFBA49CC"
        onPress={() => navigation.navigate('ScanQRCode')}>
        <Text style={styles.scanButtonText}>Scan Kode QR Peternak</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    paddingHorizontal: 34,
    backgroundColor: '#FAFAFA',
  },
  sectionText: {
    marginTop: '15%',
    color: '#2E4057',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  descriptionText: {
    color: '#2E4057',
    marginTop: 8,
    marginRight: 4,
    textAlign: 'center',
  },
  inputFarmCode: {
    marginTop: '10%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlign: 'center',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
  },
  atauText: {
    marginTop: '20%',
    color: '#2E4057',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  scanButton: {
    marginTop: '6%',
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default RegisterWorkerScreen;
