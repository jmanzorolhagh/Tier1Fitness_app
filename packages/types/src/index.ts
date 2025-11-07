export interface User {
  id: string;
  username: string;
  email: string; // Private info
  created: string;
}


export interface PublicUser {
  id: string;
  username: string;
  profilePicUrl: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}


