// CustomAlert.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomAlertProps {
  visible?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  confirmText?: string;
  iconName?: 'error' | 'success' | 'info';
  backgroundColor?: string;
  primaryColor?: string;
  confirmColor?: string;
  customStyles?: {
    container?: ViewStyle;
    title?: TextStyle;
    message?: TextStyle;
    button?: ViewStyle;
    buttonText?: TextStyle;
    confirmButton?: ViewStyle;
    confirmButtonText?: TextStyle;
  };
}

/**
 * CustomAlert - A customizable alert popup component with optional confirm button
 */
const CustomAlert: React.FC<CustomAlertProps> = ({
  visible = false,
  onClose,
  onConfirm,
  title = 'Thông báo lỗi',
  message = 'Úi úi úi! Bạn gặp lỗi rồi, vui lòng thử lại!',
  buttonText = 'Đóng',
  confirmText = 'Xác nhận',
  iconName = 'error',
  backgroundColor = '#ebffee',
  primaryColor = '#D00416',
  confirmColor = '#4CAF50', // Default green color for confirm button
  customStyles = {},
}) => {
  // Determine the theme color - use confirmColor if onConfirm exists, otherwise use primaryColor
  const themeColor = onConfirm ? confirmColor : primaryColor;

  // Render icon based on iconName prop
  const renderIcon = () => {
    // Basic icon implementation - replace with your icon system
    return (
      <View
        style={[
          styles.iconContainer,
          {borderColor: themeColor, backgroundColor: backgroundColor},
        ]}>
        <Text style={[styles.iconText, {color: themeColor}]}>
          {iconName === 'error' ? '!' : iconName === 'success' ? '✓' : 'i'}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.alertContainer, customStyles.container]}>
          {renderIcon()}

          <Text style={[styles.title, {color: themeColor}, customStyles.title]}>
            {title}
          </Text>

          <Text style={[styles.message, customStyles.message]}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: primaryColor},
                onConfirm ? styles.buttonWithConfirm : styles.buttonFullWidth,
                customStyles.button,
              ]}
              onPress={onClose}>
              <Text style={[styles.buttonText, customStyles.buttonText]}>
                {buttonText}
              </Text>
            </TouchableOpacity>

            {onConfirm && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  {backgroundColor: confirmColor},
                  customStyles.confirmButton,
                ]}
                onPress={() => {
                  if (onConfirm) {
                    onConfirm();
                  }
                  onClose();
                }}>
                <Text
                  style={[styles.buttonText, customStyles.confirmButtonText]}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonWithConfirm: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
