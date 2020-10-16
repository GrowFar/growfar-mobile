import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  TextInput,
  LogBox,
  Alert,
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_NEW_USER } from '../../graphql/Mutations';
import {
  FIND_USER_BY_PHONE,
  FIND_FARM_BY_USER_ID,
  FIND_FARM_BY_WORKER_ID,
} from '../../graphql/Queries';
import Spinner from '../../components/Spinner';
import ConfirmCodeBackground from '../../assets/ConfirmCodeBackground.svg';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ConfirmCodeScreen = ({ route, navigation }) => {
  const { type, confirm, phone, role } = route.params;
  const [user, setUser] = useState();
  const [heightScreen, setHeightScreen] = useState(0);
  const [confirmUser, setConfirmUser] = useState(confirm);
  const [code, setCode] = useState();
  const [loading, setLoading] = useState(true);
  const [userFirebase, setUserFirebase] = useState();
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(60);
  let resendOtpTimerInterval;

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  const mergeUserData = async (value) => {
    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  // Redirect screen
  const redirectScreen = (routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      }),
    );
  };

  useEffect(() => {
    if (user) {
      getFarmByWorkerId({
        variables: {
          userId: user.id,
        },
      });
    }
  }, [user]);

  // Set userFirebase ketika state auth berubah dan tidak null
  useEffect(() => {
    const screenHeight = Dimensions.get('window').height;
    setHeightScreen(screenHeight);
    const subscriber = auth().onAuthStateChanged((userState) => {
      if (userState) {
        setUserFirebase(userState);
      } else {
        setLoading(false);
      }
    });
    return subscriber;
  }, []);

  // Cari user berdasarkan nomor hp
  const [getUser] = useLazyQuery(FIND_USER_BY_PHONE, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    async onCompleted(data) {
      const result = data.findUserByPhone;
      if (result) {
        storeData(data.findUserByPhone);
        if (role === 'FARMER') {
          getFarm({ variables: { userId: result.id } });
        } else if (role === 'WORKER') {
          readUserDataFromStorage();
        }
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  const [getFarmByWorkerId] = useLazyQuery(FIND_FARM_BY_WORKER_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    async onCompleted(data) {
      const result = data.findFarmByWorkerId;
      if (result) {
        await mergeUserData({
          farm: result,
        });
        redirectScreen('HomeWorker');
      } else {
        redirectScreen('OnBoarding');
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  // Cari farm berdasarkan id user
  const [getFarm] = useLazyQuery(FIND_FARM_BY_USER_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      if (data.findFarmByUserId) {
        mergeUserData({
          farm: data.findFarmByUserId,
        });
        redirectScreen('HomeFarm');
      } else {
        redirectScreen('AddFarm');
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  // Jika user sudah diset dan tipenya login, redirect ke home
  // Jika tipenya register daftarkan akun
  const [addNewUser] = useMutation(CREATE_NEW_USER, {
    onCompleted(data) {
      storeData(data.createNewUser);
      if (role === 'FARMER') {
        redirectScreen('AddFarm');
      } else if (role === 'WORKER') {
        redirectScreen('OnBoarding');
      }
    },
  });

  useEffect(() => {
    if (userFirebase) {
      if (type === 'login') {
        getUser({ variables: { phone: userFirebase.phoneNumber } });
      } else {
        setLoading(true);
        addNewUser({
          variables: {
            uid: userFirebase.uid,
            fullname: route.params.name,
            phone: userFirebase.phoneNumber,
            role: role,
          },
        });
      }
    }
  }, [userFirebase]);

  // Update timer
  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  const onChangeConfirmCode = (text) => {
    setCode(text);
    if (text.length === 6) {
      setLoading(true);
      confirmUser.confirm(text).catch((error) => {
        setLoading(false);
        setCode(null);
        Alert.alert(
          'Kode Salah',
          'Silahkan cek kembali kode yang telah dikirimkan!',
        );
      });
    }
  };

  // Set timer
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  // Kirim ulang kode verifikasi
  const onPressResendCode = async () => {
    try {
      setLoading(true);
      setConfirmUser(await auth().signInWithPhoneNumber(phone, true));
      setLoading(false);
    } catch (error) {
      console.log('Error ' + error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.containerBackground}>
          <ConfirmCodeBackground height={heightScreen} />
        </View>
        <View style={styles.confirmCodeContainer}>
          <Text style={styles.sectionText}>Masukkan Kode</Text>
          <Text style={styles.descriptionText}>
            Berikan kode yang kami kirim melalui SMS.{' '}
            <Text style={styles.subDescriptionText}>
              Ingat jangan biarkan siapapun tau termasuk tim growfar
            </Text>
          </Text>
          <TextInput
            style={styles.inputConfirmCode}
            placeholder="Berikan kode konfirmasi"
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={onChangeConfirmCode}
            value={code}
          />
          {resendButtonDisabledTime > 0 ? (
            <TouchableHighlight
              style={styles.confirmButtonDisable}
              underlayColor="#FFBA49CC"
              disabled>
              <Text style={styles.confirmButtonTextDisable}>
                Kirim ulang kode dalam {resendButtonDisabledTime}
              </Text>
            </TouchableHighlight>
          ) : (
            <TouchableHighlight
              style={styles.confirmButton}
              underlayColor="#FFBA49CC"
              onPress={onPressResendCode}>
              <Text style={styles.confirmButtonText}>Kirim ulang kode</Text>
            </TouchableHighlight>
          )}
          {loading ? <Spinner /> : null}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

ConfirmCodeScreen.navigationOptions = () => ({
  headerLeft: <HeaderBackButton />,
});

const styles = StyleSheet.create({
  contentContainer: {
    position: 'relative',
  },
  containerBackground: {
    position: 'absolute',
    zIndex: -999,
  },
  confirmCodeContainer: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  sectionText: {
    color: '#2F9C95',
    fontWeight: 'bold',
    fontSize: 48,
  },
  descriptionText: {
    fontSize: 16,
    color: '#2F9C95',
    marginTop: 12,
    marginRight: 4,
  },
  subDescriptionText: {
    fontWeight: '700',
  },
  inputConfirmCode: {
    marginTop: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlign: 'center',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
  },
  confirmButton: {
    marginTop: 32,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderRadius: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
  confirmButtonDisable: {
    marginTop: 32,
    paddingVertical: 12,
    backgroundColor: '#CFCFCF73',
    borderRadius: 10,
  },
  confirmButtonTextDisable: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#FFBA49',
  },
});

export default ConfirmCodeScreen;
