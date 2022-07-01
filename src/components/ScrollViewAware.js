import {ScrollView as ScrollViewNative} from 'react-native';
import {useScroller} from '../providers/ScrollProvider';

export const ScrollView = props => {
  const {updateOffset} = useScroller();

  return (
    <ScrollViewNative
      {...props}
      onScroll={({nativeEvent}) => {
        updateOffset(nativeEvent.contentOffset.y);
      }}
      scrollEventThrottle={200}>
      {props.children}
    </ScrollViewNative>
  );
};
