import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {width} from '../utils/constants';

const CardPlaceholder = ({horizontal, style = {}}) => {
  return (
    <ShimmerPlaceHolder
      LinearGradient={LinearGradient}
      width={horizontal ? 280 : width - 36}
      height={390}
      style={[
        styles.container,
        horizontal ? {marginRight: 20} : {marginBottom: 20},
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {borderRadius: 6},
});

export default CardPlaceholder;
