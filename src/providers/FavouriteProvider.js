import React, {createContext, useContext, useState} from 'react';
import {getFavouriteProducts as getFavouriteProductsAPI} from '../core/api';

const context = createContext({
  favouriteProducts: [],
  getFavouriteProducts: () => {},
  isFetching: false,
});

export const FavouriteProvider = ({children}) => {
  const [favouriteProducts, setFavouriteProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const getFavouriteProducts = async () => {
    setIsFetching(true);
    try {
      const data = await getFavouriteProductsAPI();
      console.log('getFavouriteProductsAPI', data);
      setFavouriteProducts(data);
    } catch (e) {
      console.log('getFavouriteProductsAPI-e', e);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <context.Provider
      value={{
        favouriteProducts,
        getFavouriteProducts,
        isFetching,
      }}>
      {children}
    </context.Provider>
  );
};

export const useFavouriteData = () => useContext(context);
