import {Dimensions, Platform, StatusBar} from 'react-native';
import {hasNotch} from 'react-native-device-info';

const {height, width} = Dimensions.get('screen');
const isiOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const isiPhone = isiOS && !Platform.isPad && !Platform.isTV;
const isSmallScreen = height < 650;
const isBigScreen = isiPhone ? height > 800 : height > 730;
const IPHONEX_BOTTOM_PADDING = 34;
const isiP5 = isiPhone && (height === 568 || width === 568);
const isiPPlus = isiPhone && (height === 736 || width === 736);
const isiPhoneXSize = isiPhone && (height === 812 || width === 812); // = XS, 11 Pro
const isiPhoneXRSize = isiPhone && (height === 896 || width === 896); // = XS Max, 11, 11 Pro Max
const isiPhone12 = isiPhone && (height === 844 || width === 844); // = 12 Pro
const isiPhone12Mini = isiPhone && (height === 780 || width === 780);
const isiPhone12ProMax = isiPhone && (height === 926 || width === 926);

const STATUSBAR_DEFAULT_HEIGHT = 20; // no notch iphone
const STATUSBAR_X_HEIGHT = 44; // X, XR, XS/XS Max, 11, 11 Pro/Pro Max
const STATUSBAR_IP12_HEIGHT = 47; // 12, 12 Pro/Pro Max

let STATUSBAR_HEIGHT = STATUSBAR_DEFAULT_HEIGHT;
if (isiPhone) {
  if (isiPhoneXSize || isiPhoneXRSize) {
    STATUSBAR_HEIGHT = STATUSBAR_X_HEIGHT;
  } else if (isiPhone12 || isiPhone12Mini || isiPhone12ProMax) {
    STATUSBAR_HEIGHT = STATUSBAR_IP12_HEIGHT;
  }
} else if (isAndroid) {
  STATUSBAR_HEIGHT = StatusBar.currentHeight;
}
const isiPhoneNotch = isiPhone && STATUSBAR_HEIGHT > STATUSBAR_DEFAULT_HEIGHT;
const HAS_NOTCH = isiPhone ? isiPhoneNotch : hasNotch();

export {
  width,
  height,
  isAndroid,
  isiOS,
  isiPhone,
  isiP5,
  isiPPlus,
  isiPhoneNotch,
  isSmallScreen,
  isBigScreen,
  STATUSBAR_HEIGHT,
  HAS_NOTCH,
  IPHONEX_BOTTOM_PADDING,
};
