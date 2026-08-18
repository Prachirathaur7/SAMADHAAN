import { Router } from "express";
import { db } from "@workspace/db";
import { complaintsTable, wardsTable, emergencyServicesTable } from "@workspace/db";
import { eq, and, gte, sql, or } from "drizzle-orm";

const router = Router();

// ── Haversine distance helper (km) ──────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Severity → weight mapping ───────────────────────────────────────────────
const SEVERITY_WEIGHT: Record<string, number> = {
  low: 0.2,
  medium: 0.45,
  high: 0.75,
  critical: 1.0,
};

// ── GET /api/map/heatmap ─────────────────────────────────────────────────────
router.get("/map/heatmap", async (req, res) => {
  const { category, hours } = req.query as { category?: string; hours?: string };
  const hoursBack = hours ? parseInt(hours) : 168; // default 7 days
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

  const conditions = [gte(complaintsTable.reportedAt, since)];
  if (category && category !== "all") {
    conditions.push(eq(complaintsTable.category, category));
  }

  const rows = await db
    .select({
      lat: complaintsTable.lat,
      lng: complaintsTable.lng,
      severity: complaintsTable.severity,
      status: complaintsTable.status,
    })
    .from(complaintsTable)
    .where(and(...conditions));

  const points = rows
    .filter((r) => r.status !== "resolved")
    .map((r) => ({
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lng),
      weight: SEVERITY_WEIGHT[r.severity] ?? 0.3,
    }));

  res.json(points);
});

// ── GET /api/map/clusters ────────────────────────────────────────────────────
router.get("/map/clusters", async (req, res) => {
  const { swLat, swLng, neLat, neLng, category } = req.query as {
    swLat?: string;
    swLng?: string;
    neLat?: string;
    neLng?: string;
    category?: string;
  };

  if (!swLat || !swLng || !neLat || !neLng) {
    res.status(400).json({ error: "swLat, swLng, neLat, neLng are required" });
    return;
  }

  const sw = [parseFloat(swLat), parseFloat(swLng)];
  const ne = [parseFloat(neLat), parseFloat(neLng)];

  const rows = await db
    .select()
    .from(complaintsTable)
    .where(
      and(
        sql`CAST(${complaintsTable.lat} AS FLOAT) BETWEEN ${sw[0]} AND ${ne[0]}`,
        sql`CAST(${complaintsTable.lng} AS FLOAT) BETWEEN ${sw[1]} AND ${ne[1]}`,
        ...(category && category !== "all"
          ? [eq(complaintsTable.category, category)]
          : []),
      ),
    );

  // Simple grid clustering: group by ~500m grid cells (0.005 deg ≈ 500m)
  const GRID = 0.005;
  type Cell = {
    lat: number;
    lng: number;
    count: number;
    topCategory: string;
    topSeverity: string;
    wardName: string;
    ids: string[];
    severities: Record<string, number>;
    categories: Record<string, number>;
  };
  const cellMap = new Map<string, Cell>();

  for (const row of rows) {
    const cellLat = Math.round(parseFloat(row.lat) / GRID) * GRID;
    const cellLng = Math.round(parseFloat(row.lng) / GRID) * GRID;
    const key = `${cellLat.toFixed(4)},${cellLng.toFixed(4)}`;

    if (!cellMap.has(key)) {
      cellMap.set(key, {
        lat: cellLat,
        lng: cellLng,
        count: 0,
        topCategory: row.category,
        topSeverity: row.severity,
        wardName: row.wardName,
        ids: [],
        severities: {},
        categories: {},
      });
    }
    const cell = cellMap.get(key)!;
    cell.count++;
    cell.ids.push(row.id);
    cell.severities[row.severity] = (cell.severities[row.severity] ?? 0) + 1;
    cell.categories[row.category] = (cell.categories[row.category] ?? 0) + 1;
    cell.wardName = row.wardName || cell.wardName;
  }

  const SEVERITY_ORDER = ["critical", "high", "medium", "low"];
  const clusters = Array.from(cellMap.values()).map((cell) => {
    const topSeverity = SEVERITY_ORDER.find((s) => (cell.severities[s] ?? 0) > 0) ?? "low";
    const topCategory = Object.entries(cell.categories).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "other";
    return {
      id: `${cell.lat.toFixed(4)},${cell.lng.toFixed(4)}`,
      lat: cell.lat,
      lng: cell.lng,
      count: cell.count,
      topCategory,
      topSeverity,
      wardName: cell.wardName,
      ids: cell.ids,
    };
  });

  res.json(clusters);
});

