# Tier1Fitness: Social Activity & Challenge Tracker 
<img width="276" height="276" alt="image" src="https://github.com/user-attachments/assets/c166e12d-6a3d-402c-b1a6-12c30e0237f3" /> 

![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

1. [Project Overview](#project-overview)  
2. [Key Features](#key-features)
3. [User Guide](#user-guide)
4. [Quick Deployment Instructions (Expo + Cloud Backend)](#quick-deployment-instructions-expo--cloud-backend)  
5. [Local-Only Setup Instructions](#local-only-setup-instructions)  
6. [Technology Stack](#technology-stack)  
7. [Cloud Infrastructure & Workflow](#cloud-infrastructure--workflow)  
   - [Database Layer (Supabase)](#1-database-layer-supabase)  
   - [Backend Deployment (Render)](#2-backend-deployment-render)    
8. [The Team](#the-team)

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
Welcome to **Tier1Fitness**, the social activity tracker designed to gamify your health journey!  
This manual will guide you through installing the application, setting up your account, and navigating every feature to ensure you get the most out of your experience.

---

## 1. Installation & Setup

### Step 1: Download & Install
- Locate the `Tier1Fitness_FINAL.apk` file provided in the project folder.
- Tap the file on your Android device to begin installation.
- **Note:** If prompted, allow *Install from Unknown Sources* in your device settings.
- Once installed, tap the **Tier1Fitness icon** on your home screen to launch the app.

### Step 2: Login & Registration
- **Login Screen:** Appears upon opening the app.
- **To Log In:**
  - Enter your **Email** and **Password**.
  - Tap **Log In**.
- **To Create a New Account:**
  - Tap *Don't have an account? Sign Up*.
  - Enter a **Username**, **Email**, and **Password**.
  - Tap **Create Account**.  
    → Your profile picture will be auto-generated from your username initials.
- **Guest Mode:** Tap *Skip for now (Guest Mode)* to explore without an account.

---

##  2. Navigating the App (Tab by Tab)

The app is organized into a **bottom navigation bar** with five main tabs:

### Tab 1: Home (The Feed)
- **Viewing Posts:** Scroll to see workout updates, photos, and challenge announcements.
- **Liking a Post:** Tap the ❤️ icon to like/unlike.
- **Comments:**
  - Tap 💬 to open the comment feed.
  - Read or type your own message, then tap **Send**.
- **Searching for Users:**
  - Tap 🔍 in the top-right corner.
  - Enter a username (e.g., *Josh*).
  - Tap a result to view their **External Profile**.

---

### Tab 2: Challenges
- **Active Challenges:** View all current competitions.
- **Joining a Challenge:**
  - Tap a **Challenge Card** → Review goal & duration.
  - Tap **Join Team Challenge**.
- **Tracking Progress:**
  - Progress bar updates as your team advances.
  - When complete → Card turns green with **GOAL ACHIEVED! 🏆**

---

### Tab 3: Create (Post & Challenge)
- **Mode Toggle:** Switch between *Post* or *Challenge*.
- **Creating a Post:**
  - Select category (Workout, Progress Photo, Milestone).
  - Write a caption (e.g., *Just ran my first 5k!*).
  - (Optional) Add image URL.
  - Tap **Share Post**.
- **Creating a Challenge:**
  - Enter **Title** & **Description**.
  - Select **Metric** (Steps/Calories) + **Target Amount**.
  - Choose **Duration** (3 Days, 1 Week, etc.).
  - Tap **Launch Challenge** → Announcement auto-posts to Home Feed.

---

### Tab 4: Progress (Stats)
- **Daily Step Counter:** Displays steps vs. 10,000-step goal.
- **Victory Chart:** Shows 7-day step history if goal achieved.
- **Metrics:** Calories burned + Distance traveled.
- **Global Leaderboard:** Ranks top 10 movers worldwide for the day.

---

### Tab 5: Profile
- **Personal Profile:**
  - Stats: Posts, Followers, Following.
  - **Trophy Case:** Earned badges (e.g., *Socialite*, *10k Club*).
- **Edit Profile:** Update Bio or Profile Picture URL.
- **Log Out:** Securely sign out.
- **Followers / Following:** Tap numbers to view connected users.
- **My Posts:** History of shared posts. Toggle between *List View* and *Grid View*.

---
## Quick Deployment Instructions (Expo + Cloud Backend)

If you only want to **use the Tier1Fitness app via Expo**, without setting up your own backend or database, follow these steps.  
The app is already configured to connect to our **Render-hosted API** and **Supabase database**, so you don’t need to run any servers locally.

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
