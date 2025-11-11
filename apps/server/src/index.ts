import express, { Request, Response } from 'express';
import cors from 'cors';
import { Post, PostType, PrismaClient } from '@prisma/client';

import { 
  User, 
  Post as ApiPost,
  PostType as ApiPostType,
  PublicUser, 
  LeaderboardEntry, 
  HealthData 
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


    const userToReturn: User = {
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
            const publicAuthor: PublicUser = {
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
        const publicAuthor: PublicUser = {
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

