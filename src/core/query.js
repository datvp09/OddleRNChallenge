import {gql} from 'graphql-request';

const getProductListQuery = gql`
  query getProductList($limit: Int!, $offset: Int!) {
    products(
      first: $limit
      skip: $offset
      where: {AND: [{price_not: null}, {price_not: "0.0"}]}
      orderBy: price_ASC
    ) {
      productID
      brand
      name
      price
      category
      currency
      description
      priceSign
      productApiUrl
      productLink
      productType
      rating
      stage
      tagList
      websiteLink
    }
    productsConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      aggregate {
        count
      }
    }
  }
`;

export {getProductListQuery};
