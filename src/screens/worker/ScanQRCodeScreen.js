import React, { useState, useEffect } from 'react';
import {
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useMutation } from '@apollo/client';
import { REGISTER_NEW_WORKER } from '../../graphql/Mutations';

const ScanQRCodeScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [isRender, setIsRender] = useState(false);

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
      Alert.alert(null, 'Kode tidak dapat digunakan!');
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setIsRender(true);
    }, 300);
  }, []);

  const onRead = (e) => {
    registerNewWorker({
      variables: {
        userId: user.id,
        invitationCode: e.data,
      },
    });
  };

  return (
    <SafeAreaView style={styles.contentContainer}>
      <StatusBar backgroundColor="#C8C8C8" />
      <ActivityIndicator style={styles.spinner} size="large" color="#2F9C95" />
      {isRender ? <QRCodeScanner onRead={onRead} /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  spinner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ScanQRCodeScreen;
