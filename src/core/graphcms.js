import {GraphQLClient} from 'graphql-request';
import {fetchEndpoint} from './api';

const graphCMS = new GraphQLClient(fetchEndpoint);

export {graphCMS};
