import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_USER_ID = "cmhw533h40000v2pk92qrjsfe";

async function main() {
  console.log('Starting database seed...');

  const demoUser = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {}, // If user exists, do nothing
    create: {
      id: DEMO_USER_ID,
      username: 'DemoUser',
      email: 'demo@tier1fitness.com',
      passwordHash: 'password123', 
      profilePicUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff&size=128',
      bio: 'I am the hardcoded demo user for testing!',
    },
  });

  console.log(`Demo User ensured: ${demoUser.username} (${demoUser.id})`);

  // 2. Create a Dummy Post
  await prisma.post.create({
    data: {
      caption: 'First post from the cloud! ☁️🚀',
      postType: 'MOTIVATION',
      authorId: DEMO_USER_ID,
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    }
  });

  console.log('Dummy post created');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });