import React from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Post } from '@tier1fitness_app/types';
import { colors } from '../theme/colors';

type PostCardProps = {
  post: Post;
};

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <Text style={{ color: filled ? colors.accent : colors.text, fontSize: 20 }}>♥</Text>
);


const formatTimeAgo = (isoDate: string) => {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};


export const PostCard = ({ post }: PostCardProps) => {
  const { width } = useWindowDimensions();
  const hasImage = post.imageUrl;

  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.profilePicUrl }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{post.author.username}</Text>
          <Text style={styles.timestamp}>{timeAgo}</Text> 
        </View>
      </View>

      {hasImage && (
        <Image 
          source={{ uri: post.imageUrl }} 
          style={[styles.image, { height: width }]} 
        />
      )}

        <View style={styles.actionBar}>
          <View style={styles.actionItem}>
            <Ionicons
              name={post.hasLiked ? "heart" : "heart-outline"}
              size={22}
              color="black"
            />
            <Text style={styles.actionText}>{post.likeCount}</Text>
          </View>
          <View style={styles.actionItem}>
            <Feather name="message-circle" size={22} color="black" />
            <Text style={styles.actionText}>{post.commentCount}</Text>
          </View>
        </View>

      <View style={styles.captionContainer}>
        <Text style={styles.caption} numberOfLines={3}>
          <Text style={styles.username}>{post.author.username}</Text>
          {' '}{post.caption}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: colors.border, // Placeholder bg
  },
  headerText: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    color: colors.text,
  },
  timestamp: { 
    fontSize: 12,
    color: colors.textSecondary,
  },
  image: {
    width: '100%',
    backgroundColor: colors.border, 
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    marginLeft: 6,
    fontWeight: '600',
    color: colors.text,
  },
  captionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  caption: {
    lineHeight: 18,
    color: colors.text,
  }
});