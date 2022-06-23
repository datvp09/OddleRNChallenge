// import {useQuery} from 'react-query';
import axios from 'axios';
import Credential from '../config/credential';
import {getProductListQuery} from './query';
import {queryData} from './request';

const PAGE_SIZE = 10;

const fetchEndpoint =
  'https://api-ap-northeast-1.graphcms.com/v2/cl49zomnx1n4f01w892q05vkz/master';

const fetchLikeEndpoint =
  'https://oddle-challenge-api.herokuapp.com/api/accounts';

const getProductList = async (pageSize = 10) => {
  const result = await queryData(getProductListQuery, pageSize);
  console.log('getProductList', result);

  return result?.['data'];
};

export const getQueryVariables = page => {
  const skip = (page - 1) * PAGE_SIZE;
  const take = PAGE_SIZE;
  const orderBy = {createdAt: 'desc'};
  return {take, skip, orderBy};
};

const getFavouriteProducts = () => {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', Credential.apiKey);

  var requestOptions = {
    headers: myHeaders,
    redirect: 'follow',
  };

  axios
    .get(`${fetchLikeEndpoint}/${Credential.accountName}/favourites`, {
      headers: {
        Authorization: Credential.apiKey,
      },
    })
    .then(response => response.data)
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

// const getProductList = async (page = 0) => {
//   console.log('useQuery', useQuery);
//   const {data, loading, error} = useQuery(getProductListQuery, {
//     variables: getQueryVariables(page),
//   });
//   console.log('getProductList', data, loading, error);

//   return data;
// };

export {fetchEndpoint, getProductList, getFavouriteProducts};
