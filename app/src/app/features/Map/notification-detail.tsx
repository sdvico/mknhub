import { decimalToDMS, formatDMS } from "@/src/utils/dmsFormat";
import { formatTestTimeToVietnamese } from "@/src/utils/timeFormat";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationItem } from "../hooks/useNotifications";

export default function NotificationDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const notificationData = params.notification as string;
  const [notification, setNotification] = useState<NotificationItem | null>(
    null
  );

  useEffect(() => {
    if (notificationData) {
      try {
        const parsedNotification = JSON.parse(notificationData);
        setNotification(parsedNotification);
      } catch (error) {
        console.error("Error parsing notification data:", error);
      }
    }
  }, [notificationData]);

  const handleNavigateToLocationDeclaration = () => {
    if (notification?.plateNumber) {
      router.navigate({
        pathname: "/location-declaration",
        params: { plateNumber: notification.plateNumber },
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN");
  };

  const getDeclarationStatus = () => {
    if (!notification) return null;

    if (
      notification.status_gps === undefined ||
      notification.status_gps === null
    ) {
      return {
        text: "Chưa xác định",
        color: "text-gray-500",
        bgColor: "bg-gray-100",
      };
    }
    if (notification.status_gps === 0) {
      return {
        text: "Chưa khai báo",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    }
    if (notification.status_gps === 1) {
      return {
        text: "Đã khai báo",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    }
    return {
      text: "Không xác định",
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    };
  };

  const makeKeywordsBold = (text: string) => {
    if (!notification) return text;

    const keywords = [
      ...(notification.plateNumber ? [notification.plateNumber] : []),
      ...(notification.lastTime
        ? [formatTestTimeToVietnamese(notification.lastTime)]
        : []),
      ...(notification.hadTime
        ? [formatTestTimeToVietnamese(notification.hadTime)]
        : []),
      "VMS",
      "06h",
      "10 ngày",
      "MẤT KẾT NỐI",
      "CÓ LẠI KẾT NỐI",
    ];

    let result = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi");
      result = result.replace(regex, "**$1**");
    });

    // Split by ** and render bold parts
    const parts = result.split("**");
    return parts.map((part, index) => {
      const isBold = index % 2 === 1; // Odd indices are bold
      return (
        <Text
          key={index}
          className={`text-base ${
            isBold ? "font-bold text-gray-800" : "text-gray-600"
          }`}>
          {part}
        </Text>
      );
    });
  };

  if (!notification) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <SafeAreaView
          className="flex-1 bg-gray-50"
          edges={["top", "left", "right"]}>
          <View className="flex-row items-center justify-between px-5 py-2 bg-white border-b border-gray-200">
            <TouchableOpacity className="p-2" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text className="text-lg font-bold">Chi tiết thông báo</Text>
            <View style={{ width: 40 }} />
          </View>
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Không tìm thấy thông báo</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const declarationStatus = getDeclarationStatus();

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView
        className="flex-1 bg-gray-50"
        edges={["top", "left", "right"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-2 bg-white border-b border-gray-200">
          <TouchableOpacity className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Chi tiết thông báo</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-5">
            {/* Notification Card */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              {/* Title */}
              <Text className="text-xl font-bold text-gray-800 mb-3">
                {notification.title}
              </Text>

              {/* Timestamp */}
              <View className="flex-row items-center mb-4">
                <Ionicons name="time" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-500 ml-2">
                  {formatTimestamp(notification.timestamp)}
                </Text>
                {notification.Viewed === 0 && (
                  <View className="ml-2 bg-blue-500 rounded-full px-2 py-1">
                    <Text className="text-xs text-white font-medium">Mới</Text>
                  </View>
                )}
              </View>

              {/* Body */}
              <View className="mb-4">
                <Text className="text-base text-gray-600 leading-6">
                  {makeKeywordsBold(notification.body)}
                </Text>
              </View>

              {/* Ship Information */}
              {notification.plateNumber && (
                <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="boat" size={20} color="#007AFF" />
                    <Text className="ml-2 text-lg font-semibold text-blue-800">
                      Thông tin tàu
                    </Text>
                  </View>
                  <Text className="text-base text-blue-700">
                    Biển số:{" "}
                    <Text className="font-bold">
                      {notification.plateNumber}
                    </Text>
                  </Text>
                </View>
              )}

              {/* GPS Status */}
              {declarationStatus && notification.stype === "mkn6h" && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Trạng thái khai báo vị trí:
                  </Text>
                  <View
                    className={`px-3 py-2 rounded-lg ${declarationStatus.bgColor}`}>
                    <Text
                      className={`text-sm font-medium ${declarationStatus.color}`}>
                      {declarationStatus.text}
                    </Text>
                  </View>
                </View>
              )}

              {/* Location Information */}
              {(notification.lat ||
                notification.lng ||
                notification.lastTime) && (
                <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Thông tin vị trí cuối:
                  </Text>
                  {notification.lastTime && (
                    <Text className="text-sm text-gray-600 mb-1">
                      Thời gian cuối:{" "}
                      {formatTestTimeToVietnamese(notification.lastTime)}
                    </Text>
                  )}
                  {notification.lat && notification.lng && (
                    <View className="flex-row gap-4">
                      <Text className="text-sm text-gray-600">
                        Vĩ độ:{" "}
                        {formatDMS(
                          decimalToDMS(parseFloat(notification.lat), true)
                        )}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Kinh độ:{" "}
                        {formatDMS(
                          decimalToDMS(parseFloat(notification.lng), false)
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Connection Restored Information */}
              {(notification.hadTime ||
                notification.latHad ||
                notification.lngHad) && (
                <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <Text className="text-sm font-medium text-green-700 mb-2">
                    Thông tin kết nối lại:
                  </Text>
                  {notification.hadTime && (
                    <Text className="text-sm text-green-600 mb-1">
                      Thời gian kết nối lại:{" "}
                      {formatTestTimeToVietnamese(notification.hadTime)}
                    </Text>
                  )}
                  {notification.latHad && notification.lngHad && (
                    <View className="flex-row gap-4">
                      <Text className="text-sm text-green-600">
                        Vĩ độ:{" "}
                        {formatDMS(
                          decimalToDMS(parseFloat(notification.latHad), true)
                        )}
                      </Text>
                      <Text className="text-sm text-green-600">
                        Kinh độ:{" "}
                        {formatDMS(
                          decimalToDMS(parseFloat(notification.lngHad), false)
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              {/* Location Declaration Button */}
              {notification.plateNumber &&
                notification.status_gps === 0 &&
                (notification.stype === "mkn6h" ||
                  notification.stype === "mknNear6h") && (
                  <TouchableOpacity
                    className="bg-orange-600 py-4 rounded-xl items-center"
                    onPress={handleNavigateToLocationDeclaration}>
                    <Text className="text-white text-base font-semibold">
                      Khai báo vị trí tàu
                    </Text>
                  </TouchableOpacity>
                )}

              {/* Port Declaration Button for mkn10d and mknNear10d */}
              {notification.plateNumber &&
                notification.status_tripIn === 0 &&
                (notification.stype === "mkn10d" ||
                  notification.stype === "mknNear10d") && (
                  <TouchableOpacity
                    className="bg-orange-600 py-4 rounded-xl items-center"
                    onPress={() => {
                      router.navigate({
                        pathname: "/port-declaration",
                        params: {
                          plateNumber: notification.plateNumber,
                        },
                      });
                    }}>
                    <Text className="text-white text-base font-semibold">
                      Khai báo cập bến
                    </Text>
                  </TouchableOpacity>
                )}

              {/* View GPS History Button */}
              {notification.plateNumber &&
                (notification.status_gps === 1 ||
                  notification.status_tripIn === 1) && (
                  <TouchableOpacity
                    className="bg-green-600 py-4 rounded-xl items-center"
                    onPress={() => {
                      router.navigate({
                        pathname: "/listSubmit",
                        params: { plateNumber: notification.plateNumber },
                      });
                    }}>
                    <Text className="text-white text-base font-semibold">
                      Xem lịch sử vị trí GPS
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
