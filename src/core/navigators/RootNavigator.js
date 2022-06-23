import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderBackButton,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, ShopScreen, FavouriteScreen} from '../../screens';
import {
  ROUTE_TAB_FAVOURITE,
  ROUTE_TAB_SHOP,
  ROUTE_TAB_HOME,
} from '../../utils/routes';
import Colors from '../../utils/colors';
import Images from '../../utils/images';
import {IPHONEX_BOTTOM_PADDING, isiPhoneNotch} from '../../utils/constants';
import WebviewScreen from '../../screens/WebviewScreen';
import SvgIcon from '../../components/SvgIcon';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => {
  const tabBarHeight = 68;
  // const {
  //   userInfo: {messageList},
  // } = store.getState();
  // const intl = useIntl();
  // const numberOfMessages =
  //   messageList?.reduce((acc, msg) => acc + (msg.isRead ? 0 : 1), 0) || 0;

  return (
    <Tab.Navigator
      backBehavior={'initialRoute'}
      detachInactiveScreens={false}
      // tabBarOptions={{
      //   tabStyle: {
      //     height: tabBarHeight,
      //     paddingBottom: 15,
      //     // justifyContent: 'flex-start',
      //   },
      //   labelStyle: {fontSize: 10},
      //   inactiveTintColor: Colors.tiber,
      //   activeTintColor: Colors.tiber,
      // }}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          paddingHorizontal: 15,
          // height: tabBarHeight,
          paddingBottom: 25,
        },
        tabBarLabelStyle: {fontSize: 10},
        tabBarInactiveTintColor: Colors.tiber,
        tabBarActiveTintColor: Colors.tiber,
        tabBarIcon: ({focused, color, size}) => {
          // let iconSource;
          let iconName;
          let iconSize = 28;
          if (route.name == ROUTE_TAB_HOME) {
            // iconSource = focused ? Images.homeSelected : Images.homeIcon;
            iconName = focused ? 'home-selected' : 'home';
          } else if (route.name == ROUTE_TAB_SHOP) {
            // iconSource = focused ? Images.moneySelected : Images.moneyIcon;
            iconSize = 38;
            iconName = focused ? 'money-selected' : 'money';
            // return (
            //   <Image
            //     source={iconSource}
            //     style={{
            //       width: 40,
            //       height: 40,
            //       position: 'absolute',
            //       bottom: 5,
            //     }}
            //     resizeMode={'contain'}
            //   />
            // );
          } else if (route.name == ROUTE_TAB_FAVOURITE) {
            iconSize = 24;
            // iconSource = focused ? Images.heartSelected : Images.heartIcon;
            iconName = focused ? 'heart-selected' : 'heart';
          }

          return (
            // <Image
            //   source={iconSource}
            //   style={{width: iconSize, height: iconSize}}
            //   resizeMode={'contain'}
            // />
            <SvgIcon
              name={iconName}
              size={iconSize}
              style={
                iconName.includes('money') && {
                  width: 40,
                  height: 40,
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bottom: 5,
                }
              }
            />
          );
        },
        // headerTruncatedBackTitle: intl.formatMessage({id: 'button.back'}),
      })}>
      <Tab.Screen
        name={'HOME'}
        options={({route}) => ({tabBarLabel: 'Home'})}
        component={HomeScreen}
      />
      <Tab.Screen
        name={'SHOP'}
        options={({route}) => ({tabBarLabel: 'Shop'})}
        component={ShopScreen}
      />
      <Tab.Screen
        name="FAVOURITE"
        options={({route}) => ({tabBarLabel: 'Favourites'})}
        component={FavouriteScreen}
      />
    </Tab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator
      // headerMode="screen"
      // key="screen"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        // headerTruncatedBackTitle: intl.formatMessage({id: 'button.back'}),
      }}
      initialRouteName={'MainStack'}>
      <Stack.Screen name="MainStack" component={MainStack} />
      {/* <Stack.Screen name="MainStack2" component={MainStack} /> */}
      <Stack.Screen
        name="WebviewScreen"
        component={WebviewScreen}
        options={({route}) => ({
          headerShown: true,
          headerBackTitle: '', // must have for 'title' to show
          title: route?.params?.title || 'Online Store',
          headerTintColor: Colors.tiber,
          headerTitleStyle: {
            fontFamily: 'IBMPlexSans-SemiBold',
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default Router;
