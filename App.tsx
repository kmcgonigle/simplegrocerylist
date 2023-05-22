import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { setCustomText } from 'react-native-global-props';

import List from './components/List';

const App = () => {
  const [fontLoaded] = useFonts({
    Quicksand: require('./assets/fonts/Quicksand-Regular.ttf'),
  });

  if (!fontLoaded) {
    return <AppLoading />;
  }

  const customTextProps = {
    style: {
      fontFamily: 'Quicksand',
    },
  };
  setCustomText(customTextProps);

  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) => `${options?.title ?? route?.name} - Simple Grocery List`,
      }}
    >
      <List />
    </NavigationContainer>
  );
};

export default App;
