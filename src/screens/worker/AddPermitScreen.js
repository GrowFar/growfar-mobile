import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import AsyncStorage from '@react-native-community/async-storage';
import { useMutation } from '@apollo/client';
import { CREATE_FARM_WORKER_PERMIT } from '../../graphql/Mutations';
import Spinner from '../../components/Spinner';

const AddPermitScreen = ({ navigation: { goBack } }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [duration, setDuration] = useState(0);
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [categoryPermit, setCategoryPermit] = useState('SICK');
  const [deskripsi, setDeskripsi] = useState();

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (duration > 0 && categoryPermit && deskripsi) {
      setIsDisabledButton(false);
    } else {
      setIsDisabledButton(true);
    }
  }, [duration, categoryPermit, deskripsi]);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const [createWorkerPermit] = useMutation(CREATE_FARM_WORKER_PERMIT, {
    onCompleted(data) {
      setLoading(false);
      if (data.createFarmWorkerPermit) {
        goBack();
      }
    },
    onError(data) {
      setLoading(false);
      console.log(data);
    },
  });

  const onSubmitPermit = () => {
    setLoading(true);
    createWorkerPermit({
      variables: {
        workerPermitInput: {
          category: categoryPermit,
          description: deskripsi,
          duration: duration,
          farm_id: user.farm.id,
          user_id: user.id,
        },
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.textHeader}>Tidak Dapat Hadir?</Text>
            <Text style={styles.textHeader}>Tenang Kami Bantu</Text>
          </View>
          <Text style={styles.textDescription}>
            Bila berhalangan untuk bekerja, buat izin sehingga beban pekerjaanmu
            hari ini dapat diselesaikan oleh pekerja yang lain. Juga agar
            pemilik peternakan mengetahui kondisimu
          </Text>
          <Text style={styles.textDuration}>Lama Tidak Hadir</Text>
          <Slider
            containerStyle={styles.containerSlider}
            trackStyle={styles.trackSlider}
            value={duration}
            minimumTrackTintColor="#40C9A2"
            maximumTrackTintColor="#FFFFFF"
            thumbTintColor="#40C9A2"
            minimumValue={0}
            maximumValue={7}
            step={1}
            renderAboveThumbComponent={() => (
              <Text style={styles.textAboveSlider}>{duration} Hari</Text>
            )}
            onSlidingComplete={(value) => setDuration(value[0])}
          />
          <Text style={styles.categoryPermitText}>Kategori Perizinan</Text>
          <View style={styles.categoryPermitContainer}>
            <TouchableHighlight
              style={
                categoryPermit === 'SICK'
                  ? {
                      ...styles.categoryPermitButton,
                      ...styles.backgroundColorGreen,
                    }
                  : {
                      ...styles.categoryPermitButton,
                      ...styles.backgroundColorWhite,
                    }
              }
              underlayColor="#2F9C95"
              onPress={() => setCategoryPermit('SICK')}>
              <Text
                style={
                  categoryPermit === 'SICK'
                    ? styles.categoryPermitButtonText
                    : {
                        ...styles.categoryPermitButtonText,
                        ...styles.textColorGreen,
                      }
                }>
                Sakit
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={
                categoryPermit === 'EVENT'
                  ? {
                      ...styles.categoryPermitButton,
                      ...styles.backgroundColorGreen,
                    }
                  : {
                      ...styles.categoryPermitButton,
                      ...styles.backgroundColorWhite,
                    }
              }
              underlayColor="#2F9C95"
              onPress={() => setCategoryPermit('EVENT')}>
              <Text
                style={
                  categoryPermit === 'EVENT'
                    ? styles.categoryPermitButtonText
                    : {
                        ...styles.categoryPermitButtonText,
                        ...styles.textColorGreen,
                      }
                }>
                Keluarga
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={
                categoryPermit === 'OTHERS'
                  ? {
                      ...styles.categoryPermitButton,
                      ...styles.backgroundColorGreen,
                    }
                  : {
                      ...styles.categoryPermitButton,
                      ...styles.backgroundColorWhite,
                    }
              }
              underlayColor="#2F9C95"
              onPress={() => setCategoryPermit('OTHERS')}>
              <Text
                style={
                  categoryPermit === 'OTHERS'
                    ? styles.categoryPermitButtonText
                    : {
                        ...styles.categoryPermitButtonText,
                        ...styles.textColorGreen,
                      }
                }>
                Lain-Lain
              </Text>
            </TouchableHighlight>
          </View>
          <TextInput
            style={styles.textArea}
            autoCorrect={false}
            multiline={true}
            numberOfLines={5}
            minHeight={Platform.OS === 'ios' ? 20 * 5 : null}
            maxLength={300}
            placeholder="Alasan ketidakhadiran"
            textAlignVertical="top"
            onChangeText={(text) => setDeskripsi(text)}
          />
          <Text style={styles.textAreaLength}>
            {deskripsi ? deskripsi.length : '0'}/300
          </Text>
          <TouchableHighlight
            style={
              isDisabledButton ? styles.izinDisabledButton : styles.izinButton
            }
            underlayColor="#FFBA49CC"
            onPress={onSubmitPermit}>
            <Text
              style={
                isDisabledButton
                  ? styles.izinDisabledButtonText
                  : styles.izinButtonText
              }>
              Ajukan Perizinan
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.contactButton}
            activeOpacity={0.3}
            underlayColor="#FAFAFA"
            onPress={() => Linking.openURL(`tel:${user.farm.user.phone}`)}>
            <Text style={styles.contactButtonText}>Atau Hubungi Langsung</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
      {loading ? <Spinner /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    paddingHorizontal: 16,
    marginVertical: 22,
  },
  textHeader: {
    color: '#2E4057',
    fontSize: 28,
    fontWeight: 'bold',
  },
  textDescription: {
    color: '#2E4057',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  textDuration: {
    color: '#2E4057',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  containerSlider: {
    width: '90%',
  },
  trackSlider: {
    height: 7,
  },
  textAboveSlider: {
    marginTop: 16,
    color: '#2F9C95',
    fontWeight: 'bold',
  },
  typePermitText: {
    marginTop: 20,
    color: '#2E4057',
    fontWeight: 'bold',
    fontSize: 20,
  },
  categoryPermitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryPermitButton: {
    width: '30%',
    padding: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  categoryPermitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    textTransform: 'uppercase',
  },
  backgroundColorGreen: {
    backgroundColor: '#2F9C95',
  },
  backgroundColorWhite: {
    backgroundColor: 'white',
  },
  textColorGreen: {
    color: '#2F9C95',
  },
  textArea: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  textAreaLength: {
    marginTop: 4,
    textAlign: 'right',
    fontSize: 12,
  },
  izinButton: {
    marginTop: 18,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  izinButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  izinDisabledButton: {
    marginTop: 18,
    paddingVertical: 12,
    backgroundColor: '#EAE9E9',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 10,
  },
  izinDisabledButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#B5B5B5',
  },
  contactButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
});

export default AddPermitScreen;
