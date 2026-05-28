# Portfolio

A modern, interactive portfolio website built with React, Vite, Tailwind CSS, and Three.js (React Three Fiber). 
It features a responsive 3D design and a modular architecture.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Three.js (@react-three/fiber, @react-three/drei)
- **Backend / API**:
  - Vercel Serverless Functions (`/api` directory)
  - Alternatively, an Express server is available in the `/server` directory for other hosting environments.

## Running Locally (Frontend)

1. **Install Dependencies**
   ```powershell
   npm install
   ```

2. **Start the Development Server**
   ```powershell
   npm run dev
   ```
   The site will be available at `http://localhost:5173`.

3. **Build for Production**
   ```powershell
   npm run build
   ```
   You can preview the production build with:
   ```powershell
   npm run preview
   ```

## Deploying

### Frontend (Vercel)

The project includes a `vercel.json` for easy deployment to Vercel. 
Vercel will also automatically host the serverless functions found in the `/api` directory.

1. Connect your repository to Vercel.
2. Vercel will automatically detect the Vite framework.
3. Deploy!

### Backend (Express)

If you prefer to host the backend separately using the Express app instead of Vercel Serverless functions:
- See the [server/README.md](server/README.md) for instructions on running and deploying the Express server.
