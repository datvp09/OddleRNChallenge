import React from 'react';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/core/navigators/RootNavigator';
import {setCustomText} from 'react-native-global-props';
import {FavouriteProvider} from './src/providers/FavouriteProvider';
import {ScrollContextProvider} from './src/providers/ScrollProvider';

const defaultTextProps = {
  style: {
    fontFamily: 'IBMPlexSans-Regular',
  },
};
setCustomText(defaultTextProps);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.flex}>
      <NavigationContainer>
        <FavouriteProvider>
          <ScrollContextProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={'transparent'}
              translucent={true}
            />
            <RootNavigator />
          </ScrollContextProvider>
        </FavouriteProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
});

export default App;
