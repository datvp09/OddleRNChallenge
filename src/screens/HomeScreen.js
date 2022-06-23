import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
// import {useQuery} from 'react-query';
import {getProductListQuery} from '../core/query';
import {fetchEndpoint, getQueryVariables} from '../core/api';
import {request, gql} from 'graphql-request';
import ProductCard from '../components/ProductCard';
import Credential from '../config/credential';
import Colors from '../utils/colors';
import {welcomeText} from '../utils/functions';
import SvgIcon from '../components/SvgIcon';
import AppHeader from '../components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = ({params}) => {
  const [listItems, setListItems] = useState([]);

  // const result = useQuery(getProductListQuery, {
  //   variables: getQueryVariables(currentPage),
  // });
  // const result = useQuery(getProductListQuery, async () => {

  //   return data;
  // });

  // useEffect(() => {
  //   getProductList();
  // }, []);

  // const getProductList = async (page = 0) => {
  //   const result = await request(
  //     fetchEndpoint,
  //     gql`
  //       ${getProductListQuery}
  //     `,
  //     {skip: 4},
  //   );
  //   setListItems(result?.['products']);
  //   console.log(
  //     'getProductList',
  //     typeof result?.['products'],
  //     result?.['products'],
  //     listItems,
  //   );
  // };

  // console.log('getProductList-2', listItems);

  const renderItems = ({item, index}) => {
    console.log(`item-${index}`, item);
    return <ProductCard />;
  };

  return (
    <LinearGradient colors={[Colors.lightPurple, Colors.aqua, Colors.white]}>
      <SafeAreaView>
        <AppHeader useShortName={false} />
        <ScrollView style={{height: '100%'}}>
          <View style={{paddingLeft: 16}}>
            <Text style={styles.title}>{'Recommended for you'}</Text>
          </View>
          <FlatList
            data={listItems}
            keyExtractor={item => item.productID}
            renderItem={renderItems}
            horizontal
            style={{
              borderWidth: 1,
              borderColor: 'red',
              marginBottom: 30,
              paddingLeft: 16,
            }}
          />
          <View style={{paddingLeft: 16}}>
            <Text style={styles.title}>{`Because you like ${''}`}</Text>
          </View>
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
    marginBottom: 20,
  },
});

export default HomeScreen;
