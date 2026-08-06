# NagarDrishti AI — GIS Live Map Module
## Technical Workflow & Implementation Guide
**Module Owner: [Your Name] | Role: GIS Feature Developer**

---

## What This Module Does

The GIS Live Map is the spatial intelligence layer of NagarDrishti. It gives citizens a visual answer to:
- *"Is my area already being dealt with?"*
- *"Where are the active problem zones near me?"*
- *"Should I file this complaint or has someone already?"*

And gives the government dashboard:
- *"Which wards need immediate attention?"*
- *"Where is complaint density highest right now?"*

---

## Module Scope (Your Deliverable)

| Feature | Description | Priority |
|---|---|---|
| Live complaint heatmap | Red/orange/yellow zones by complaint density | P0 |
| Complaint cluster markers | Grouped pins showing count per area | P0 |
| User's location pin | "You are here" with radius overlay | P0 |
| Problem zone polygons | Ward-level shading by severity | P1 |
| Complaint detail popup | Click a cluster → see complaint list | P1 |
| Filter by category | Show only road/water/garbage complaints | P1 |
| Real-time updates | Map refreshes as new complaints arrive | P2 |
| SOS proximity layer | Show nearest emergency contact on map | P2 |

---

## APIs & Resources (All Free / Open Source)

### 1. Map Tiles — OpenStreetMap via Leaflet
```
Provider: OpenStreetMap (tile.openstreetmap.org)
Cost: Free, no API key required
Leaflet CDN: https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
Usage limit: Fair use (reasonable for a hackathon/pilot)
```
**Why not Google Maps?** Costs money after $200 free credit. OSM is production-grade for Indian cities.

**Tile URL format:**
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### 2. Geocoding — Nominatim (OSM)
```
Provider: Nominatim (nominatim.openstreetmap.org)
Cost: Free
Purpose: Convert address text → lat/long coordinates
India coverage: Excellent for all cities and districts
Rate limit: 1 request/second (sufficient for complaint filing)
```
**Example call:**
```
GET https://nominatim.openstreetmap.org/search?q=Connaught+Place+Delhi&format=json&countrycodes=IN
```

### 3. Heatmap Layer — Leaflet.heat
```
Library: leaflet.heat
GitHub: Leaflet/Leaflet.heat
CDN: https://unpkg.com/leaflet.heat/dist/leaflet-heat.js
Cost: Free, open source
Purpose: Render complaint density as a thermal overlay
```

### 4. Marker Clustering — Leaflet.markercluster
```
Library: Leaflet.markercluster
CDN: https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js
Cost: Free, open source
Purpose: Group nearby complaints into cluster bubbles with count badges
```

### 5. Ward/Zone Boundaries — GeoJSON
```
Source: data.gov.in (India Open Government Data Platform)
Format: GeoJSON polygons for municipal ward boundaries
Available for: Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune
Fallback: OpenStreetMap relation boundaries via Overpass API
Cost: Free, publicly available
```
**Overpass API (to fetch ward boundaries on-demand):**
```
https://overpass-api.de/api/interpreter
```
**Example query for ward boundaries in Bangalore:**
```
[out:json];
area["name"="Bengaluru"]["admin_level"="6"];
(relation["admin_level"="10"](area););
out geom;
```

### 6. Spatial Queries — PostGIS (Backend)
```
Extension: PostGIS on top of PostgreSQL
Purpose: "Find all complaints within 2km of user's location"
Functions used:
  - ST_DWithin() — radius-based search
  - ST_MakePoint() — create point from lat/long
  - ST_AsGeoJSON() — convert DB results to GeoJSON for frontend
```

### 7. Reverse Geocoding (Location to Address)
```
Provider: Nominatim reverse geocoding
Endpoint: nominatim.openstreetmap.org/reverse
Purpose: When user shares location, display human-readable address
```

---

## Data Model (What the Map Consumes)

### Complaint Table (Backend → GIS)
```sql
complaints (
  id           UUID PRIMARY KEY,
  latitude     DECIMAL(9,6) NOT NULL,
  longitude    DECIMAL(9,6) NOT NULL,
  category     ENUM ('road', 'water', 'garbage', 'drainage', 'electricity', 'other'),
  severity     ENUM ('low', 'medium', 'high', 'critical'),
  status       ENUM ('open', 'assigned', 'in_progress', 'resolved'),
  ward_id      VARCHAR,
  reported_at  TIMESTAMP,
  location     GEOGRAPHY(POINT, 4326)  -- PostGIS spatial column
)
```

### API Endpoints the Map Consumes

