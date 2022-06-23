import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {welcomeText} from '../utils/functions';
import Credential from '../config/credential';
import Colors from '../utils/colors';
import Images from '../utils/images';
import FastImage from 'react-native-fast-image';

const AppHeader = ({useShortName = true}) => {
  const username = useShortName
    ? Credential.accountName.slice(0, 8)
    : Credential.accountName;

  return (
    <View style={styles.header}>
      <FastImage source={Images.defaultAvatar} style={styles.avatar} />
      <View>
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
    marginBottom: 8,
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
