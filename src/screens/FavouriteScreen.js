import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FavouriteHeader from '../components/FavouriteHeader';
import ListEmptyComponent from '../components/ListEmptyComponent';
import ProductCard from '../components/ProductCard';
import {useFavouriteData} from '../providers/FavouriteProvider';

const FavouriteScreen = ({params}) => {
  const {isFetching, favouriteProducts, getFavouriteProducts} =
    useFavouriteData();

  console.log(
    'useFavouriteData',
    isFetching,
    favouriteProducts,
    getFavouriteProducts,
  );

  useEffect(() => {
    if (favouriteProducts.length == 0) {
      getFavouriteProducts();
    }
  }, []);

  const renderItems = ({item, index}) => {
    return <ProductCard item={item} isFavourite={true} />;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'top', 'left']}>
      <FavouriteHeader />
      <FlatList
        data={favouriteProducts}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItems}
        contentContainerStyle={styles.contentContainerStyle}
        refreshing={isFetching}
        onRefresh={getFavouriteProducts}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 0,
  },
  contentContainerStyle: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});

export default FavouriteScreen;
