const riskBands = [
  {
    id: "low",
    label: "Low risk",
    min: 0,
    max: 24,
    className: "green",
    summary: "The use case appears low risk, provided normal business controls and documentation are maintained."
  },
  {
    id: "medium",
    label: "Medium risk",
    min: 25,
    max: 54,
    className: "amber",
    summary: "The use case has material risk indicators and should have defined controls, ownership, and review evidence."
  },
  {
    id: "high",
    label: "High risk",
    min: 55,
    max: 100,
    className: "red",
    summary: "The use case has significant risk indicators and should receive enhanced governance, assurance, and approval."
  }
];

function getQuestionScore(question, answerValue) {
  if (!question || answerValue === undefined || answerValue === null || answerValue === "") {
    return 0;
  }

  if (question.type === "select") {
    const option = (question.options || []).find(item => String(item.value) === String(answerValue));
    return Number(option?.score || 0);
  }

  if (question.scoring) {
    const text = String(answerValue).trim().toLowerCase();

    if (!text) return 0;
    if (text.length < 30) return Number(question.scoring.unclear || 2);
    if (text.length < 140) return Number(question.scoring.narrow || 1);

    return Number(question.scoring.broad || 2);
  }

  return 0;
}

function getMaxQuestionScore(question) {
  if (!question) return 0;

  if (question.type === "select") {
    return Math.max(...(question.options || []).map(option => Number(option.score || 0)), 0);
  }

  if (question.scoring) {
    return Math.max(...Object.values(question.scoring).map(Number), 0);
  }

  return 0;
}
const governanceRouteOrder = {
  lightweight: 1,
  standard: 2,
  enhanced: 3,
  critical: 4
};

function getGovernanceRouteById(routeId) {
  return governanceRoutes.find(route => route.id === routeId) || governanceRoutes[0];
}

function getSelectedQuestionOption(question, answerValue) {
  if (!question || question.type !== "select") return null;

  return (question.options || []).find(option => String(option.value) === String(answerValue)) || null;
}

