import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  TextInput,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { useLazyQuery } from '@apollo/client';
import { FIND_USER_BY_PHONE } from '../../graphql/Queries';
import Spinner from '../../components/Spinner';
import UserRegisterBackground from '../../assets/UserRegisterBackground.svg';

const LoginScreen = ({ navigation }) => {
  const [heightScreen, setHeightScreen] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  const [getUser] = useLazyQuery(FIND_USER_BY_PHONE, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    async onCompleted(data) {
      if (data.findUserByPhone) {
        try {
          const confirm = await auth().signInWithPhoneNumber(phone);
          setLoading(false);
          navigation.navigate('ConfirmCode', {
            type: 'login',
            confirm,
            phone,
            role: data.findUserByPhone.role,
          });
        } catch (error) {
          setLoading(false);
          console.log('Error ' + error.message);
        }
      } else {
        setLoading(false);
        Alert.alert(
          'Nomor Telepon Belum Terdaftar',
          'Nomor telepon yang anda gunakan belum terdaftar, silahkan buat akun terlebih dahulu!',
        );
      }
    },
  });

  useEffect(() => {
    const screenHeight = Dimensions.get('window').height;
    setHeightScreen(screenHeight);
  }, []);

  const onPressRegister = async () => {
    if (phone) {
      getUser({ variables: { phone } });
      setLoading(true);
    } else {
      Alert.alert(
        'Masukkan Nomor Telepon',
        'Silahkan masukkan terlebih dahulu nomor telepon yang telah terdaftar!',
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.containerBackground}>
          <UserRegisterBackground height={heightScreen} />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.sectionText}>Masuk</Text>
          <Text style={styles.descriptionText}>
            Hanya dengan nomor telepon, dan tunggu kode unik dari kami. Anda
            sudah dapat masuk kedalam sistem
          </Text>
          <View style={styles.containerInputNoHP}>
            <Text style={styles.labelInputNoHP}>+62</Text>
            <TextInput
              style={styles.inputNoHP}
              placeholder="Berikan nomor telepon"
              keyboardType="phone-pad"
              onChangeText={(text) => {
                if (text[0] === '0') {
                  text = text.slice(1);
                } else if (text.substring(0, 3) === '+62') {
                  text = text.slice(3);
                }
                setPhone('+62' + text);
              }}
            />
          </View>
          <TouchableHighlight
            style={styles.loginButton}
            underlayColor="#FFBA49CC"
            onPress={onPressRegister}>
            <Text style={styles.loginButtonText}>Masuk</Text>
          </TouchableHighlight>
          {loading ? <Spinner /> : null}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

LoginScreen.navigationOptions = () => ({
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
  loginContainer: {
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
  containerInputNoHP: {
    flexDirection: 'row',
    marginTop: 16,
  },
  labelInputNoHP: {
    marginRight: 16,
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#2F9C95',
  },
  inputNoHP: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
  },
  loginButton: {
    marginTop: 32,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
});

export default LoginScreen;