// ── GET /api/map/wards ───────────────────────────────────────────────────────
router.get("/map/wards", async (_req, res) => {
  const wards = await db.select().from(wardsTable);

  // For each ward count complaints
  const complaintRows = await db
    .select({
      wardId: complaintsTable.wardId,
      severity: complaintsTable.severity,
      status: complaintsTable.status,
    })
    .from(complaintsTable);

  type WardAgg = { total: number; critical: number };
  const agg = new Map<string, WardAgg>();
  for (const c of complaintRows) {
    if (c.status === "resolved") continue;
    if (!agg.has(c.wardId)) agg.set(c.wardId, { total: 0, critical: 0 });
    const a = agg.get(c.wardId)!;
    a.total++;
    if (c.severity === "critical") a.critical++;
  }

  function calcSeverity(total: number, critical: number): string {
    if (critical >= 3) return "critical";
    if (critical >= 1) return "high";
    if (total >= 10) return "high";
    if (total >= 5) return "medium";
    if (total >= 1) return "low";
    return "none";
  }

  const result = wards.map((w) => {
    const { total = 0, critical = 0 } = agg.get(w.wardId) ?? {};
    let coords: number[][] = [];
    try {
      coords = JSON.parse(w.boundaryCoords);
    } catch {
      coords = [];
    }
    return {
      wardId: w.wardId,
      wardName: w.wardName,
      complaintCount: total,
      criticalCount: critical,
      severityLevel: calcSeverity(total, critical),
      centerLat: parseFloat(w.centerLat),
      centerLng: parseFloat(w.centerLng),
      boundaryCoords: coords,
    };
  });

  res.json(result);
});

// ── GET /api/map/nearby ──────────────────────────────────────────────────────
router.get("/map/nearby", async (req, res) => {
  const { lat, lng, radiusKm } = req.query as {
    lat?: string;
    lng?: string;
    radiusKm?: string;
  };
  if (!lat || !lng) {
    res.status(400).json({ error: "lat and lng are required" });
    return;
  }
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const radius = radiusKm ? parseFloat(radiusKm) : 2;

  const rows = await db
    .select()
    .from(complaintsTable)
    .where(sql`status != 'resolved'`);

  const nearby = rows
    .map((r) => ({
      ...r,
      distanceKm: haversineKm(userLat, userLng, parseFloat(r.lat), parseFloat(r.lng)),
    }))
    .filter((r) => r.distanceKm <= radius)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 30)
    .map((r) => ({
      id: r.id,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lng),
      category: r.category,
      severity: r.severity,
      status: r.status,
      description: r.description,
      wardName: r.wardName,
      reporterCount: r.reporterCount,
      reportedAt: r.reportedAt.toISOString(),
      distanceKm: Math.round(r.distanceKm * 100) / 100,
    }));

  res.json(nearby);
});

// ── GET /api/map/emergency-services ─────────────────────────────────────────
router.get("/map/emergency-services", async (req, res) => {
  const { lat, lng } = req.query as { lat?: string; lng?: string };
  if (!lat || !lng) {
    res.status(400).json({ error: "lat and lng are required" });
    return;
  }
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  const services = await db.select().from(emergencyServicesTable);

  const result = services
    .map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lng),
      phone: s.phone,
      distanceKm: Math.round(haversineKm(userLat, userLng, parseFloat(s.lat), parseFloat(s.lng)) * 100) / 100,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 8);

  res.json(result);
});

