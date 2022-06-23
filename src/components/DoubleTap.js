import React, {useRef} from 'react';
import {State, TapGestureHandler} from 'react-native-gesture-handler';

export const DoubleTap = ({children, onSingleTap, onDoubleTap}) => {
  const doubleTapRef = useRef(null);

  const onSingleTapEvent = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onSingleTap?.();
    }
  };

  const onDoubleTapEvent = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onDoubleTap?.();
    }
  };

  return (
    <TapGestureHandler
      onHandlerStateChange={onSingleTapEvent}
      waitFor={doubleTapRef}>
      <TapGestureHandler
        ref={doubleTapRef}
        onHandlerStateChange={onDoubleTapEvent}
        numberOfTaps={2}>
        {children}
      </TapGestureHandler>
    </TapGestureHandler>
  );
};
