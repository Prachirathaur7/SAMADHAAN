# SAMADHAAN — GIS Live Map Module

SAMADHAAN is an AI-powered civic grievance platform. This repo contains the GIS Live Map module — the real-time citizen-facing map showing complaint heatmaps, ward severity overlays, and SOS emergency services.

## Run & Operate

- `pnpm --filter @workspace/gis-map run dev` — run the map frontend (uses PORT env)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Map**: Leaflet + react-leaflet + leaflet.heat + leaflet.markercluster
- **Tiles**: CARTO dark tiles (free, via OpenStreetMap)
- **Geocoding**: Nominatim (OSM, free)
- **API**: Express 5 (artifacts/api-server)
- **DB**: PostgreSQL + Drizzle ORM (lib/db)
- **Validation**: Zod v3 + drizzle-zod
- **API codegen**: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)
- **Frontend**: React + Vite + TanStack Query + Tailwind

## AI service integration

The GIS API calls the separate FastAPI service for complaint analysis when `AI_ENGINE_URL` is set. Set `AI_ENGINE_URL` to the deployed AI service's base URL in the GIS API deployment. The complaint endpoint uses the AI category when its score is at least 0.45, saves the suggestion and analysis source, and falls back to the citizen-selected category if the service is unavailable. Severity remains a recommendation and must be reviewed by an officer. Duplicate candidates are found with TF-IDF/cosine similarity against up to 100 reports from the same ward in the past 90 days; suspected duplicates are linked for review and are still recorded.

For pretrained inference, set `HF_TOKEN` as a secret in the AI service deployment with Hugging Face Inference Providers permission. The default text model is `MoritzLaurer/ModernBERT-large-zeroshot-v2.0`, a multilingual zero-shot classifier. The image endpoint uses `punchnami/resnet50-pothole-classification` by default and only identifies potholes; it does not classify all civic image categories. Both model names can be changed with `SAMADHAAN_CLASSIFIER_MODEL` and `SAMADHAAN_IMAGE_MODEL`. When a token is configured, complaint text and uploaded images are sent to Hugging Face Inference Providers; phone numbers and emails are masked in text first. Without a token, text analysis reports `rules_fallback`, duplicate matching still works, and image inference returns unavailable instead of a fabricated prediction.

Deploy the AI service separately using `ai_engine/Dockerfile` (or run `uvicorn main:app --host 0.0.0.0 --port 8000` from `ai_engine`). Set `HF_TOKEN` and `PORT` as platform secrets/settings; never put provider credentials in source control. In the GIS API deployment, set `AI_ENGINE_URL` to the AI service URL. Apply `lib/db/migrations/2026-10-06-add-ai-analysis-fields.sql` to the target PostgreSQL database before enabling complaint creation with the new version.

The repository previously tracked a root `.env` file. It has been removed from the Git index and is covered by `.gitignore`; keep local settings in `.env` and copy only variable names from `.env.example`. Because the former file was in a public repository, rotate any credentials it contained before deploying.

## Where Things Live

- `artifacts/gis-map/` — citizen-facing React map app
  - `src/components/map/` — map layers (ward, heatmap, cluster, user-location)
  - `src/components/ui/` — floating panels (stats header, filter pills, SOS, report modal)
  - `src/contexts/map-context.tsx` — shared state (selectedCategory, SOS active, user location)
  - `src/pages/map-page.tsx` — main page composition
- `artifacts/api-server/src/routes/map.ts` — all GIS API endpoints
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — DB tables: complaints, wards, emergency_services
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)

## API Endpoints (all under /api)

| Method | Path | Description |
|---|---|---|
| GET | /map/heatmap | Weighted lat/lng points for heatmap layer |
| GET | /map/clusters | Complaint clusters by bounding box |
| GET | /map/wards | Ward polygons with severity overlay |
| GET | /map/nearby | Complaints within radius of user |
| GET | /map/emergency-services | Nearest SOS services |
| GET | /map/stats | City-level stats (open, critical, 24h count) |
| GET | /complaints | List complaints |
| POST | /complaints | File a new complaint |
| GET | /complaints/:id | Single complaint detail |

## Architecture Decisions

- **FabButtons lives inside MapContainer** — `useMap()` from react-leaflet requires MapContainer ancestor. All other UI panels are outside MapContainer (standard CSS absolute positioning).
- **Severity scoring is heuristic** — AI priority scoring uses keyword detection on description + category/zone weighting. Replace with ML model post-SIH.
- **No PostGIS** — distance queries use Haversine in JS (accurate for demo scale). PostGIS extension can be added for production.
- **Ward boundaries are simple polygons** — bounding boxes per ward for demo. Real deployment would use actual BBMP/municipal GeoJSON shapefiles.
- **Orval generates `zod.int()` (Zod v4 syntax)** — workspace runs Zod v3, so all integer fields in openapi.yaml must be typed as `number`, not `integer`.

## Integration Points for Teammates

### What this module exports (you consume):
- `GET /api/map/*` endpoints — documented in openapi.yaml
- Complaint schema: `{ id, lat, lng, category, severity, status, description, wardId, wardName, reporterCount, reportedAt }`

### What this module needs from teammates:
- **Mobile app dev**: Ensure lat/lng is captured at complaint filing time
- **AI/ML dev**: Add `severity_score: 0.0–1.0` to complaint row; the map uses `severity` field for weight
- **Backend dev**: When auth is added, pass userId on POST /complaints

## User Preferences

- Project for SIH (Smart India Hackathon) — keep features focused and demonstrable
- GIS module is citizen-facing live map only (not government dashboard)
- Use free APIs only (OpenStreetMap, Nominatim, CARTO tiles)

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing openapi.yaml before touching frontend code
- Do not use `type: integer` in openapi.yaml — use `type: number` (Orval generates Zod v4 syntax that breaks with Zod v3)
- FabButtons must stay inside MapContainer or `useMap()` throws
- DB seed data uses Bangalore coordinates (center ~12.97N, 77.59E)
