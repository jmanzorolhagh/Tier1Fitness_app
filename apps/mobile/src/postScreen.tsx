import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './postScreenStyles';

 

const POST_TYPES = ["Workout", "Progress", "Photo"];

export default function CreatePostScreen({ userId }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postType, setPostType] = useState(POST_TYPES[1]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, imageUrl, postType, userId }),
      });
      if (res.ok) {
        
      }
    } catch (e) {
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Post</Text>
      <Text style={styles.label}>What would you like to share?</Text>
      <View style={styles.tabRow}>
        {POST_TYPES.map(type => (
          <TouchableOpacity key={type} onPress={() => setPostType(type)}
            style={[styles.tab, postType === type && styles.tabSelected]}>
            <Text style={postType === type ? styles.tabTextSelected : styles.tabText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Share your workouts or progress!"
        value={caption}
        onChangeText={setCaption}
        multiline
      />
      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste image URL here"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.shareButtonText}>
            <Text style={styles.shareButtonText}>Share Post</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/*

*/