import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery } from '@apollo/client';
import { FIND_FARM_WORKER } from '../../graphql/Queries';
import ClockIcon from '../../assets/ClockIcon.svg';
import PekerjaYellowIcon from '../../assets/PekerjaYellowIcon.svg';
import PhoneIcon from '../../assets/PhoneIcon.svg';

const WorkerListScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [workerList, setWorkerList] = useState([]);
  const [page, setPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(true);

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      getWorkerList({
        variables: {
          farmId: user.farm.id,
          limit: 4,
          page: page + 1,
        },
      });
    }
  }, [user]);

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const convertTime = (time) => {
    return moment(moment(time, 'HH:mm:ss').toDate()).format('HH:mm');
  };

  const [getWorkerList] = useLazyQuery(FIND_FARM_WORKER, {
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const result = data.findFarmWorker.users;
      if (result.length === 0) {
        setLoadingMore(false);
      }
      setWorkerList(workerList.concat(result));
    },
    onError(data) {
      console.log(data);
    },
  });

  useEffect(() => {
    if (page > 0) {
      getWorkerList({
        variables: {
          farmId: user.farm.id,
          limit: 4,
          page: page + 1,
        },
      });
    }
  }, [page]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {workerList.length > 0 ? (
          <FlatList
            data={workerList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<View style={styles.textSub} />}
            ListFooterComponent={
              <View style={styles.footerContainer}>
                {loadingMore && (
                  <View style={styles.noLogContainer}>
                    <ActivityIndicator size="large" color="#2F9C95" />
                  </View>
                )}
              </View>
            }
            onEndReachedThreshold={0.01}
            onEndReached={() => setPage(page + 1)}
            keyExtractor={(item) => item.uid}
            renderItem={({ item, index }) => (
              <View key={item.uid} style={styles.logPekerjaContainer}>
                <View style={styles.profileContainerPekerja}>
                  <Image
                    style={styles.profileImagePekerja}
                    source={{
                      uri: `https://api.adorable.io/avatars/${
                        item.uid ? item.uid : '1'
                      }`,
                    }}
                  />
                  <View style={styles.textDescriptionPekerja}>
                    <Text style={styles.namaPekerja}>{item.fullname}</Text>
                    <View style={styles.timePekerjaContainer}>
                      <ClockIcon />
                      <Text style={styles.timePekerja}>Hadir pada 05.30</Text>
                    </View>
                  </View>
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>Pekerja</Text>
                    <PekerjaYellowIcon />
                  </View>
                </View>
                <View style={styles.phoneContainer}>
                  <PhoneIcon width={18} height={18} />
                  <Text style={styles.phoneText}>{item.phone}</Text>
                </View>
                {item.permit_id ? (
                  <TouchableHighlight
                    style={styles.permitButton}
                    underlayColor="#FFBA49CC"
                    onPress={() =>
                      navigation.navigate('PermitDetail', {
                        permitId: item.permit_id,
                      })
                    }>
                    <Text style={styles.permitButtonText}>Lihat Perizinan</Text>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                    style={styles.kickButton}
                    activeOpacity={0.3}
                    underlayColor="#FAFAFA"
                    onPress={() => console.log('WorkerList')}>
                    <Text style={styles.kickButtonText}>Rumahkan</Text>
                  </TouchableHighlight>
                )}
              </View>
            )}
          />
        ) : (
          <View style={styles.noLogContainer}>
            <Text style={styles.noLogText}>Kamu belum memiliki pekerja</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    paddingHorizontal: 18,
  },
  textSub: {
    marginTop: 20,
  },
  logPekerjaContainer: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
    borderRadius: 10,
  },
  profileContainerPekerja: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImagePekerja: {
    height: 48,
    width: 48,
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
  },
  timePekerja: {
    color: '#2E4057',
    fontSize: 12,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  logText: {
    color: '#2E4057',
    marginTop: 8,
    fontSize: 16,
  },
  noLogContainer: {
    marginTop: 8,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
  },
  noLogText: {
    fontSize: 16,
    textAlign: 'center',
  },
  categoryContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    marginRight: 4,
    textTransform: 'uppercase',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  phoneText: {
    marginLeft: 8,
  },
  permitButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  permitButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  kickButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  kickButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF4949',
  },
  footerContainer: {
    marginBottom: 16,
  },
});

export default WorkerListScreen;
