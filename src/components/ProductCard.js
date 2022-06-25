import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  PlatformColor,
  Platform,
} from 'react-native';
import axios from 'axios';
import Colors from '../utils/colors';
import Images from '../utils/images';
import {width} from '../utils/constants';
import FastImage from 'react-native-fast-image';
import {DoubleTap} from './DoubleTap';
import {useNavigation} from '@react-navigation/native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import SvgIcon from './SvgIcon';
import {likeProduct, unlikeProduct} from '../core/api';
import {useFavouriteData} from '../providers/FavouriteProvider';

const ProductCard = ({item, isFavourite = false, horizontal = false}) => {
  const {
    brand,
    productApiUrl,
    name,
    tagList,
    rating,
    price,
    category,
    productType,
    productID,
  } = item;
  const [productDetail, setProductDetail] = useState(isFavourite ? item : {});
  const [imageError, setImageError] = useState(false);
  const {favouriteProducts, getFavouriteProducts} = useFavouriteData();
  const productId = isFavourite ? productDetail?.id : productID;
  const isLiked =
    isFavourite || favouriteProducts.map(pro => pro.id).includes(productId);
  const [likeStatus, setLikeStatus] = useState(isLiked);
  const navigation = useNavigation();

  // console.log(
  //   'ProductCard-detail',
  //   productId,
  //   favouriteProducts,
  //   isLiked,
  //   likeStatus,
  // );

  useEffect(() => {
    if (!isFavourite) {
      getProductDetail();
    }
  }, []);

  const onImageNotFound = () => {
    setImageError(true);
  };

  const getProductDetail = async () => {
    const productUrl = productApiUrl.replace('http', 'https');
    try {
      const result = await axios.get(productUrl);
      const _ = require('lodash');
      const objTransformed = _.mapKeys(result?.data, (v, k) => _.camelCase(k));
      setProductDetail(objTransformed);
    } catch (e) {
      console.log('getProductDetail-e', productUrl, e);
    }
  };

  const onImageDoubleTap = () => {
    console.log('double tap image');
  };

  const renderImage = () => {
    if (!productDetail?.imageLink) {
      return null;
    }

    return (
      <DoubleTap onDoubleTap={onImageDoubleTap}>
        <FastImage
          source={{
            uri: imageError
              ? Images.notFoundImageUrl
              : productDetail?.imageLink,
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.productImage}
          onError={onImageNotFound}
        />
      </DoubleTap>
    );
  };

  const viewBrand = () => {
    if (!productDetail?.websiteLink) {
      return;
    }
    let title;
    if (!!productDetail?.brand) {
      title = productDetail?.brand + ' store';
    }
    navigation.navigate('WebviewScreen', {
      url: productDetail?.websiteLink,
      title,
    });
  };

  const orderNow = async () => {
    if (!productDetail?.productLink) {
      return;
    }

    const url = productDetail?.productLink;
    if (await InAppBrowser.isAvailable()) {
      InAppBrowser.open(url, {
        toolbarColor: 'black',
      });
    } else {
      Linking.open(url);
    }
  };

  const onFavouritePress = async () => {
    setLikeStatus(liked => !liked);
    console.log('productId:', productId);
    if (likeStatus) {
      await unlikeProduct(productId);
    } else {
      await likeProduct(productId);
      getFavouriteProducts();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: horizontal ? 282 : width - 36,
          marginRight: horizontal ? 20 : 0,
        },
      ]}>
      <View style={styles.imageWrap}>
        {renderImage()}
        <View style={styles.brandWrap}>
          <Text style={styles.normalText}>{brand}</Text>
        </View>
        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={onFavouritePress}>
          <SvgIcon name={likeStatus ? 'heart-selected' : 'heart'} size={20} />
        </TouchableOpacity>
      </View>
      <View style={[styles.contentWrap]}>
        <View style={styles.contents}>
          <Text style={styles.title} numberOfLines={2}>
            {name}
          </Text>
          {!!tagList && tagList?.length > 0 ? (
            <Text style={styles.tags} numberOfLines={1}>
              {tagList.join(', ')}
            </Text>
          ) : (
            <Text style={styles.tags}>{'N/A'}</Text>
          )}
          <View style={[styles.rowCenter, {marginBottom: 5}]}>
            <View style={styles.rowCenter}>
              <SvgIcon name={'star'} size={14} />
              <View style={styles.space} />
              <Text>{productDetail?.rating || 'N/A'}</Text>
            </View>
            <View style={styles.space2} />
            <View style={styles.rowCenter}>
              <SvgIcon name={'dollar'} size={14} />
              <View style={styles.space} />
              <Text>{productDetail?.price}</Text>
            </View>
          </View>
          <View style={styles.rowCenter}>
            <SvgIcon name={'info'} size={20} />
            <View style={styles.space} />
            <Text>{`${(category || 'N/A').capitalize()} - ${(
              productType || 'N/A'
            ).capitalize()}`}</Text>
          </View>
        </View>
        <View style={styles.rowCenter}>
          <TouchableOpacity onPress={viewBrand} style={styles.buttonViewBrand}>
            <Text style={styles.buttonText}>{'View brand'}</Text>
          </TouchableOpacity>
          <View style={styles.space2} />
          <TouchableOpacity onPress={orderNow} style={styles.buttonOrderNow}>
            <Text style={styles.buttonTextOrderNow}>{'Order now'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const shadow = Platform.select({
  ios: {
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  android: {
    elevation: 6,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 25,
    borderRadius: 8,
    ...shadow,
  },
  imageWrap: {
    height: 205,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  favouriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
    paddingTop: 1,
  },
  contentWrap: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: Colors.smokeGrey,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  contents: {marginBottom: 15},
  productImage: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tags: {
    color: Colors.charcoal,
    lineHeight: 20,
    marginBottom: 5,
  },
  rowCenter: {flexDirection: 'row', alignItems: 'center'},
  space: {width: 6},
  space2: {width: 10},
  buttonViewBrand: {
    width: 120,
    height: 38,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.darkGrey,
  },
  buttonOrderNow: {
    width: 120,
    height: 38,
    borderRadius: 4,
    backgroundColor: Colors.tolopea,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: Colors.tiber,
  },
  normalText: {
    fontSize: 14,
    color: Colors.tiber,
  },
  buttonTextOrderNow: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  brandWrap: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;
