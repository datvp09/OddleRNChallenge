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

const getRecommendProductsQuery = gql`
  query getRecommendProduct(
    $limit: Int!
    $offset: Int!
    $productType: String!
  ) {
    products(
      first: $limit
      skip: $offset
      where: {
        AND: [{price_not: null}, {price_not: "0.0"}]
        productType_contains: $productType
      }
      orderBy: price_DESC
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
  }
`;

const getSimilarProductQuery = gql`
  query getSimilarBrandProducts($limit: Int!, $offset: Int!, $brand: String!) {
    products(
      first: $limit
      skip: $offset
      where: {
        AND: [{price_not: null}, {price_not: "0.0"}]
        brand_contains: $brand
      }
      orderBy: price_DESC
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
  }
`;

const getTrendingProductQuery = gql`
  query getTrendingProducts($limit: Int!, $offset: Int!) {
    products(
      first: $limit
      skip: $offset
      where: {AND: [{price_not: null}, {price_not: "0.0"}]}
      orderBy: rating_DESC
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
  }
`;

export {
  getProductListQuery,
  getRecommendProductsQuery,
  getSimilarProductQuery,
  getTrendingProductQuery,
};
