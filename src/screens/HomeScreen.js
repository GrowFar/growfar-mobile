import React, { useState } from 'react';
import { SafeAreaView, Text } from 'react-native';

const HomeScreen = () => {
  const [uid, setUid] = useState('Eka');

  return (
    <SafeAreaView>
      <Text>Hello there, {uid}</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
