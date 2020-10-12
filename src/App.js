import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/Client';
import RegisterScreen from './screens/auth/RegisterScreen';
import LoginScreen from './screens/auth/LoginScreen';
import UserRegisterScreen from './screens/auth/UserRegisterScreen';
import ConfirmCodeScreen from './screens/auth/ConfirmCodeScreen';
import HomeScreen from './screens/HomeScreen';
import AddFarmScreen from './screens/farmer/AddFarmScreen';
import HomeFarmScreen from './screens/farmer/HomeFarmScreen';
import CommodityListScreen from './screens/farmer/CommodityListScreen';
import CommodityScreen from './screens/farmer/CommodityScreen';
import FarmMapScreen from './screens/farmer/FarmMapScreen';
import ManageWorkerScreen from './screens/farmer/ManageWorkerScreen';
import AddWorkerScreen from './screens/farmer/AddWorkerScreen';
import HomeWorkerScreen from './screens/worker/HomeWorkerScreen';
import FindFarmScreen from './screens/worker/FindFarmScreen';
import RegisterWorkerScreen from './screens/worker/RegisterWorkerScreen';
import ScanQRCodeScreen from './screens/worker/ScanQRCodeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <ApolloProvider client={client}>
        <Stack.Navigator>
          <Stack.Screen
            name="Register"
            options={{ title: null, headerShown: false }}
            component={RegisterScreen}
          />
          <Stack.Screen
            name="Login"
            options={{
              title: null,
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerTransparent: true,
            }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="UserRegister"
            options={{
              title: null,
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerTransparent: true,
            }}
            component={UserRegisterScreen}
          />
          <Stack.Screen
            name="ConfirmCode"
            options={{
              title: null,
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerTransparent: true,
            }}
            component={ConfirmCodeScreen}
          />
          <Stack.Screen
            name="Home"
            options={{
              title: 'Profile',
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={HomeScreen}
          />
          {/* Farmer */}
          <Stack.Screen
            name="AddFarm"
            options={{ headerShown: false }}
            component={AddFarmScreen}
          />
          <Stack.Screen
            name="HomeFarm"
            options={{ headerShown: false }}
            component={HomeFarmScreen}
          />
          <Stack.Screen
            name="Komoditas Tersedia"
            options={{
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={CommodityListScreen}
          />
          <Stack.Screen
            name="Komoditas"
            options={{
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={CommodityScreen}
          />
          <Stack.Screen
            name="FarmMap"
            options={{
              title: 'Pasang Harga',
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={FarmMapScreen}
          />
          <Stack.Screen
            name="ManageWorker"
            options={{
              title: 'Pekerja',
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={ManageWorkerScreen}
          />
          <Stack.Screen
            name="AddWorker"
            options={{
              title: 'Tambahkan Pekerja',
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={AddWorkerScreen}
          />
          {/* Worker */}
          <Stack.Screen
            name="HomeWorker"
            options={{ headerShown: false }}
            component={HomeWorkerScreen}
          />
          <Stack.Screen
            name="FindFarmByWorker"
            options={{
              title: 'Cari Peternakan',
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={FindFarmScreen}
          />
          <Stack.Screen
            name="RegisterWorker"
            options={{
              title: 'Daftar Sebagai Pekerja',
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={RegisterWorkerScreen}
          />
          <Stack.Screen
            name="ScanQRCode"
            options={{
              title: 'Scan Kode QR Peternak',
              headerBackTitle: 'Kembali',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
            component={ScanQRCodeScreen}
          />
        </Stack.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  );
};

export default App;
