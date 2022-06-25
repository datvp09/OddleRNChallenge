import {request} from 'graphql-request';
import {BASE_URL} from '../config/url';

const QUERY_LIMIT = 10;

const queryData = (query, pageSize = 10) => {
  return request(BASE_URL, query);
};

export {QUERY_LIMIT, queryData};
