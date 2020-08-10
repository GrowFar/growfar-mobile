import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  TextInput,
} from 'react-native';

const ConfirmCodeScreen = () => {
  const onChangeConfirmCode = (text) => {
    if (text.length === 6) {
      console.log('Konfirmasi');
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
            maxLength={6}
            onChangeText={onChangeConfirmCode}
          />
          <TouchableHighlight
            style={styles.buttonConfirm}
            underlayColor="#FFBA49CC"
            onPress>
            <Text style={styles.buttonTextConfirm}>Kirim ulang kode</Text>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

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
