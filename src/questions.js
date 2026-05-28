const governanceRoutes = [
  {
    id: "lightweight",
    label: "Lightweight Review",
    level: 1,
    description: "Low-risk internal productivity or experimentation use cases.",
    approvalLevel: "Line manager / business owner",
    assuranceDepth: "Basic registration and responsible use acknowledgement"
  },
  {
    id: "standard",
    label: "Standard Governance",
    level: 2,
    description: "Operational AI support with moderate governance exposure.",
    approvalLevel: "Business owner",
    assuranceDepth: "Structured assessment, ownership, and monitoring expectations"
  },
  {
    id: "enhanced",
    label: "Enhanced Governance",
    level: 3,
    description: "Customer-affecting, regulated, or higher-risk AI systems.",
    approvalLevel: "Governance forum / cross-functional review",
    assuranceDepth: "Formal review, policy mapping, control evidence, and technical assessment"
  },
  {
    id: "critical",
    label: "Critical / Restricted",
    level: 4,
    description: "High-impact, autonomous, vulnerable-customer, or materially regulated AI systems.",
    approvalLevel: "Senior governance approval",
    assuranceDepth: "Enhanced assurance, mandatory validation, continuous monitoring, and explicit approval gates"
  }
];

const governanceDomains = [
  {
    id: "context",
    label: "Use Case Context",
    purpose: "Understand the purpose, ownership, users, and operating environment of the AI use case."
  },
  {
    id: "userImpact",
    label: "User & Customer Impact",
    purpose: "Identify who may be affected and whether outcomes could materially influence customers, colleagues, or external users."
  },
  {
    id: "dataSensitivity",
    label: "Data Sensitivity",
    purpose: "Understand privacy, confidentiality, financial data, and special-category data exposure."
  },
  {
    id: "automationAutonomy",
    label: "Automation & Autonomy",
    purpose: "Assess whether AI supports, recommends, automates, or directly performs actions."
  },
  {
    id: "regulatoryExposure",
    label: "Regulatory Exposure",
    purpose: "Identify links to financial services regulation, Consumer Duty, GDPR, EU AI Act-style obligations, and regulated decision-making."
  },
  {
    id: "externalExposure",
    label: "External Exposure",
    purpose: "Assess whether the AI system is internally contained, vendor-hosted, customer-facing, or publicly exposed."
  },
  {
    id: "explainability",
    label: "Explainability",
    purpose: "Assess whether outputs can be understood, justified, challenged, and communicated."
  },
  {
    id: "monitoring",
    label: "Monitoring",
    purpose: "Assess whether performance, incidents, outputs, and controls can be monitored over time."
  },
  {
    id: "humanOversight",
    label: "Human Oversight",
    purpose: "Assess whether human review is meaningful, skilled, timely, and able to intervene."
  },
  {
    id: "governanceReadiness",
    label: "Governance Readiness",
    purpose: "Assess ownership, documentation, approvals, and readiness for controlled deployment."
  }
];

