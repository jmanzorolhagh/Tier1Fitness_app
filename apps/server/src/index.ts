import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import { User } from '@tier1fitness_app/types';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());