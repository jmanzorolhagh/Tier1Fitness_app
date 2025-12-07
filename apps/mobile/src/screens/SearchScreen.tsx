import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
// 1. Import SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import api from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';

// ... (keep useDebounce helper the same) ...
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const SearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // No need for 'const insets = useSafeAreaInsets()' anymore

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500); 

  useEffect(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery]);

  const searchUsers = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<any[]>(`/users/search?q=${encodeURIComponent(searchTerm)}`);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.userRow}
      onPress={() => navigation.push('Profile', { userId: item.id })}
    >
      <Image source={{ uri: item.profilePicUrl }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.stats}>{item._count?.followers || 0} followers</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    // 2. Use SafeAreaView wrapper
    // 'edges' prop ensures we only add padding to the top (Status Bar)
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Search users..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus={true}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            query.length >= 2 ? (
              <Text style={styles.emptyText}>No users found.</Text>
            ) : (
              <View style={styles.center}>
                <Ionicons name="people-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5 }} />
                <Text style={styles.instructionText}>   Type to find friends!    </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    height: 40, 
  },
  cancelText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: { paddingVertical: 10 },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: '#333' },
  userInfo: { flex: 1 },
  username: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
  stats: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 20 },
  instructionText: { color: colors.textSecondary, marginTop: 10, fontSize: 14 },
});