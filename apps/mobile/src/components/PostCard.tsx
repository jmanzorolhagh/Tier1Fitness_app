import React from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { Post, PostType } from '@tier1fitness_app/types';
import { styles } from './PostCardStyles';
import { colors } from '../theme/colors';

type PostCardProps = {
  post: Post;
};

// Helper: Get Color & Icon based on Post Type
const getPostTypeDetails = (type: PostType) => {
  switch (type) {
    case PostType.WORKOUT:
      return { label: 'Workout', color: '#3B82F6', icon: 'barbell-outline' }; // Blue
    case PostType.MILESTONE:
      return { label: 'Milestone', color: '#F59E0B', icon: 'trophy-outline' }; // Gold
    case PostType.MOTIVATION:
      return { label: 'Motivation', color: '#8B5CF6', icon: 'flame-outline' }; // Purple
    case PostType.PROGRESS_PHOTO:
      return { label: 'Progress', color: '#10B981', icon: 'camera-outline' }; // Green
    case PostType.CHALLENGE_UPDATE:
      return { label: 'Challenge', color: '#EF4444', icon: 'flash-outline' }; // Red
    default:
      return { label: 'General', color: '#6B7280', icon: 'pricetag-outline' }; // Gray
  }
};

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
  
  const typeDetails = getPostTypeDetails(post.postType);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.profilePicUrl }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{post.author.username}</Text>
          <Text style={styles.timestamp}>{timeAgo}</Text> 
        </View>
        
        <View style={[styles.badge, { backgroundColor: typeDetails.color + '20' }]}> 
          <Ionicons name={typeDetails.icon as any} size={12} color={typeDetails.color} style={{ marginRight: 4 }} />
          <Text style={[styles.badgeText, { color: typeDetails.color }]}>
            {typeDetails.label}
          </Text>
        </View>
      </View>

      {/* Caption is moved ABOVE image for better context reading */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          {post.caption}
        </Text>
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
            size={24}
            color={post.hasLiked ? colors.accent : colors.text}
          />
          <Text style={styles.actionText}>{post.likeCount}</Text>
        </View>
        <View style={styles.actionItem}>
          <Feather name="message-circle" size={24} color={colors.text} />
          <Text style={styles.actionText}>{post.commentCount}</Text>
        </View>
      </View>
    </View>
  );
};