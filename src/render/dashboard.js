function renderDashboard() {
  const assessments = getFilteredAssessments();

  return `
    <section class="workspace">
      ${renderDashboardHero()}
      ${renderCreateAssessmentCard()}
      ${renderAssessmentFilters()}
      ${renderAssessmentList(assessments)}
    </section>
  `;
}

function renderDashboardHero() {
  const total = state.assessments.length;
  const inProgress = state.assessments.filter(a => a.status === "In progress").length;
  const completed = state.assessments.filter(a => a.status === "Complete").length;

  return `
    <div class="hero">
      <div>
        <div class="eyebrow">Responsible AI Workbench</div>
        <h1>AI assessment workspace</h1>
        <p>
          Create, assess, route, score and evidence AI use cases through a structured governance workflow.
        </p>
      </div>

      <div class="hero-metrics">
        ${metricCard("Assessments", total, "Total records")}
        ${metricCard("In progress", inProgress, "Active reviews")}
        ${metricCard("Complete", completed, "Finished reviews")}
      </div>
    </div>
  `;
}

function renderCreateAssessmentCard() {
  return `
    <div class="card">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">New assessment</div>
          <h2>Create assessment</h2>
        </div>
      </div>

      <form data-create-assessment class="form-grid">
        <label>
          Assessment name
          <input name="name" placeholder="e.g. Customer service AI assistant" required />
        </label>

        <label>
          Owner
          <input name="owner" placeholder="Business owner or accountable lead" />
        </label>

        <label>
          Entity
          <input name="entity" placeholder="Business unit / entity" />
        </label>

        <label>
          Business criticality
          <select name="businessCriticality">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Data sensitivity
          <select name="dataSensitivity">
            <option value="public">Public</option>
            <option value="internal" selected>Internal</option>
            <option value="confidential">Confidential</option>
            <option value="special-category">Special category / sensitive</option>
          </select>
        </label>

        <label>
          AI system type
          <select name="aiSystemType">
            <option value="decision-support" selected>Decision support</option>
            <option value="automation">Automation</option>
            <option value="generative-ai">Generative AI</option>
            <option value="classification">Classification / prediction</option>
            <option value="monitoring">Monitoring / surveillance</option>
          </select>
        </label>

        <label class="full-span">
          Description
          <textarea name="description" placeholder="Briefly describe the AI use case, decision, data, users and intended outcome."></textarea>
        </label>

        <div class="form-actions full-span">
          <button class="primary" type="submit">Create assessment</button>
        </div>
      </form>
    </div>
  `;
}

function renderAssessmentFilters() {
  return `
    <div class="card">
      <div class="toolbar">
        <input 
          data-filter="query"
          value="${escapeAttr(state.filters.query)}"
          placeholder="Search assessments..."
        />

        <select data-filter="status">
          <option value="all" ${state.filters.status === "all" ? "selected" : ""}>All statuses</option>
          <option value="Not started" ${state.filters.status === "Not started" ? "selected" : ""}>Not started</option>
          <option value="In progress" ${state.filters.status === "In progress" ? "selected" : ""}>In progress</option>
          <option value="Complete" ${state.filters.status === "Complete" ? "selected" : ""}>Complete</option>
        </select>

        <select data-filter="risk">
          <option value="all" ${state.filters.risk === "all" ? "selected" : ""}>All risks</option>
          <option value="Low" ${state.filters.risk === "Low" ? "selected" : ""}>Low</option>
          <option value="Medium" ${state.filters.risk === "Medium" ? "selected" : ""}>Medium</option>
          <option value="High" ${state.filters.risk === "High" ? "selected" : ""}>High</option>
        </select>
      </div>
    </div>
  `;
}

function renderAssessmentList(assessments) {
  if (!assessments.length) {
    return emptyState(
      "No assessments found",
      "Create your first assessment or adjust your filters."
    );
  }

  return `
    <div class="assessment-grid">
      ${assessments.map(renderAssessmentCard).join("")}
    </div>
  `;
}

function renderAssessmentCard(assessment) {
  const route = assessment.routing?.primaryRoute || "Unrouted";
  const risk = assessment.routing?.riskLevel || "Unknown";

  return `
    <article class="card assessment-card">
      <div class="card-topline">
        <span class="pill ${riskPillClass(risk)}">${escapeHtml(risk)}</span>
        <span class="muted">${escapeHtml(assessment.status || "Not started")}</span>
      </div>

      <h3>${escapeHtml(assessment.name)}</h3>

      <p>${escapeHtml(truncateText(assessment.description || "No description added.", 160))}</p>

      <div class="mini-grid">
        ${infoRow("Owner", assessment.owner || "Unassigned")}
        ${infoRow("Entity", assessment.entity || "Unknown")}
        ${infoRow("Route", route)}
        ${infoRow("Progress", `${Math.round(assessment.progress || 0)}%`)}
      </div>

      <div class="progress">
        <span style="width:${Math.round(assessment.progress || 0)}%"></span>
      </div>

      <div class="card-actions">
        <button data-open-assessment="${assessment.id}">Open</button>
        <button data-view-results="${assessment.id}">Results</button>
        <button data-duplicate-assessment="${assessment.id}">Duplicate</button>
        <button class="danger" data-delete-assessment="${assessment.id}">Delete</button>
      </div>
    </article>
  `;
}

function getFilteredAssessments() {
  const query = String(state.filters.query || "").toLowerCase();
  const status = state.filters.status || "all";
  const risk = state.filters.risk || "all";

  return state.assessments.filter(assessment => {
    const haystack = [
      assessment.name,
      assessment.owner,
      assessment.entity,
      assessment.description,
      assessment.routing?.primaryRoute,
      assessment.routing?.riskLevel
    ].join(" ").toLowerCase();

    const matchesQuery = !query || haystack.includes(query);
    const matchesStatus = status === "all" || assessment.status === status;
    const matchesRisk = risk === "all" || assessment.routing?.riskLevel === risk;

    return matchesQuery && matchesStatus && matchesRisk;
  });
}
