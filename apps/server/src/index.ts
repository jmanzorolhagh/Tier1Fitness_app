import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { 
  User as ApiUser, 
  Post as ApiPost,
  PostType as ApiPostType,
  PublicUser as ApiPublicUser, 
  LeaderboardEntry as ApiLeaderboardEntry, 
} from '@tier1fitness_app/types';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); 
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Tier1Fitness API is running!' });
});

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

app.get('/api/users/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive', 
        },
      },
      take: 20, 
      select: {
        id: true,
        username: true,
        profilePicUrl: true,
        _count: { select: { followers: true } }
      },
      orderBy: {
        followers: { _count: 'desc' } 
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ error: "Search failed" });
  }
});

app.post('/api/users/follow', async (req: Request, res: Response) => {
  try {
    const { followerId, followingId } = req.body;

    if (followerId === followingId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId }
      }
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } }
      });
    } else {
      await prisma.follow.create({
        data: { followerId, followingId }
      });
    }

    res.json({ isFollowing: !existingFollow });

  } catch (error) {
    console.error('Failed to toggle follow:', error);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requesterId = req.query.requesterId as string;

    const userFromDb = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            _count: { select: { likes: true, comments: true } },
            likes: requesterId ? { where: { userId: requesterId } } : false
          }
        },
        _count: { 
          select: { followers: true, following: true }
        }
      }
    });

    if (!userFromDb) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const badges: any[] = [];
    if (userFromDb.posts.length > 0) badges.push({ label: 'Socialite', icon: 'camera', color: '#8B5CF6' });
    
    const challengeCount = await prisma.challengeParticipant.count({ where: { userId: id } });
    if (challengeCount > 0) badges.push({ label: 'Challenger', icon: 'trophy', color: '#F59E0B' });

    const hit10k = await prisma.healthData.findFirst({ where: { userId: id, dailySteps: { gte: 10000 } } });
    if (hit10k) badges.push({ label: '10k Club', icon: 'ribbon', color: '#10B981' });

    const postsToSend = userFromDb.posts.map(post => {
        const isLiked = post.likes ? post.likes.length > 0 : false;
        
        return {
            id: post.id,
            caption: post.caption,
            imageUrl: post.imageUrl || undefined,
            postType: post.postType,
            createdAt: post.createdAt.toISOString(),
            author: {
                id: userFromDb.id,
                username: userFromDb.username,
                profilePicUrl: userFromDb.profilePicUrl
            },
            likeCount: post._count.likes,
            commentCount: post._count.comments,
            hasLiked: isLiked
        };
    });

    let isFollowing = false;
    if (requesterId) {
      const followRecord = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: requesterId, followingId: id } }
      });
      isFollowing = !!followRecord;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const healthData = await prisma.healthData.findFirst({
      where: { userId: id, date: { gte: today, lt: tomorrow } }
    });

    const healthStatsToSend = {
      dailySteps: healthData?.dailySteps || 0,
      dailyCalories: healthData?.dailyCalories || 0,
    };
    
    const profile = {
      id: userFromDb.id,
      username: userFromDb.username,
      bio: userFromDb.bio || undefined,
      profilePicUrl: userFromDb.profilePicUrl,
      followerCount: userFromDb._count.followers,
      followingCount: userFromDb._count.following,
      posts: postsToSend, 
      healthStats: healthStatsToSend,
      isFollowing,
      badges
    };
    
    res.json(profile);
    
  } catch (error) {
    console.error(`Failed to get user ${req.params.id}:`, error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.get('/api/users/:userId/history', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const history = await prisma.healthData.findMany({
      where: {
        userId: userId,
        date: { gte: sevenDaysAgo }
      },
      orderBy: { date: 'asc' },
      select: { date: true, dailySteps: true }
    });

    const formatted = history.map(entry => ({
      label: entry.date.toLocaleDateString('en-US', { weekday: 'short' }), 
      steps: entry.dailySteps
    }));

    res.json(formatted);
  } catch (error) {
    console.error('History fetch failed:', error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.get('/api/users/:userId/followers', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      select: {
        follower: {
          select: { id: true, username: true, profilePicUrl: true }
        }
      }
    });

    const followerList = followers.map(f => f.follower);
    res.json(followerList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve followers' });
  }
});

app.get('/api/users/:userId/following', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: {
        following: {
          select: { id: true, username: true, profilePicUrl: true }
        }
      }
    });

    const followingList = following.map(f => f.following);
    res.json(followingList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve following list' });
  }
});

