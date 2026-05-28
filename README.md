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

## Design Philosophy & Aesthetics

This portfolio is not just a digital resume; it is a living engineering showcase designed to reflect Buddhika Darshan's deep technical focus. The aesthetic choices intentionally mirror his expertise in backend architecture, embedded systems (IoT), and complex logic layers.

### The PCB & Terminal Aesthetic
- **Visual Styles**: The UI leverages a "Printed Circuit Board" (PCB) and retro-terminal aesthetic. Features include neon green trace lines (`--pcb-green`), glowing text components (`emissive-pulse`, `.percentage-glow`), CRT scanline reveals, and simulated hardware components like blinking LED indicators and metallic screw heads.
- **Glassmorphism**: Semi-transparent panels with background blurs (`backdrop-filter`) are used to create depth, making the UI feel like a digital HUD overlaying physical hardware.
- **How it Reflects the Engineer**: The raw, hardware-centric aesthetic perfectly aligns with Buddhika's work on projects like `HomeCanvas` (ESP32 IoT systems) and `Cypher-UI` (low-level cryptography algorithms), emphasizing a developer who seamlessly bridges the gap between hardware and software.

### Dynamic 3D Swarms
Built using React Three Fiber, the background isn't static—it's highly reactive.
- **Particle Engine**: A custom `ParticleEngine` controls thousands of particles simulating data flow through a circuit board.
- **Interactive Swarms**: When the user hovers over technical skills, custom DOM events (`scatter-swarm` and `gather-swarm`) are dispatched. The 3D particles react in real-time by breaking their idle flow and rapidly swarming (orbiting) around a dynamic radius. This visualizes the concept of "computational load" and real-time data aggregation.

### Theme Modes
- **Mode Switching**: The portfolio includes dynamic theme swapping, such as the `tranquil` mode. This mode smoothly transitions the aggressive terminal green and navy colors into a softer, teal/cyan color palette (`#2dd4bf` and `#38bdf8`). It dynamically alters CSS variables, emissive pulses, and border glows to offer a calmer browsing experience while strictly maintaining the core engineering aesthetic.
