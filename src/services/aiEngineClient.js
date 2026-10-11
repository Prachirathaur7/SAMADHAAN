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