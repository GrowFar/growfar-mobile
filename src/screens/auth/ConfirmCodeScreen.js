import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  TextInput,
  LogBox,
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import Spinner from '../../components/Spinner';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ConfirmCodeScreen = ({ route, navigation }) => {
  const { confirm, nama, phone, userType } = route.params;
  const [confirmUser, setConfirmUser] = useState(confirm);
  const [code, setCode] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(60);
  let resendOtpTimerInterval;

  // Set user ketika state auth berubah
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((userState) => {
      setUser(userState);
      setLoading(false);
    });
    return subscriber;
  }, []);

  // Jika user sudah diset, redirect ke home
  useEffect(() => {
    if (user) {
      navigation.navigate('Home', {
        uid: user.uid,
        nama,
        phone,
        userType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Update timer
  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resendButtonDisabledTime]);

  const onChangeConfirmCode = async (text) => {
    setCode(text);
    if (text.length === 6) {
      setLoading(true);
      confirmUser.confirm(text).catch((error) => {
        console.log(error);
        setLoading(false);
        setCode(null);
        // eslint-disable-next-line no-alert
        alert('Silahkan cek kembali kode yang telah dikirimkan!');
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
    console.log('Kirim ulang');
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
      <SafeAreaView>
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
              style={styles.buttonConfirmDisable}
              underlayColor="#FFBA49CC"
              disabled>
              <Text style={styles.buttonTextConfirmDisable}>
                Kirim ulang kode dalam {resendButtonDisabledTime}
              </Text>
            </TouchableHighlight>
          ) : (
            <TouchableHighlight
              style={styles.buttonConfirm}
              underlayColor="#FFBA49CC"
              onPress={onPressResendCode}>
              <Text style={styles.buttonTextConfirm}>Kirim ulang kode</Text>
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
  buttonConfirm: {
    marginTop: 32,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderRadius: 10,
  },
  buttonTextConfirm: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
  buttonConfirmDisable: {
    marginTop: 32,
    paddingVertical: 12,
    backgroundColor: '#CFCFCF73',
    borderRadius: 10,
  },
  buttonTextConfirmDisable: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#FFBA49',
  },
});

export default ConfirmCodeScreen;