app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const currentUserId = req.query.userId as string;

    const postsFromDb = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true, 
        _count: { select: { likes: true, comments: true } },
        likes: currentUserId ? {
          where: { userId: currentUserId }
        } : false
      }
    });

    const postsToSend: ApiPost[] = postsFromDb.map(post => {
      const publicAuthor: ApiPublicUser = {
        id: post.author.id,
        username: post.author.username,
        profilePicUrl: post.author.profilePicUrl
      };

      const userHasLiked = post.likes ? post.likes.length > 0 : false;

      return {
        id: post.id,
        caption: post.caption,
        imageUrl: post.imageUrl || undefined,
        postType: post.postType as ApiPostType, 
        createdAt: post.createdAt.toISOString(),
        author: publicAuthor,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        hasLiked: userHasLiked 
      };
    });
    
    res.json(postsToSend);
  } catch (error) {
    console.error('Failed to get posts:', error);
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
  } catch (error: any) {
    console.error('Failed to create post:', error);
    if (error.code === 'P2003') {
       return res.status(404).json({ error: 'User ID not found in database.' });
    }
    res.status(500).json({error: "An error occured creating the post."});
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

app.get('/api/posts/:postId/comments', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, username: true, profilePicUrl: true }
        }
      }
    });

    const commentsToSend = comments.map(comment => ({
      id: comment.id,
      text: comment.content, 
      createdAt: comment.createdAt.toISOString(),
      author: {
        id: comment.author.id,
        username: comment.author.username,
        profilePicUrl: comment.author.profilePicUrl
      }
    }));

    res.json(commentsToSend);

  } catch (error) {
    console.error(`Failed to get comments for post ${req.params.postId}:`, error);
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
});

app.post('/api/posts/:postId/comments', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { authorId, text } = req.body;

    if (!authorId || !text) {
      return res.status(400).json({ error: "Missing authorId or text" });
    }

    const newComment = await prisma.comment.create({
      data: {
        postId,
        authorId,
        content: text 
      },
      include: {
        author: {
          select: { id: true, username: true, profilePicUrl: true }
        }
      }
    });

    const commentToSend = {
      id: newComment.id,
      text: newComment.content,
      createdAt: newComment.createdAt.toISOString(),
      author: {
        id: newComment.author.id,
        username: newComment.author.username,
        profilePicUrl: newComment.author.profilePicUrl
      }
    };

    res.status(201).json(commentToSend);

  } catch (error) {
    console.error(`Failed to create comment for post ${req.params.postId}:`, error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

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

    const challengesWithProgress = await Promise.all(challenges.map(async (c) => {
      const aggregate = await prisma.healthData.aggregate({
        _sum: {
          dailySteps: true,
          dailyCalories: true
        },
        where: {
          userId: { in: c.participants.map(p => p.userId) }, 
          date: { gte: c.startDate, lte: c.endDate }        
        }
      });

      const currentSteps = aggregate._sum.dailySteps || 0;
      const currentCalories = aggregate._sum.dailyCalories || 0;
      
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        startDate: c.startDate.toISOString(),
        endDate: c.endDate.toISOString(),
        participantCount: c.participants.length,
        participantIds: c.participants.map(p => p.userId),
        goalType: c.goalType,
        goalValue: c.goalValue,
        currentProgress: c.goalType === 'STEPS' ? currentSteps : currentCalories,
        creator: {
          id: c.creator.id,
          username: c.creator.username,
          profilePicUrl: c.creator.profilePicUrl
        }
      };
    }));

    res.json(challengesWithProgress);
  } catch (error) {
    console.error('Failed to get challenges:', error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

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
        goalType: goalType || "STEPS",
        goalValue: goalValue || 10000,
      }
    });

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

app.post('/api/challenges/join', async (req: Request, res: Response) => {
  try {
    const { userId, challengeId } = req.body;

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

app.get('/api/challenges/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: { creator: true }
    });

    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    const participants = await prisma.challengeParticipant.findMany({
      where: { challengeId: id },
      include: { 
        user: { 
          select: { id: true, username: true, profilePicUrl: true } 
        } 
      }
    });

    const leaderboardWithStats = await Promise.all(participants.map(async (p) => {
      const stats = await prisma.healthData.aggregate({
        _sum: {
          dailySteps: true,
          dailyCalories: true
        },
        where: {
          userId: p.userId,
          date: {
            gte: challenge.startDate,
            lte: challenge.endDate
          }
        }
      });

      return {
        userId: p.userId,
        username: p.user.username,
        profilePicUrl: p.user.profilePicUrl,
        totalSteps: stats._sum.dailySteps || 0,
        totalCalories: stats._sum.dailyCalories || 0,
      };
    }));

    const groupTotalSteps = leaderboardWithStats.reduce((sum, p) => sum + p.totalSteps, 0);
    const groupTotalCalories = leaderboardWithStats.reduce((sum, p) => sum + p.totalCalories, 0);

    res.json({
      ...challenge,
      participants: leaderboardWithStats.sort((a, b) => {
        if (challenge.goalType === 'CALORIES') return b.totalCalories - a.totalCalories;
        return b.totalSteps - a.totalSteps;
      }),
      groupProgress: {
        steps: groupTotalSteps,
        calories: groupTotalCalories
      }
    });

  } catch (error) {
    console.error('Failed to get challenge details:', error);
    res.status(500).json({ error: "Failed to fetch challenge details" });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});