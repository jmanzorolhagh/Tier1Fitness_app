Tier1Fitness App
A social fitness community platform, built with React Native (Expo) and a Node.js (Express/Prisma) backend.

Project Structure
This is a monorepo managed by npm workspaces.

apps/mobile: The React Native (Expo) mobile application.

apps/server: The Node.js backend server. It uses Express, Prisma, and PostgreSQL.

packages/types: Our shared "API Contract." This library holds all the TypeScript interfaces (DTOs) used by both the server and the mobile app.

Local Development Setup
Follow these steps to get the project running on your local machine.

1. Prerequisites
Before you begin, make sure you have:

Node.js (v20 or higher)

Git

PostgreSQL: A local Postgres server. 

2. Clone & Install
First, clone the repo and install all dependencies from the root.

```bash

# Clone the repository
git clone https://github.com/YOUR_USERNAME/Tier1Fitness_app.git

# Navigate into the project root
cd Tier1Fitness_app

# Install all dependencies for all workspaces (server, mobile, etc.)
npm install

```
3. Set Up the Database
You must have a local PostgreSQL server running.

Open your database tool (DBngin, TablePlus, etc.).

Create a new, empty database named tier1fitness_dev.

4. Configure the Server Environment
The server needs to know how to connect to your new database.

Navigate to the server directory:

```bash

cd apps/server
```
Create a .env file by copying the example:

```bash

cp .env.example .env
```
Open the new .env file and update the DATABASE_URL to point to your local database. (If you're using DBngin on its default port 5432 with no password, it will look like this):

```javascript

# .env.example

DATABASE_URL="postgresql://postgres@localhost:5432/tier1fitness_dev"
```
5. Run Database Migrations
This is the final setup step. This command reads the prisma/schema.prisma file and builds all the tables in your database.

```bash

# From the apps/server directory
npm run db:migrate
```
Running the Project
You'll need two terminals open.

Terminal 1: Run the Backend
```bash

# From the project root
npm run dev --workspace=apps/server
```
This will start the Node.js server.

When we have the mobile app ready:

Terminal 2: Run the Mobile App
```bash

# From the project root
npm start --workspace=apps/mobile
```
This will start the Expo bundler for the mobile app.

Useful Database Command
To view or edit your local database, run this from the apps/server directory:

npm run db:studio