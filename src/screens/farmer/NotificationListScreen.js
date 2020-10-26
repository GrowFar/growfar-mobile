import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
var idLocale = require('moment/locale/id');
moment.locale('id', idLocale);
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery } from '@apollo/client';
import { FIND_LOG_ACTIVITY } from '../../graphql/Queries';
import ClockIcon from '../../assets/ClockIcon.svg';
import PekerjaGreenIcon from '../../assets/PekerjaGreenIcon.svg';
import PekerjaYellowIcon from '../../assets/PekerjaYellowIcon.svg';
import PekerjaRedIcon from '../../assets/PekerjaRedIcon.svg';

const NotificationListScreen = () => {
  const [user, setUser] = useState();
  const [notifList, setNotifList] = useState([]);
  const [page, setPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      getLogActivity({
        variables: {
          userId: user.id,
          limit: 6,
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
    return moment(time).format('lll');
  };

  const [getLogActivity] = useLazyQuery(FIND_LOG_ACTIVITY, {
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
    async onCompleted(data) {
      const result = data.findLogActivity;
      setNotifList(notifList.concat(result));
      if (result.length === 0) {
        setLoadingMore(false);
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  useEffect(() => {
    if (page > 0) {
      getLogActivity({
        variables: {
          userId: user.id,
          limit: 6,
          page: page + 1,
        },
      });
    } else {
      setLoadingMore(true);
      setNotifList([]);
      if (user) {
        getLogActivity({
          variables: {
            userId: user.id,
            limit: 6,
            page: page + 1,
          },
        });
      }
    }
  }, [page]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setRefreshing(false);
  };

  const renderCategory = (category) => {
    let item;
    switch (category) {
      case 'TASK':
        item = (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>Pembaharuan Tugas</Text>
            <PekerjaGreenIcon />
          </View>
        );
        break;
      case 'ATTENDANCE':
        item = (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>Kehadiran</Text>
            <PekerjaYellowIcon />
          </View>
        );
        break;
      case 'ABSENT':
        item = (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>Izin Ketidakhadiran</Text>
            <PekerjaRedIcon />
          </View>
        );
        break;
    }
    return item;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <FlatList
          data={notifList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <Text style={styles.textSub}>Log Aktivitas</Text>
          }
          ListFooterComponent={
            notifList.length > 0 ? (
              loadingMore ? (
                <View style={styles.noLogContainer}>
                  <ActivityIndicator size="large" color="#2F9C95" />
                </View>
              ) : null
            ) : (
              <View style={styles.noLogContainer}>
                <Text style={styles.noLogText}>
                  Kamu belum memiliki pemberitahuan
                </Text>
              </View>
            )
          }
          onEndReachedThreshold={0.01}
          onEndReached={() => {
            if (loadingMore) {
              setPage(page + 1);
            }
          }}
          keyExtractor={(item, index) =>
            'informasi_' + item.information.data + '_index_' + index
          }
          renderItem={({ item, index }) => (
            <View key={index} style={styles.logPekerjaContainer}>
              <View style={styles.profileContainerPekerja}>
                <Image
                  style={styles.profileImagePekerja}
                  source={{
                    uri: `https://api.adorable.io/avatars/${
                      item.information.user_id ? item.information.user_id : '1'
                    }`,
                  }}
                />
                <View style={styles.textDescriptionPekerja}>
                  <Text style={styles.namaPekerja}>
                    {item.information.title}
                  </Text>
                  <View style={styles.timePekerjaContainer}>
                    <ClockIcon />
                    <Text style={styles.timePekerja}>
                      {item.notification_type === 'ABSENT'
                        ? 'Mengajukan pada'
                        : 'Selesai pada'}{' '}
                      {item.notification_type === 'TASK'
                        ? convertTime(item.information.task_finish_at)
                        : convertTime(item.information.submit_at)}
                    </Text>
                  </View>
                </View>
                {renderCategory(item.notification_type)}
              </View>
              <Text style={styles.logText}>{item.information.data}</Text>
            </View>
          )}
        />
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
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 16,
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
  },
});

export default NotificationListScreen;
