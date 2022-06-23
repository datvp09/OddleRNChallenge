import React, {useState} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';

const WebviewScreen = ({route}) => {
  const {url} = route.params;
  const [isLoadingShow, setIsLoadingShow] = useState(true);
  const hideLoading = () => setIsLoadingShow(false);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      {isLoadingShow && (
        <View style={{padding: 30}}>
          <ActivityIndicator />
        </View>
      )}
      <WebView
        source={{uri: url}}
        containerStyle={styles.webContainer}
        onLoadEnd={hideLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  webContainer: {
    flex: 1,
    padding: 0,
  },
});

export default WebviewScreen;
