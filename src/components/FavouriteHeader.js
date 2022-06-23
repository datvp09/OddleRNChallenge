import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {HAS_NOTCH} from '../utils/constants';
import Images from '../utils/images';

const FavouriteHeader = () => {
  return (
    <View style={[styles.header, HAS_NOTCH && {paddingTop: 0}]}>
      <Text style={styles.title}>{'Favourites'}</Text>
      <FastImage source={Images.defaultAvatar} style={styles.avatar} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    lineHeight: 33.8,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1,
    // borderColor: 'red',
  },
});

export default FavouriteHeader;