const assessmentSections = [
  {
    id: "context",
    title: "Use case context",
    domainId: "context",
    routeRelevance: ["lightweight", "standard", "enhanced", "critical"],
    description: "Understand what the AI system is being used for, who owns it, and where it sits in the business process."
  },
  {
    id: "impact",
    title: "People and customer impact",
    domainId: "userImpact",
    routeRelevance: ["standard", "enhanced", "critical"],
    description: "Assess whether the use case affects customers, colleagues, vulnerable groups, decisions, or access to services."
  },
  {
    id: "data",
    title: "Data and privacy",
    domainId: "dataSensitivity",
    routeRelevance: ["standard", "enhanced", "critical"],
    description: "Identify personal data, sensitive data, financial data, data quality risks, and privacy obligations."
  },
  {
    id: "automation",
    title: "Automation and autonomy",
    domainId: "automationAutonomy",
    routeRelevance: ["standard", "enhanced", "critical"],
    description: "Understand whether AI outputs are advisory, decision-supporting, workflow-triggering, or autonomous."
  },
  {
    id: "regulation",
    title: "Regulatory exposure",
    domainId: "regulatoryExposure",
    routeRelevance: ["enhanced", "critical"],
    description: "Identify whether the use case creates financial services, Consumer Duty, GDPR, or EU AI Act-style governance obligations."
  },
  {
    id: "model",
    title: "Model behaviour and reliability",
    domainId: "explainability",
    routeRelevance: ["standard", "enhanced", "critical"],
    description: "Review explainability, accuracy, hallucination risk, testing, reliability, and operational dependency."
  },
  {
    id: "governance",
    title: "Governance and assurance",
    domainId: "governanceReadiness",
    routeRelevance: ["lightweight", "standard", "enhanced", "critical"],
    description: "Check ownership, documentation, monitoring, controls, approvals, and readiness for deployment."
  }
];

