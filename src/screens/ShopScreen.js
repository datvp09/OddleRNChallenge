import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Colors from '../utils/colors';
import ProductCard from '../components/ProductCard';
import {getProductListQuery} from '../core/query';
import {graphCMS} from '../core/graphcms';
import {formatNumber} from '../utils/functions';
import LinearGradient from 'react-native-linear-gradient';
import {QUERY_LIMIT} from '../core/api';
import AppHeader from '../components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import CardPlaceholder from '../components/CardPlaceholder';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {FlatList} from '../components/FlatListAware';

const ShopScreen = () => {
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
      const result = await graphCMS.request(getProductListQuery, {
        limit: QUERY_LIMIT,
        offset: (isRefresh ? 0 : currentPage) * QUERY_LIMIT,
      });
      setCurrentPage(isRefresh ? 0 : currentPage + 1);

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
    return <ProductCard item={item} />;
  };

  const renderHeader = () => {
    if (!totalItems) {
      return null;
    }

    return (
      <View style={{paddingTop: 10, paddingBottom: 15, paddingHorizontal: 10}}>
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
    return <CardPlaceholder />;
  };

  const renderListPlaceholder = () => {
    return (
      <View style={styles.listPlaceholder}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={150}
          height={18}
          style={styles.summaryPlaceholder}
        />
        <CardPlaceholder />
        <CardPlaceholder />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'top', 'left']}>
      <AppHeader whiteBackground />
      <LinearGradient
        colors={[Colors.lightPurple, Colors.aqua, Colors.white]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
        style={styles.flex}>
        {listItems.length == 0 && refreshing ? (
          renderListPlaceholder()
        ) : (
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
        )}
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
  totalItems: {
    color: Colors.charcoal,
  },
  contentContainerStyle: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  listPlaceholder: {alignItems: 'center', paddingTop: 20},
  summaryPlaceholder: {
    alignSelf: 'flex-start',
    marginLeft: 30,
    borderRadius: 6,
    marginBottom: 18,
  },
});

export default ShopScreen;
