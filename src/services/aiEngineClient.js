const AI_URL = process.env.AI_SERVICE_URL;
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 5000);

const PRIORITY_RANK = { low: 0, medium: 1, high: 2, critical: 3 };

function mapCategory(aiCategory = "", department = "") {
    const t = `${aiCategory} ${department}`.toLowerCase();
    if (/water|pipe|leak|supply/.test(t)) return "water";
    if (/electric|power|light|transformer|wire/.test(t)) return "electricity";
    if (/garbage|waste|sanit|drain|sewer|sewage/.test(t)) return "sanitation";
    if (/road|pothole|footpath|bridge|traffic/.test(t)) return "roads";
    if (/safety|fire|crime|police|danger/.test(t)) return "public_safety";
    return null;
}

function mapPriority(value) {
    const p = String(value || "").toLowerCase();
    return p in PRIORITY_RANK ? p : null;
}

async function callEngine(text, latitude, longitude) {
    if (!AI_URL) return { status: "disabled" };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const res = await fetch(`${AI_URL}/api/complaint/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                complaint: text,
                language: "auto",
                latitude,
                longitude
            }),
            signal: controller.signal
        });
        if (!res.ok) {
            return { status: "failed", error: `AI service returned ${res.status}` };
        }
        return { status: "completed", data: await res.json() };
    } catch (err) {
        return {
            status: "failed",
            error: err.name === "AbortError"
                ? "AI service timed out"
                : "AI service unreachable"
        };
    } finally {
        clearTimeout(timer);
    }
}

async function findDuplicate(text, complaint) {
    const location = complaint.location || {};
    const ward = typeof location.ward === "string" ? location.ward.trim() : "";
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);
    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng) &&
        Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

    // Keep comparisons local to reduce false positives across different cities.
    let scope;
    if (ward) {
        scope = { "location.ward": ward };
    } else if (hasGeo) {
        scope = {
            geo: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: 3000
                }
            }
        };
    } else {
        return null;
    }

    const candidates = await complaint.constructor.find({
        ...scope,
        _id: { $ne: complaint._id },
        createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        status: { $ne: "rejected" }
    }).select("title description").sort({ createdAt: -1 }).limit(50).lean();

    if (!candidates.length) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(`${AI_URL}/api/complaint/similarity`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                complaint: text,
                previous_complaints: candidates.map((item) => `${item.title} ${item.description}`)
            }),
            signal: controller.signal
        });
        if (!res.ok) return null;
        const payload = await res.json();
        const duplicate = (payload.results || []).find((item) => item.is_duplicate === true);
        if (!duplicate || !Number.isInteger(duplicate.index)) return null;
        const match = candidates[duplicate.index];
        return match ? { id: match._id, score: Number(duplicate.similarity) } : null;
    } catch {
        // Duplicate detection is advisory; never block complaint registration.
        return null;
    } finally {
        clearTimeout(timer);
    }
}

async function enrichComplaint(complaint) {
    try {
        const loc = complaint.location || {};
        const lat = Number(loc.latitude);
        const lng = Number(loc.longitude);
        const hasGeo =
            Number.isFinite(lat) && Number.isFinite(lng) &&
            Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

        if (hasGeo) {
            complaint.geo = { type: "Point", coordinates: [lng, lat] };
        }

        const result = await callEngine(
            `${complaint.title} ${complaint.description}`,
            hasGeo ? lat : undefined,
            hasGeo ? lng : undefined
        );

        // Similarity is an advisory check and is independent of classification.
        // Preserve complaint submission even if the AI similarity endpoint is down.
        if (AI_URL) {
            let duplicate = null;
            try {
                duplicate = await findDuplicate(
                    `${complaint.title} ${complaint.description}`,
                    complaint
                );
            } catch (err) {
                console.warn("AI duplicate check unavailable:", err.message);
            }
            if (duplicate) {
                complaint.aiDuplicateOf = duplicate.id;
                complaint.aiDuplicateScore = duplicate.score;
            }
        }

        complaint.aiStatus = result.status;

        if (result.status === "completed") {
            const d = result.data;
            const mappedCategory = mapCategory(d.category, d.department);
            const aiPriority = mapPriority(d.priority);

            if (mappedCategory && complaint.category === "other") {
                complaint.category = mappedCategory;
            }

            const sev = mapPriority(d.severity);
            const candidates = [complaint.priority, aiPriority, sev].filter(Boolean);
            complaint.priority = candidates.reduce((a, b) =>
                PRIORITY_RANK[b] > PRIORITY_RANK[a] ? b : a
            );

            complaint.department = d.department;
            complaint.aiAnalysis = {
                aiCategory: d.category,
                aiPriority: d.priority,
                severity: d.severity,
                urgency: d.urgency,
                departmentConfidence: d.department_confidence,
                slaHours: d.sla && d.sla.recommended_sla_hours,
                etaHours: d.eta && d.eta.estimated_resolution_hours,
                summary: d.summary,
                analyzedAt: new Date()
            };
        } else if (result.error) {
            complaint.aiAnalysis = { error: result.error, analyzedAt: new Date() };
        }

        await complaint.save();
    } catch (err) {
        console.error("AI enrichment failed (complaint kept):", err.message);
    }
    return complaint;
}

module.exports = { enrichComplaint };
