import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Image,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [avatar, setAvatar] = useState();

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
    setAvatar(item.uid);
  };

  useEffect(() => {
    readUserDataFromStorage();
  }, []);

  return (
    <SafeAreaView style={styles.contentContainer}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: `https://api.adorable.io/avatars/${avatar}`,
          }}
        />
        <Text style={styles.profileName}>{user ? user.fullname : ''}</Text>
        <Text style={styles.profileRole}>
          {user ? (user.role === 'FARMER' ? 'Peternak' : 'Pekerja') : ''}
        </Text>
      </View>
      <TouchableHighlight
        style={styles.logoutButton}
        underlayColor="#FFBA49CC"
        onPress={async () => {
          await auth().signOut();
          await AsyncStorage.removeItem('user');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Register' }],
            }),
          );
        }}>
        <Text style={styles.logoutButtonText}>Keluar</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    paddingVertical: 22,
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#2F9C95',
  },
  profileName: {
    color: '#2E4057',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileRole: {
    color: '#2E4057',
    fontStyle: 'italic',
  },
  logoutButton: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default HomeScreen;
