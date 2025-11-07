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


export enum PostType {
  WORKOUT = "WORKOUT",
  MILESTONE = "MILESTONE",
  MOTIVATION = "MOTIVATION",
  PROGRESS_PHOTO = "PROGRESS_PHOTO",
  CHALLENGE_UPDATE = "CHALLENGE_UPDATE"
}


export interface Comment {
  id: string;
  author: PublicUser; 
  content: string;
  createdAt: string;
}


export interface Post {
  id: string;
  caption: string;
  imageUrl?: string; 
  postType: PostType;
  createdAt: string;
  author: PublicUser;
  
  likeCount: number;
  commentCount: number;
  

  hasLiked: boolean; 
}


export interface UserProfile {

  id: string;
  username: string;
  bio?: string;
  joinedDate: string;
  profilePicUrl: string;


  followerCount: number;
  followingCount: number;

 
  posts: Post[]; 

  healthStats: HealthData; 
}


export interface HealthData {
  dataID: string;
  user: PublicUser; 
  date: string;
  dailySteps: number;
  dailyCalories: number;
  totalWorkouts: number;
}


export interface Challenge {
  id: string;
  title: string;
  description: string;
  creator: PublicUser; 
  startDate: string;
  endDate: string;
  participantCount: number;
}


export interface ChallengeParticipant {
  user: PublicUser; 
  progress: 'completed' | 'in progress';
}


export interface ChallengeDetails extends Challenge {
  isPublic: boolean;
  participants: ChallengeParticipant[];
}


export interface LeaderboardEntry {
  rank: number;
  user: PublicUser; 
  score: number;
  weeklyStreak?: number;
}