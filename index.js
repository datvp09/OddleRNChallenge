import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Fix: Unexpected token o in JSON at position 1 - GraphCMS
if (__DEV__) {
  global.XMLHttpRequest =
    global.originalXMLHttpRequest || global.XMLHttpRequest;
  global.FormData = global.originalFormData || global.FormData;

  if (window.FETCH_SUPPORT) {
    window.FETCH_SUPPORT.blob = false;
  } else {
    global.Blob = global.originalBlob || global.Blob;
    global.FileReader = global.originalFileReader || global.FileReader;
  }
}

AppRegistry.registerComponent(appName, () => App);
