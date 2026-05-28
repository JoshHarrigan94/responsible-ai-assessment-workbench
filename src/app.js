const app = document.getElementById("app");

function render() {
  app.innerHTML = `
    ${renderTopNav()}
    ${renderMainView()}
    ${renderToast()}
  `;
}

function renderTopNav() {
  return `
    <header class="top-nav">
      <div>
        <strong>Responsible AI Workbench</strong>
        <span>Assessment, routing and control evidence</span>
      </div>

      <nav>
        <button data-set-view="dashboard" class="${state.activeView === "dashboard" ? "active" : ""}">
          Dashboard
        </button>

        <button data-set-view="wizard" class="${state.activeView === "wizard" ? "active" : ""}">
          Assessment
        </button>

        <button data-set-view="results" class="${state.activeView === "results" ? "active" : ""}">
          Results
        </button>

        <button data-set-view="controls" class="${state.activeView === "controls" ? "active" : ""}">
          Tools
        </button>
      </nav>
    </header>
  `;
}

function renderMainView() {
  if (state.activeView === "wizard") return renderWizard();
  if (state.activeView === "results") return renderResults();
  if (state.activeView === "controls") return renderControls();

  return renderDashboard();
}

function renderToast() {
  if (!state.ui.toast) return "";

  return `
    <div class="toast">
      ${escapeHtml(state.ui.toast.message)}
    </div>
  `;
}

document.addEventListener("submit", event => {
  const createForm = event.target.closest("[data-create-assessment]");

  if (createForm) {
    event.preventDefault();
    createAssessmentFromForm(new FormData(createForm));
  }
});

document.addEventListener("input", event => {
  const filterInput = event.target.closest("[data-filter]");

  if (filterInput) {
    setFilter(filterInput.dataset.filter, filterInput.value);
    return;
  }

  const answerInput = event.target.closest("[data-answer-question]");

  if (answerInput) {
    updateAssessmentAnswerQuiet(
      answerInput.dataset.assessmentId,
      answerInput.dataset.answerQuestion,
      answerInput.value
    );
  }
});

document.addEventListener("change", event => {
  const answerInput = event.target.closest("[data-answer-question]");

  if (answerInput) {
    updateAssessmentAnswer(
      answerInput.dataset.assessmentId,
      answerInput.dataset.answerQuestion,
      answerInput.value
    );
  }
});

document.addEventListener("click", event => {
  const setViewButton = event.target.closest("[data-set-view]");
  if (setViewButton) {
    setView(setViewButton.dataset.setView);
    return;
  }

  const openAssessmentButton = event.target.closest("[data-open-assessment]");
  if (openAssessmentButton) {
    setView("wizard", openAssessmentButton.dataset.openAssessment);
    return;
  }

  const viewResultsButton = event.target.closest("[data-view-results]");
  if (viewResultsButton) {
    setView("results", viewResultsButton.dataset.viewResults);
    return;
  }

  const duplicateButton = event.target.closest("[data-duplicate-assessment]");
  if (duplicateButton) {
    duplicateAssessment(duplicateButton.dataset.duplicateAssessment);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-assessment]");
  if (deleteButton) {
    deleteAssessment(deleteButton.dataset.deleteAssessment);
    return;
  }

  const exportJsonButton = event.target.closest("[data-export-json]");
  if (exportJsonButton) {
    exportAssessmentJson(exportJsonButton.dataset.exportJson);
    return;
  }

  const exportMarkdownButton = event.target.closest("[data-export-markdown]");
  if (exportMarkdownButton) {
    exportAssessmentMarkdown(exportMarkdownButton.dataset.exportMarkdown);
    return;
  }

  const copyMarkdownButton = event.target.closest("[data-copy-markdown]");
  if (copyMarkdownButton) {
    copyAssessmentMarkdown(copyMarkdownButton.dataset.copyMarkdown);
    return;
  }

  const resetButton = event.target.closest("[data-reset-all]");
  if (resetButton) {
    resetAllData();
    return;
  }

  const resultsTabButton = event.target.closest("[data-results-tab]");
  if (resultsTabButton) {
    setActiveResultsTab(resultsTabButton.dataset.resultsTab);
    return;
  }

  const scrollQuestionButton = event.target.closest("[data-scroll-question]");
  if (scrollQuestionButton) {
    const questionId = scrollQuestionButton.dataset.scrollQuestion;
    const element = document.getElementById(`question-${questionId}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }
});

render();
