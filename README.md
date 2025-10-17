# Mini Sync Dashboard

A real-time user activity synchronization system with web admin dashboard and mobile app.

## Tech Stack

### Backend

- **NestJS** with TypeScript
- **GraphQL** (Queries, Mutations, Subscriptions)
- **MongoDB** with Mongoose
- **Real-time** updates via GraphQL Subscriptions

### Web Admin (React)

- **Vite** + React + TypeScript
- **Apollo Client** for GraphQL
- **Tailwind CSS** for styling
- Real-time activity creation and display

### Mobile App (React Native)

- **Expo** + React Native
- **GraphQL Client** with polling
- Auto-refresh every 10 seconds
- Time-since-posted display

## Features

### ✅ Backend

- [x] GraphQL API with createActivity mutation
- [x] getActivities query with expiry filtering
- [x] Real-time subscriptions for new activities
- [x] MongoDB data persistence
- [x] Input validation and error handling

### ✅ Web Admin

- [x] Activity creation form with validation
- [x] Real-time activity list with visual hints
- [x] Clean, responsive UI
- [x] Error states and loading indicators

### ✅ Mobile App

- [x] Display active activities
- [x] Auto-refresh via polling
- [x] Time since posted display
- [x] Pull-to-refresh functionality

## Setup Instructions

### Backend

```bash
cd server
npm install
# Set MONGODB_URI in .env (default: mongodb://localhost:27017/sync-dashboard)
npm run start:dev
```

### Web

```bash
cd web
npm install
npm run dev
```

### mobile

```bash
cd mobile
npm install
npx expo start
```
