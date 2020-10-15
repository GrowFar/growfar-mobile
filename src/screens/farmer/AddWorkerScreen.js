import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  Clipboard,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-community/async-storage';
import { useMutation } from '@apollo/client';
import { GENERATE_FARM_INVITATION_CODE } from '../../graphql/Mutations';

const AddWorkerScreen = () => {
  const [widthScreen, setWidthScreen] = useState(0);
  const [user, setUser] = useState();
  const [code, setCode] = useState('0000');

  useEffect(() => {
    setWidthScreen(Dimensions.get('window').width - 72);
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      generateCode({
        variables: {
          farmId: user.id,
        },
      });
    }
  }, [user]);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const mergeUserData = async (value) => {
    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  const [generateCode] = useMutation(GENERATE_FARM_INVITATION_CODE, {
    async onCompleted(data) {
      const result = data.generateFarmInvitationCode.generated_token;
      await mergeUserData({
        farm: {
          invitationCode: result,
        },
      });
      setCode(result);
    },
    onError(error) {
      if (error.message === 'Token already generated, please wait') {
        setCode(user.farm.invitationCode);
      }
    },
  });

  const onCopyInvitationCode = () => {
    Clipboard.setString(code);
    Snackbar.show({
      text: 'Kode berhasil disalin!',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View width={widthScreen} style={styles.qrCodeContainer}>
            <QRCode
              size={widthScreen - 64}
              style={styles.qrCode}
              value={code}
            />
          </View>
          <Text style={styles.textHeader}>Tambahkan Pekerja Baru</Text>
          <Text style={styles.textDescription}>
            Melalui aplikasi yang mereka miliki, minta untuk menscan kode QR
            tersebut atau masukkan kode unik peternakanmu dibawah ini.
          </Text>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{code.charAt(0)}</Text>
            <Text style={styles.code}>{code.charAt(1)}</Text>
            <Text style={styles.code}>{code.charAt(2)}</Text>
            <Text style={styles.code}>{code.charAt(3)}</Text>
          </View>
          <TouchableHighlight
            style={styles.copyButton}
            underlayColor="#FFBA49CC"
            onPress={onCopyInvitationCode}>
            <Text style={styles.copyButtonText}>Salin Kode Unik</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 18,
  },
  contentContainer: {
    marginVertical: 22,
  },
  qrCodeContainer: {
    margin: 18,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 10,
    padding: 32,
  },
  textHeader: {
    marginTop: 12,
    color: '#2E4057',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textDescription: {
    marginTop: 8,
    color: '#2E4057',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
  },
  codeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 38,
  },
  code: {
    backgroundColor: 'white',
    paddingHorizontal: 26,
    paddingVertical: 16,
    marginVertical: 4,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#40C9A2',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  copyButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  copyButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default AddWorkerScreen;
