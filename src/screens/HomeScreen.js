import React from 'react';
import { SafeAreaView, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen = ({ route, navigation }) => {
  const { uid, nama, phone, userType } = route.params;

  return (
    <SafeAreaView>
      <Text>Hello there, {nama}</Text>
      <Text>Your ID, {uid}</Text>
      <Text>Phone, {phone}</Text>
      <Text>You are, {userType}</Text>
      <Button
        title="Keluar"
        onPress={async () => {
          await auth().signOut();
          navigation.navigate('Register');
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
