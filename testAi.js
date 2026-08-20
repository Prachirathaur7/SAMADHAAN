const {
    classifyComplaint,
    predictPriority,
    analyzeComplaint
} = require("./src/services/aiService");

const complaint =
    "There is a major water pipeline leakage in our area.";

console.log("\n=== CATEGORY ===");
console.log(classifyComplaint(complaint));

console.log("\n=== PRIORITY ===");
console.log(predictPriority(complaint));

console.log("\n=== COMPLETE ANALYSIS ===");
console.log(analyzeComplaint(complaint));