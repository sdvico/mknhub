/* eslint-disable react-native/no-inline-styles */
// CustomToast.tsx
import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';

const {width} = Dimensions.get('window');

type ToastPosition = 'top' | 'bottom' | 'center';

interface CustomToastProps {
  visible?: boolean;
  onHide?: () => void;
  message?: string;
  iconName?: 'error' | 'success' | 'info';
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  position?: ToastPosition;
  duration?: number;
  customStyles?: {
    container?: ViewStyle;
    text?: TextStyle;
    icon?: ViewStyle;
  };
}

/**
 * CustomToast - A customizable toast notification component
 */
const CustomToast: React.FC<CustomToastProps> = ({
  visible = false,
  onHide,
  message = 'GPS bị lỗi, vui lòng sửa lại',
  iconName = 'error',
  backgroundColor = '#FCEBE8',
  textColor = '#801F10',
  iconColor = '#E33D25',
  position = 'top',
  duration = 3000,
  customStyles = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current as any;
  const translateY = useRef(
    new Animated.Value(position === 'bottom' ? 50 : -50),
  ).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timers when visibility changes
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    } else {
      // If visible becomes false from parent, make sure we hide
      hideToast(false); // false means don't trigger onHide since parent already knows
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible, duration]); // Added duration as dependency

  const hideToast = (triggerCallback = true) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'bottom' ? 50 : -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (triggerCallback && onHide) {
        onHide();
      }
    });
  };

  // Determine position style
  const getPositionStyle = (): ViewStyle => {
    switch (position) {
      case 'top':
        return {top: 50};
      case 'bottom':
        return {bottom: 50};
      case 'center':
        return {top: '50%', transform: [{translateY: -25}]};
      default:
        return {top: 50};
    }
  };

  // Render icon based on iconName prop
  const renderIcon = () => {
    // Basic icon implementation - replace with your icon system
    return (
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconColor,
            borderColor: iconName === 'error' ? '#F6BEB6' : '#B6F6BE',
          },
          customStyles.icon,
        ]}>
        <Text style={[styles.iconText, {color: backgroundColor}]}>
          {iconName === 'error' ? '!' : iconName === 'success' ? '✓' : 'i'}
        </Text>
      </View>
    );
  };

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        {
          backgroundColor,
          borderColor: iconName === 'error' ? '#F6BEB6' : '#B6F6BE',
          opacity: fadeAnim,
          transform: [{translateY}],
        },
        customStyles.container,
      ]}>
      {renderIcon()}
      <Text style={[styles.message, {color: textColor}, customStyles.text]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    maxWidth: width - 40,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 9999,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CustomToast;
