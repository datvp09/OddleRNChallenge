import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FavouriteHeader from '../components/FavouriteHeader';
import {getFavouriteProducts} from '../core/api';

const FavouriteScreen = ({params}) => {
  useEffect(() => {
    getFavouriteProducts();
  }, []);

  return (
    <SafeAreaView>
      <FavouriteHeader />
      <Text>FavouriteScreen</Text>
    </SafeAreaView>
  );
};

export default FavouriteScreen;
