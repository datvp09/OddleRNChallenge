import React, {createContext, useContext, useState} from 'react';
import {getFavouriteProducts as getFavouriteProductsAPI} from '../core/api';

const context = createContext({
  favouriteProducts: [],
  getFavouriteProducts: () => {},
  isFetching: false,
  changedFavourite: null,
  setChangedFavourite: () => {},
});

export const FavouriteProvider = ({children}) => {
  const [favouriteProducts, setFavouriteProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [changedFavourite, setChangedFavourite] = useState();

  const getFavouriteProducts = async () => {
    setIsFetching(true);
    try {
      const data = await getFavouriteProductsAPI();
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
        changedFavourite,
        setChangedFavourite,
      }}>
      {children}
    </context.Provider>
  );
};

export const useFavouriteData = () => useContext(context);
