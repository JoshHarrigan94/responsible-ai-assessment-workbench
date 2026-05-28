function renderResults() {
  const assessment = getActiveAssessment();

  if (!assessment) {
    return emptyState("No assessment selected", "Return to the dashboard and open an assessment.");
  }

  const activeTab = state.ui.activeResultsTab || "summary";

  return `
    <section class="workspace">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">Assessment results</div>
          <h1>${escapeHtml(assessment.name)}</h1>
          <p class="subtitle">
            ${escapeHtml(assessment.routing?.primaryRoute || "Unrouted")} · 
            ${escapeHtml(assessment.routing?.riskLevel || "Unknown risk")} · 
            ${Math.round(assessment.weightedScore || 0)}%
          </p>
        </div>

        <div class="button-row">
          <button data-open-assessment="${assessment.id}">Back to wizard</button>
          <button data-export-json="${assessment.id}">Export JSON</button>
          <button data-export-markdown="${assessment.id}">Export Markdown</button>
          <button data-copy-markdown="${assessment.id}">Copy Markdown</button>
        </div>
      </div>

      <div class="tab-row">
        <button data-results-tab="summary" ${activeTab === "summary" ? "class='active'" : ""}>Summary</button>
        <button data-results-tab="sections" ${activeTab === "sections" ? "class='active'" : ""}>Sections</button>
        <button data-results-tab="controls" ${activeTab === "controls" ? "class='active'" : ""}>Controls</button>
        <button data-results-tab="evidence" ${activeTab === "evidence" ? "class='active'" : ""}>Evidence</button>
      </div>

      ${activeTab === "summary" ? renderResultsSummary(assessment) : ""}
      ${activeTab === "sections" ? renderResultsSections(assessment) : ""}
      ${activeTab === "controls" ? renderResultsControls(assessment) : ""}
      ${activeTab === "evidence" ? renderResultsEvidence(assessment) : ""}
    </section>
  `;
}

function renderResultsSummary(assessment) {
  const routing = assessment.routing || {};

  return `
    <div class="results-grid">
      ${metricCard("Weighted score", `${Math.round(assessment.weightedScore || 0)}%`, "Overall assessment score")}
      ${metricCard("Progress", `${Math.round(assessment.progress || 0)}%`, "Questions answered")}
      ${metricCard("Risk level", routing.riskLevel || "Unknown", "Calculated route risk")}
      ${metricCard("Status", assessment.status || "Unknown", "Assessment state")}
    </div>

    <div class="card">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">Governance route</div>
          <h2>${escapeHtml(routing.primaryRoute || "Unrouted")}</h2>
        </div>
        <span class="pill ${riskPillClass(routing.riskLevel)}">${escapeHtml(routing.riskLevel || "Unknown")}</span>
      </div>

      <div class="divider"></div>

      <div class="mini-grid">
        ${infoRow("Routing confidence", routing.routingConfidence || "Not assessed")}
        ${infoRow("Approval level", routing.approvalLevel || "Not assessed")}
        ${infoRow("Review cadence", routing.reviewCadence || "Not assessed")}
        ${infoRow("AI Act alignment", routing.aiActAlignment || "Not assessed")}
      </div>
    </div>

    ${renderCompactSectionScores(assessment.sectionScores || [])}
  `;
}

function renderCompactSectionScores(sectionScores = []) {
  if (!sectionScores.length) {
    return emptyState("No section scores yet", "Answer questions to generate a section profile.");
  }

  return `
    <div class="card">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">Section profile</div>
          <h2>Risk by assessment area</h2>
        </div>
      </div>

      <div class="divider"></div>

      <div class="list">
        ${sectionScores.map(section => `
          <div class="list-item">
            <div>
              <div class="item-title">${escapeHtml(section.title || section.sectionId || "Section")}</div>
              <div class="item-meta">${escapeHtml(section.level || "Not assessed")}</div>
            </div>
            <span class="pill">${Math.round(section.normalisedScore || section.score || 0)}%</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderResultsSections(assessment) {
  const sectionScores = assessment.sectionScores || [];

  if (!sectionScores.length) {
    return emptyState("No section scores yet", "Complete assessment questions to generate section scoring.");
  }

  return `
    <div class="card">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">Detailed scoring</div>
          <h2>Section scores</h2>
        </div>
      </div>

      <div class="list">
        ${sectionScores.map(section => `
          <div class="list-item stacked">
            <div class="workspace-title-row">
              <div>
                <div class="item-title">${escapeHtml(section.title || section.sectionId || "Section")}</div>
                <div class="item-meta">${escapeHtml(section.level || "Not assessed")}</div>
              </div>
              <span class="pill">${Math.round(section.normalisedScore || 0)}%</span>
            </div>

            <div class="progress">
              <span style="width:${Math.round(section.normalisedScore || 0)}%"></span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderResultsControls(assessment) {
  const controls = assessment.controls || [];

  if (!controls.length) {
    return emptyState("No controls recommended yet", "Answer more questions to generate recommended controls.");
  }

  return `
    <div class="card">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">Recommended controls</div>
          <h2>Control plan</h2>
        </div>
      </div>

      <div class="list">
        ${controls.map(control => `
          <div class="list-item stacked">
            <div class="workspace-title-row">
              <div>
                <div class="item-title">${escapeHtml(control.title || control.id || "Control")}</div>
                <div class="item-meta">${escapeHtml(control.category || "Governance control")}</div>
              </div>
              <span class="pill">${escapeHtml(control.priority || "Recommended")}</span>
            </div>

            ${control.description ? `<p>${escapeHtml(control.description)}</p>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderResultsEvidence(assessment) {
  const answers = assessment.answers || {};

  const answeredQuestions = assessmentQuestions.filter(question => answers[question.id]);

  if (!answeredQuestions.length) {
    return emptyState("No evidence captured yet", "Assessment answers will appear here as evidence.");
  }

  return `
    <div class="card">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">Evidence record</div>
          <h2>Assessment answers</h2>
        </div>
      </div>

      <div class="list">
        ${answeredQuestions.map(question => `
          <div class="list-item stacked">
            <div class="item-title">${escapeHtml(question.title || question.label || question.id)}</div>
            <div class="item-meta">${escapeHtml(question.section || "Assessment")}</div>
            <p>${escapeHtml(getAnswerLabel(question, answers[question.id]))}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
