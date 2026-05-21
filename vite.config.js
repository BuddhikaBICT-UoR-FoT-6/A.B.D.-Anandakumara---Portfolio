import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

const localApiPlugin = () => ({
  name: 'local-api-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/save-portfolio' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const dataPath = resolve(__dirname, 'src/data/portfolioData.json');
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      }

      if (req.url === '/api/upload-photo' && req.method === 'POST') {
        const photoPath = resolve(__dirname, 'public/profile.png');
        const fileStream = fs.createWriteStream(photoPath);
        req.pipe(fileStream);
        fileStream.on('finish', () => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, path: '/profile.png' }));
        });
        fileStream.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });
        return;
      }

      if (req.url === '/api/upload-cv' && req.method === 'POST') {
        const cvPath = resolve(__dirname, 'public/Resume.pdf');
        const fileStream = fs.createWriteStream(cvPath);
        req.pipe(fileStream);
        fileStream.on('finish', () => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, path: '/Resume.pdf' }));
        });
        fileStream.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });
        return;
      }

      next();
    });
  }
});

export default defineConfig({
  base: './',
  plugins: [react(), localApiPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        error: resolve(__dirname, '404.html'),
      },
    },
  },
})

