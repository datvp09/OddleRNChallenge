import React from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {welcomeText} from '../utils/functions';
import Credential from '../config/credential';
import Colors from '../utils/colors';
import Images from '../utils/images';
import FastImage from 'react-native-fast-image';
import {useScroller} from '../providers/ScrollProvider';

const AppHeader = ({useShortName = true, whiteBackground = false}) => {
  const username = useShortName
    ? Credential.accountName.slice(0, 8)
    : Credential.accountName;

  const {opacity} = useScroller();

  return (
    <View
      style={[
        styles.header,
        {
          shadowOpacity: opacity,
        },
        whiteBackground && {backgroundColor: 'white'},
      ]}>
      <FastImage source={Images.defaultAvatar} style={styles.avatar} />
      <View style={styles.flex}>
        <Text style={styles.welcomeText}>{welcomeText()}</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
    </View>
  );
};

const titleStyle = {
  fontSize: 20,
  lineHeight: 26,
  fontWeight: 'bold',
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 6,
    marginBottom: 2,
    paddingTop: Platform.select({ios: 0, android: 6}),
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowRadius: 10,
  },
  welcomeText: {
    color: Colors.charcoal,
    lineHeight: 20,
    marginBottom: 3,
  },
  username: {
    ...titleStyle,
    color: Colors.tiber,
  },
});

export default AppHeader;
