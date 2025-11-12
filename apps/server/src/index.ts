import express, { Request, Response } from 'express';
import cors from 'cors';
import { Post, PostType, PrismaClient } from '@prisma/client';

import { 
  User as ApiUser, 
  Post as ApiPost,
  PostType as ApiPostType,
  PublicUser as ApiPublicUser, 
  LeaderboardEntry as ApiLeaderboardEntry, 
  HealthData as ApiHealthData,
  UserProfile as ApiUserProfile
} from '@tier1fitness_app/types';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Tier1Fitness API is running!' });
});

app.post('/api/users/create', async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Email, username, and password are required.' });
        }

        const existingUser = await prisma.user.findFirst({ 
        where: { OR: [{ email }, { username }] }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists.' });
        }
        const defaultProfilePic = `https://placehold.co/100x100/E2E2E2/000000?text=${username[0] || 'U'}`;
        
        const newUser = await prisma.user.create({
        data: {
            email,
            username,
            passwordHash: password, // Storing plain text password
            profilePicUrl: defaultProfilePic,
        }
    });


    const userToReturn: ApiUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      created: newUser.createdAt.toISOString()
    };

    res.status(201).json(userToReturn);

}
catch (error) {
    console.error('User creation failed:', error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
}
    
});

app.get('/api/posts', async (req: Request, res: Response) => {
    try{
        const postsFromDb = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
            author: true,
            }
        });
        const postsToSend: ApiPost[] = postsFromDb.map(post => {
            const publicAuthor: ApiPublicUser = {
                id: post.author.id,
                username: post.author.username,
                profilePicUrl: post.author.profilePicUrl
            };

            return {
                id: post.id,
                caption: post.caption,
                imageUrl: post.imageUrl || undefined,
                postType: post.postType as ApiPostType,
                createdAt: post.createdAt.toISOString(),
                author: publicAuthor,

                likeCount: Math.floor(Math.random() * 50),
                commentCount: Math.floor(Math.random() * 10),
                hasLiked: Math.random() > 0.5
            };
        });
        
    res.json(postsToSend);


    }
    catch(error){
        console.error('Failed to get postss:', error);
        res.status(500).json({ error: 'An error occurred while retrieving posts.' });
    }
});

app.post('/api/posts', async (req: Request, res: Response) => {
    try {
        const { caption, imageUrl, postType, userId } = req.body;
        if (!caption || !postType || !userId) {
            return res.status(400).json({ error: 'Caption, postType, and userId are required.' });
        }
        const newPost = await prisma.post.create({
            data: {
                caption,
                imageUrl,
                postType,
                authorId: userId,
            },
            include: { author: true }
            });
        const publicAuthor: ApiPublicUser = {
            id: newPost.author.id,
            username: newPost.author.username,
            profilePicUrl: newPost.author.profilePicUrl
        };
        const postToSend: ApiPost = {
            id: newPost.id,
            caption: newPost.caption,
            imageUrl: newPost.imageUrl || undefined,
            postType: newPost.postType as ApiPostType,
            createdAt: newPost.createdAt.toISOString(),
            author: publicAuthor,

            likeCount: 0,
            commentCount: 0,
            hasLiked: false
        };
        res.status(201).json(postToSend);

    }
    catch(error){
        console.error('Failed to get posts:', error);
        res.status(500).json({error: "An error occured creating the post."});
    }
});

app.post('/api/healthdata', async (req: Request, res: Response) => {
    try{
        const { userId, steps, calories } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required.' });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const healthData = await prisma.healthData.upsert({
            where: {
                userId_date: {
                userId: userId,
                date: today
                }
            },
            
            create: {
                userId: userId,
                date: today,
                dailySteps: steps || 0,
                dailyCalories: calories || 0,
                totalWorkouts: 0 
            },
            
            update: {
                dailySteps: steps,
                dailyCalories: calories
            }
            });

        res.json(healthData);
    }
    catch(error){
        console.error('Failed to save health data:', error);
        res.status(500).json({error: "An error occured saving health data."});
    }
    });
app.get('/api/leaderboard', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const healthDataEntries = await prisma.healthData.findMany({
      where: { date: today },
      orderBy: { dailySteps: 'desc' },
      take: 10,
      include: { user: true } 
    });

    const leaderboard: ApiLeaderboardEntry[] = healthDataEntries.map((entry, index) => {
      const publicUser: ApiPublicUser = {
        id: entry.user.id,
        username: entry.user.username,
        profilePicUrl: entry.user.profilePicUrl
      };

      return {
        rank: index + 1,
        user: publicUser,
        score: entry.dailySteps,
      };
    });

    res.json(leaderboard);

  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    res.status(500).json({error: "An error occured getting the leaderboard."});
  }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const userFromDb = await prisma.user.findUnique({
            where: { id },
            include: {
                posts: {
                orderBy: { createdAt: 'desc' },
                take: 5, 
                include: { author: true } 
                },
            }
        });
        if (!userFromDb) {
            return res.status(404).json({ error: 'User not found' });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const healthDataFromDb = await prisma.healthData.findFirst({
        where: {
            userId: id,
            date: today
        },
        include: { user: true }
        });
        const followerCount = Math.floor(Math.random() * 500); 
        const followingCount = Math.floor(Math.random() * 200); 


        let healthStatsToSend: ApiHealthData;
        if (healthDataFromDb) {
            healthStatsToSend = {
                dataID: healthDataFromDb.id,
                user: {
                id: userFromDb.id,
                username: userFromDb.username,
                profilePicUrl: userFromDb.profilePicUrl
                },
                date: healthDataFromDb.date.toISOString(),
                dailySteps: healthDataFromDb.dailySteps,
                dailyCalories: healthDataFromDb.dailyCalories,
                totalWorkouts: healthDataFromDb.totalWorkouts
            };
        } 
        else {
            healthStatsToSend = {
                dataID: 'temp-id',
                user: { id: userFromDb.id, username: userFromDb.username, profilePicUrl: userFromDb.profilePicUrl },
                date: today.toISOString(),
                dailySteps: 0,
                dailyCalories: 0,
                totalWorkouts: 0
            };
        }

        // Translate Posts
        const postsToSend: ApiPost[] = userFromDb.posts.map(post => {
        const publicAuthor: ApiPublicUser = {
            id: post.author.id,
            username: post.author.username,
            profilePicUrl: post.author.profilePicUrl
        };
        return {
            id: post.id,
            caption: post.caption,
            imageUrl: post.imageUrl || undefined,
            postType: post.postType as ApiPostType, // Cast Prisma type to API type
            createdAt: post.createdAt.toISOString(),
            author: publicAuthor,
            likeCount: Math.floor(Math.random() * 50),
            commentCount: Math.floor(Math.random() * 10),
            hasLiked: Math.random() > 0.5,
        };
        });

        // --- 5. Build the Final UserProfile Object ---
        const profileToSend: ApiUserProfile = {
        id: userFromDb.id,
        username: userFromDb.username,
        bio: userFromDb.bio || undefined,
        joinedDate: userFromDb.createdAt.toISOString(),
        profilePicUrl: userFromDb.profilePicUrl,
        followerCount: followerCount,
        followingCount: followingCount,
        posts: postsToSend,
        healthStats: healthStatsToSend
        };

        res.json(profileToSend);
    }
    catch(error){
        console.error('Failed to get user profile:', error);
        res.status(500).json({error: "An error occured getting the user profile."});

    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

