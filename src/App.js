import React from 'react';
import { View } from 'react-native';
import RegisterScreen from './screens/auth/RegisterScreen';
import UserRegisterScreen from './screens/auth/UserRegisterScreen';
import ConfirmCodeScreen from './screens/auth/ConfirmCodeScreen';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <View>
      <ConfirmCodeScreen />
    </View>
  );
};

export default App;
