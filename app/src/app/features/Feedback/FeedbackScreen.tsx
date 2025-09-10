import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Loading, {RefObject} from '../common/screens/loading';
import {Text} from '../../library/components';
import HeaderBasic from '../common/components/header/header-basic';
import {useInfiniteList} from '@/app/hooks/useInfiniteList';
import {ColorDefault} from '@/app/themes/color';
import {Feedback, FeedbackResponse, FeedbackStatus} from './types';
import {NetWorkService} from '@/app/library/networking';
import {useSelector} from 'react-redux';

const FeedbackScreen = () => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const userId = useSelector((state: any) => state.app.profile.user.id);

  const {data, loading, refreshing, loadMore, refresh} =
    useInfiniteList<FeedbackResponse>({
      url: '/api/feedbacks/my-feedbacks',
    });

  const handleSubmit = async () => {
    if (!content.trim() || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      loadingRef.current?.toggleState(true);
      await NetWorkService.Post({
        url: '/api/feedbacks',
        body: {
          content: content.trim(),
          reporter_id: userId,
          status: 'new',
        },
      });
      setContent('');
      refresh(); // Refresh list after submitting
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // TODO: Show error toast
    } finally {
      setSubmitting(false);
      loadingRef.current?.toggleState(false);
    }
  };

  const renderFeedbackItem = ({item}: {item: Feedback}) => {
    return (
      <View style={styles.feedbackItem}>
        <View style={styles.feedbackHeader}>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleString('vi-VN')}
          </Text>
          <View
            style={[
              styles.statusBadge,
              item.status === FeedbackStatus.RESOLVED
                ? styles.resolvedBadge
                : item.status === FeedbackStatus.REJECTED
                ? styles.rejectedBadge
                : item.status === FeedbackStatus.IN_PROGRESS
                ? styles.inProgressBadge
                : styles.newBadge,
            ]}>
            <Text style={styles.statusText}>
              {item.status === FeedbackStatus.RESOLVED
                ? 'Đã xử lý'
                : item.status === FeedbackStatus.REJECTED
                ? 'Từ chối'
                : item.status === FeedbackStatus.IN_PROGRESS
                ? 'Đang xử lý'
                : 'Mới'}
            </Text>
          </View>
        </View>

        <Text style={styles.feedbackContent}>{item.content}</Text>

        {item.response && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Phản hồi:</Text>
            <Text style={styles.responseContent}>{item.response}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={ColorDefault.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có phản ánh nào</Text>
      </View>
    );
  };

  const inputRef = useRef<TextInput>(null);
  const loadingRef = useRef<RefObject>(null);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <HeaderBasic title="Phản ánh" />
      <TouchableOpacity
        style={styles.content}
        activeOpacity={1}
        onPress={() => Keyboard.dismiss()}>
        <FlatList
          data={data || []}
          renderItem={renderFeedbackItem}
          keyExtractor={item => item.id}
          onRefresh={refresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={[
            styles.listContent,
            !data?.length && styles.emptyList,
          ]}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[styles.input, Platform.OS === 'ios' && {maxHeight: 100}]}
            placeholder="Nhập nội dung phản ánh..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!content.trim() || submitting) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!content.trim() || submitting}>
            <Text style={styles.submitText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <Loading ref={loadingRef} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.white,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  feedbackItem: {
    backgroundColor: ColorDefault.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: ColorDefault.grey600,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadge: {
    backgroundColor: ColorDefault.grey100,
  },
  inProgressBadge: {
    backgroundColor: ColorDefault.facebook_blue,
  },
  resolvedBadge: {
    backgroundColor: ColorDefault.green,
  },
  rejectedBadge: {
    backgroundColor: ColorDefault.red,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  feedbackContent: {
    fontSize: 14,
    color: ColorDefault.grey800,
    marginBottom: 8,
  },
  responseContainer: {
    backgroundColor: ColorDefault.grey100,
    padding: 12,
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 12,
    color: ColorDefault.grey600,
    marginBottom: 4,
  },
  responseContent: {
    fontSize: 14,
    color: ColorDefault.grey800,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: ColorDefault.grey300,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: ColorDefault.grey300,
    borderRadius: 8,
    padding: 12,
    minHeight: Platform.OS === 'ios' ? 40 : 48,
    marginRight: 12,
  },
  submitButton: {
    backgroundColor: ColorDefault.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: ColorDefault.white,
    fontWeight: '600',
  },
  loaderFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: ColorDefault.grey600,
  },
});

export default FeedbackScreen;
