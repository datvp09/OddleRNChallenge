import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FavouriteHeader from '../components/FavouriteHeader';
import {getFavouriteProducts, productDetailEndpoint} from '../core/api';

const FavouriteScreen = ({params}) => {
  const [listFavourite, setListFavourite] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getFavouriteList();
  }, []);

  const getFavouriteList = async () => {
    setRefreshing(false);
    try {
      const list = await getFavouriteProducts();

      if (!list) {
        return;
      }
      const getDetailPromises = list.map(id =>
        axios.get(`${productDetailEndpoint}/${id}.json`),
      );
      const result = await Promise.all(getDetailPromises);
      console.log(
        'getDetailPromises',
        result.map(res => res.data),
      );
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  const renderItems = ({item, index}) => {
    // console.log(`item-${index}`, item);
    return <ProductCard item={item} />;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'top', 'left']}>
      <FavouriteHeader />
      <FlatList
        data={listItems}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItems}
        style={{
          paddingLeft: 16,
        }}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 30,
        }}
        refreshing={refreshing}
        onRefresh={getFavouriteList}
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
});

export default FavouriteScreen;
