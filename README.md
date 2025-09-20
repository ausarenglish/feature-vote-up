# FeatureVotes

A mobile-first feature voting app built with Vite + React + TypeScript.

## Project info

**URL**: https://lovable.dev/projects/d51f9ab8-90c1-4abd-85f6-a538d61430ab

## Features

- **Home**: View and upvote features with optimistic updates
- **New Feature**: Simple form to submit feature requests
- **Settings**: Toggle for haptic feedback preferences
- Mobile-first design with 44px minimum touch targets
- Safe area padding for mobile devices

## Development

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d51f9ab8-90c1-4abd-85f6-a538d61430ab) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Run locally**

Requirements: Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

Quick start:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:3001
```

Replace with your backend API URL. The app expects these endpoints:
- `GET /features` - Returns array of features
- `POST /features` - Creates new feature (body: `{title: string}`)
- `POST /features/:id/upvote` - Upvotes a feature

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d51f9ab8-90c1-4abd-85f6-a538d61430ab) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
