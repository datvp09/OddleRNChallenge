import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Colors from '../utils/colors';
import ProductCard from '../components/ProductCard';
import {getProductListQuery} from '../core/query';
import {graphCMS} from '../core/graphcms';
import {formatNumber, welcomeText} from '../utils/functions';
import LinearGradient from 'react-native-linear-gradient';
import {QUERY_LIMIT} from '../core/request';
import AppHeader from '../components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

const ShopScreen = ({params}) => {
  const [listItems, setListItems] = useState([]);
  const [totalItems, setTotalItems] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async (isRefresh = false) => {
    setRefreshing(true);
    try {
      console.log('call-getItems-1', currentPage);
      const result = await graphCMS.request(getProductListQuery, {
        limit: QUERY_LIMIT,
        offset: (isRefresh ? 0 : currentPage) * QUERY_LIMIT,
      });
      setCurrentPage(isRefresh ? 0 : currentPage + 1);
      console.log('call-setListItems-1');
      if (isRefresh) {
        setListItems(result?.products);
      } else {
        setListItems(currentItems => [...currentItems, ...result?.products]);
      }
      setTotalItems(result?.productsConnection?.aggregate?.count);
      setHasNextPage(result?.productsConnection?.pageInfo?.hasNextPage);
    } catch (e) {
      console.log('call-getItems-e', e);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => getProductList(true);

  const onEndReached = async () => {
    if (!hasNextPage || fetchingMore) {
      return;
    }
    setFetchingMore(true);
    await getProductList();
    setFetchingMore(false);
  };

  const renderItems = ({item, index}) => {
    // console.log(`item-${index}`, item);
    return <ProductCard item={item} />;
  };

  const renderHeader = () => {
    if (!totalItems) {
      return null;
    }
    return (
      <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
        <Text style={styles.totalItems}>{`${formatNumber(
          totalItems,
        )} products sorted by price`}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!fetchingMore) {
      return null;
    }
    return (
      <View style={styles.fetchingMore}>
        <ActivityIndicator />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'top', 'left']}>
      <AppHeader />
      <LinearGradient
        colors={[Colors.lightPurple, Colors.aqua, Colors.white]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
        style={styles.flex}>
        <FlatList
          data={listItems}
          keyExtractor={item => `${item.productID}`}
          renderItem={renderItems}
          contentContainerStyle={styles.contentContainerStyle}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  safeArea: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 0,
  },
  fetchingMore: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalItems: {
    color: Colors.charcoal,
  },
  contentContainerStyle: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
});

export default ShopScreen;
