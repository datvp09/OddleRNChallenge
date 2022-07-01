import React, {createContext, useContext, useState} from 'react';

const withinLimits = (val, min, max) =>
  val > max ? max : val < min ? min : val;

const ScrollContext = createContext({
  opacity: 0,
  maxOffset: 0,
  offset: 0,
  titleShowing: false,
  updateOffset: () => {},
});

export const ScrollContextProvider = props => {
  const minOffset = 0;
  const maxOffset = 30;

  const [offset, setOffset] = useState(0);
  const [titleShowing, setTitleShowing] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const updateOffset = val => {
    setOffset(withinLimits(val, minOffset, maxOffset));
    setTitleShowing(val > maxOffset);
    setOpacity(withinLimits((val * maxOffset) / 1000, 0, 1));
  };

  return (
    <ScrollContext.Provider
      value={{
        opacity,
        maxOffset,
        offset,
        titleShowing,
        updateOffset,
      }}>
      {props.children}
    </ScrollContext.Provider>
  );
};

export const useScroller = () => useContext(ScrollContext);
