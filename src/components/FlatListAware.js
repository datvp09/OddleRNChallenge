import {FlatList as FlatListNative} from 'react-native';
import {useScroller} from '../providers/ScrollProvider';

export const FlatList = props => {
  const {updateOffset} = useScroller();

  return (
    <FlatListNative
      {...props}
      onScroll={({nativeEvent}) => {
        updateOffset(nativeEvent.contentOffset.y);
      }}
      scrollEventThrottle={200}>
      {props.children}
    </FlatListNative>
  );
};
