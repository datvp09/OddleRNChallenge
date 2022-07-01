import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const ImagePlaceholder = style => {
  return (
    <ShimmerPlaceHolder
      LinearGradient={LinearGradient}
      style={[styles.container, style]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default ImagePlaceholder;
