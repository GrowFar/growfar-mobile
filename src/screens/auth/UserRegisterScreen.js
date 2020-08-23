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

const UserRegisterScreen = ({ route, navigation }) => {
  const [heightScreen, setHeightScreen] = useState(0);
  const [loading, setloading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { userType } = route.params;

  const [getUser] = useLazyQuery(FIND_USER_BY_PHONE, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    async onCompleted(data) {
      if (data.findUserByPhone) {
        setloading(false);
        Alert.alert(
          'Nomor Telepon Sudah Terdaftar',
          'Nomor telepon yang anda gunakan sudah terdaftar, silahkan gunakan nomor telepon yang lain!',
        );
      } else {
        try {
          const confirm = await auth().signInWithPhoneNumber(phone);
          setloading(false);
          navigation.navigate('ConfirmCode', {
            type: 'register',
            confirm,
            name,
            phone,
            userType,
          });
        } catch (error) {
          setloading(false);
          console.log('Error ' + error.message);
        }
      }
    },
  });

  useEffect(() => {
    const screenHeight = Dimensions.get('window').height;
    setHeightScreen(screenHeight);
  }, []);

  const onPressRegister = async () => {
    if (name && phone) {
      getUser({ variables: { phone } });
      setloading(true);
    } else {
      Alert.alert(
        'Lengkapi Data Anda',
        'Silahkan lengkapi terlebih dahulu kolom yang tersedia!',
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.containerBackground}>
          <UserRegisterBackground height={heightScreen} />
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.sectionText}>Daftar</Text>
          <Text style={styles.descriptionText}>
            Hanya dengan nomor telepon, dan tunggu kode unik dari kami. Akun
            anda siap digunakan
          </Text>
          <TextInput
            style={styles.inputNamaPengguna}
            placeholder={
              userType === 'peternak' ? 'Nama pemilik peternakan' : 'Nama anda'
            }
            autoCorrect={false}
            autoCapitalize={'words'}
            onChangeText={(text) => setName(text)}
          />
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
            style={styles.registerButton}
            underlayColor="#FFBA49CC"
            onPress={onPressRegister}>
            <Text style={styles.registerButtonText}>Buat Akun</Text>
          </TouchableHighlight>
          {loading ? <Spinner /> : null}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

UserRegisterScreen.navigationOptions = () => ({
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
  registerContainer: {
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
  inputNamaPengguna: {
    marginTop: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
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
  registerButton: {
    marginTop: 32,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
});

export default UserRegisterScreen;
