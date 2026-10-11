const classifyComplaint = (text = "") => {
    const complaint = text.toLowerCase();

    const categories = {
        water: [
            "water",
            "pipeline",
            "tap",
            "drinking water",
            "water supply",
            "leakage"
        ],

        electricity: [
            "electricity",
            "power",
            "street light",
            "transformer",
            "current",
            "electric pole"
        ],

        sanitation: [
            "garbage",
            "waste",
            "drainage",
            "sewage",
            "dirty",
            "sanitation"
        ],

        roads: [
            "road",
            "pothole",
            "street",
            "footpath",
            "traffic"
        ],

        public_safety: [
            "crime",
            "unsafe",
            "accident",
            "danger",
            "security"
        ]
    };

    for (const [category, keywords] of Object.entries(categories)) {
        const matchedKeyword = keywords.find((keyword) =>
            complaint.includes(keyword)
        );

        if (matchedKeyword) {
            return {
                category,
                confidence: 0.85,
                matchedKeyword
            };
        }
    }

    return {
        category: "other",
        confidence: 0.40,
        matchedKeyword: null
    };
};


const predictPriority = (text = "") => {
    const complaint = text.toLowerCase();

    const criticalKeywords = [
        "fire",
        "accident",
        "emergency",
        "life threatening",
        "danger",
        "electric shock"
    ];

    const highKeywords = [
        "flood",
        "sewage",
        "major leakage",
        "broken transformer",
        "unsafe road"
    ];

    if (
        criticalKeywords.some((keyword) =>
            complaint.includes(keyword)
        )
    ) {
        return {
            priority: "critical",
            score: 0.95
        };
    }

    if (
        highKeywords.some((keyword) =>
            complaint.includes(keyword)
        )
    ) {
        return {
            priority: "high",
            score: 0.85
        };
    }

    return {
        priority: "medium",
        score: 0.60
    };
};


const analyzeComplaint = (text = "") => {
    const classification = classifyComplaint(text);
    const priority = predictPriority(text);

    return {
        category: classification.category,
        categoryConfidence: classification.confidence,

        priority: priority.priority,
        priorityScore: priority.score,

        matchedKeyword: classification.matchedKeyword
    };
};


module.exports = {
    classifyComplaint,
    predictPriority,
    analyzeComplaint
};
