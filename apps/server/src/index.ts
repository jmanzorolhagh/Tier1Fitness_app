import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import { User } from '@tier1fitness_app/types';

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

