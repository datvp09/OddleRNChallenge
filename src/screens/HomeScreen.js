import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import {INITIAL_RENDER_ITEMS} from '../core/api';
import ProductCard from '../components/ProductCard';
import Colors from '../utils/colors';
import AppHeader from '../components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useFavouriteData} from '../providers/FavouriteProvider';
import {graphCMS} from '../core/graphcms';
import {
  getRecommendProductsQuery,
  getSimilarProductQuery,
  getTrendingProductQuery,
} from '../core/query';
import {QUERY_LIMIT} from '../core/api';
import CardPlaceholder from '../components/CardPlaceholder';
import ListEmptyComponent from '../components/ListEmptyComponent';

const HomeScreen = ({params}) => {
  // Recommend
  const [currentRecommendPage, setCurrentRecommendPage] = useState(0);
  const [listRecommended, setListRecommended] = useState([]);
  const [fetchingRecommended, setFetchingRecommended] = useState(false);
  const [fetchingMoreRecommend, setFetchingMoreRecommend] = useState(false);
  // Similar
  const [currentSimilarPage, setCurrentSimilarPage] = useState(0);
  const [listSimilar, setListSimilar] = useState([]);
  const [fetchingSimilar, setFetchingSimilar] = useState(false);
  const [fetchingMoreSimilar, setFetchingMoreSimilar] = useState(false);
  // Trending
  const [currentTrendingPage, setCurrentTrendingPage] = useState(0);
  const [listTrending, setListTrending] = useState([]);
  const [fetchingTrending, setFetchingTrending] = useState(false);
  const [fetchingMoreTrending, setFetchingMoreTrending] = useState(false);

  const {isFetching, favouriteProducts, getFavouriteProducts} =
    useFavouriteData();
  const isGettingHomeData = useRef(false);
  const favouriteProductBrand = useRef();
  const favouriteProductType = useRef();
  const onSimilarEndReachCalledDuringMomentum = useRef(false);
  const onRecommendEndReachCalledDuringMomentum = useRef(false);
  const onTrendingEndReachCalledDuringMomentum = useRef(false);

  useEffect(() => {
    if (favouriteProducts.length == 0) {
      getFavouriteProducts();
    }
  }, []);

  useEffect(() => {
    if (favouriteProducts.length > 0) {
      getHomeData();
    } else {
      resetData();
    }
  }, [favouriteProducts]);

  const resetData = () => {
    setCurrentRecommendPage(0);
    setCurrentSimilarPage(0);
    setCurrentTrendingPage(0);
    setListRecommended([]);
    setListSimilar([]);
    setListTrending([]);
  };

  const getHomeData = async () => {
    if (isGettingHomeData.current) {
      return;
    }
    isGettingHomeData.current = true;
    favouriteProductBrand.current = favouriteProducts[0].brand;
    favouriteProductType.current = favouriteProducts[0].productType;

    await Promise.all([
      getRecommendProducts(favouriteProductType.current, {isRefresh: false}),
      getSimilarProducts(favouriteProductBrand.current, {isRefresh: false}),
      getTrendingProducts({isRefresh: false}),
    ]);
    isGettingHomeData.current = false;
  };

  const getRecommendProducts = async (
    productType,
    {isRefresh = false, isFetchingMore = false},
  ) => {
    if (!isRefresh && !isFetchingMore && listRecommended.length == 0) {
      setFetchingRecommended(true);
    }
    try {
      const result = await graphCMS.request(getRecommendProductsQuery, {
        productType,
        limit: QUERY_LIMIT,
        offset: (isRefresh ? 0 : currentRecommendPage) * QUERY_LIMIT,
      });
      setCurrentRecommendPage(isRefresh ? 0 : currentRecommendPage + 1);

      if (isRefresh) {
        setListRecommended(result?.products);
      } else {
        setListRecommended(items => [...items, ...result?.products]);
      }
    } catch (e) {
      console.log('call-getItems-e', e);
    } finally {
      setFetchingRecommended(false);
    }
  };

  const getSimilarProducts = async (
    brand,
    {isRefresh = false, isFetchingMore = false},
  ) => {
    if (!isRefresh && !isFetchingMore && listSimilar.length == 0) {
      setFetchingSimilar(true);
    }
    try {
      const result = await graphCMS.request(getSimilarProductQuery, {
        brand,
        limit: QUERY_LIMIT,
        offset: (isRefresh ? 0 : currentSimilarPage) * QUERY_LIMIT,
      });
      setCurrentSimilarPage(isRefresh ? 0 : currentSimilarPage + 1);

      if (isRefresh) {
        setListSimilar(result?.products);
      } else {
        setListSimilar(items => [...items, ...result?.products]);
      }
    } catch (e) {
      console.log('call-getSimilarProducts-e', e);
    } finally {
      setFetchingSimilar(false);
    }
  };

  const getTrendingProducts = async ({
    isRefresh = false,
    isFetchingMore = false,
  }) => {
    if (!isRefresh && !isFetchingMore && listTrending.length == 0) {
      setFetchingTrending(true);
    }
    try {
      const result = await graphCMS.request(getTrendingProductQuery, {
        limit: QUERY_LIMIT,
        offset: (isRefresh ? 0 : currentTrendingPage) * QUERY_LIMIT,
      });
      setCurrentTrendingPage(isRefresh ? 0 : currentTrendingPage + 1);

      if (isRefresh) {
        setListTrending(result?.products);
      } else {
        setListTrending(items => [...items, ...result?.products]);
      }
    } catch (e) {
      console.log('call-getTrendingProducts-e', e);
    } finally {
      setFetchingTrending(false);
    }
  };

  const onRefresh = () => {
    if (favouriteProducts.length == 0) {
      getFavouriteProducts();
    } else {
      getRecommendProducts(favouriteProductType.current, {isRefresh: true});
      getSimilarProducts(favouriteProductBrand.current, {isRefresh: true});
      getTrendingProducts({isRefresh: true});
    }
  };
  const renderItems = ({item, index}) => {
    return <ProductCard item={item} horizontal />;
  };

  const onRecommendEndReach = async () => {
    if (
      onRecommendEndReachCalledDuringMomentum.current ||
      fetchingMoreRecommend
    ) {
      return;
    }

    setFetchingMoreRecommend(true);
    await getRecommendProducts(favouriteProductType.current, {
      isFetchingMore: true,
    });
    setFetchingMoreRecommend(false);
    onRecommendEndReachCalledDuringMomentum.current = true;
  };

  const onSimilarEndReach = async () => {
    if (onSimilarEndReachCalledDuringMomentum.current || fetchingMoreSimilar) {
      return;
    }

    setFetchingMoreSimilar(true);
    await getSimilarProducts(favouriteProductType.current, {
      isFetchingMore: true,
    });
    setFetchingMoreSimilar(false);
    onSimilarEndReachCalledDuringMomentum.current = true;
  };

  const onTrendingEndReach = async () => {
    if (
      onTrendingEndReachCalledDuringMomentum.current ||
      fetchingMoreTrending
    ) {
      return;
    }

    setFetchingMoreTrending(true);
    await getTrendingProducts({isFetchingMore: true});
    setFetchingMoreTrending(false);
    onTrendingEndReachCalledDuringMomentum.current = true;
  };

  const renderRecommendFooter = () => {
    if (!fetchingMoreRecommend) {
      return null;
    }
    return <CardPlaceholder horizontal />;
  };

  const renderSimilarFooter = () => {
    if (!fetchingMoreSimilar) {
      return null;
    }
    return <CardPlaceholder horizontal />;
  };

  const renderTrendingFooter = () => {
    if (!fetchingMoreTrending) {
      return null;
    }
    return <CardPlaceholder horizontal />;
  };

  const renderListPlaceholder = () => {
    return (
      <View style={styles.listPlaceholder}>
        <CardPlaceholder horizontal />
        <CardPlaceholder horizontal />
        <CardPlaceholder horizontal />
        <CardPlaceholder horizontal />
      </View>
    );
  };

  const renderScrollViewContent = () => {
    if (favouriteProducts.length == 0 && !isFetching) {
      return <ListEmptyComponent />;
    }
    const noData = favouriteProducts.length == 0;

    return (
      <>
        {(!isFetching || listRecommended.length > 0) && (
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>{'Recommended for you'}</Text>
          </View>
        )}
        {fetchingRecommended ? (
          renderListPlaceholder()
        ) : (
          <FlatList
            data={listRecommended}
            keyExtractor={item => `${item.productID}`}
            renderItem={renderItems}
            initialNumToRender={INITIAL_RENDER_ITEMS}
            onEndReached={onRecommendEndReach}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() =>
              (onRecommendEndReachCalledDuringMomentum.current = false)
            }
            horizontal
            removeClippedSubviews
            showsHorizontalScrollIndicator={false}
            style={styles.listStyle}
            contentContainerStyle={styles.listContentStyle}
            ListFooterComponent={renderRecommendFooter}
          />
        )}
        {!noData && (
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>{`Because you like ${''}`}</Text>
          </View>
        )}
        {fetchingSimilar ? (
          renderListPlaceholder()
        ) : (
          <FlatList
            data={listSimilar}
            keyExtractor={item => `${item.productID}`}
            renderItem={renderItems}
            initialNumToRender={INITIAL_RENDER_ITEMS}
            onEndReached={onSimilarEndReach}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() =>
              (onSimilarEndReachCalledDuringMomentum.current = false)
            }
            horizontal
            removeClippedSubviews
            showsHorizontalScrollIndicator={false}
            style={styles.listStyle}
            contentContainerStyle={styles.listContentStyle}
            ListFooterComponent={renderSimilarFooter}
          />
        )}
        {!noData && (
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>{'Trending items'}</Text>
          </View>
        )}
        {fetchingTrending ? (
          renderListPlaceholder()
        ) : (
          <FlatList
            data={listTrending}
            keyExtractor={item => `${item.productID}`}
            renderItem={renderItems}
            initialNumToRender={INITIAL_RENDER_ITEMS}
            onEndReached={onTrendingEndReach}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() =>
              (onTrendingEndReachCalledDuringMomentum.current = false)
            }
            horizontal
            removeClippedSubviews
            showsHorizontalScrollIndicator={false}
            style={styles.listStyle}
            contentContainerStyle={styles.listContentStyle}
            ListFooterComponent={renderTrendingFooter}
          />
        )}
      </>
    );
  };

  return (
    <LinearGradient colors={[Colors.lightPurple, Colors.aqua, Colors.white]}>
      <SafeAreaView>
        <AppHeader useShortName={false} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContent,
            favouriteProducts.length == 0 &&
              !isFetching && {backgroundColor: 'white'},
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }>
          {renderScrollViewContent()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const titleStyle = {
  fontSize: 20,
  lineHeight: 26,
  fontWeight: 'bold',
};

const styles = StyleSheet.create({
  safeArea: {
    paddingBottom: 0,
  },
  scrollView: {height: '100%'},
  scrollViewContent: {
    paddingTop: 6,
    paddingBottom: Platform.select({ios: 140, android: 195}),
  },
  container: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'red',
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...titleStyle,
    marginBottom: 3,
  },
  listStyle: {
    marginBottom: Platform.select({ios: 10, android: 0}),
  },
  listContentStyle: {
    paddingTop: 10,
    paddingLeft: 16,
  },
  fetchingMoreRecommend: {
    width: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  listPlaceholder: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {paddingLeft: 16},
});

export default HomeScreen;
