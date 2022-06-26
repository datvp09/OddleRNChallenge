import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, ShopScreen, FavouriteScreen} from '../../screens';
import {
  ROUTE_TAB_FAVOURITE,
  ROUTE_TAB_SHOP,
  ROUTE_TAB_HOME,
} from '../../utils/routes';
import Colors from '../../utils/colors';
import WebviewScreen from '../../screens/WebviewScreen';
import SvgIcon from '../../components/SvgIcon';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => (
  <Tab.Navigator
    backBehavior={'initialRoute'}
    detachInactiveScreens={false}
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarStyle: styles.tabBarStyle,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarInactiveTintColor: Colors.tiber,
      tabBarActiveTintColor: Colors.tiber,
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        let iconSize = 28;
        if (route.name == ROUTE_TAB_HOME) {
          iconName = focused ? 'home-selected' : 'home';
        } else if (route.name == ROUTE_TAB_SHOP) {
          iconSize = 40;
          iconName = focused ? 'money-selected' : 'money';
        } else if (route.name == ROUTE_TAB_FAVOURITE) {
          iconSize = 24;
          iconName = focused ? 'heart-selected' : 'heart';
        }

        return (
          <SvgIcon
            name={iconName}
            size={iconSize}
            style={iconName.includes('money') && styles.moneyIcon}
          />
        );
      },
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

const Router = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={'MainStack'}>
    <Stack.Screen name="MainStack" component={MainStack} />
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

const tabBarHeight = 57;
const platformTabBar = Platform.select({
  ios: {paddingBottom: 25},
  android: {height: tabBarHeight},
});

const styles = StyleSheet.create({
  tabBarStyle: {
    paddingHorizontal: 15,
    paddingTop: 0,
    ...platformTabBar,
  },
  tabBarLabel: {
    fontSize: 10,
    fontFamily: 'IBMPlexSans-Medium',
  },
  moneyIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 5,
  },
});

export default Router;