```
GET /api/map/complaints/heatmap
  Query params: lat, long, radius_km, category, status
  Returns: Array of { lat, lng, weight } — weight = priority score
  Used by: Leaflet.heat to render the thermal overlay

GET /api/map/complaints/clusters
  Query params: bbox (bounding box of current map view), zoom_level
  Returns: Array of { lat, lng, count, severity, ids[] }
  Used by: MarkerCluster to render grouped pins

GET /api/map/wards/status
  Returns: GeoJSON FeatureCollection with ward polygons + complaint_count + severity
  Used by: Choropleth layer (ward coloring)

GET /api/map/complaints/:id
  Returns: Single complaint detail for popup
  Used by: Click handler on marker

GET /api/map/nearby?lat=&lng=&radius=2
  Returns: Complaints within radius of user's location
  Used by: "Nearby complaints" feature

WebSocket: ws://api/map/live
  Emits: { type: 'new_complaint', lat, lng, category, severity }
  Used by: Real-time map updates without polling
```

---

## Frontend Architecture

### File Structure (React Component)
```
src/
├── components/
│   └── map/
│       ├── LiveMap.tsx              ← Main map container
│       ├── HeatmapLayer.tsx         ← Complaint density overlay
│       ├── ClusterLayer.tsx         ← Grouped complaint markers
│       ├── WardPolygonLayer.tsx     ← Ward boundary + coloring
│       ├── UserLocationMarker.tsx   ← Blue dot for citizen
│       ├── ComplaintPopup.tsx       ← Click-to-view complaint detail
│       ├── MapFilterPanel.tsx       ← Category/status filter sidebar
│       └── SOSNearbyLayer.tsx       ← Emergency contacts on map
├── hooks/
│   ├── useMapData.ts                ← Fetches heatmap + cluster data
│   ├── useUserLocation.ts           ← Browser Geolocation API
│   └── useMapWebSocket.ts           ← Real-time updates
└── utils/
    └── mapHelpers.ts                ← Color coding, weight calculation
```

### Map Initialization (LiveMap.tsx)
```tsx
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

const INDIA_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 12;

export const LiveMap = () => {
  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatmapLayer />
      <ClusterLayer />
      <WardPolygonLayer />
      <UserLocationMarker />
    </MapContainer>
  );
};
```

---

## Color Coding System

### Heatmap Colors (Complaint Density)
```
0 complaints   → No overlay
1-5            → Yellow (#FFE066)
6-15           → Orange (#FF8C42)
16-30          → Red (#E63946)
30+            → Dark Red (#9B1D20)
```

### Ward Polygon Fill (Severity Level)
```
No complaints  → Transparent
Low severity   → Light blue (#AED6F1, 20% opacity)
Medium         → Yellow (#F9E79F, 30% opacity)
High           → Orange (#FAD7A0, 40% opacity)
Critical       → Red (#F1948A, 50% opacity)
```

### Complaint Category Marker Icons
```
Road Damage    → 🔴 Red circle
Waterlogging   → 🔵 Blue circle
Garbage        → 🟢 Green circle
Electricity    → 🟡 Yellow circle
Other          → ⚫ Grey circle
```

---

## User Flows on the Map

### Flow 1: Citizen Opens App → Views Nearby Situation
```
1. App launches → requests browser location (Geolocation API)
2. Map centers on user's coordinates
3. API call: GET /api/map/complaints/heatmap?lat=&lng=&radius=5
4. Heatmap layer renders — citizen sees red zones near them
5. API call: GET /api/map/wards/status
6. Ward polygons render — entire ward colored by severity
7. Citizen can see: "My ward is orange — several complaints active"
```

### Flow 2: Citizen Wants to File — Checks for Duplicates First
```
1. Citizen taps "Report Problem"
2. Before form opens: map zooms to 200m radius around user
3. Shows all open complaints in that radius (blue markers)
4. Message: "3 similar complaints already filed here. Add your voice to existing report?"
5. Option A: Join existing report (adds +1 to cluster count)
6. Option B: File new complaint (different exact issue)
```

### Flow 3: Citizen Clicks a Red Zone
```
1. User taps red/orange area on heatmap
2. Map smoothly zooms into that area
3. Cluster markers appear showing individual complaint counts
4. User taps a cluster → popup opens:
   ┌────────────────────────────────┐
   │ Ward 14 — Road Damage Cluster  │
   │ 23 complaints • Last: 2h ago   │
   │ Status: Assigned to PWD        │
   │ Expected resolution: Tomorrow  │
   │ [View Details] [Add Your Voice]│
   └────────────────────────────────┘
```

### Flow 4: SOS Mode
```
1. Citizen taps SOS button
2. Map immediately shows:
   - Nearest police station (blue pin)
   - Nearest fire station (red pin)
   - Nearest hospital (green cross pin)
   - Municipal emergency contact (orange pin)
3. Distances shown in km
4. Tap any pin → one-tap call or WhatsApp message
5. Data source: OSM Overpass API queries for amenity=police/hospital/fire_station
```

---

## Backend Spatial Query Examples

