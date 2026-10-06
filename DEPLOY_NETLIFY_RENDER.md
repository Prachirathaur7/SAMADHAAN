# Deploy SAMADHAAN with Netlify and Render

This setup hosts the GIS map UI on Netlify and the Node API, Python AI service,
and PostgreSQL database on Render. The frontend uses the generated API client
and reads `VITE_API_BASE_URL` at build time. The Node API uses the Drizzle
complaints, wards, and emergency services models against PostgreSQL.

## Deploy the backend and database

1. In Render, create a Blueprint from this repository and select `render.yaml`.
2. Allow Render to create the `samadhaan-api`, `samadhaan-ai`, and
   `samadhaan-db` resources.
3. Set `HF_TOKEN` on `samadhaan-ai` to enable pretrained Hugging Face models.
   Leaving it unset keeps the documented rules-based fallback available.
4. Deploy the services. The API start command runs Drizzle Kit push against
   the configured database before starting the server, creating or updating
   tables from `lib/db/src/schema`.
5. Copy the public API service URL. Keep the trailing slash off.

## Deploy the frontend

1. In Netlify, import this same Git repository and use the root `netlify.toml`
   build settings.
2. Set `VITE_API_BASE_URL` to the public Render API URL, for example
   `https://samadhaan-api.onrender.com`.
3. Set `CLIENT_URL` on the Render API service to the exact Netlify site origin,
   for example `https://samadhaan.netlify.app` (no path or trailing slash).
4. Redeploy the Render API after setting `CLIENT_URL`, then deploy the Netlify
   site. The API service allows the configured browser origin and the frontend
   sends its `/api/...` requests to that API host.

## Runtime configuration

- `DATABASE_URL` is provided by the Render Blueprint from its PostgreSQL
  resource. Do not copy it into source files.
- `AI_ENGINE_URL` is provided by the Blueprint from the AI service hostname.
- `HF_TOKEN` is optional and belongs only in the AI service's secret settings.
- For local split-host development, set `VITE_API_BASE_URL` and `CLIENT_URL` in
  local ignored environment files. For the GIS frontend on Vite's default
  local port, use `VITE_API_BASE_URL=http://localhost:5000` and
  `CLIENT_URL=http://localhost:5173`.

The free Render web service may sleep when idle, causing a cold start on the
first request. Render's free PostgreSQL offering is temporary and is intended
for demos; choose a persistent database plan before relying on stored public
complaints long term.
