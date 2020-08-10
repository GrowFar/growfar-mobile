import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableHighlight,
} from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [widthRegisterButton, setWidthRegisterButton] = useState(0);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const paddingApp = 22 * 2; //jumlah padding kanan kiri
    const paddingButton = 8 * 4 + 8 * 2; //jumlah padding button + margin antar button
    setWidthRegisterButton((screenWidth - paddingApp - paddingButton) / 2);
  }, []);

  const onPress = () => console.log('Test');

  return (
    <SafeAreaView>
      <View style={styles.registerContainer}>
        <Text style={styles.appName}>growfar</Text>
        <Text style={styles.descriptionText}>
          Daftarkan dirimu, dan permudah pekerjaanmu dibidang peternakan
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.buttonPeternak}
            underlayColor="#2F9C95CC"
            onPress={() => navigation.navigate('UserRegister')}>
            <View style={{ width: widthRegisterButton }}>
              <Text style={styles.buttonText}>Daftar sebagai peternak</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.buttonPekerja}
            underlayColor="#2F9C95CC"
            onPress={onPress}>
            <View style={{ width: widthRegisterButton }}>
              <Text style={styles.buttonText}>Daftar sebagai pekerja</Text>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          style={styles.buttonMasuk}
          underlayColor="#FFBA49CC"
          onPress={onPress}>
          <Text style={styles.buttonTextMasuk}>Masuk</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  buttonMasuk: {
    marginTop: 32,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  buttonTextMasuk: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
});

export default RegisterScreen;
