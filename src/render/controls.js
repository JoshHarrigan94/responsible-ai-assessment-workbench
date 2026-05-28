function renderControls() {
  return `
    <section class="workspace">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">Workbench tools</div>
          <h1>Deployment tools</h1>
          <p class="subtitle">
            Export, print, review or reset assessment data.
          </p>
        </div>

        <div class="button-row">
          <button data-set-view="dashboard">Back to dashboard</button>
        </div>
      </div>

      <div class="tool-grid">
        ${renderExportTools()}
        ${renderDataTools()}
        ${renderWorkbenchSummary()}
      </div>
    </section>
  `;
}

function renderExportTools() {
  const assessment = getActiveAssessment();

  return `
    <div class="card">
      <div class="eyebrow">Export</div>
      <h2>Assessment outputs</h2>
      <p class="subtitle">
        Download structured outputs for review, evidence packs or onward documentation.
      </p>

      <div class="button-stack">
        <button 
          ${assessment ? `data-export-json="${assessment.id}"` : "disabled"}
        >
          Export active assessment JSON
        </button>

        <button 
          ${assessment ? `data-export-markdown="${assessment.id}"` : "disabled"}
        >
          Export active assessment Markdown
        </button>

        <button 
          ${assessment ? `data-copy-markdown="${assessment.id}"` : "disabled"}
        >
          Copy active assessment Markdown
        </button>
      </div>
    </div>
  `;
}

function renderDataTools() {
  return `
    <div class="card">
      <div class="eyebrow">Local data</div>
      <h2>Browser storage</h2>
      <p class="subtitle">
        This workbench currently stores assessment data locally in this browser.
      </p>

      <div class="button-stack">
        <button onclick="window.print()">Print current view</button>
        <button class="danger" data-reset-all>Reset all local data</button>
      </div>
    </div>
  `;
}

function renderWorkbenchSummary() {
  const total = state.assessments.length;
  const complete = state.assessments.filter(a => a.status === "Complete").length;
  const inProgress = state.assessments.filter(a => a.status === "In progress").length;

  return `
    <div class="card">
      <div class="eyebrow">Summary</div>
      <h2>Workbench status</h2>

      <div class="mini-grid">
        ${infoRow("Total assessments", total)}
        ${infoRow("In progress", inProgress)}
        ${infoRow("Complete", complete)}
        ${infoRow("Storage mode", "Local browser")}
      </div>
    </div>
  `;
}
