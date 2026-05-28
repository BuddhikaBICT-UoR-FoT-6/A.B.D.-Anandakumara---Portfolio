# Express Backend Server

This is an optional Express backend for the portfolio, useful if you are not using Vercel Serverless Functions. It exposes the following endpoints:

- `GET /api/hello` — simple JSON hello
- `POST /api/contact` — accepts `{ name, email, message }` and processes the contact form
- `GET /health` — healthcheck endpoint

## Running Locally

1. **Navigate to the server directory**
   ```powershell
   cd server
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Start the Server**
   ```powershell
   npm start
   ```

## Deployment

When deploying to a service like Render or Railway:
- Set the root directory or start path to the `server/` folder.
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Make sure to configure CORS appropriately to allow requests from your frontend domain.
