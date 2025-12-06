import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, PostType as PrismaPostType } from '@prisma/client';

// Shared types
import { 
  User as ApiUser, 
  Post as ApiPost,
  PostType as ApiPostType,
  PublicUser as ApiPublicUser, 
  LeaderboardEntry as ApiLeaderboardEntry, 
  HealthData as ApiHealthData,
  UserProfile as ApiUserProfile,
} from '@tier1fitness_app/types';

const prisma = new PrismaClient();
const app = express();

function formatComment(c: any) {
  return {
    id: c.id,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    author: {
      id: c.author.id,
      username: c.author.username,
      profilePicUrl: c.author.profilePicUrl
    },
    replies: c.replies?.map((r: any) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      author: {
        id: r.author.id,
        username: r.author.username,
        profilePicUrl: r.author.profilePicUrl
      }
    })) ?? []
  };
}


app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); 
});

// --- ROUTES ---

// Health Check
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Tier1Fitness API is running!' });
});

// 1. Login User (Simple Version)
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.passwordHash !== password) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const userToReturn: ApiUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      created: user.createdAt.toISOString()
    };

    console.log(`User logged in: ${user.username}`);
    res.json(userToReturn);

  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Login error" });
  }
});

// 2. Create User (Sign Up)
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
      return res.status(409).json({ error: 'User with this email or username already exists.' });
    }
    
    const defaultProfilePic = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
    
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: password, 
        profilePicUrl: defaultProfilePic,
      }
    });

    const userToReturn: ApiUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      created: newUser.createdAt.toISOString()
    };
    
    console.log(`User created: ${newUser.username}`);
    res.status(201).json(userToReturn);
  } catch (error) {
    console.error('User creation failed:', error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
});

// 3. Get User Profile
app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userFromDb = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { 
          select: { followers: true, following: true }
        }
      }
    });

    if (!userFromDb) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const healthData = await prisma.healthData.findFirst({
      where: {
        userId: id,
        date: { gte: today, lt: tomorrow }
      }
    });

    const healthStatsToSend: ApiHealthData = {
      dataID: healthData?.id || 'temp-id',
      user: {
        id: userFromDb.id,
        username: userFromDb.username,
        profilePicUrl: userFromDb.profilePicUrl
      },
      date: (healthData?.date || today).toISOString(),
      dailySteps: healthData?.dailySteps || 0,
      dailyCalories: healthData?.dailyCalories || 0,
      totalWorkouts: healthData?.totalWorkouts || 0,
    };
    
    const postsToSend: ApiPost[] = userFromDb.posts.map(post => {
      const author: ApiPublicUser = {
        id: userFromDb.id,
        username: userFromDb.username,
        profilePicUrl: userFromDb.profilePicUrl
      };
      return {
        id: post.id,
        caption: post.caption,
        imageUrl: post.imageUrl || undefined,
        postType: post.postType as ApiPostType,
        createdAt: post.createdAt.toISOString(),
        author: author,
        likeCount: 0, 
        commentCount: 0, 
        hasLiked: false 
      };
    });
    
    const profile: ApiUserProfile = {
      id: userFromDb.id,
      username: userFromDb.username,
      bio: userFromDb.bio || undefined,
      joinedDate: userFromDb.createdAt.toISOString(),
      profilePicUrl: userFromDb.profilePicUrl,
      followerCount: userFromDb._count.followers,
      followingCount: userFromDb._count.following,
      posts: postsToSend,
      healthStats: healthStatsToSend
    };
    
    res.json(profile);
    
  } catch (error) {
    console.error(`Failed to get user ${req.params.id}:`, error);
    res.status(500).json({ error: 'An error occurred while retrieving the user profile.' });
  }
});

// 4. Get All Posts

app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const currentUserId = typeof userId === 'string' ? userId : undefined;

    const postsFromDb = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        _count: { select: { likes: true, comments: true } },
        likes: currentUserId
          ? {
              where: { userId: currentUserId }
            }
          : false
      }
    });

    const postsToSend: ApiPost[] = postsFromDb.map((post) => ({
      id: post.id,
      caption: post.caption,
      imageUrl: post.imageUrl ?? undefined, // prisma: string | null → API: string | undefined
      postType: post.postType as ApiPostType,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id,
        username: post.author.username,
        profilePicUrl: post.author.profilePicUrl
      },
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      hasLiked: Array.isArray(post.likes) && post.likes.length > 0
    }));

    res.json(postsToSend);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});



// 5. Create Post
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
  } catch (error: any) {
    console.error('Failed to create post:', error);
    if (error.code === 'P2003') {
       return res.status(404).json({ error: 'User ID not found in database.' });
    }
    res.status(500).json({error: "An error occured creating the post."});
  }
});

