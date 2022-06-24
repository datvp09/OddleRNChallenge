import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Images from '../utils/images';

const ListEmptyComponent = () => (
  <FastImage
    source={Images.noResultShow}
    style={styles.image}
    resizeMode={FastImage.resizeMode.contain}
  />
);

const styles = StyleSheet.create({
  image: {
    marginTop: 20,
    height: 220,
  },
});

export default ListEmptyComponent;
