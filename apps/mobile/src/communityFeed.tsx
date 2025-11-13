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

const API_URL = 'http://localhost:3000/api/posts';
export default function CommunityFeedScreen({ route }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, route?.params?.refreshFeed]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    const renderPost = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.authorRow}>
                <Image source={{ uri: item.author.profilePicUrl }} style={styles.avatar} />
                <View>
                    <Text style={styles.username}>{item.author.username}</Text>
                    <Text style={styles.postSubtitle}>
                        {item.postType} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
            {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            ) : (
                <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderIcon}>📷</Text>
                </View>
            )}

            <Text style={styles.caption}>{item.caption}</Text>
        </View>
    );

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
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.feedContainer}
        />
    );
}
