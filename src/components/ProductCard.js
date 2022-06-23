import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
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

const ProductCard = ({item}) => {
  const {
    brand,
    productApiUrl,
    name,
    tagList,
    rating,
    price,
    category,
    productType,
  } = item;
  const [productDetail, setProductDetail] = useState();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    getProductDetail();
  }, []);

  const onImageNotFound = () => {
    setImageError(true);
  };

  const getProductDetail = async () => {
    const productUrl = productApiUrl.replace('http', 'https');
    try {
      const result = await axios.get(productUrl);
      // console.log('getProductDetail', result);
      setProductDetail(result?.data);
    } catch (e) {
      console.log('getProductDetail-e', productUrl, e);
    }
  };

  const onImageDoubleTap = () => {
    console.log('double tap image');
  };

  const renderImage = () => {
    if (!productDetail?.['image_link']) {
      return null;
    }

    // if (imageLoading) {
    //   return (
    //     <View style={styles.imageLoading}>
    //       <ActivityIndicator />
    //     </View>
    //   );
    // }
    return (
      <DoubleTap onDoubleTap={onImageDoubleTap}>
        <FastImage
          source={{
            uri: imageError
              ? Images.notFoundImageUrl
              : productDetail?.['image_link'],
          }}
          style={styles.productImage}
          onError={onImageNotFound}
          onLoadEnd={() => setImageLoading(false)}
        />
      </DoubleTap>
    );
  };

  const viewBrand = () => {
    console.log('view-brand', productDetail?.['website_link']);

    if (!productDetail?.['website_link']) {
      return;
    }
    let title;
    if (!!productDetail?.brand) {
      title = productDetail?.brand + ' store';
    }
    navigation.navigate('WebviewScreen', {
      url: productDetail?.['website_link'],
      title,
    });
  };

  const orderNow = async () => {
    if (!productDetail?.['product_link']) {
      return;
    }

    const url = productDetail?.['product_link'];
    if (await InAppBrowser.isAvailable()) {
      InAppBrowser.open(url, {});
    } else {
      Linking.open(url);
    }
  };

  const onFavouritePress = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.imageWrap}>
        {renderImage()}
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            paddingHorizontal: 6,
            paddingVertical: 5,
            borderRadius: 6,
            backgroundColor: Colors.lightGrey,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.normalText}>{brand}</Text>
        </View>
        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={onFavouritePress}>
          <SvgIcon name={'heart'} size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentWrap}>
        <View style={styles.contents}>
          <Text style={styles.title} numberOfLines={2}>
            {name}
          </Text>
          {!!tagList && tagList?.length > 0 ? (
            <Text style={styles.tags}>{tagList.join(', ')}</Text>
          ) : (
            <Text style={styles.tags}>{'N/A'}</Text>
          )}
          <View style={[styles.rowCenter, {marginBottom: 5}]}>
            <View style={styles.rowCenter}>
              {/* <Image source={Images.star} style={styles.starIcon} /> */}
              <SvgIcon name={'star'} />
              <View style={styles.space} />
              <Text>{productDetail?.['rating'] || 'N/A'}</Text>
            </View>
            <View style={styles.space2} />
            <View style={styles.rowCenter}>
              {/* <Image source={Images.dollar} style={styles.dollarIcon} /> */}
              <SvgIcon name={'dollar'} />
              <View style={styles.space} />
              <Text>{productDetail?.['price']}</Text>
            </View>
          </View>
          <View style={styles.rowCenter}>
            {/* <Image source={Images.info} style={styles.dollarIcon} /> */}
            <SvgIcon name={'info'} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.smokeGrey,
    // height: 372,
    flex: 1,
    maxWidth: width - 36,
    marginBottom: 25,
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: 'red',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  imageWrap: {height: 205},
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
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    paddingTop: 1,
  },
  contentWrap: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  contents: {marginBottom: 15},
  imageLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
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
  starIcon: {marginBottom: 2, width: 16, height: 16},
  dollarIcon: {width: 16, height: 16},
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
});

export default ProductCard;
