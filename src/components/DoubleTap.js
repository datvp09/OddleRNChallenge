import React, {useRef} from 'react';
import {TouchableWithoutFeedback} from 'react-native';

export const DoubleTap = ({children, delay = 300, onDoubleTap}) => {
  const lastTap = useRef();

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < delay) {
      onDoubleTap?.();
    } else {
      lastTap.current = now;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      {children}
    </TouchableWithoutFeedback>
  );
};
