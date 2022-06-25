import axios from 'axios';
import Credential from '../config/credential';

const INITIAL_RENDER_ITEMS = 10;
const QUERY_LIMIT = 10;

const fetchEndpoint =
  'https://api-ap-northeast-1.graphcms.com/v2/cl49zomnx1n4f01w892q05vkz/master';

const fetchLikeEndpoint =
  'https://oddle-challenge-api.herokuapp.com/api/accounts';

const productDetailEndpoint = 'http://makeup-api.herokuapp.com/api/v1/products';

export const getQueryVariables = page => {
  const skip = (page - 1) * QUERY_LIMIT;
  const take = QUERY_LIMIT;
  const orderBy = {createdAt: 'desc'};
  return {take, skip, orderBy};
};

const getFavouriteProductIds = async () => {
  let resIds;
  try {
    const config = {
      method: 'get',
      url: `${fetchLikeEndpoint}/${Credential.accountName}/favourites`,
      headers: {
        Authorization: Credential.apiKey,
      },
    };
    resIds = await axios(config);
  } catch (e) {}

  return resIds?.data?.data || [];
};

const getFavouriteProducts = async () => {
  const list = await getFavouriteProductIds();
  if (!list) {
    return;
  }

  let listTransformed;

  try {
    const getDetailPromises = list.map(id =>
      axios.get(`${productDetailEndpoint}/${id}.json`),
    );
    const result = await Promise.all(getDetailPromises);
    const _ = require('lodash');
    listTransformed = result.map(res =>
      _.mapKeys(res.data, (v, k) => _.camelCase(k)),
    );
  } catch (e) {}

  return listTransformed || [];
};

const likeProduct = async id => {
  if (!id) {
    return;
  }

  let result;
  try {
    const config = {
      method: 'patch',
      url: `${fetchLikeEndpoint}/${Credential.accountName}/favourites/${id}`,
      headers: {
        Authorization: Credential.apiKey,
      },
    };
    result = await axios(config);
  } catch (e) {}

  return result?.data;
};

const unlikeProduct = async id => {
  if (!id) {
    return;
  }

  let result;
  try {
    const config = {
      method: 'delete',
      url: `${fetchLikeEndpoint}/${Credential.accountName}/favourites/${id}`,
      headers: {
        Authorization: Credential.apiKey,
      },
    };
    result = await axios(config);
  } catch (e) {}

  return result?.data;
};

export {
  fetchEndpoint,
  productDetailEndpoint,
  getFavouriteProducts,
  likeProduct,
  unlikeProduct,
  INITIAL_RENDER_ITEMS,
  QUERY_LIMIT,
};