// 6. Submit Health Data
app.post('/api/healthdata', async (req: Request, res: Response) => {
  try {
    const { userId, steps, calories } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required.' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const healthData = await prisma.healthData.upsert({
      where: { userId_date: { userId: userId, date: today } },
      update: { dailySteps: steps, dailyCalories: calories },
      create: {
        userId: userId,
        date: today,
        dailySteps: steps || 0,
        dailyCalories: calories || 0,
        totalWorkouts: 0 
      }
    });

    res.json(healthData);
  } catch (error) {
    console.error('Failed to save health data:', error);
    res.status(500).json({error: "An error occured saving health data."});
  }
});

// 7. Get Leaderboard
app.get('/api/leaderboard', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const healthDataEntries = await prisma.healthData.findMany({
      where: { date: { gte: today, lt: tomorrow } },
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

// --- 8. CHALLENGES (UPDATED) ---

// Get Active Challenges
app.get('/api/challenges', async (req: Request, res: Response) => {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { isPublic: true },
      include: {
        creator: true,
        participants: true,
      },
      orderBy: { startDate: 'desc' }
    });

    const response = challenges.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      participantCount: c.participants.length,
      participantIds: c.participants.map(p => p.userId), 
      goalType: c.goalType,
      goalValue: c.goalValue,
      // -------------------------
      creator: {
        id: c.creator.id,
        username: c.creator.username,
        profilePicUrl: c.creator.profilePicUrl
      }
    }));

    res.json(response);
  } catch (error) {
    console.error('Failed to get challenges:', error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

// Create Challenge
app.post('/api/challenges', async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate, creatorId, goalType, goalValue } = req.body;

    if (!title || !creatorId) {
      return res.status(400).json({ error: "Title and Creator ID required" });
    }

    const newChallenge = await prisma.challenge.create({
      data: {
        title,
        description: description || "",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        creatorId,
        isPublic: true,
        // --- NEW FIELDS SAVED ---
        goalType: goalType || "STEPS",
        goalValue: goalValue || 10000,
        // -------------------------
      }
    });

    // Auto-join the creator
    await prisma.challengeParticipant.create({
      data: {
        userId: creatorId,
        challengeId: newChallenge.id
      }
    });

    console.log(`Challenge created: ${title}`);
    res.status(201).json(newChallenge);
  } catch (error) {
    console.error('Failed to create challenge:', error);
    res.status(500).json({ error: "Failed to create challenge" });
  }
});

// Join Challenge
app.post('/api/challenges/join', async (req: Request, res: Response) => {
  try {
    const { userId, challengeId } = req.body;

    // Check if already joined
    const existing = await prisma.challengeParticipant.findUnique({
      where: {
        userId_challengeId: { userId, challengeId }
      }
    });

    if (existing) {
      return res.status(400).json({ error: "Already joined this challenge" });
    }

    await prisma.challengeParticipant.create({
      data: { userId, challengeId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to join challenge:', error);
    res.status(500).json({ error: "Failed to join" });
  }
});
app.post('/api/posts/like', async (req: Request, res: Response) => {
  try {
    const { userId, postId } = req.body;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: { userId, postId }
        }
      });
    } else {
      await prisma.like.create({
        data: { userId, postId }
      });
    }

    const newCount = await prisma.like.count({
      where: { postId }
    });

    res.json({ 
      liked: !existingLike, 
      newCount 
    });

  } catch (error) {
    console.error('Failed to toggle like:', error);
    res.status(500).json({ error: "Failed to like post" });
  }
});
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});

// ✅ Get all posts from one user
app.get('/api/users/:userId/posts', async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        comments: true,
        likes: true,
      }
    });

    res.json(posts);

  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    res.status(500).json({ error: "Failed to load user posts" });
  }
});


app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        author: true,
        replies: {
          include: { author: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    const formatted = comments.map(formatComment);
    res.json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load comments" });
  }
});

// Create top-level comment
app.post('/api/posts/:postId/comments', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;

    const newComment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: userId,
        postId,
        parentId: null
      },
      include: { author: true }
    });

    await prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } }
    });


    res.json(formatComment({ ...newComment, replies: [] }));

  } catch (error) {
    console.error("Failed to create comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Reply to an existing comment
app.post('/api/comments/:commentId/reply', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const parent = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!parent) {
      return res.status(404).json({ error: "Parent comment not found" });
    }

    const reply = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: userId,
        postId: parent.postId,
        parentId: commentId
      },
      include: { author: true }
    });

    await prisma.post.update({
      where: { id: parent.postId },
      data: { commentCount: { increment: 1 } }
    });


    res.json({
      id: reply.id,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      author: {
        id: reply.author.id,
        username: reply.author.username,
        profilePicUrl: reply.author.profilePicUrl
      }
    });

  } catch (error) {
    console.error("Failed to post reply:", error);
    res.status(500).json({ error: "Failed to reply" });
  }
});

// Delete a comment
app.delete('/api/comments/:commentId', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await prisma.post.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 } }
    });

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ success: true, deletedId: commentId });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});
