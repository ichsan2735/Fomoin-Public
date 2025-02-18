import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from "@react-navigation/native"
import RootStack from './navigators/RootStack';
import { AuthProvider } from './contexts/AuthContext';
import { ApolloProvider } from '@apollo/client';
import client from './configs/Apollo';

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <RootStack />

          
        </NavigationContainer>
      </ApolloProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
