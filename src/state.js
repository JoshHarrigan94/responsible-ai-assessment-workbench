const STORAGE_KEY = "responsible-ai-assessment-workbench-v1";

const defaultState = {
  activeView: "dashboard",
  activeAssessmentId: null,
  assessments: [],
  filters: {
    query: "",
    status: "all",
    risk: "all"
  },
  ui: {
    toast: null,
    selectedQuestionId: null,
    activeResultsTab: "summary"
  }
};

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return clone(defaultState);
    }

    const parsed = JSON.parse(saved);

    return {
      ...clone(defaultState),
      ...parsed,
      filters: {
        ...defaultState.filters,
        ...(parsed.filters || {})
      },
      ui: {
        ...defaultState.ui,
        ...(parsed.ui || {})
      },
      assessments: Array.isArray(parsed.assessments)
        ? parsed.assessments.map(recalculateAssessment)
        : []
    };
  } catch (error) {
    console.warn("Unable to load state. Resetting workbench.", error);
    return clone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setView(view, assessmentId = null) {
  state.activeView = view;

  if (assessmentId) {
    state.activeAssessmentId = assessmentId;
  }

  saveState();
  render();
}

function showToast(message) {
  state.ui.toast = {
    id: uid("toast"),
    message,
    createdAt: nowIso()
  };

  saveState();
  render();

  setTimeout(() => {
    if (state.ui.toast && state.ui.toast.message === message) {
      state.ui.toast = null;
      saveState();
      render();
    }
  }, 2200);
}

function createAssessmentFromForm(formData) {
  const id = uid("assessment");

  const assessment = recalculateAssessment({
    id,
    name: formData.get("name")?.trim() || "Untitled assessment",
    owner: formData.get("owner")?.trim() || "",
    entity: formData.get("entity")?.trim() || "",
    description: formData.get("description")?.trim() || "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    status: "Not started",
    answers: {},
    notes: [],
    metadata: {
      businessCriticality: formData.get("businessCriticality") || "medium",
      dataSensitivity: formData.get("dataSensitivity") || "internal",
      aiSystemType: formData.get("aiSystemType") || "decision-support"
    }
  });

  state.assessments = [assessment, ...state.assessments];
  state.activeAssessmentId = id;
  state.activeView = "wizard";

  saveState();
  render();
  showToast("Assessment created");
}

function updateAssessmentAnswerQuiet(id, questionId, value) {
  state.assessments = state.assessments.map(assessment => {
    if (assessment.id !== id) return assessment;

    const next = {
      ...assessment,
      answers: {
        ...assessment.answers,
        [questionId]: value
      },
      metadata: {
        ...(assessment.metadata || {}),
        updatedAt: nowIso()
      },
      updatedAt: nowIso()
    };

    return recalculateAssessment(next);
  });

  saveState();

  const status = document.querySelector(`[data-question-save-status="${questionId}"]`);
  if (status) status.textContent = "✓ Saved";
}

function updateAssessmentAnswer(id, questionId, value) {
  updateAssessmentAnswerQuiet(id, questionId, value);
  render();
}

function deleteAssessment(id) {
  state.assessments = state.assessments.filter(assessment => assessment.id !== id);

  if (state.activeAssessmentId === id) {
    state.activeAssessmentId = state.assessments[0]?.id || null;
    state.activeView = state.assessments.length ? "dashboard" : "dashboard";
  }

  saveState();
  render();
  showToast("Assessment deleted");
}

function duplicateAssessment(id) {
  const source = state.assessments.find(assessment => assessment.id === id);

  if (!source) return;

  const copy = recalculateAssessment({
    ...clone(source),
    id: uid("assessment"),
    name: `${source.name} Copy`,
    createdAt: nowIso(),
    updatedAt: nowIso()
  });

  state.assessments = [copy, ...state.assessments];
  state.activeAssessmentId = copy.id;
  state.activeView = "wizard";

  saveState();
  render();
  showToast("Assessment duplicated");
}

function resetAllData() {
  const confirmed = window.confirm(
    "This will permanently remove all local assessment data from this browser. Continue?"
  );

  if (!confirmed) return;

  state = clone(defaultState);
  saveState();
  render();
  showToast("Workbench reset");
}

function setFilter(name, value) {
  state.filters = {
    ...state.filters,
    [name]: value
  };

  saveState();
  render();
}

function setActiveResultsTab(tab) {
  state.ui.activeResultsTab = tab;
  saveState();
  render();
}

function getActiveAssessment() {
  return state.assessments.find(
    assessment => assessment.id === state.activeAssessmentId
  ) || state.assessments[0] || null;
}
