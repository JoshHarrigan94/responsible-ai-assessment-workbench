function buildAssessmentExportPayload(assessment) {
  if (!assessment) return null;

  return {
    id: assessment.id,
    name: assessment.name,
    owner: assessment.owner,
    entity: assessment.entity,
    createdAt: assessment.createdAt,
    updatedAt: assessment.updatedAt,
    status: assessment.status,
    progress: assessment.progress,
    routing: assessment.routing,
    sectionScores: assessment.sectionScores,
    weightedScore: assessment.weightedScore,
    controls: assessment.controls,
    answers: assessment.answers,
    metadata: assessment.metadata
  };
}

function exportAssessmentJson(id) {
  const assessment = state.assessments.find(a => a.id === id);

  if (!assessment) return;

  const payload = buildAssessmentExportPayload(assessment);

  downloadTextFile(
    `${assessment.name || "assessment"}.json`,
    JSON.stringify(payload, null, 2),
    "application/json"
  );
}

function exportAssessmentMarkdown(id) {
  const assessment = state.assessments.find(a => a.id === id);

  if (!assessment) return;

  const markdown = generateAssessmentMarkdown(assessment);

  downloadTextFile(
    `${assessment.name || "assessment"}.md`,
    markdown,
    "text/markdown"
  );
}

function copyAssessmentMarkdown(id) {
  const assessment = state.assessments.find(a => a.id === id);

  if (!assessment) return;

  const markdown = generateAssessmentMarkdown(assessment);

  navigator.clipboard.writeText(markdown);

  showToast("Markdown copied to clipboard");
}

function generateAssessmentMarkdown(assessment) {
  const routing = assessment.routing || {};
  const controls = assessment.controls || [];
  const sectionScores = assessment.sectionScores || [];

  return `
# ${assessment.name || "Assessment"}

## Overview

- Owner: ${assessment.owner || "Unknown"}
- Entity: ${assessment.entity || "Unknown"}
- Status: ${assessment.status || "Unknown"}
- Weighted Score: ${Math.round(assessment.weightedScore || 0)}%
- Progress: ${Math.round(assessment.progress || 0)}%

---

## Governance Routing

- Primary Route: ${routing.primaryRoute || "Unknown"}
- Risk Level: ${routing.riskLevel || "Unknown"}
- Confidence: ${routing.routingConfidence || "Unknown"}

---

## Section Scores

${sectionScores.map(section => `
### ${section.title || section.sectionId}

- Score: ${Math.round(section.normalisedScore || 0)}%
- Level: ${section.level || "Unknown"}
`).join("\n")}

---

## Recommended Controls

${controls.map(control => `
- ${control.title || control.id}
`).join("\n")}

---
`;
}

function downloadTextFile(filename, content, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();

  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}
