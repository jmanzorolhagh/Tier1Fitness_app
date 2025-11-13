import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import styles from './communityFeedStyle';

const API_URL = 'http://192.168.1.100:3000/api/posts';

export default function CommunityFeedScreen({ route }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = useCallback(async () => {
        if (!refreshing) setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, route?.params?.refreshFeed]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    const renderPost = ({ item }) => {
    const timeAgo = (() => {
        const diff = (Date.now() - new Date(item.createdAt)) / 1000;
        if (diff < 60) return `${Math.floor(diff)}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    })();

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
            <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{item.author?.username?.[0] || '?'}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.author?.username || 'Unknown'}</Text>
                <Text style={styles.timestamp}>{timeAgo}</Text>
            </View>
            </View>

            <View style={styles.postImagePlaceholder}>
            <Text style={styles.placeholderIcon}>❤️‍🔥</Text>
            </View>

            <Text style={styles.postText}>{item.caption}</Text>
        </View>
        );
    };

    if (loading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text>Loading feed...</Text>
        </View>
        );
    }

    return (
        <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.feedContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No posts yet.</Text>}
        />
    );
    }
