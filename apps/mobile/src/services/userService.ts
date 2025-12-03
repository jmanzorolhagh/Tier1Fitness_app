import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@tier1fitness_app/types';

const USER_KEY = 'tier1_current_user';

export const UserService = {
  saveUser: async (user: User) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: async (): Promise<User | null> => {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearUser: async () => {
    await AsyncStorage.removeItem(USER_KEY);
  }
};