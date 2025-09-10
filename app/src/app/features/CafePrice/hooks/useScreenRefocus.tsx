// useScreenRefocus.ts
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';

/**
 * Hook: gọi `onRefocus` mỗi khi màn hình bị blur và được focus lại lần tiếp theo.
 *
 * @param onRefocus  Hàm callback muốn gọi khi screen focus lại.
 */
export const useScreenRefocus = (onRefocus: () => void) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [focus, setfocus] = useState(false);

  useEffect(() => {
    // Khi BLUR
    const blurSub = navigation.addListener('blur', () => {
      // console.log('blur----------------------');
      setfocus(true);
    });

    // Khi FOCUS
    const focusSub = navigation.addListener('focus', () => {
      // console.log('focus----------------------', focus);
      if (focus) {
        setfocus(false);
        onRefocus();
      }
    });

    // Dọn dẹp listeners khi unmount
    return () => {
      blurSub();
      focusSub();
    };
  }, [navigation, onRefocus]);
};
