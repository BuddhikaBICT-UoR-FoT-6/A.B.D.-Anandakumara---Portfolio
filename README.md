# Portfolio (static)

This is a simple static portfolio website (no framework needed).

## Edit your info
- Update links and text in `index.html` (email, GitHub, LinkedIn, projects, resume).

## Preview locally
### Option A: VS Code Live Server extension
- Install **Live Server**
- Right-click `index.html` → **Open with Live Server**

### Option B: Python (if installed)
From this folder:
```powershell
python -m http.server 5173
```
Then open:
- http://localhost:5173

## Host it (GitHub Pages)
1. Create a new GitHub repo (example: `portfolio`).
2. Upload these files (`index.html`, `styles.css`, `script.js`, `README.md`).
3. In GitHub: **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` (root)
4. Wait ~1–3 minutes, then your site will be available at the URL GitHub shows.

## Push to GitHub (git)
From this folder:
```powershell
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
```

Then create a GitHub repository (on github.com) and push:
```powershell
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Host it (Netlify)
1. Go to https://www.netlify.com/ and log in.
2. "Add new site" → "Deploy manually".
3. Drag-and-drop this folder contents.

## Host it (Vercel)
1. Log in to Vercel with GitHub.
2. **Add New → Project** → select your repo.
3. Framework preset: pick **Other** (or **Static Site** if shown).
4. Build Command: leave empty.
5. Output/Publish directory: `.` (repo root).

## Host it (Render)
For this repo (static frontend only):
1. Log in to Render with GitHub.
2. **New + → Static Site** → select your repo.
3. Build Command: leave empty.
4. Publish Directory: `.`

If you later add a backend, put it in a separate folder (example: `server/`) and deploy as a **Web Service**.

## Custom domain (optional)
- GitHub Pages: **Settings → Pages → Custom domain** (then add the DNS records GitHub shows).
- Netlify: **Domain management** (Netlify will tell you which DNS records to add).

## Notes
- The contact form uses `mailto:` (no backend). If you want a real form (Formspree / Netlify Forms), tell me.
