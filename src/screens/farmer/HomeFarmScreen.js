import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Image,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import HomeFarmBanner from '../../assets/HomeFarmBanner.svg';
import KomoditasButton from '../../assets/KomoditasButton.svg';
import PekerjaButton from '../../assets/PekerjaButton.svg';
import KomoditasIcon from '../../assets/KomoditasIcon.svg';
import PekerjaIcon from '../../assets/PekerjaIcon.svg';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [avatar, setAvatar] = useState();

  const readItemFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
    setAvatar(item.uid);
  };

  useEffect(() => {
    readItemFromStorage();
  }, []);

  return (
    <SafeAreaView style={styles.homeFarmContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.profileText}>Profile</Text>
            <Image
              style={styles.profileImage}
              source={{
                uri: `https://api.adorable.io/avatars/${avatar}`,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoHargaContainer}>
          <View style={styles.containerBanner}>
            <HomeFarmBanner style={styles.homeFarmBanner} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textHeader}>Jangan Lewatkan</Text>
            <Text style={styles.textDescription}>
              pergerakan harga komoditas yang
            </Text>
            <Text style={styles.textDescription}>anda kelola</Text>
            <Text style={styles.textComodity}>Telur</Text>
            <Text style={styles.textComodityPrice}>Rp 18.678,-</Text>
          </View>
        </View>
        <TouchableHighlight
          style={styles.setPriceButton}
          underlayColor="#FFBA49CC"
          onPress={() => console.log(user)}>
          <Text style={styles.setPriceButtonText}>Pasang Harga</Text>
        </TouchableHighlight>
        <Text style={styles.textSub}>Kelola Peternakanmu</Text>
        <View style={styles.manageContainer}>
          <TouchableHighlight
            style={styles.manageButton}
            onPress={() => console.log('Komoditas')}>
            <View style={styles.manageButtonContainer}>
              <KomoditasButton />
              <View style={styles.manageContentContainer}>
                <KomoditasIcon />
                <Text style={styles.manageText}>Komoditas</Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.manageButton}
            onPress={() => console.log('Pekerja')}>
            <View style={styles.manageButtonContainer}>
              <PekerjaButton />
              <View style={styles.manageContentContainer}>
                <PekerjaIcon />
                <Text style={styles.manageText}>Pekerja</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <View>
          <Text style={styles.textSub}>Log Aktivitas</Text>
          <View style={styles.logContainer}>
            <Text style={styles.logText}>Belum ada log aktivitas pekerja</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeFarmContainer: {
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    height: '100%',
    paddingTop: 9,
    paddingHorizontal: 22,
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileText: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  profileImage: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: 'red',
  },
  infoHargaContainer: {
    marginTop: 24,
    position: 'relative',
  },
  containerBanner: {
    overflow: 'hidden',
    width: '100%',
    borderRadius: 20,
  },
  homeFarmBanner: {
    backgroundColor: '#2F9C95',
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textDescription: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  textComodity: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
  },
  textComodityPrice: {
    overflow: 'hidden',
    color: 'white',
    backgroundColor: 'rgba(207, 207, 207, 0.5)',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  setPriceButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  setPriceButtonText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
  },
  textSub: {
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  manageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 12,
  },
  manageButton: {
    marginRight: 12,
    borderRadius: 12,
  },
  manageButtonContainer: {
    overflow: 'hidden',
  },
  manageContentContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.14,
    marginTop: 8,
  },
  logContainer: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
    borderRadius: 10,
  },
  logText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default HomeScreen;
