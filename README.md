# Tier1Fitness: Social Activity & Challenge Tracker 
<img width="276" height="276" alt="image" src="https://github.com/user-attachments/assets/c166e12d-6a3d-402c-b1a6-12c30e0237f3" /> 

![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---
1. [Project Overview](#project-overview)  
2. [Key Features](#key-features)
3. [User Guide](#user-guide)
4. [Quick Deployment Instructions (Expo + Cloud Backend)](#quick-deployment-instructions-expo--cloud-backend)  
5. [Local-Only Setup Instructions](#local-only-setup-instructions)
6. [Database](#database)
7. [Endpoints](#endpoints)
8. [Technology Stack](#technology-stack)  
9. [Cloud Infrastructure & Workflow](#cloud-infrastructure--workflow)  
   - [Database Layer (Supabase)](#1-database-layer-supabase)  
   - [Backend Deployment (Render)](#2-backend-deployment-render)    
10. [The Team](#the-team)
---
### **IMPORTANT: Server "Cold Start" Delay**
- The backend for this project is hosted on Render's Free Tier. This service automatically "spins down" after 15 minutes of inactivity to save resources.
**When you first open the app, it may take 50–60 seconds for the server to wake up.**
- Please be patient during the first Login or Signup attempt. Once the server is active, the app will function at normal speed.
---
### App Screenshots

| Login | Login | Home Feed | Comment Feed |
|:---:|:---:|:---:|:---:|
 | <img src="https://github.com/user-attachments/assets/66545d1d-d780-44c2-8f9a-b9136268dcce" width="200" /> | <img src="https://github.com/user-attachments/assets/68f462f9-2077-4510-ad41-c0909c7e01aa" width="200" /> | <img src="https://github.com/user-attachments/assets/ffd3a02f-112c-4e9d-874c-08d3e752b486" width="200" /> | <img src="https://github.com/user-attachments/assets/35f20013-b5d8-4fc3-96b9-4c7505639145" width="200" /> |
| **Search** | **Search Results** | **Challenge** | **Challenge Details** |
| <img src="https://github.com/user-attachments/assets/9c6418e8-fa56-43cf-8876-f22a0d4b3675" width="200" /> | <img src="https://github.com/user-attachments/assets/989af0e9-a2c1-4540-99a7-85c16d386cc3" width="200" /> | <img src="https://github.com/user-attachments/assets/6080c0fa-ec17-4e1c-be2c-bebe0bb297d3" width="200" /> | <img src="https://github.com/user-attachments/assets/7bf9bb8e-533b-4090-9e6e-0876b88c4a2c" width="200" /> |
| **Create Post** | **Create Challenge** | **Progress** | **Leaderboard** |
| <img src="https://github.com/user-attachments/assets/4c1fe9fa-b72a-4aea-95f2-8c4edac49cd8" width="200" /> | <img src="https://github.com/user-attachments/assets/5540dbe8-1aeb-45d0-add5-b858aa3309dc" width="200" /> | <img src="https://github.com/user-attachments/assets/2438e5ac-406e-4cd6-b24f-2a107bc274b2" width="200" /> | <img src="https://github.com/user-attachments/assets/18e8a2d4-6ab0-42a1-a90d-825d895f938e" width="200" /> |
| **Followers** | **Incomplete Challenge** | **Personal Profile** | **External Profile** |
| <img src="https://github.com/user-attachments/assets/6f5047e9-2f57-4b80-af6b-cdf16217e26b" width="200" /> | <img src="https://github.com/user-attachments/assets/880657fb-2509-4f6e-a7e1-0d6bd014c114" width="200" /> | <img src="https://github.com/user-attachments/assets/f0b07dad-7d35-4753-8990-b5e9092dae30" width="200" /> | <img src="https://github.com/user-attachments/assets/0bf160e2-c5ee-4fa7-98c3-a860e8cf6780" width="200" /> |

## Project Overview


Tier1Fitness is a **cross-platform mobile application** designed to bridge the gap between solitary activity tracking and social networking. Unlike traditional fitness apps that focus solely on metrics, Tier1Fitness emphasizes **motivation through community engagement**.

Users can:
- Automatically sync daily steps via native device sensors  
- Share workout milestones with friends  
- Create and join competitive challenges (e.g., *"30k Steps in 3 Days"*)  
- Climb the global leaderboards to showcase progress  

---

## Key Features
- **Social Feed**: Real-time feed of workouts, challenges, and milestones with *Like* and *Comment* functionality  
- **Gamification**: Launch custom challenges with specific win conditions (Steps vs. Calories) and duration  
- **Automated Tracking**: Background activity tracking using Expo sensors  
- **Global Leaderboard**: Daily rankings aggregated from user data  
- **Progress Dashboard**: Unified view of personal health metrics and competitive standing

---
## User Guide
# Tier1Fitness User Guide

This guide provides instructions on how to install, configure, and use the Tier1Fitness application, along with our testing methodologies and results.

---

## 1. Installation & Setup

To run the application on your device, follow these steps:

### Option A: Android APK (Production Simulation)
- Download the **Tier1Fitness_FINAL.apk** file from the [Releases/OneDrive] folder.
- Transfer the file to your Android device.
- Tap the file to install. Ensure **"Install from Unknown Sources"** is enabled in your settings.
- Open the app and grant the required permissions (**Physical Activity**) to allow step tracking.

### Option B: Expo Go (Development Mode)
- Install the **Expo Go** app from the Google Play Store or Apple App Store.
- Ensure your computer (running the server) and phone are on the same Wi-Fi network.
- Scan the QR code generated in the terminal after running `npm start`.

---

## 2. Using the App

- **Sign Up**: Launch the app and select *Create Account*. Enter a username, email, and password to generate your profile.  
- **Track Activity**: Navigate to the *Progress* tab to view your live step count and leaderboard ranking.  
- **Socialize**: Use the *Home* tab to view the community feed. Double-tap posts to like them or tap the bubble icon to comment.  
- **Compete**: Go to the *Challenges* tab to create a new competition (e.g., *30k Steps Weekend*) or join an existing one.  

---

## Testing Strategies

To ensure app stability and performance, we employed a combination of **Manual Black-Box Testing** and **API Integration Testing**.

- **Functional Testing**: We manually verified user flows (Login → Feed → Profile) on physical devices (Pixel 5, Samsung S22) to ensure the UI handles different screen sizes and "Edge-to-Edge" Android layouts correctly.  
- **API Logic Testing**: We verified backend endpoints using Postman to ensure correct HTTP status codes (200 for success, 404 for not found, 401 for unauthorized) before connecting the frontend.  
- **Usability Testing**: We conducted "Guest Mode" walkthroughs to ensure non-registered users could still navigate the app without crashing.  

---

## Sample Test Cases & Results

The following test cases were executed on an Android device (**Samsung Galaxy S21**) running **Android 14**.

| ID   | Test Scenario        | Steps to Reproduce                                                                 | Expected Result                                                                 | Actual Result                                                                 | Status |
|------|----------------------|------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------|--------|
| TC01 | User Registration    | 1. Open App.<br>2. Switch toggle to "Sign Up".<br>3. Enter valid email/pass.<br>4. Tap Create. | User is redirected to Home Feed; Profile data is saved to DB.                    | User redirected; "User created" log appeared in server console.                | PASS   |
| TC02 | Step Tracking        | 1. Grant "Physical Activity" permission.<br>2. Walk 10 steps.<br>3. Check Progress Tab. | Step counter updates in real-time or within 2 seconds.                           | Step counter incremented correctly from 0 to 10.                               | PASS   |
| TC03 | Search Functionality | 1. Go to Home.<br>2. Tap Search Icon.<br>3. Type "Josh".                            | List of users matching "Josh" appears (Debounced).                               | List populated after 500ms delay.                                              | PASS   |
| TC04 | Create Challenge     | 1. Go to Create Tab.<br>2. Select "Challenge".<br>3. Set Title "Walk off".<br>4. Tap Launch. | Challenge created, user redirected to Challenge list, Auto-post added to feed.   | Challenge appeared in list and on Home Feed.                                   | PASS   |
| TC05 | Android Layout       | 1. Open Profile Screen on Android.<br>2. Check top status bar and bottom nav bar.   | Content should not be hidden behind status bar or white nav bar.                 | Layout respects Safe Area; Custom header used to clear status bar.             | PASS   |
| TC06 | Invalid Login        | 1. Open App.<br>2. Enter email not in DB.<br>3. Tap Log In.                         | Alert popup: "User not found".                                                   | Alert popup displayed correctly.                                               | PASS   |

---


---
## Quick Deployment Instructions (Expo + Cloud Backend)

If you only want to **use the Tier1Fitness app via Expo**, without setting up your own backend or database, follow these steps.  
The app is already configured to connect to our **Render-hosted API** and **Supabase database**, so you don’t need to run any servers locally.

---
### **IMPORTANT: Server "Cold Start" Delay**
- The backend for this project is hosted on Render's Free Tier. This service automatically "spins down" after 15 minutes of inactivity to save resources.
**When you first open the app, it may take 50–60 seconds for the server to wake up.**
- Please be patient during the first Login or Signup attempt. Once the server is active, the app will function at normal speed.
---
### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (v18+ recommended)  
- Install [Expo Go](https://expo.dev/client) on your mobile device (iOS or Android)  
- Install Git on your machine  

---

### 2. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Tier1Fitness_app.git
cd Tier1Fitness_app
```
### 3. Install Dependencies
```bash
npm install
```
### 4. Run the Mobile App
```bash
npm start -w mobile
```
<img width="1325" height="442" alt="{871F7621-B88B-4078-AF6C-DF709CD640A2}" src="https://github.com/user-attachments/assets/64f73a96-3cf1-46e0-b1d0-d66d5f7b7420" />
<img width="1327" height="168" alt="{4A312268-5EEC-4A23-934D-256A7DE6D81C}" src="https://github.com/user-attachments/assets/e7daa880-5741-416a-aa0a-4868cf48cd20" />

This will start the Expo development server and display a QR code in your terminal.

### 5. Open on Your Device
Open Expo Go on your phone

<img width="300" height="600" alt="image" src="https://github.com/user-attachments/assets/e8527584-0c6d-4446-8b48-6e00ad9daef6" />


Scan the QR code from your terminal
<img width="1313" height="440" alt="{EE6BE892-A4C3-4306-BC56-37FC90B59118}" src="https://github.com/user-attachments/assets/97e5433d-e24b-47ae-84a2-c9f240cea119" />


The app will launch and automatically connect to our Render backend and Supabase database

That’s It!
You’re now running Tier1Fitness with live cloud infrastructure:

- Backend: Render Web Services (auto-deployed from our repo)

- Database: Supabase PostgreSQL (Transaction Pooler enabled)

No local backend setup required — just clone, install, and run via Expo.

<img width="1310" height="152" alt="{752DE4FA-2171-4EBE-BEDB-09DF3105C663}" src="https://github.com/user-attachments/assets/c857021e-e8e4-4bde-b56e-8bb20700db94" />


<img width="1310" height="56" alt="{9889C80C-7C36-45B6-A7B4-114BA8AA0D18}" src="https://github.com/user-attachments/assets/5761b18b-62b7-405f-8807-76e13764e540" />

---
## Local-Only Setup Instructions

Follow these steps if you want to run **everything locally** — your own backend server and database — without relying on our hosted Render or Supabase instances.

---

### 1. Prerequisites
- Node.js (v18+ recommended)  
- npm (comes with Node.js)  
- PostgreSQL (local installation or Docker container)  
- EAS CLI (for native builds):  
  ```bash
  npm install -g eas-cli
  ```
### 2. Clone & Install
  ```bash
git clone https://github.com/YOUR_USERNAME/Tier1Fitness_app.git
cd Tier1Fitness_app
npm install
```
### 3. Environment Setup
Create an .env file in apps/server with your local PostgreSQL connection string:

```env
DATABASE_URL="postgres://<user>:<password>@localhost:5432/postgres"
```
Use your local database credentials. Ensure PostgreSQL is running and accessible on port 5432.
### 4. Initialize Database
Run Prisma migrations to set up the schema in your local database:
```bash
npm run db:migrate -w server
```
### 5. Run the Backend
Start the local Express server:
```bash
npm run dev -w server
```
This will boot the API at http://localhost:3000/api.
---
## Technology Stack
This project is structured as a **Monorepo** managed by npm workspaces.

| Component   | Technology             | Description |
|-------------|------------------------|-------------|
| Frontend    | ![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Managed workflow using TypeScript and React Navigation |
| Backend     | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) | RESTful API server handling auth, business logic, and aggregation |
| Database    | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) | Managed cloud database with high availability |
| ORM         | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) | Type-safe database client and schema migration tool |
| Hosting     | ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white) | Continuous Deployment (CI/CD) for backend API |
| Builds      | ![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white) | Cloud build pipeline for Android APKs and iOS IPAs |
---

## Database
# Database Setup (Using npm Scripts)

This project uses **Prisma** with convenient npm scripts (defined in `server/package.json`) to manage the database. Follow these steps to set up your database, generate the client, inspect data, and seed initial records.

### 1. First-time Setup (Run once)


# 1. Apply migrations → creates all tables
```bash
npm run db:migrate
```
### 2. Generate Prisma Client
```bash
npm run db:generate
```
### 3. Seed initial data (users, challenges, health stats, etc.)
```bash
npx prisma db seed
```
### When you change prisma/schema.prisma
```bash
npm run db:migrate      # apply new schema changes
npm run db:generate      # update types
```

### Quick data inspection / manual edits
```bash
npm run db:studio        # opens http://localhost:5555
```
### Reset everything with fresh sample data
```bash
npx prisma db push --force-reset   # warning: deletes all data
npx prisma db seed
```
---
## Endpoints

### General
- **GET `/api`**  
  Health check. Returns `{ message: "Tier1Fitness API is running!" }`.

### Authentication
- **POST `/api/login`**  
  Login with email + password.  
  **Returns**: User object `{ id, username, email, created }`.

### Users
- **POST `/api/users/create`**  
  Create a new user.  
  **Returns**: Newly created user `{ id, username, email, created }`.

- **GET `/api/users/search?q=term`**  
  Search users by username.  
  **Returns**: Array of users `{ id, username, profilePicUrl, followerCount }`.

- **POST `/api/users/follow`**  
  Toggle follow/unfollow another user.  
  **Returns**: `{ isFollowing: true/false }`.

- **GET `/api/users/:id`**  
  Get user profile with posts, follower/following counts, badges, health stats.  
  **Returns**: Profile object `{ id, username, bio, profilePicUrl, followerCount, followingCount, posts[], healthStats, isFollowing, badges[] }`.

- **GET `/api/users/:userId/history`**  
  Get last 7 days of step history.  
  **Returns**: Array of `{ label: "Mon", steps: 1234 }`.

- **GET `/api/users/:userId/followers`**  
  List followers.  
  **Returns**: Array of `{ id, username, profilePicUrl }`.

- **GET `/api/users/:userId/following`**  
  List following.  
  **Returns**: Array of `{ id, username, profilePicUrl }`.

### Posts
- **GET `/api/posts?userId=...`**  
  Get all posts, ordered by newest.  
  **Returns**: Array of posts `{ id, caption, imageUrl, postType, createdAt, author, likeCount, commentCount, hasLiked }`.

- **POST `/api/posts`**  
  Create a new post.  
  **Returns**: Newly created post object.

- **POST `/api/posts/like`**  
  Toggle like/unlike a post.  
  **Returns**: `{ liked: true/false, newCount: number }`.

- **GET `/api/posts/:postId/comments`**  
  Get comments for a post.  
  **Returns**: Array of `{ id, text, createdAt, author }`.

- **POST `/api/posts/:postId/comments`**  
  Add a comment to a post.  
  **Returns**: Newly created comment object.

### Health Data
- **POST `/api/healthdata`**  
  Upsert today’s health data.  
  **Returns**: HealthData record `{ userId, date, dailySteps, dailyCalories, totalWorkouts }`.

### Leaderboard
- **GET `/api/leaderboard`**  
  Get top 10 users by daily steps.  
  **Returns**: Array of `{ rank, user: { id, username, profilePicUrl }, score }`.

### Challenges
- **GET `/api/challenges`**  
  Get all public challenges with aggregated progress.  
  **Returns**: Array of challenges `{ id, title, description, startDate, endDate, participantCount, goalType, goalValue, currentProgress, creator }`.

- **POST `/api/challenges`**  
  Create a new challenge.  
  **Returns**: Newly created challenge object.

- **POST `/api/challenges/join`**  
  Join a challenge.  
  **Returns**: `{ success: true }`.

- **GET `/api/challenges/:id`**  
  Get challenge details, participants, and group progress.  
  **Returns**: Challenge object with participant stats and group totals.

---
## Cloud Infrastructure & Workflow

### 1. Database Layer (Supabase)
We chose **Supabase** for its robust PostgreSQL features.  
A critical decision was using the **Transaction Pooler (Port 6543)** instead of the Session Pooler, enabling serverless-style deployment on Render without exhausting database limits.

**Data Model Highlights:**
- **User**: Authentication and profile data  
- **Challenge & ChallengeParticipant**: Many-to-many relationship between users and competitions  
- **HealthData**: Daily activity logs linked to users  

<img width="1920" height="876" alt="{D555F92F-1A5D-429D-8327-F701DD62FC5C}" src="https://github.com/user-attachments/assets/d9e3fdb4-a7ed-4166-8dda-5da10a0251d5" />

---

### 2. Backend Deployment (Render)
The backend is deployed to **Render Web Services** with CI/CD configured to auto-deploy on pushes to `main`.

Render automatically executes the following during deployment:

- **Build Command**: `npm install && npx prisma generate && npm run build`  
- **Start Command**: `npm start`  

<img width="1904" height="903" alt="{5EC3CF07-BB07-40FF-B2D0-0BEC47CFDFEB}" src="https://github.com/user-attachments/assets/755ec574-5f0a-4778-8c0d-368143a8a957" />

---
## The Team

Tier1Fitness is the result of a collaborative effort by a diverse group of developers and designers. Each member contributed unique expertise to bring the project to life:

| Name                 | Role              | Responsibility |
|----------------------|-------------------|----------------|
| **Joshua Manzorolhagh**  | Frontend / Infra  | Mobile UI development, EAS configuration, cloud deployment pipeline |
| **Israel Velazquez Rugama** | Backend / DB   | Database schema design, SQL optimization, Prisma setup |
| **David Cano**           | Frontend / UI     | Component library creation, styling system, user experience design |
| **Li Chao Liu**          | Backend / Logic   | Challenge logic, data validation, core API routes |
| **Meet Mangukia**        | Backend / API     | REST endpoints, error handling, authentication security |
| **Jordy Pabon**          | Frontend / Design | Prototyping, wireframing, visual asset creation |

--
