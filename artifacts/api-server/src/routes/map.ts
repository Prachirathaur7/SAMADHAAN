import { Router } from "express";
import { db } from "@workspace/db";
import { complaintsTable, wardsTable, emergencyServicesTable } from "@workspace/db";
import { eq, and, gte, sql, or } from "drizzle-orm";
import { logger } from "../lib/logger";

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

const CATEGORIES = new Set(["road", "water", "garbage", "drainage", "electricity", "other"]);
const PRIORITIES = new Set(["low", "medium", "high", "critical"]);
const AI_ENGINE_URL = process.env.AI_ENGINE_URL?.replace(/\/+$/, "");
// Free Render services may need tens of seconds to wake after idle periods.
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS ?? 65000);

function serializeComplaint(row: typeof complaintsTable.$inferSelect) {
  return {
    ...row,
    lat: Number(row.lat),
    lng: Number(row.lng),
    aiConfidence: row.aiConfidence === null ? null : Number(row.aiConfidence),
    aiDuplicateScore: row.aiDuplicateScore === null ? null : Number(row.aiDuplicateScore),
    reportedAt: row.reportedAt.toISOString(),
  };
}

function aiCategoryToMapCategory(value: unknown): string | null {
  const category = String(value ?? "").toLowerCase().replace(/[_-]+/g, " ");
  // Check waterlogging and drainage before generic water so flood complaints
  // are routed to drainage rather than water supply.
  if (/waterlog|water logged|flood|drain|sewer|sewage|overflow/.test(category)) return "drainage";
  if (/pothole|road|footpath|bridge|traffic/.test(category)) return "road";
  if (/water leak|water supply|water leakage|drinking water/.test(category)) return "water";
  if (/garbage|waste|sanitation|trash|litter/.test(category)) return "garbage";
  if (/electric|power|street ?light|transformer/.test(category)) return "electricity";
  return null;
}

async function callAi(path: string, body: Record<string, unknown>): Promise<any | null> {
  if (!AI_ENGINE_URL) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const response = await fetch(`${AI_ENGINE_URL}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      logger.warn({ status: response.status, path }, "AI engine request failed");
      return null;
    }
    return await response.json();
  } catch (error) {
    logger.warn({ error, path }, "AI engine unavailable; using safe fallback");
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Lightweight per-IP guard for the public report form. It complements the
// platform-level rate limits and avoids an extra runtime dependency.
const reportAttempts = new Map<string, { count: number; resetAt: number }>();
function allowReport(ip: string): boolean {
  const now = Date.now();
  const current = reportAttempts.get(ip);
  if (!current || current.resetAt <= now) {
    reportAttempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    if (reportAttempts.size > 5000) {
      for (const [key, value] of reportAttempts) if (value.resetAt <= now) reportAttempts.delete(key);
    }
    return true;
  }
  if (current.count >= 10) return false;
  current.count += 1;
  return true;
}

async function findAiDuplicate(description: string, lat: number, lng: number, category: string) {
  if (!AI_ENGINE_URL) return null;
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const rows = await db.select().from(complaintsTable)
    .where(and(gte(complaintsTable.reportedAt, since), sql`${complaintsTable.status} != 'resolved'`))
    .orderBy(sql`${complaintsTable.reportedAt} DESC`).limit(100);
  const candidates = rows
    .map((row) => ({ row, distance: haversineKm(lat, lng, parseFloat(row.lat), parseFloat(row.lng)) }))
    .filter(({ row, distance }) => distance <= 3 && (row.category === category || distance <= 0.5))
    .slice(0, 30);
  if (!candidates.length) return null;

  const result = await callAi("/api/complaint/similarity", {
    complaint: description,
    previous_complaints: candidates.map(({ row }) => row.description),
  });
  const match = result?.results?.find((item: any) => item?.is_duplicate === true && Number.isInteger(item.index));
  const previous = match ? candidates[match.index]?.row : null;
  if (!previous) return null;
  const score = Number(match.similarity);
  return {
    id: previous.id,
    score: Number.isFinite(score) ? Math.min(1, Math.max(0, score)).toFixed(4) : null,
  };
}

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
    rows.map(serializeComplaint),
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

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  if (!allowReport(ip)) {
    res.status(429).json({ error: "Too many reports from this connection. Please try again later." });
    return;
  }

  if (
    typeof lat !== "number" || !Number.isFinite(lat) || Math.abs(lat) > 90 ||
    typeof lng !== "number" || !Number.isFinite(lng) || Math.abs(lng) > 180 ||
    typeof category !== "string" || !CATEGORIES.has(category) ||
    typeof description !== "string" || description.trim().length < 10 || description.trim().length > 2000
  ) {
    res.status(400).json({ error: "A valid location, category, and description (10–2000 characters) are required" });
    return;
  }
  if (imageUrl !== undefined && imageUrl !== null) {
    try {
      if (typeof imageUrl !== "string" || imageUrl.length > 2048 || new URL(imageUrl).protocol !== "https:") {
        throw new Error("Invalid image URL");
      }
    } catch {
      res.status(400).json({ error: "imageUrl must be a valid HTTPS URL" });
      return;
    }
  }

  const cleanDescription = description.trim();

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

  const aiResult = await callAi("/api/complaint/analyze", {
    complaint: cleanDescription,
    language: "auto",
    latitude: lat,
    longitude: lng,
  });
  const ai = aiResult?.success === true ? aiResult : null;
  const aiCategory = typeof ai?.category === "string" ? ai.category : null;
  const mappedCategory = aiCategoryToMapCategory(aiCategory) ?? category;
  const aiSeverity = String(ai?.severity ?? "").toLowerCase();
  const severity = PRIORITIES.has(aiSeverity) ? aiSeverity : "medium";
  const priorityResult = String(ai?.priority ?? "").toLowerCase();
  const aiPriority = ai && PRIORITIES.has(priorityResult) ? priorityResult : null;
  const aiConfidenceValue = Number(ai?.category_confidence);
  const aiConfidence = Number.isFinite(aiConfidenceValue)
    ? Math.min(1, Math.max(0, aiConfidenceValue)).toFixed(4)
    : null;

  let duplicate: Awaited<ReturnType<typeof findAiDuplicate>> = null;
  try {
    duplicate = await findAiDuplicate(cleanDescription, lat, lng, mappedCategory);
  } catch (error) {
    logger.warn({ error }, "AI duplicate check failed; report will still be recorded");
  }

  const [inserted] = await db
    .insert(complaintsTable)
    .values({
      lat: lat.toString(),
      lng: lng.toString(),
      category: mappedCategory,
      severity,
      status: "open",
      description: cleanDescription,
      wardId: nearestWard.wardId,
      wardName: nearestWard.wardName,
      imageUrl: imageUrl ?? null,
      aiCategory,
      aiPriority,
      aiSummary: typeof ai?.summary === "string" ? ai.summary.slice(0, 500) : null,
      aiDepartment: typeof ai?.department === "string" ? ai.department.slice(0, 120) : null,
      aiConfidence,
      aiStatus: ai ? "completed" : "unavailable",
      aiDuplicateOf: duplicate?.id ?? null,
      aiDuplicateScore: duplicate?.score ?? null,
    })
    .returning();

  res.status(201).json(serializeComplaint(inserted));
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

    res.json(serializeComplaint(row));
  } catch (error) {
    console.error("Failed to fetch complaint:", error);
    res.status(500).json({ error: "Failed to fetch complaint" });
  }
});
export default router;
