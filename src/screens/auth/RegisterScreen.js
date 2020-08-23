import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableHighlight,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import RegisterBackground from '../../assets/RegisterBackground.svg';

const USER_ROLE = {
  FARMER: 'FARMER',
  WORKER: 'WORKER',
};

const RegisterScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [widthScreen, setWidthScreen] = useState(0);
  const [heightScreen, setHeightScreen] = useState(0);

  useEffect(() => {
    const renderContent = async () => {
      const result = await auth().currentUser;
      console.log(result);
      if (result) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          }),
        );
      } else {
        setIsLoggedIn(false);
      }
    };
    renderContent();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const paddingApp = 22 * 2; //jumlah padding kanan kiri
    const paddingButton = 8 * 4 + 8 * 2; //jumlah padding button + margin antar button
    setWidthScreen((screenWidth - paddingApp - paddingButton) / 2);
    setHeightScreen(screenHeight);
  }, [navigation]);

  if (isLoggedIn === false) {
    return (
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.containerBackground}>
          <RegisterBackground height={heightScreen} />
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.appName}>growfar</Text>
          <Text style={styles.descriptionText}>
            Daftarkan dirimu, dan permudah pekerjaanmu dibidang peternakan
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              style={styles.buttonPeternak}
              underlayColor="#2F9C95CC"
              onPress={() =>
                navigation.navigate('UserRegister', {
                  userType: USER_ROLE.FARMER,
                })
              }>
              <View style={{ width: widthScreen }}>
                <Text style={styles.buttonText}>Daftar sebagai peternak</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonPekerja}
              underlayColor="#2F9C95CC"
              onPress={() =>
                navigation.navigate('UserRegister', {
                  userType: USER_ROLE.WORKER,
                })
              }>
              <View style={{ width: widthScreen }}>
                <Text style={styles.buttonText}>Daftar sebagai pekerja</Text>
              </View>
            </TouchableHighlight>
          </View>
          <TouchableHighlight
            style={styles.loginButton}
            underlayColor="#FFBA49CC"
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Masuk</Text>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    );
  } else {
    return null;
  }
};

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
  appName: {
    color: '#2F9C95',
    fontWeight: 'bold',
    fontSize: 48,
  },
  descriptionText: {
    fontSize: 16,
    color: '#2F9C95',
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  buttonPeternak: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: '#2F9C95',
    borderRadius: 10,
  },
  buttonPekerja: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    marginLeft: 8,
    backgroundColor: '#2F9C95',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
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

export default RegisterScreen;
