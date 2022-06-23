import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
// import {QueryClientWrapper} from './src/providers';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/core/navigators/RootNavigator';
import {setDefaultFontFamily} from './src/utils/functions';
import {setCustomText} from 'react-native-global-props';

Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

// let oldRender = Text.render;
// Text.render = function (...args) {
//   let origin = oldRender.call(this, ...args);
//   return React.cloneElement(origin, {
//     style: [{fontFamily: 'IBMPlexSans-Regular'}, origin.props.style],
//   });
// };

const defaultTextProps = {
  style: {
    fontFamily: 'IBMPlexSans-Regular',
  },
};
setCustomText(defaultTextProps);

const App = () => {
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // <QueryClientWrapper>
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={'transparent'}
          translucent={true}
        />
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
    // </QueryClientWrapper>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
