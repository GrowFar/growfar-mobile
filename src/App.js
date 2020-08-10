import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/auth/RegisterScreen';
import UserRegisterScreen from './screens/auth/UserRegisterScreen';
import ConfirmCodeScreen from './screens/auth/ConfirmCodeScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Register"
          options={{ title: null, headerShown: false }}
          component={RegisterScreen}
        />
        <Stack.Screen
          name="UserRegister"
          options={{
            title: null,
            headerShown: true,
            headerTransparent: true,
          }}
          component={UserRegisterScreen}
        />
        <Stack.Screen
          name="ConfirmCode"
          options={{
            title: null,
            headerShown: true,
            headerTransparent: true,
          }}
          component={ConfirmCodeScreen}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