const assessmentQuestions = [
  {
    id: "context_purpose",
    sectionId: "context",
    domainId: "context",
    type: "textarea",
    label: "What is the AI use case trying to achieve?",
    helper: "Describe the business problem, intended outcome, and why AI is being used.",
    riskWeight: 1,
    routeSignal: "context",
    isPrimaryTrigger: false,
    requiredForRoutes: ["lightweight", "standard", "enhanced", "critical"],
    tags: ["purpose", "scope", "business-context"],
    scoring: {
      unclear: 3,
      narrow: 1,
      broad: 2
    }
  },

  {
    id: "context_users",
    sectionId: "context",
    domainId: "userImpact",
    type: "select",
    label: "Who will use or receive the AI output?",
    helper: "This determines the initial user-impact profile. Customer-facing or external use should increase governance depth.",
    riskWeight: 3,
    routeSignal: "userImpact",
    isPrimaryTrigger: true,
    requiredForRoutes: ["lightweight", "standard", "enhanced", "critical"],
    tags: ["users", "customer-impact", "external-users"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "internal_support",
        label: "Internal colleagues for support only",
        score: 1,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "expert_review",
        label: "Specialist users with review responsibility",
        score: 1,
        routeImpact: "standard",
        triggers: ["skilled-human-review"]
      },
      {
        value: "frontline",
        label: "Frontline colleagues serving customers",
        score: 2,
        routeImpact: "standard",
        triggers: ["customer-indirect-impact"]
      },
      {
        value: "customer_facing",
        label: "Customers or external users",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["customer-facing", "external-user-impact", "transparency-needed"]
      },
      {
        value: "automated_process",
        label: "An automated process or workflow",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["automation", "workflow-action"]
      }
    ]
  },

  {
    id: "context_decision_role",
    sectionId: "context",
    domainId: "automationAutonomy",
    type: "select",
    label: "What role does the AI output play in decisions?",
    helper: "Decision-support, recommendations, and automated decisions increase governance expectations.",
    riskWeight: 4,
    routeSignal: "automationAutonomy",
    isPrimaryTrigger: true,
    requiredForRoutes: ["lightweight", "standard", "enhanced", "critical"],
    tags: ["decisioning", "automation", "human-in-the-loop"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "informational",
        label: "Informational only",
        score: 1,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "drafting",
        label: "Drafts content for human review",
        score: 1,
        routeImpact: "standard",
        triggers: ["human-review-required"]
      },
      {
        value: "recommendation",
        label: "Provides recommendations for a human",
        score: 3,
        routeImpact: "standard",
        triggers: ["decision-support", "human-accountability-needed"]
      },
      {
        value: "prioritisation",
        label: "Prioritises cases, customers, claims, risks, or work queues",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["prioritisation", "fairness-review-needed"]
      },
      {
        value: "automated_decision",
        label: "Makes or triggers decisions automatically",
        score: 5,
        routeImpact: "critical",
        triggers: ["automated-decision", "senior-review-needed", "human-override-required"]
      }
    ]
  },

  {
    id: "context_supplier",
    sectionId: "context",
    domainId: "externalExposure",
    type: "select",
    label: "Is the AI capability internally built or supplied by a third party?",
    helper: "Third-party tools may need supplier assurance, contractual review, security review, and operational monitoring.",
    riskWeight: 2,
    routeSignal: "externalExposure",
    isPrimaryTrigger: true,
    requiredForRoutes: ["lightweight", "standard", "enhanced", "critical"],
    tags: ["supplier", "vendor", "third-party", "outsourcing"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "internal",
        label: "Internally built",
        score: 1,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "approved_supplier",
        label: "Approved supplier or enterprise platform",
        score: 2,
        routeImpact: "standard",
        triggers: ["supplier-assurance"]
      },
      {
        value: "new_supplier",
        label: "New supplier or unassured tool",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["new-supplier", "supplier-assurance", "security-review-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["unknown-supplier", "supplier-assurance-needed"]
      }
    ]
  },

  {
    id: "impact_customer",
    sectionId: "impact",
    domainId: "userImpact",
    type: "select",
    label: "Could this affect customers or external individuals?",
    helper: "Consider pricing, eligibility, service quality, claims, complaints, communications, access, or customer treatment.",
    riskWeight: 4,
    routeSignal: "userImpact",
    isPrimaryTrigger: true,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["customer-impact", "consumer-duty", "fairness"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No direct customer impact",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "indirect",
        label: "Indirect customer impact",
        score: 2,
        routeImpact: "standard",
        triggers: ["customer-indirect-impact"]
      },
      {
        value: "direct_low",
        label: "Direct but low materiality",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["customer-facing", "transparency-needed"]
      },
      {
        value: "direct_high",
        label: "Direct and material customer impact",
        score: 5,
        routeImpact: "critical",
        triggers: ["material-customer-impact", "consumer-duty", "senior-review-needed"]
      }
    ]
  },

  {
    id: "impact_vulnerable",
    sectionId: "impact",
    domainId: "userImpact",
    type: "select",
    label: "Could vulnerable customers or protected groups be affected?",
    helper: "This increases the need for fairness, accessibility, explainability, monitoring, and human oversight.",
    riskWeight: 5,
    routeSignal: "userImpact",
    isPrimaryTrigger: true,
    requiredForRoutes: ["enhanced", "critical"],
    tags: ["vulnerable-customers", "protected-groups", "fairness"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No",
        score: 0,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "possible",
        label: "Possibly",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["vulnerable-customer-possible", "fairness-review-needed"]
      },
      {
        value: "yes",
        label: "Yes",
        score: 5,
        routeImpact: "critical",
        triggers: ["vulnerable-customer-impact", "senior-review-needed", "enhanced-oversight-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 5,
        routeImpact: "critical",
        triggers: ["unknown-vulnerability-impact", "fairness-review-needed"]
      }
    ]
  },

  {
    id: "impact_financial",
    sectionId: "impact",
    domainId: "regulatoryExposure",
    type: "select",
    label: "Could the output influence financial outcomes?",
    helper: "Includes pricing, affordability, credit, claims, fees, loss, eligibility, underwriting, complaints, or commercial decisions.",
    riskWeight: 5,
    routeSignal: "regulatoryExposure",
    isPrimaryTrigger: true,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["financial-outcome", "regulated-decision", "materiality"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "minor",
        label: "Minor or indirect influence",
        score: 2,
        routeImpact: "standard",
        triggers: ["financial-influence-minor"]
      },
      {
        value: "material",
        label: "Material influence",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["financial-outcome-impact", "regulated-review-needed"]
      },
      {
        value: "critical",
        label: "Critical or automated financial outcome",
        score: 5,
        routeImpact: "critical",
        triggers: ["automated-financial-outcome", "senior-review-needed", "model-validation-needed"]
      }
    ]
  },

  {
    id: "data_personal",
    sectionId: "data",
    domainId: "dataSensitivity",
    type: "select",
    label: "Does the use case process personal data?",
    helper: "Personal data increases privacy, legal, and governance obligations.",
    riskWeight: 4,
    routeSignal: "dataSensitivity",
    isPrimaryTrigger: true,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["personal-data", "gdpr", "privacy"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No personal data",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "limited",
        label: "Limited personal data",
        score: 2,
        routeImpact: "standard",
        triggers: ["personal-data", "privacy-review-consider"]
      },
      {
        value: "significant",
        label: "Significant personal data",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["personal-data", "privacy-review-needed", "dpia-consider"]
      },
      {
        value: "unknown",
        label: "Unknown or not yet assessed",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["unknown-data", "privacy-review-needed"]
      }
    ]
  },

  {
    id: "data_sensitive",
    sectionId: "data",
    domainId: "dataSensitivity",
    type: "select",
    label: "Does it use sensitive or special category data?",
    helper: "Includes health, biometric, ethnicity, religion, political views, criminal offence data, or similar high-sensitivity fields.",
    riskWeight: 5,
    routeSignal: "dataSensitivity",
    isPrimaryTrigger: true,
    requiredForRoutes: ["enhanced", "critical"],
    tags: ["special-category-data", "sensitive-data", "privacy"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No",
        score: 0,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "possible",
        label: "Possibly",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["possible-sensitive-data", "privacy-review-needed"]
      },
      {
        value: "yes",
        label: "Yes",
        score: 5,
        routeImpact: "critical",
        triggers: ["special-category-data", "dpia-likely", "senior-review-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 5,
        routeImpact: "critical",
        triggers: ["unknown-sensitive-data", "privacy-review-needed"]
      }
    ]
  },

  {
    id: "data_financial",
    sectionId: "data",
    domainId: "dataSensitivity",
    type: "select",
    label: "Does the use case process customer financial or policy data?",
    helper: "Financial, claims, pricing, affordability, underwriting, or policy data can increase regulatory and conduct risk.",
    riskWeight: 4,
    routeSignal: "dataSensitivity",
    isPrimaryTrigger: true,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["financial-data", "policy-data", "claims-data"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "limited",
        label: "Limited or aggregated financial data",
        score: 2,
        routeImpact: "standard",
        triggers: ["financial-data-limited"]
      },
      {
        value: "yes",
        label: "Yes, identifiable customer financial or policy data",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["financial-data", "regulated-review-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["unknown-financial-data"]
      }
    ]
  },

  {
    id: "data_quality",
    sectionId: "data",
    domainId: "dataSensitivity",
    type: "select",
    label: "How reliable is the input data?",
    helper: "Poor data quality can create inaccurate, unfair, misleading, or non-compliant outputs.",
    riskWeight: 3,
    routeSignal: "dataSensitivity",
    isPrimaryTrigger: false,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["data-quality", "lineage", "accuracy"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "known_good",
        label: "Known, governed, and quality checked",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "partially_known",
        label: "Partially understood or inconsistently governed",
        score: 2,
        routeImpact: "standard",
        triggers: ["data-quality-review"]
      },
      {
        value: "poor",
        label: "Known quality issues",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["poor-data-quality", "testing-needed"]
      },
      {
        value: "unknown",
        label: "Unknown quality",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["unknown-data-quality", "testing-needed"]
      }
    ]
  },

  {
    id: "data_reuse",
    sectionId: "data",
    domainId: "dataSensitivity",
    type: "select",
    label: "Is data being reused for a new purpose?",
    helper: "Purpose change may require privacy, ethics, policy, and fairness review.",
    riskWeight: 3,
    routeSignal: "dataSensitivity",
    isPrimaryTrigger: false,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["purpose-limitation", "data-reuse", "privacy"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No, same purpose",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "minor",
        label: "Minor adjacent reuse",
        score: 1,
        routeImpact: "standard",
        triggers: ["purpose-reuse-minor"]
      },
      {
        value: "material",
        label: "Materially new purpose",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["purpose-change", "privacy-review-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["unknown-purpose", "privacy-review-needed"]
      }
    ]
  },

  {
    id: "automation_level",
    sectionId: "automation",
    domainId: "automationAutonomy",
    type: "select",
    label: "How autonomous is the AI system?",
    helper: "Autonomy is one of the clearest escalation triggers. The more the AI can act without human control, the deeper the governance route.",
    riskWeight: 5,
    routeSignal: "automationAutonomy",
    isPrimaryTrigger: true,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["autonomy", "automation", "human-control"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "suggestion_only",
        label: "Suggestion only, no action taken",
        score: 1,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "human_approval",
        label: "Human approval required before action",
        score: 2,
        routeImpact: "standard",
        triggers: ["human-approval"]
      },
      {
        value: "workflow_trigger",
        label: "Can trigger workflow actions",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["workflow-action", "monitoring-needed"]
      },
      {
        value: "autonomous_action",
        label: "Can act autonomously without prior human approval",
        score: 5,
        routeImpact: "critical",
        triggers: ["autonomous-action", "senior-review-needed", "human-override-required"]
      }
    ]
  },

  {
    id: "automation_reversibility",
    sectionId: "automation",
    domainId: "humanOversight",
    type: "select",
    label: "Can humans stop, intervene, or reverse outcomes?",
    helper: "Weak reversibility increases residual risk, especially for customer or financial outcomes.",
    riskWeight: 4,
    routeSignal: "humanOversight",
    isPrimaryTrigger: false,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["override", "reversibility", "human-oversight"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "yes_clear",
        label: "Yes, clearly and quickly",
        score: 0,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "partial",
        label: "Partially, but with limitations",
        score: 2,
        routeImpact: "enhanced",
        triggers: ["limited-override"]
      },
      {
        value: "no",
        label: "No meaningful intervention or reversal route",
        score: 5,
        routeImpact: "critical",
        triggers: ["no-override", "senior-review-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["unknown-override"]
      }
    ]
  },

  {
    id: "regulatory_activity",
    sectionId: "regulation",
    domainId: "regulatoryExposure",
    type: "select",
    label: "Does the use case support regulated financial services activity?",
    helper: "Consider claims, complaints, underwriting, pricing, affordability, vulnerability, fraud, financial crime, risk management, or customer communications.",
    riskWeight: 5,
    routeSignal: "regulatoryExposure",
    isPrimaryTrigger: true,
    requiredForRoutes: ["enhanced", "critical"],
    tags: ["regulated-activity", "fca", "consumer-duty"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No",
        score: 0,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "indirect",
        label: "Indirectly supports regulated activity",
        score: 2,
        routeImpact: "standard",
        triggers: ["regulated-activity-indirect"]
      },
      {
        value: "yes_material",
        label: "Yes, materially supports regulated activity",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["regulated-activity", "policy-review-needed"]
      },
      {
        value: "yes_decisioning",
        label: "Yes, influences or automates regulated decisions",
        score: 5,
        routeImpact: "critical",
        triggers: ["regulated-decisioning", "senior-review-needed", "model-validation-needed"]
      }
    ]
  },

  {
    id: "regulatory_explainability_expectation",
    sectionId: "regulation",
    domainId: "regulatoryExposure",
    type: "select",
    label: "Would a regulator, customer, or reviewer expect the outcome to be explainable?",
    helper: "If an outcome affects customers, money, treatment, access, or regulated processes, explainability expectations increase.",
    riskWeight: 4,
    routeSignal: "regulatoryExposure",
    isPrimaryTrigger: false,
    requiredForRoutes: ["enhanced", "critical"],
    tags: ["explainability", "regulatory-expectation", "challenge"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "no",
        label: "No meaningful expectation",
        score: 0,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "possibly",
        label: "Possibly",
        score: 2,
        routeImpact: "enhanced",
        triggers: ["explainability-needed"]
      },
      {
        value: "yes",
        label: "Yes",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["explainability-needed", "challenge-route-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["unknown-explainability-expectation"]
      }
    ]
  },

  {
    id: "model_explainability",
    sectionId: "model",
    domainId: "explainability",
    type: "select",
    label: "Can users explain how the output was produced?",
    helper: "Low explainability increases review, challenge, fairness, and accountability difficulty.",
    riskWeight: 4,
    routeSignal: "explainability",
    isPrimaryTrigger: false,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["explainability", "interpretability", "challenge"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "clear",
        label: "Yes, clear and explainable",
        score: 0,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "partial",
        label: "Partially explainable",
        score: 2,
        routeImpact: "standard",
        triggers: ["partial-explainability"]
      },
      {
        value: "limited",
        label: "Limited explainability",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["limited-explainability", "challenge-route-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["unknown-explainability"]
      }
    ]
  },

  {
    id: "model_accuracy",
    sectionId: "model",
    domainId: "monitoring",
    type: "select",
    label: "How well has output accuracy been tested?",
    helper: "Untested outputs should not be relied on for material, customer, financial, or regulated decisions.",
    riskWeight: 4,
    routeSignal: "monitoring",
    isPrimaryTrigger: false,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["testing", "validation", "accuracy"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "tested",
        label: "Tested with clear acceptance criteria",
        score: 0,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "sampled",
        label: "Sample tested informally",
        score: 2,
        routeImpact: "standard",
        triggers: ["testing-light"]
      },
      {
        value: "limited",
        label: "Limited testing",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["testing-needed"]
      },
      {
        value: "not_tested",
        label: "Not tested",
        score: 5,
        routeImpact: "critical",
        triggers: ["not-tested", "validation-needed"]
      }
    ]
  },

  {
    id: "model_hallucination",
    sectionId: "model",
    domainId: "monitoring",
    type: "select",
    label: "Is there a risk of hallucination or fabricated output?",
    helper: "Especially relevant for generative AI, summarisation, advice, drafting, customer communication, or content generation.",
    riskWeight: 3,
    routeSignal: "monitoring",
    isPrimaryTrigger: false,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["hallucination", "generative-ai", "content-risk"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "none",
        label: "No meaningful hallucination risk",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "low",
        label: "Low risk",
        score: 1,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "medium",
        label: "Medium risk",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["hallucination-risk", "output-review-needed"]
      },
      {
        value: "high",
        label: "High risk",
        score: 5,
        routeImpact: "critical",
        triggers: ["high-hallucination-risk", "validation-needed"]
      }
    ]
  },

  {
    id: "model_human_oversight",
    sectionId: "model",
    domainId: "humanOversight",
    type: "select",
    label: "Is meaningful human oversight in place?",
    helper: "Oversight should be skilled, timely, documented, and able to challenge the AI output.",
    riskWeight: 5,
    routeSignal: "humanOversight",
    isPrimaryTrigger: false,
    requiredForRoutes: ["lightweight", "standard", "enhanced", "critical"],
    tags: ["human-oversight", "accountability", "challenge"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "strong",
        label: "Yes, strong oversight",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "basic",
        label: "Basic oversight",
        score: 2,
        routeImpact: "standard",
        triggers: ["basic-oversight"]
      },
      {
        value: "weak",
        label: "Weak oversight",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["weak-oversight", "oversight-uplift-needed"]
      },
      {
        value: "none",
        label: "No meaningful oversight",
        score: 5,
        routeImpact: "critical",
        triggers: ["no-human-oversight", "senior-review-needed"]
      }
    ]
  },

  {
    id: "governance_owner",
    sectionId: "governance",
    domainId: "governanceReadiness",
    type: "select",
    label: "Is there a named accountable owner?",
    helper: "Every use case should have clear business and technical accountability.",
    riskWeight: 3,
    routeSignal: "governanceReadiness",
    isPrimaryTrigger: false,
    requiredForRoutes: ["lightweight", "standard", "enhanced", "critical"],
    tags: ["ownership", "accountability", "governance"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "yes",
        label: "Yes",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "partial",
        label: "Partially clear",
        score: 2,
        routeImpact: "standard",
        triggers: ["ownership-unclear"]
      },
      {
        value: "no",
        label: "No",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["no-owner", "ownership-needed"]
      }
    ]
  },

  {
    id: "governance_documentation",
    sectionId: "governance",
    domainId: "governanceReadiness",
    type: "select",
    label: "Is documentation in place?",
    helper: "Include purpose, data, model behaviour, limitations, testing, owners, controls, and approval records.",
    riskWeight: 3,
    routeSignal: "governanceReadiness",
    isPrimaryTrigger: false,
    requiredForRoutes: ["lightweight", "standard", "enhanced", "critical"],
    tags: ["documentation", "evidence", "auditability"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "complete",
        label: "Complete and maintained",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "partial",
        label: "Partial",
        score: 2,
        routeImpact: "standard",
        triggers: ["documentation-partial"]
      },
      {
        value: "minimal",
        label: "Minimal",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["documentation-needed"]
      },
      {
        value: "none",
        label: "None",
        score: 5,
        routeImpact: "critical",
        triggers: ["no-documentation", "not-ready-for-approval"]
      }
    ]
  },

  {
    id: "governance_monitoring",
    sectionId: "governance",
    domainId: "monitoring",
    type: "select",
    label: "Is ongoing monitoring defined?",
    helper: "Consider drift, output quality, complaints, incidents, performance, and control effectiveness.",
    riskWeight: 4,
    routeSignal: "monitoring",
    isPrimaryTrigger: false,
    requiredForRoutes: ["standard", "enhanced", "critical"],
    tags: ["monitoring", "incident-management", "control-effectiveness"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "defined",
        label: "Yes, monitoring is defined",
        score: 0,
        routeImpact: "standard",
        triggers: []
      },
      {
        value: "manual",
        label: "Manual or informal monitoring",
        score: 2,
        routeImpact: "standard",
        triggers: ["manual-monitoring"]
      },
      {
        value: "planned",
        label: "Planned but not yet implemented",
        score: 3,
        routeImpact: "enhanced",
        triggers: ["monitoring-not-live"]
      },
      {
        value: "none",
        label: "No monitoring",
        score: 5,
        routeImpact: "critical",
        triggers: ["no-monitoring", "not-ready-for-approval"]
      }
    ]
  },

  {
    id: "governance_approval",
    sectionId: "governance",
    domainId: "governanceReadiness",
    type: "select",
    label: "Has the use case received appropriate approval?",
    helper: "Higher-risk use cases may require legal, privacy, risk, compliance, security, model risk, or senior approval.",
    riskWeight: 3,
    routeSignal: "governanceReadiness",
    isPrimaryTrigger: false,
    requiredForRoutes: ["lightweight", "standard", "enhanced", "critical"],
    tags: ["approval", "governance-state", "readiness"],
    options: [
      {
        value: "",
        label: "Select an option",
        score: 0
      },
      {
        value: "approved",
        label: "Approved",
        score: 0,
        routeImpact: "lightweight",
        triggers: []
      },
      {
        value: "in_review",
        label: "In review",
        score: 2,
        routeImpact: "standard",
        triggers: ["approval-in-review"]
      },
      {
        value: "not_started",
        label: "Not started",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["approval-needed"]
      },
      {
        value: "unknown",
        label: "Unknown",
        score: 4,
        routeImpact: "enhanced",
        triggers: ["approval-unknown"]
      }
    ]
  }
];