// ── GET /api/map/stats ───────────────────────────────────────────────────────
router.get("/map/stats", async (_req, res) => {
  const all = await db.select().from(complaintsTable);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const open = all.filter((c) => c.status !== "resolved");
  const resolved = all.filter((c) => c.status === "resolved");
  const critical = open.filter((c) => c.severity === "critical");
  const last24h = all.filter((c) => c.reportedAt >= yesterday);
  const activeWardIds = new Set(open.map((c) => c.wardId)).size;

  res.json({
    totalOpen: open.length,
    totalCritical: critical.length,
    totalResolved: resolved.length,
    activeWards: activeWardIds,
    last24hCount: last24h.length,
  });
});

// ── GET /api/complaints ──────────────────────────────────────────────────────
router.get("/complaints", async (req, res) => {
  const { status, category } = req.query as { status?: string; category?: string };

  const conditions = [];
  if (status && status !== "all") conditions.push(eq(complaintsTable.status, status));
  if (category && category !== "all") conditions.push(eq(complaintsTable.category, category));

  const rows = await db
    .select()
    .from(complaintsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(sql`${complaintsTable.reportedAt} DESC`);

  res.json(
    rows.map((r) => ({
      ...r,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lng),
      reportedAt: r.reportedAt.toISOString(),
    })),
  );
});

// ── POST /api/complaints ─────────────────────────────────────────────────────
router.post("/complaints", async (req, res) => {
  const { lat, lng, category, description, imageUrl } = req.body as {
    lat: number;
    lng: number;
    category: string;
    description: string;
    imageUrl?: string;
  };

  if (!lat || !lng || !category || !description) {
    res.status(400).json({ error: "lat, lng, category, description are required" });
    return;
  }

  // Naive ward assignment: find nearest ward
  const wards = await db.select().from(wardsTable);
  let nearestWard = { wardId: "w0", wardName: "Unknown Ward" };
  if (wards.length > 0) {
    const sorted = wards
      .map((w) => ({
        ...w,
        dist: haversineKm(lat, lng, parseFloat(w.centerLat), parseFloat(w.centerLng)),
      }))
      .sort((a, b) => a.dist - b.dist);
    nearestWard = { wardId: sorted[0].wardId, wardName: sorted[0].wardName };
  }

  // Simple AI severity heuristic
  const text = description.toLowerCase();
  let severity = "medium";
  if (text.includes("flood") || text.includes("fire") || text.includes("collapse") || text.includes("emergency")) {
    severity = "critical";
  } else if (text.includes("major") || text.includes("dangerous") || text.includes("urgent")) {
    severity = "high";
  } else if (text.includes("minor") || text.includes("small")) {
    severity = "low";
  }

  const [inserted] = await db
    .insert(complaintsTable)
    .values({
      lat: lat.toString(),
      lng: lng.toString(),
      category,
      severity,
      status: "open",
      description,
      wardId: nearestWard.wardId,
      wardName: nearestWard.wardName,
      imageUrl: imageUrl ?? null,
    })
    .returning();

  res.status(201).json({
    ...inserted,
    lat: parseFloat(inserted.lat),
    lng: parseFloat(inserted.lng),
    reportedAt: inserted.reportedAt.toISOString(),
  });
});

// ── GET /api/complaints/:id ──────────────────────────────────────────────────
router.get("/complaints/:id", async (req, res) => {
  const { id } = req.params;

  // Validate UUID before querying PostgreSQL.
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(id)) {
    res.status(400).json({ error: "Invalid complaint ID" });
    return;
  }

  try {
    const [row] = await db
      .select()
      .from(complaintsTable)
      .where(eq(complaintsTable.id, id));

    if (!row) {
      res.status(404).json({ error: "Complaint not found" });
      return;
    }

    res.json({
      ...row,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      reportedAt: row.reportedAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch complaint:", error);
    res.status(500).json({ error: "Failed to fetch complaint" });
  }
});
export default router;
