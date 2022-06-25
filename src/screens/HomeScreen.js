import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  fetchEndpoint,
  getQueryVariables,
  INITIAL_RENDER_ITEMS,
} from '../core/api';
import {request, gql} from 'graphql-request';
import ProductCard from '../components/ProductCard';
import Credential from '../config/credential';
import Colors from '../utils/colors';
import {welcomeText} from '../utils/functions';
import SvgIcon from '../components/SvgIcon';
import AppHeader from '../components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useFavouriteData} from '../providers/FavouriteProvider';
import ListEmptyComponent from '../components/ListEmptyComponent';
import {useFocusEffect} from '@react-navigation/native';
import {graphCMS} from '../core/graphcms';
import {
  getRecommendProductsQuery,
  getSimilarProductQuery,
  getTrendingProductQuery,
} from '../core/query';
import {QUERY_LIMIT} from '../core/request';
import CardPlaceHolder from '../components/CardPlaceHolder';

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
    }
  }, [favouriteProducts]);

  useFocusEffect(
    useCallback(() => {
      getFavouriteProducts();
    }, []),
  );

  const getHomeData = async () => {
    if (isGettingHomeData.current) {
      return;
    }
    isGettingHomeData.current = true;
    favouriteProductBrand.current = favouriteProducts[0].brand;
    favouriteProductType.current = favouriteProducts[0].productType;
    console.log(
      'favouriteProducts',
      favouriteProductBrand.current,
      favouriteProductType.current,
      favouriteProducts[0],
    );

    console.log('callxxx-1111');
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
    if (!isRefresh && !isFetchingMore) {
      setFetchingRecommended(true);
    }
    try {
      // console.log(
      //   'call-getRecommendProducts',
      //   isRefresh,
      //   (isRefresh ? 0 : currentRecommendPage) * QUERY_LIMIT,
      // );
      const result = await graphCMS.request(getRecommendProductsQuery, {
        productType,
        limit: QUERY_LIMIT,
        offset: (isRefresh ? 0 : currentRecommendPage) * QUERY_LIMIT,
      });
      setCurrentRecommendPage(isRefresh ? 0 : currentRecommendPage + 1);
      console.log('call-getRecommendProducts-res', result);

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
    if (!isRefresh && !isFetchingMore) {
      setFetchingSimilar(true);
    }
    try {
      console.log(
        'call-getSimilarProducts',
        isRefresh,
        (isRefresh ? 0 : currentSimilarPage) * QUERY_LIMIT,
      );
      const result = await graphCMS.request(getSimilarProductQuery, {
        brand,
        limit: QUERY_LIMIT,
        offset: (isRefresh ? 0 : currentSimilarPage) * QUERY_LIMIT,
      });
      setCurrentSimilarPage(isRefresh ? 0 : currentSimilarPage + 1);
      console.log('call-getSimilarProducts', result);

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
    if (!isRefresh && !isFetchingMore) {
      setFetchingTrending(true);
    }
    try {
      console.log(
        'call-getTrendingProducts',
        isRefresh,
        isFetchingMore,
        (isRefresh ? 0 : currentTrendingPage) * QUERY_LIMIT,
      );
      const result = await graphCMS.request(getTrendingProductQuery, {
        limit: QUERY_LIMIT,
        offset: (isRefresh ? 0 : currentTrendingPage) * QUERY_LIMIT,
      });
      setCurrentTrendingPage(isRefresh ? 0 : currentTrendingPage + 1);
      console.log('call-getTrendingProducts', result);

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
      console.log('callxxx-2222');
      getRecommendProducts(favouriteProductType.current, {isRefresh: true});
      getSimilarProducts(favouriteProductBrand.current, {isRefresh: true});
      getTrendingProducts({isRefresh: true});
    }
  };

  const renderEmptyText = () => {
    return (
      <View style={{paddingLeft: 16, marginBottom: 50}}>
        <Text>{'No results to show'}</Text>
      </View>
    );
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
    return <CardPlaceHolder horizontal />;
  };

  const renderSimilarFooter = () => {
    if (!fetchingMoreSimilar) {
      return null;
    }
    return <CardPlaceHolder horizontal />;
  };

  const renderTrendingFooter = () => {
    if (!fetchingMoreTrending) {
      return null;
    }
    return <CardPlaceHolder horizontal />;
  };

  const renderListPlaceholder = () => {
    return (
      <View style={styles.listPlaceholder}>
        <CardPlaceHolder horizontal />
        <CardPlaceHolder horizontal />
        <CardPlaceHolder horizontal />
        <CardPlaceHolder horizontal />
      </View>
    );
  };

  const renderScrollViewContent = () => {
    // if (favouriteProducts.length == 0) {
    //   return <ListEmptyComponent />;
    // }
    const noData = favouriteProducts.length == 0;

    console.log('fetchingTrending', fetchingTrending);

    return (
      <>
        <View style={{paddingLeft: 16}}>
          <Text style={styles.title}>{'Recommended for you'}</Text>
        </View>
        {noData && renderEmptyText()}
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
            showsHorizontalScrollIndicator={false}
            style={styles.listStyle}
            contentContainerStyle={styles.listContentStyle}
            ListFooterComponent={renderRecommendFooter}
          />
        )}
        {!noData && (
          <View style={{paddingLeft: 16}}>
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
            showsHorizontalScrollIndicator={false}
            style={styles.listStyle}
            contentContainerStyle={styles.listContentStyle}
            ListFooterComponent={renderSimilarFooter}
          />
        )}
        {!noData && (
          <View style={{paddingLeft: 16}}>
            <Text style={styles.title}>{'Trending items'}</Text>
          </View>
        )}
        {noData && renderEmptyText()}
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
          style={{height: '100%'}}
          contentContainerStyle={{paddingTop: 20, paddingBottom: 130}}
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
    // flex: 1,
    paddingBottom: 0,
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
    marginBottom: 10,
  },
  listStyle: {
    marginBottom: 10,
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
});

export default HomeScreen;
