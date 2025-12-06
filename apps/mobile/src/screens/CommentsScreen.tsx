import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import api, { MY_DEMO_USER_ID } from '../services/api';
import { colors } from '../theme/colors';
import { Comment } from '@tier1fitness_app/types';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';




type CommentsRouteProp = RouteProp<RootStackParamList, 'Comments'>;

export const CommentsScreen = () => {
  const navigation = useNavigation();

  const { params } = useRoute<CommentsRouteProp>();
  const { postId } = params;

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  // Track which comment IDs have replies expanded
const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});


  const fetchComments = async () => {
    try {
      const data = await api.get<Comment[]>(`/posts/${postId}/comments`);
      setComments(data);
    } catch (error) {
      console.log("Failed to load comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const sendComment = async () => {
  if (!newComment.trim()) return;

  try {
    setSending(true);

    if (replyingTo) {
      // Reply to an existing comment
      const reply = await api.post<Comment>(
        `/comments/${replyingTo.id}/reply`,
        {
          userId: MY_DEMO_USER_ID,
          content: newComment.trim(),
        }
      );

      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo.id
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        )
      );

      setReplyingTo(null);
    } else {
      // New top-level comment
      const created = await api.post<Comment>(
        `/posts/${postId}/comments`,
        {
          userId: MY_DEMO_USER_ID,
          content: newComment.trim(),
        }
      );

      setComments((prev) => [...prev, created]);
    }

    setNewComment('');
  } catch (error) {
    console.log('Failed to send comment:', error);
  } finally {
    setSending(false);
  }
};



  const deleteComment = async (commentId: string, parentId?: string) => {
  try {
    await api.delete(`/comments/${commentId}`);

    if (parentId) {
      // Deleting a reply
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: c.replies?.filter((r) => r.id !== commentId) || [] }
            : c
        )
      );
    } else {
      // Deleting a top-level comment
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }

  } catch (error) {
    console.log('Failed to delete comment:', error);
  }
};




  const toggleReplies = (commentId: string) => {
  setExpandedComments((prev) => ({
    ...prev,
    [commentId]: !prev[commentId]
  }));
};


  const renderItem = ({ item }: { item: Comment }) => {
  const isExpanded = expandedComments[item.id];
  const repliesCount = item.replies?.length || 0;

  return (
    <View>
      {/* Top-level comment */}
      <View
        style={styles.commentRow}
        onLongPress={() =>
            Alert.alert(
            "Delete comment?",
            "This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteComment(item.id)
                }
            ]
            )
        }
        >


        <View style={styles.contentBubble}>
          <Text style={styles.username}>{item.author.username}</Text>
          <Text style={styles.commentText}>{item.content}</Text>

          <Text
            style={styles.replyButton}
            onPress={() => setReplyingTo(item)}
          >
            Reply
          </Text>

          {/* ⭐ NEW — View replies button */}
          {repliesCount > 0 && !isExpanded && (
            <Text
              style={styles.viewRepliesButton}
              onPress={() => toggleReplies(item.id)}
            >
              View replies ({repliesCount})
            </Text>
          )}

          {repliesCount > 0 && isExpanded && (
            <Text
              style={styles.hideRepliesButton}
              onPress={() => toggleReplies(item.id)}
            >
              Hide replies
            </Text>
          )}
        </View>
      </View>

      {/* Replies (shown only if expanded) */}
      {isExpanded && item.replies?.map((r) => (
        <View
            key={r.id}
            style={styles.replyRow}
            onLongPress={() =>
            Alert.alert(
                "Delete reply?",
                "This action cannot be undone.",
                [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteComment(r.id, item.id)
                }
                ]
            )
            }
            >
          <View style={styles.replyAvatar}>
            <Text style={styles.avatarText}>
              {r.author.username[0]?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.replyBubble}>
            <Text style={styles.username}>{r.author.username}</Text>
            <Text style={styles.commentText}>{r.content}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};


 return (
  <View
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end'
    }}
  >
    {/* CLICK OUTSIDE TO CLOSE */}
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.goBack()}
      style={{ flex: 1 }}
    />

    {/* COMMENTS SHEET */}
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        height: '75%',
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingHorizontal: 10
      }}
      pointerEvents="box-none"  // ⭐ IMPORTANT FIX
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, marginRight: 10 }}>←</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
          Comments
        </Text>
      </View>

      {replyingTo && (
        <Text style={styles.replyingToText}>
          Replying to {replyingTo.author.username}
        </Text>
      )}

      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor={colors.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity
          style={[styles.sendButton, sending && { opacity: 0.5 }]}
          onPress={sendComment}
          disabled={sending}
        >
          <Text style={styles.sendText}>{sending ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </View>
);


};

const styles = StyleSheet.create({
  commentRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.text,
    fontWeight: '600',
  },
  contentBubble: {
    marginLeft: 10,
    flex: 1,
    backgroundColor: colors.cardBackground,
    padding: 10,
    borderRadius: 10,
  },
  commentText: {
    color: colors.text,
    marginTop: 2,
  },
  username: {
    fontWeight: '700',
    color: colors.text,
  },
  replyButton: {
    marginTop: 4,
    color: colors.accent,
    fontSize: 12,
  },
  replyRow: {
    flexDirection: 'row',
    marginLeft: 40,
    marginBottom: 10,
  },
  replyAvatar: {
    width: 30,
    height: 30,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyBubble: {
    marginLeft: 8,
    backgroundColor: colors.cardBackground,
    padding: 8,
    borderRadius: 10,
    flex: 1,
  },
  replyingToText: {
    color: colors.accent,
    fontWeight: '600',
    padding: 8,
    marginLeft: 10,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    padding: 10,
    borderRadius: 20,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendText: {
    color: 'white',
    fontWeight: '700',
  },
  viewRepliesButton: {
  color: colors.accent,
  marginTop: 6,
  fontSize: 12,
  fontWeight: '600',
},

hideRepliesButton: {
  color: colors.textSecondary,
  marginTop: 6,
  fontSize: 12,
},

});
