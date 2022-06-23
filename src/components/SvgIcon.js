import React from 'react';
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
// import DefaultAvatar from '../assets/svg/default-avatar.svg';
import Dollar from '../assets/svg/dollar.svg';
import HeartSelected from '../assets/svg/heart-selected.svg';
import Heart from '../assets/svg/heart.svg';
import HomeSelected from '../assets/svg/home-selected.svg';
import Home from '../assets/svg/home.svg';
import Info from '../assets/svg/info.svg';
import MoneySelected from '../assets/svg/money-selected.svg';
import Money from '../assets/svg/money.svg';
import Star from '../assets/svg/star.svg';

const getIcon = (name, size, width, height, color) => {
  const map = new Map([
    // ['default-avatar', DefaultAvatar],
    ['dollar', Dollar],
    ['heart-selected', HeartSelected],
    ['heart', Heart],
    ['home-selected', HomeSelected],
    ['home', Home],
    ['info', Info],
    ['money-selected', MoneySelected],
    ['money', Money],
    ['star', Star],
  ]);

  const IconName = map.get(name);

  if (!IconName) {
    return null;
  }

  return (
    <IconName
      width={size || width || 24}
      height={size || height || 24}
      fill={color || 'none'}
      fillRule={'evenodd'}
    />
  );
};

const SvgIcon = ({
  name,
  size,
  width,
  height,
  color,
  style,
  enableTouch = false,
  touchWithoutFeedback = false,
  onPress,
}) => {
  const Touch = touchWithoutFeedback
    ? TouchableWithoutFeedback
    : TouchableOpacity;
  const icon = (
    <View style={style}>{getIcon(name, size, width, height, color)}</View>
  );

  if (!enableTouch) {
    return icon;
  }

  return <Touch onPress={onPress}>{icon}</Touch>;
};

export default SvgIcon;
