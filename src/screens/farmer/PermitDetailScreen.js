import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Linking,
  Modal,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_FARM_WORKER_PERMIT_BY_ID } from '../../graphql/Queries';
import { CREATE_FARM_WORKER_PERMIT_SUBMIT } from '../../graphql/Mutations';
import Spinner from '../../components/Spinner';
import ClockRedIcon from '../../assets/ClockRedIcon.svg';

const PermitDetailScreen = ({ route, navigation: { goBack } }) => {
  const { permitId } = route.params;
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [permitDetail, setPermitDetail] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    readUserDataFromStorage();
    getPermitDetail({
      variables: {
        workerPermitId: permitId,
      },
    });
  }, []);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const [getPermitDetail] = useLazyQuery(FIND_FARM_WORKER_PERMIT_BY_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const result = data.findFarmWorkerPermitById;
      setPermitDetail(result);
    },
    onError(data) {
      console.log(data);
    },
  });

  const [submitPermit] = useMutation(CREATE_FARM_WORKER_PERMIT_SUBMIT, {
    onCompleted(data) {
      setLoading(false);
      goBack();
    },
    onError(data) {
      console.log(data);
    },
  });

  const onAllowPermit = () => {
    setModalVisible(false);
    setLoading(true);
    submitPermit({
      variables: {
        workerPermitId: permitId,
        isAllowed: true,
        farmId: user.farm.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {permitDetail ? (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View style={styles.profileContainerPekerja}>
              <Image
                style={styles.profileImagePekerja}
                source={{
                  uri: `https://api.adorable.io/avatars/${
                    permitDetail.worker.uid ? permitDetail.worker.uid : '1'
                  }`,
                }}
              />
              <View style={styles.textDescriptionPekerja}>
                <Text style={styles.namaPekerja}>
                  {permitDetail.worker.fullname}
                </Text>
                <View style={styles.timePekerjaContainer}>
                  <ClockRedIcon />
                  <Text style={styles.timePekerja}>
                    Lama izin tidak hadir - {permitDetail.duration} hari
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.categoryPermitText}>Kategori Perizinan</Text>
            <View style={styles.categoryPermitContainer}>
              <View
                style={
                  permitDetail.category === 'SICK'
                    ? {
                        ...styles.categoryPermitButton,
                        ...styles.backgroundColorGreen,
                      }
                    : {
                        ...styles.categoryPermitButton,
                        ...styles.backgroundColorGrey,
                      }
                }>
                <Text style={styles.categoryPermitButtonText}>Sakit</Text>
              </View>
              <View
                style={
                  permitDetail.category === 'EVENT'
                    ? {
                        ...styles.categoryPermitButton,
                        ...styles.backgroundColorGreen,
                      }
                    : {
                        ...styles.categoryPermitButton,
                        ...styles.backgroundColorGrey,
                      }
                }>
                <Text style={styles.categoryPermitButtonText}>Keluarga</Text>
              </View>
              <View
                style={
                  permitDetail.category === 'OTHERS'
                    ? {
                        ...styles.categoryPermitButton,
                        ...styles.backgroundColorGreen,
                      }
                    : {
                        ...styles.categoryPermitButton,
                        ...styles.backgroundColorGrey,
                      }
                }>
                <Text style={styles.categoryPermitButtonText}>Lain-Lain</Text>
              </View>
            </View>
            <View style={styles.textArea}>
              <Text style={styles.dateText}>
                Izin Diajukan pada{' '}
                {moment(permitDetail.submit_at).format('LLL')}.
              </Text>
              <Text style={styles.descriptionText}>
                {permitDetail.description}
              </Text>
            </View>
            {permitDetail.is_allowed ? (
              <TouchableHighlight
                disabled={true}
                style={styles.allowDisabledButton}
                underlayColor="#FFBA49CC"
                onPress={() => setModalVisible(true)}>
                <Text style={styles.allowDisabledButtonText}>
                  Izin Telah Diberikan
                </Text>
              </TouchableHighlight>
            ) : (
              <View>
                <TouchableHighlight
                  style={styles.allowButton}
                  underlayColor="#FFBA49CC"
                  onPress={() => setModalVisible(true)}>
                  <Text style={styles.allowButtonText}>
                    Terima Izin Ketidakhadiran
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.manageButton}
                  activeOpacity={0.3}
                  underlayColor="#FAFAFA"
                  onPress={() =>
                    Linking.openURL(`tel:${permitDetail.worker.phone}`)
                  }>
                  <Text style={styles.manageButtonText}>Hubungi pekerja</Text>
                </TouchableHighlight>
              </View>
            )}
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableWithoutFeedback
              onPress={() => (loading ? null : setModalVisible(false))}>
              <View style={styles.bottomView}>
                <View style={styles.modalView}>
                  <Text style={styles.confirmText}>
                    Apakah anda yakin untuk memberikan izin ketidakhadiran
                    kepada {permitDetail.worker.fullname}?
                  </Text>
                  <View style={styles.containerConfirm}>
                    <TouchableHighlight
                      style={styles.confirmPositiveButton}
                      underlayColor="#FFBA49CC"
                      onPress={onAllowPermit}>
                      <Text style={styles.confirmPositiveButtonText}>
                        Ya, yakin
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={styles.confirmNegativeButton}
                      underlayColor="#FFBA49CC"
                      onPress={() => setModalVisible(false)}>
                      <Text style={styles.confirmNegativeButtonText}>
                        Batal
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      ) : null}
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
  profileContainerPekerja: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImagePekerja: {
    height: 54,
    width: 54,
    borderRadius: 5,
  },
  textDescriptionPekerja: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  namaPekerja: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timePekerjaContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timePekerja: {
    color: '#2E4057',
    fontSize: 12,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  categoryPermitText: {
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
    width: '31%',
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
  backgroundColorGrey: {
    backgroundColor: '#CDCDCD',
  },
  textColorGreen: {
    color: '#2F9C95',
  },
  textArea: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
    textAlignVertical: 'top',
    color: '#2E4057',
  },
  dateText: {
    fontWeight: 'bold',
    color: '#2E4057',
  },
  descriptionText: {
    color: '#2E4057',
  },
  allowButton: {
    marginTop: 48,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  allowButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  allowDisabledButton: {
    marginTop: 48,
    paddingVertical: 12,
    backgroundColor: '#EAE9E9',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 10,
  },
  allowDisabledButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#B5B5B5',
  },
  manageButton: {
    marginTop: 48,
    paddingVertical: 12,
    borderRadius: 10,
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(78, 78, 78, 0.58)',
  },
  modalView: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  confirmText: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerConfirm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  confirmPositiveButton: {
    width: '45%',
    padding: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  confirmPositiveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  confirmNegativeButton: {
    width: '45%',
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#FFBA49',
    borderRadius: 10,
  },
  confirmNegativeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
});

export default PermitDetailScreen;
