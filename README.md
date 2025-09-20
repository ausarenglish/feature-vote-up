# FeatureVotes

A mobile-first feature voting app built with Vite + React + TypeScript, backed by an Express + SQLite API, and packaged for iOS via Capacitor.

## Quick Start

### Backend

# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the backend server
npm run server

# Step 5: In a new terminal, start the frontend development server
npm run dev

The frontend will be available at http://localhost:8080 and the backend at http://localhost:4000.

### iOS (Capacitor)

# Build the frontend and copy assets to iOS
npm run build
npx cap copy ios

# Open the iOS project in Xcode
open ios/App/App.xcworkspace

In Xcode:
- Choose your simulator (e.g., iPhone 15)
- Press Run ▶︎
- After making frontend changes, run:
  npm run build && npx cap copy ios
  then re-run in Xcode.

## Features

- Home: View and upvote features with optimistic updates
- New Feature: Submit feature requests
- Settings: Toggle haptic feedback preferences
- Mobile-first design with 44px minimum touch targets
- Safe area padding for mobile devices

## Backend Development

The backend server provides a SQLite-based API for feature management:

# Start the backend server
npm run server

# Start the backend server with auto-restart on changes
npm run server:watch

The backend creates a SQLite database at server/data.sqlite with the features table automatically.

## Environment Variables

Create a .env file in the project root:

VITE_API_URL=http://localhost:4000

Replace with your backend API URL. The app expects these endpoints:
- GET /features - Returns array of features sorted by votes DESC, created_at DESC
- POST /features - Creates new feature (body: {title: string})
- POST /features/:id/upvote - Upvotes a feature

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express
- SQLite
- Capacitor (iOS)

## Scripts

npm run server        # start API
npm run server:watch  # API with auto-restart
npm run dev           # frontend dev server
npm run build         # production build (for iOS/web)

## License

MIT