function getHighestGovernanceRoute(routeIds = []) {
  if (!routeIds.length) return "lightweight";

  return routeIds.reduce((highest, current) => {
    const highestLevel = governanceRouteOrder[highest] || 1;
    const currentLevel = governanceRouteOrder[current] || 1;

    return currentLevel > highestLevel ? current : highest;
  }, "lightweight");
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function getControlById(controlId) {
  return controlLibrary[controlId] || null;
}

function calculateControlRecommendations(routing) {
  const routeId = routing.routeId || "lightweight";
  const triggerIds = (routing.triggers || []).map(trigger => trigger.id);

  const baselineControlIds = routeBaselineControls[routeId] || [];
  const triggeredControlIds = triggerIds.flatMap(triggerId => triggerControlMap[triggerId] || []);

  const allControlIds = uniqueValues([
    ...baselineControlIds,
    ...triggeredControlIds
  ]);

  const controls = allControlIds
    .map(controlId => {
      const control = getControlById(controlId);
      if (!control) return null;

      const triggeredBy = (routing.triggers || [])
        .filter(trigger => (triggerControlMap[trigger.id] || []).includes(controlId))
        .map(trigger => trigger.id);

      const savedEvidence = routing.assessment?.controlEvidence?.[controlId] || {};

return {
  id: controlId,
  ...control,
  triggeredBy,
  evidenceStatus: savedEvidence.evidenceStatus || "not-started",
  evidenceNotes: savedEvidence.evidenceNotes || "",
  evidenceOwner: savedEvidence.evidenceOwner || "",
  evidenceUpdatedAt: savedEvidence.updatedAt || "",
  evidenceLinks: savedEvidence.evidenceLinks || [],
  evidenceFiles: savedEvidence.evidenceFiles || []
};
    })
    .filter(Boolean);

  const required = controls.filter(control => control.priority === "required");
  const recommended = controls.filter(control => control.priority === "recommended");
  const optional = controls.filter(control => control.priority === "optional");

  return {
    all: controls,
    required,
    recommended,
    optional
  };
}

function calculateGovernanceRouting(assessment) {
  const answers = assessment.answers || {};

  const triggeredRoutes = [];
  const triggers = [];
  const primarySignals = [];
  const domainScores = {};
  const unansweredPrimaryQuestions = [];

  assessmentQuestions.forEach(question => {
    const answerValue = answers[question.id];
    const answered = answerValue !== undefined && answerValue !== null && answerValue !== "";

    if (question.isPrimaryTrigger && !answered) {
      unansweredPrimaryQuestions.push(question.id);
    }

    if (!answered) return;

    const selectedOption = getSelectedQuestionOption(question, answerValue);
    const questionScore = getQuestionScore(question, answerValue);
    const domainId = question.domainId || "general";

    if (!domainScores[domainId]) {
      domainScores[domainId] = {
        domainId,
        rawScore: 0,
        maxScore: 0,
        questions: 0
      };
    }

    domainScores[domainId].rawScore += questionScore;
    domainScores[domainId].maxScore += getMaxQuestionScore(question);
    domainScores[domainId].questions += 1;

    if (selectedOption?.routeImpact) {
      triggeredRoutes.push(selectedOption.routeImpact);
    }

    if (selectedOption?.triggers?.length) {
      selectedOption.triggers.forEach(triggerId => {
        triggers.push({
          id: triggerId,
          questionId: question.id,
          questionLabel: question.label,
          answer: selectedOption.label,
          domainId: question.domainId,
          sectionId: question.sectionId,
          routeImpact: selectedOption.routeImpact || "standard",
          score: Number(selectedOption.score || 0),
          isPrimaryTrigger: Boolean(question.isPrimaryTrigger)
        });
      });
    }

    if (question.isPrimaryTrigger) {
      primarySignals.push({
        questionId: question.id,
        questionLabel: question.label,
        domainId: question.domainId,
        answer: selectedOption?.label || getAnswerLabel(question, answerValue),
        routeImpact: selectedOption?.routeImpact || "standard",
        score: questionScore
      });
    }
  });

  const routeId = getHighestGovernanceRoute(triggeredRoutes);
  const route = getGovernanceRouteById(routeId);

  const domainProfile = Object.values(domainScores).map(domain => ({
    ...domain,
    percentage: domain.maxScore ? Math.round((domain.rawScore / domain.maxScore) * 100) : 0
  }));

  const criticalTriggers = triggers.filter(trigger => trigger.routeImpact === "critical");
  const enhancedTriggers = triggers.filter(trigger => trigger.routeImpact === "enhanced");

  let routingConfidence = "High";

  if (unansweredPrimaryQuestions.length >= 3) {
    routingConfidence = "Low";
  } else if (unansweredPrimaryQuestions.length > 0) {
    routingConfidence = "Medium";
  }
  const controlRecommendations = calculateControlRecommendations({
  assessment,
  routeId,
  route,
  triggers,
  primarySignals,
  domainProfile,
  criticalTriggers,
  enhancedTriggers
});
  return {
    routeId,
    route,
    routeLabel: route.label,
    routeLevel: route.level,
    routeDescription: route.description,
    approvalLevel: route.approvalLevel,
    assuranceDepth: route.assuranceDepth,
    triggers,
    primarySignals,
    domainProfile,
    criticalTriggers,
    enhancedTriggers,
    unansweredPrimaryQuestions,
        routingConfidence,
    controlRecommendations
  };
}
function calculateAssessmentScore(assessment) {
  if (!assessmentQuestions.length) {
    return {
      rawScore: 0,
      maxScore: 0,
      weightedScore: 0,
      riskLevel: "Not scored",
      riskBand: null,
      sectionScores: [],
      drivers: []
    };
  }

  let rawScore = 0;
  let maxScore = 0;
  const drivers = [];

  const sectionScores = assessmentSections.map(section => {
    const questions = getQuestionsForSection(section.id);
    let sectionRaw = 0;
    let sectionMax = 0;
    let answered = 0;

    questions.forEach(question => {
      const answerValue = assessment.answers?.[question.id];
      const questionScore = getQuestionScore(question, answerValue);
      const questionMax = getMaxQuestionScore(question);

      sectionRaw += questionScore;
      sectionMax += questionMax;

      if (answerValue !== undefined && answerValue !== null && answerValue !== "") {
        answered += 1;
      }

      if (questionScore >= 4) {
        drivers.push({
          id: question.id,
          sectionId: section.id,
          sectionTitle: section.title,
          label: question.label,
          score: questionScore,
          answer: getAnswerLabel(question, answerValue),
          severity: questionScore >= 5 ? "High" : "Medium"
        });
      }
    });

    rawScore += sectionRaw;
    maxScore += sectionMax;

    return {
      sectionId: section.id,
      title: section.title,
      rawScore: sectionRaw,
      maxScore: sectionMax,
      percentage: sectionMax ? Math.round((sectionRaw / sectionMax) * 100) : 0,
      answered,
      total: questions.length
    };
  });

  const weightedScore = maxScore ? Math.round((rawScore / maxScore) * 100) : 0;
  const riskBand = riskBands.find(band => weightedScore >= band.min && weightedScore <= band.max) || riskBands[0];

  return {
    rawScore,
    maxScore,
    weightedScore,
    riskLevel: riskBand.label,
    riskBand,
    sectionScores,
    drivers: drivers.sort((a, b) => b.score - a.score)
  };
}

function getAnswerLabel(question, answerValue) {
  if (!question) return "Unknown";

  if (question.type === "select") {
    const option = (question.options || []).find(item => String(item.value) === String(answerValue));
    return option?.label || "Not answered";
  }

  if (!answerValue) return "Not answered";

  return String(answerValue).length > 90
    ? `${String(answerValue).slice(0, 90)}...`
    : String(answerValue);
}

function getAssessmentStatus(assessment, progress, weightedScore) {
  const routeId = assessment.governanceRouteId || "lightweight";

  if (progress < 100) return "Draft";

  if (routeId === "critical") return "Senior review required";
  if (routeId === "enhanced") return "Enhanced review required";

  if (weightedScore >= 55) return "Enhanced review required";
  if (weightedScore >= 25) return "Review required";

  return "Complete";
}
