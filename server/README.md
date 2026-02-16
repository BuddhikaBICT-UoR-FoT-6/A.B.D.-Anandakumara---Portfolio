# Server (Express)

This is a tiny Express backend for the portfolio. It exposes:

- `GET /api/hello` — simple JSON hello
- `POST /api/contact` — accepts `{ name, email, message }` and returns an acknowledgement
- `GET /health` — healthcheck

To run locally:

```powershell
cd server
npm install
npm start
```

When deployed, configure the service root/path to the `server/` folder and use `npm install` as the build command (Render) and `npm start` as the start command.
