import React from 'react';
import { SafeAreaView, Text, Button } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Text>Your ID, {auth().currentUser.uid}</Text>
      <Text>Phone, {auth().currentUser.phoneNumber}</Text>
      <Button
        title="Keluar"
        onPress={async () => {
          await auth().signOut();
          await AsyncStorage.removeItem('user');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Register' }],
            }),
          );
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