### Get Heatmap Data (PostGIS)
```sql
SELECT
  ST_Y(location::geometry) as lat,
  ST_X(location::geometry) as lng,
  COUNT(*) as complaint_count,
  MAX(severity_score) as max_severity
FROM complaints
WHERE
  status != 'resolved'
  AND ST_DWithin(
    location,
    ST_MakePoint($longitude, $latitude)::geography,
    $radius_meters
  )
  AND reported_at > NOW() - INTERVAL '7 days'
GROUP BY
  ST_SnapToGrid(ST_Y(location::geometry), 0.005),  -- ~500m grid
  ST_SnapToGrid(ST_X(location::geometry), 0.005)
ORDER BY complaint_count DESC;
```

### Get Ward Status for Choropleth
```sql
SELECT
  w.ward_id,
  w.ward_name,
  w.boundary_geojson,
  COUNT(c.id) as total_complaints,
  SUM(CASE WHEN c.severity = 'critical' THEN 1 ELSE 0 END) as critical_count,
  MAX(c.severity_score) as max_severity
FROM wards w
LEFT JOIN complaints c ON ST_Contains(
  w.boundary::geometry,
  c.location::geometry
)
WHERE c.status != 'resolved' OR c.id IS NULL
GROUP BY w.ward_id, w.ward_name, w.boundary_geojson;
```

---

## Real-Time Update Strategy

### WebSocket Event Flow
```
New complaint filed by citizen
        ↓
Backend emits WebSocket event:
  { type: 'complaint_added', lat, lng, category, severity }
        ↓
Map client receives event
        ↓
LiveMap re-fetches heatmap for affected bbox only (not full refresh)
        ↓
Heatmap layer updates — area glows brighter if density increased
        ↓
If severity = CRITICAL:
  Animated pulsing red marker placed at coordinates
  Toast notification: "Critical issue reported nearby"
```

### Polling Fallback (if WebSocket not available)
```
setInterval(() => fetchHeatmapData(), 30000)  // 30-second refresh
```

---

## External Data Sources Reference

| Data | Source | URL | Format | Update Freq |
|---|---|---|---|---|
| Map tiles | OpenStreetMap | tile.openstreetmap.org | PNG tiles | Continuous |
| Geocoding | Nominatim | nominatim.openstreetmap.org | JSON | On-demand |
| Ward boundaries | data.gov.in | data.gov.in/dataset | GeoJSON | Static |
| Hospital/Police locations | OSM Overpass | overpass-api.de | JSON | Weekly |
| Reverse geocoding | Nominatim | nominatim.openstreetmap.org/reverse | JSON | On-demand |
| Weather overlay (optional) | IMD / OpenWeatherMap | api.openweathermap.org | JSON | Hourly |

---

## Libraries to Install

```bash
# React-Leaflet (Leaflet wrapper for React)
npm install leaflet react-leaflet

# TypeScript types
npm install -D @types/leaflet

# Heatmap plugin
npm install leaflet.heat

# Marker clustering
npm install leaflet.markercluster
npm install -D @types/leaflet.markercluster
```

---

## Development Phases for This Module

### Phase 1 — Static Map (Day 1-2)
- [ ] Leaflet map renders with OSM tiles
- [ ] User location detected and centered
- [ ] Hard-coded sample complaint points plotted as markers
- [ ] Basic popup on marker click

### Phase 2 — Live Data (Day 3-4)
- [ ] API endpoints for heatmap and clusters built
- [ ] Heatmap layer rendering real complaint data
- [ ] Cluster layer grouping nearby complaints
- [ ] Complaint detail popup with real data

### Phase 3 — Zone Intelligence (Day 5-6)
- [ ] Ward boundary GeoJSON loaded and displayed
- [ ] Ward polygons colored by severity
- [ ] Category filter panel working
- [ ] Nearby-duplicate detection before complaint filing

### Phase 4 — Real-Time + Polish (Day 7-8)
- [ ] WebSocket connection for live updates
- [ ] SOS layer with nearest emergency services (Overpass API)
- [ ] Animated pulsing effect for CRITICAL complaints
- [ ] Map filter by time range (24h / 7d / 30d)
- [ ] Performance optimization: only fetch visible bbox data

---

## Integration Points (What You Need from Other Team Members)

| You need | From whom | Format |
|---|---|---|
| `GET /api/map/complaints/heatmap` endpoint | Backend developer | Returns `[{lat, lng, weight}]` |
| `GET /api/map/wards/status` endpoint | Backend developer | Returns GeoJSON FeatureCollection |
| WebSocket server setup | Backend developer | `ws://` event schema |
| Complaint `lat/lng` stored at filing time | Mobile app developer | Ensure Geolocation captured |
| Severity score per complaint | AI/ML developer | `severity_score: 0.0–1.0` on each complaint |

---

## What You Deliver (Module Output)

1. **`<LiveMap />` component** — drop-in React component, works in both citizen app and government dashboard
2. **Map API spec additions** — the 5 endpoints defined above, for the backend team to implement
3. **GeoJSON ward data** — pre-downloaded for demo city (Bangalore/Delhi/Mumbai)
4. **Demo scenario** — the "Ward 7 glows red before the flood" moment in the 8-minute SIH demo

---

*GIS Module — NagarDrishti AI | Built with Leaflet + OpenStreetMap + PostGIS*
