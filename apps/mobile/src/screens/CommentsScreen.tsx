import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Comment } from '@tier1fitness_app/types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import api from '../services/api';
import { UserService } from '../services/userService';

type CommentsScreenRouteProp = RouteProp<RootStackParamList, 'Comments'>;

const formatTimeAgo = (isoDate: string) => {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(isoDate).toLocaleDateString();
};

const CommentItem = React.memo(({ comment }: { comment: any }) => {
  // NOTE: We use 'any' here temporarily because the server returns 'text' 
  // but the shared type might define 'content'. This handles both cases.
  const content = comment.text || comment.content || ""; 
  const timeAgo = formatTimeAgo(comment.createdAt);

  return (
    <View style={styles.commentItem}>
      <Image 
        source={{ uri: comment.author.profilePicUrl }} 
        style={styles.avatar} 
      />
      <View style={styles.commentContent}>
        <View style={styles.textContainer}>
          <Text style={styles.username}>{comment.author.username}</Text>
          <Text style={styles.commentText}>{content}</Text>
        </View>
        <Text style={styles.timestamp}>{timeAgo}</Text>
      </View>
    </View>
  );
});

export function CommentsScreen() {
  const route = useRoute<CommentsScreenRouteProp>();
  const { post } = route.params;

  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const data = await api.get<any[]>(`/posts/${post.id}/comments`);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [post.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComments();
  };

  const handlePostComment = async () => {
    if (newCommentText.trim() === '' || isSending) return;

    const user = await UserService.getUser();
    if (!user) {
      Alert.alert('Login Required', 'You must be logged in to comment.');
      return;
    }

    setIsSending(true);
    const commentToSend = newCommentText.trim();
    
    // Optimistic clear
    setNewCommentText(''); 

    try {
      const payload = {
        authorId: user.id,
        text: commentToSend,
      };
      
      const newComment = await api.post<any>(`/posts/${post.id}/comments`, payload);
      
      // Append new comment to the bottom
      setComments(prev => [...prev, newComment]);

    } catch (e: any) {
      Alert.alert('Error', 'Failed to post comment.');
      setNewCommentText(commentToSend); // Restore text on failure
    } finally {
      setIsSending(false);
    }
  };

  const renderListHeader = () => (
    <View style={styles.postHeader}>
      <View style={styles.captionContainer}>
        <Image source={{ uri: post.author.profilePicUrl }} style={styles.headerAvatar} />
        <View style={{flex: 1}}>
            <Text style={styles.captionText}>
                <Text style={styles.headerUsername}>{post.author.username} </Text>
                {post.caption}
            </Text>
            <Text style={styles.timestamp}>{formatTimeAgo(post.createdAt)}</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={({ item }) => <CommentItem comment={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={colors.primary} 
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No comments yet.</Text>
          }
        />
      )}

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={newCommentText}
            onChangeText={setNewCommentText}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handlePostComment}
            disabled={isSending || !newCommentText.trim()}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons 
                name="send" 
                size={24} 
                color={newCommentText.trim() ? colors.primary : colors.textSecondary} 
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  postHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 10,
  },
  captionContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#333',
  },
  headerUsername: {
    fontWeight: 'bold',
    color: colors.text,
  },
  captionText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    width: '100%',
  },
  // Comment Item
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: '#333',
  },
  commentContent: {
    flex: 1,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  username: {
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 6,
    fontSize: 14,
  },
  commentText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  // Input
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background, // Input darker than bar
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    color: colors.text,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    padding: 4,
  }
});