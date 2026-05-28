function renderWizard() {
  const assessment = getActiveAssessment();

  if (!assessment) {
    return emptyState("No assessment selected", "Return to the dashboard and create or open an assessment.");
  }

  const answeredCount = Object.values(assessment.answers || {}).filter(Boolean).length;
  const totalQuestions = assessmentQuestions.length;
  const currentSectionProgress = Math.round(assessment.progress || 0);

  return `
    <section class="workspace">
      <div class="workspace-title-row">
        <div>
          <div class="eyebrow">Assessment wizard</div>
          <h1>${escapeHtml(assessment.name)}</h1>
          <p class="subtitle">
            ${answeredCount} of ${totalQuestions} answered · ${currentSectionProgress}% complete
          </p>
        </div>

        <div class="button-row">
          <button data-set-view="dashboard">Back</button>
          <button data-view-results="${assessment.id}">Results</button>
        </div>
      </div>

      <div class="progress">
        <span style="width:${currentSectionProgress}%"></span>
      </div>

      <div class="wizard-grid">
        <aside class="card wizard-sidebar">
          ${renderQuestionNavigation(assessment)}
        </aside>

        <main class="question-stack">
          ${assessmentQuestions.map(question => renderQuestionCard(assessment, question)).join("")}
        </main>
      </div>
    </section>
  `;
}

function renderQuestionNavigation(assessment) {
  const sections = groupQuestionsBySection();

  return `
    <div class="eyebrow">Sections</div>

    <div class="section-nav">
      ${Object.entries(sections).map(([section, questions]) => {
        const answered = questions.filter(q => assessment.answers?.[q.id]).length;
        const total = questions.length;

        return `
          <button data-scroll-question="${questions[0].id}">
            <span>${escapeHtml(section)}</span>
            <small>${answered}/${total}</small>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderQuestionCard(assessment, question) {
  const value = assessment.answers?.[question.id] || "";
  const answered = Boolean(value);

  return `
    <article class="card question-card" id="question-${escapeAttr(question.id)}">
      <div class="question-header">
        <div>
          <div class="eyebrow">${escapeHtml(question.section || "Assessment")}</div>
          <h2>${escapeHtml(question.title || question.label || question.id)}</h2>
        </div>

        <div 
          class="question-status ${answered ? "" : "muted"}" 
          data-question-save-status="${escapeAttr(question.id)}"
        >
          ${answered ? "✓ Saved" : "Not answered"}
        </div>
      </div>

      ${question.description ? `<p class="subtitle">${escapeHtml(question.description)}</p>` : ""}

      ${renderQuestionInput(assessment, question)}

      ${question.guidance ? `
        <div class="guidance">
          <strong>Guidance</strong>
          <p>${escapeHtml(question.guidance)}</p>
        </div>
      ` : ""}
    </article>
  `;
}

function renderQuestionInput(assessment, question) {
  const value = assessment.answers?.[question.id] || "";

  if (question.type === "select" || question.options) {
    return `
      <select 
        data-answer-question="${escapeAttr(question.id)}" 
        data-assessment-id="${escapeAttr(assessment.id)}"
      >
        <option value="">Select an answer</option>
        ${(question.options || []).map(option => {
          const optionValue = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;

          return `
            <option 
              value="${escapeAttr(optionValue)}" 
              ${String(value) === String(optionValue) ? "selected" : ""}
            >
              ${escapeHtml(optionLabel)}
            </option>
          `;
        }).join("")}
      </select>
    `;
  }

  if (question.type === "textarea" || question.longText) {
    return `
      <textarea
        data-answer-question="${escapeAttr(question.id)}"
        data-assessment-id="${escapeAttr(assessment.id)}"
        placeholder="${escapeAttr(question.placeholder || "Enter your answer...")}"
      >${escapeHtml(value)}</textarea>
    `;
  }

  return `
    <input
      data-answer-question="${escapeAttr(question.id)}"
      data-assessment-id="${escapeAttr(assessment.id)}"
      value="${escapeAttr(value)}"
      placeholder="${escapeAttr(question.placeholder || "Enter your answer...")}"
    />
  `;
}

function groupQuestionsBySection() {
  return assessmentQuestions.reduce((groups, question) => {
    const section = question.section || "Assessment";

    if (!groups[section]) {
      groups[section] = [];
    }

    groups[section].push(question);

    return groups;
  }, {});
}
