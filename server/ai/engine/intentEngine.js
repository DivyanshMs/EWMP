/**
 * intentEngine.js — Phase 5: Intent Engine
 * Enterprise-grade Intent Engine that classifies user queries before retrieving business data.
 * Implements hybrid Priority 1 (Rule-based) and Priority 2 (LLM Provider fallback) detection.
 * Enforces confidence thresholding (>= 0.8) and zero MongoDB/business data access.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 8
 */

const providerFactory = require('../providers/providerFactory');
const promptBuilder = require('../builders/promptBuilder');
const AppError = require('../../utils/AppError');
const { logInfo, logError, logWarn, logDebug } = require('../../utils/loggerHelper');

const INTENT_CATEGORIES = [
  'GENERAL_CHAT',
  'EMPLOYEE_QUERY',
  'ATTENDANCE_QUERY',
  'LEAVE_QUERY',
  'PAYROLL_QUERY',
  'PROJECT_QUERY',
  'TASK_QUERY',
  'ASSET_QUERY',
  'DOCUMENT_QUERY',
  'NOTIFICATION_QUERY',
  'HELPDESK_QUERY',
  'REPORT_QUERY',
  'PERFORMANCE_QUERY',
  'RECRUITMENT_QUERY',
  'SUMMARY_REQUEST',
  'INSIGHT_REQUEST',
  'RECOMMENDATION_REQUEST',
  'UNKNOWN',
];

const RULE_DICTIONARY = [
  {
    intent: 'ATTENDANCE_QUERY',
    keywords: ['attendance', 'clock in', 'clock out', 'punch in', 'punch out', 'check in', 'check out', 'late', 'early departure', 'absent', 'present', 'overtime', 'timesheet', 'shift', 'attendance log', 'working hours'],
    exactPhrases: ['clock in', 'clock out', 'punch in', 'punch out', 'my attendance', 'attendance record', 'overtime hours', 'shift timing'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'LEAVE_QUERY',
    keywords: ['leave', 'vacation', 'holiday', 'time off', 'pto', 'sick leave', 'annual leave', 'casual leave', 'maternity', 'paternity', 'bereavement', 'unpaid leave', 'leave balance', 'leave request', 'apply leave', 'cancel leave', 'approve leave', 'absence'],
    exactPhrases: ['leave balance', 'apply leave', 'take leave', 'sick leave', 'annual leave', 'vacation days', 'time off', 'leave request'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'PAYROLL_QUERY',
    keywords: ['payroll', 'salary', 'paycheck', 'payslip', 'wage', 'compensation', 'bonus', 'deduction', 'tax', 'net pay', 'gross pay', 'tds', 'provident fund', 'pf', 'esi', 'reimbursement', 'expense', 'stipend', 'pay period'],
    exactPhrases: ['my salary', 'my payslip', 'paycheck', 'net pay', 'gross pay', 'tax deduction', 'salary breakdown', 'reimbursement request'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'RECRUITMENT_QUERY',
    keywords: ['recruitment', 'job posting', 'vacancy', 'candidate', 'applicant', 'interview', 'hiring', 'offer letter', 'resume screening', 'recruiter', 'job opening', 'talent acquisition', 'shortlist'],
    exactPhrases: ['job posting', 'new candidate', 'schedule interview', 'hiring pipeline', 'offer letter', 'job vacancy', 'applicant tracking'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'PERFORMANCE_QUERY',
    keywords: ['performance', 'appraisal', 'review', 'kpi', 'kra', 'goal', 'objective', 'rating', 'feedback', '360 review', 'promotion', 'merit', 'evaluation', 'scorecard'],
    exactPhrases: ['performance review', 'annual appraisal', 'my kpi', 'my goals', 'promotion eligibility', 'feedback score'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'PROJECT_QUERY',
    keywords: ['project', 'client', 'milestone', 'budget', 'project manager', 'deliverable', 'project status', 'project timeline', 'gantt', 'project allocation', 'resource allocation'],
    exactPhrases: ['project status', 'project timeline', 'my projects', 'client milestone', 'project budget'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'TASK_QUERY',
    keywords: ['task', 'to-do', 'todo', 'kanban', 'sprint', 'backlog', 'assigned to me', 'task status', 'due date', 'priority', 'subtask', 'issue', 'ticket'],
    exactPhrases: ['my tasks', 'assigned tasks', 'task due date', 'kanban board', 'sprint backlog', 'update task'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'ASSET_QUERY',
    keywords: ['asset', 'laptop', 'monitor', 'keyboard', 'mouse', 'hardware', 'equipment', 'device', 'inventory', 'serial number', 'asset allocation', 'return asset', 'damage'],
    exactPhrases: ['my laptop', 'asset allocation', 'request laptop', 'hardware equipment', 'return asset', 'asset inventory'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'DOCUMENT_QUERY',
    keywords: ['document', 'file', 'contract', 'policy document', 'certificate', 'id proof', 'resume', 'cv', 'upload document', 'download document', 'folder', 'handbook'],
    exactPhrases: ['company policy', 'employee handbook', 'my documents', 'upload contract', 'download file'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'NOTIFICATION_QUERY',
    keywords: ['notification', 'alert', 'announcement', 'notice', 'broadcast', 'reminder', 'inbox message', 'push notification'],
    exactPhrases: ['my notifications', 'company announcement', 'alert message', 'unread notifications'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'HELPDESK_QUERY',
    keywords: ['helpdesk', 'support ticket', 'it support', 'hr support', 'raise ticket', 'complaint', 'query ticket', 'ticket status', 'resolve ticket', 'help desk', 'issue reported'],
    exactPhrases: ['raise ticket', 'helpdesk ticket', 'support ticket', 'ticket status', 'contact support'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'REPORT_QUERY',
    keywords: ['report', 'analytics', 'dashboard', 'export', 'summary report', 'monthly report', 'turnover report', 'headcount', 'metrics', 'statistics'],
    exactPhrases: ['generate report', 'monthly report', 'export analytics', 'headcount report', 'dashboard metrics'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'EMPLOYEE_QUERY',
    keywords: ['colleague', 'worker', 'personnel', 'department', 'designation', 'reporting manager', 'profile', 'contact info', 'employee id', 'onboarding', 'offboarding', 'directory'],
    exactPhrases: ['employee directory', 'my profile', 'reporting manager', 'contact details', 'team members', 'employee id'],
    baseConfidence: 0.85,
    phraseBonus: 0.08,
  },
  {
    intent: 'SUMMARY_REQUEST',
    keywords: ['summarize', 'summary', 'tldr', 'brief', 'condense', 'shorten', 'overview of record', 'executive summary'],
    exactPhrases: ['summarize this', 'give me a summary', 'brief overview', 'summarize records'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'INSIGHT_REQUEST',
    keywords: ['insight', 'trend', 'pattern', 'forecast', 'correlation', 'root cause', 'analyze trends', 'turnover analysis'],
    exactPhrases: ['generate insights', 'trend analysis', 'why are attendance', 'analyze patterns', 'key insights'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'RECOMMENDATION_REQUEST',
    keywords: ['recommend', 'recommendation', 'suggest', 'suggestion', 'advice', 'who should be promoted', 'best approach'],
    exactPhrases: ['recommend candidates', 'give recommendations', 'suggest improvements', 'who should get promotion'],
    baseConfidence: 0.88,
    phraseBonus: 0.08,
  },
  {
    intent: 'GENERAL_CHAT',
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you', 'thank you', 'thanks', 'bye', 'goodbye', 'what can you do', 'who are you', 'help me understand'],
    exactPhrases: ['hello', 'hi there', 'how are you', 'thank you', 'what can you do', 'good morning', 'who are you'],
    baseConfidence: 0.85,
    phraseBonus: 0.08,
  },
];

const CONFIDENCE_THRESHOLD = 0.80;

/**
 * Priority 1: Rule-based intent detection.
 * Evaluates keywords and exact phrases against dictionary rules using word-boundary matching.
 *
 * @param {string} text - Sanitized user text
 * @returns {object|null} { intent, confidence, source: 'RULE' } or null if confidence < threshold
 */
const _detectRuleIntent = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lowerText = text.toLowerCase();
  let bestMatch = null;
  let highestConfidence = 0;

  for (const rule of RULE_DICTIONARY) {
    let matchCount = 0;
    let phraseMatched = false;

    for (const phrase of rule.exactPhrases) {
      const phraseRegex = new RegExp(`\\b${phrase}\\b`, 'i');
      if (phraseRegex.test(text)) {
        phraseMatched = true;
        matchCount += 2;
      }
    }

    for (const kw of rule.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(text)) {
        matchCount += 1;
      }
    }

    if (matchCount > 0) {
      let calcConf = rule.baseConfidence + ((matchCount - 1) * 0.03);
      if (phraseMatched) {
        calcConf += rule.phraseBonus;
      }
      calcConf = Math.min(1.0, calcConf);

      if (calcConf > highestConfidence) {
        highestConfidence = calcConf;
        bestMatch = {
          intent: rule.intent,
          confidence: Number(calcConf.toFixed(2)),
          source: 'RULE',
        };
      }
    }
  }

  if (bestMatch && bestMatch.confidence >= CONFIDENCE_THRESHOLD) {
    return bestMatch;
  }

  return null;
};

/**
 * Priority 2: LLM Provider fallback classification.
 * Invoked when rule confidence is low or unclassified. Requests strict JSON classification.
 *
 * @param {string} text - Sanitized user text
 * @returns {Promise<object>} { intent, confidence, source: 'AI' }
 */
const _detectAIIntent = async (text) => {
  try {
    const provider = providerFactory.getProvider();
    const classificationPrompt = `You are an intent classification engine for the Enterprise Workforce Management Platform (EWMP).
Your ONLY task is to classify the user's input into EXACTLY ONE of these valid intent categories:
${INTENT_CATEGORIES.join(', ')}

Rules:
1. You MUST return ONLY a valid JSON object. Do NOT include markdown code blocks, backticks, or natural language explanations.
2. The JSON structure MUST be exactly: {"intent": "CATEGORY_NAME", "confidence": 0.00} where confidence is a float between 0.0 and 1.0.
3. If the input does not clearly match any category or is ambiguous/irrelevant, return {"intent": "UNKNOWN", "confidence": 0.5}.

User input to classify:
"${text}"`;

    const rawResponse = await provider.chat(classificationPrompt);
    const cleaned = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsed = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      const match = cleaned.match(/\{[\s\S]*?\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch (err) {}
      }
    }

    if (parsed && typeof parsed.intent === 'string' && INTENT_CATEGORIES.includes(parsed.intent.toUpperCase())) {
      const conf = typeof parsed.confidence === 'number' ? parsed.confidence : Number(parsed.confidence) || 0.0;
      const roundedConf = Number(conf.toFixed(2));

      if (roundedConf >= CONFIDENCE_THRESHOLD) {
        return {
          intent: parsed.intent.toUpperCase(),
          confidence: roundedConf,
          source: 'AI',
        };
      }
    }
  } catch (err) {
    logWarn(`⚠️ Intent Engine LLM fallback classification failed or offline: ${err.message}`);
  }

  return {
    intent: 'UNKNOWN',
    confidence: 0.0,
    source: 'AI',
  };
};

/**
 * Detects the intent of a user query using Priority 1 rules and Priority 2 LLM fallback.
 * Never accesses MongoDB or business services.
 *
 * @param {string} message - Untrusted user query
 * @returns {Promise<object>} { intent, confidence, source }
 */
const detectIntent = async (message) => {
  const startTime = Date.now();

  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new AppError(400, 'A non-empty user message is required for intent detection.', 'INVALID_PROMPT_MESSAGE');
  }

  const sanitized = promptBuilder.sanitizeMessage(message);

  // If prompt injection was redacted or text became empty, return UNKNOWN immediately
  if (!sanitized || sanitized.includes('[REDACTED_PROMPT_INJECTION]')) {
    const latencyMs = Date.now() - startTime;
    const result = {
      intent: 'UNKNOWN',
      confidence: 1.0,
      source: 'RULE',
    };
    logInfo('AI Intent Detected (Prompt Injection / Empty)', {
      intent: result.intent,
      confidence: result.confidence,
      detectionMethod: result.source,
      latencyMs,
    });
    return result;
  }

  // Priority 1: Rule-based detection
  let result = _detectRuleIntent(sanitized);

  // Priority 2: LLM Fallback if rule detection failed or confidence < threshold
  if (!result) {
    logDebug('Rule confidence below threshold (0.80). Invoking Priority 2 LLM classification.');
    result = await _detectAIIntent(sanitized);
  }

  const latencyMs = Date.now() - startTime;

  logInfo('AI Intent Detected', {
    intent: result.intent,
    confidence: result.confidence,
    detectionMethod: result.source,
    latencyMs,
  });

  return result;
};

module.exports = {
  INTENT_CATEGORIES,
  CONFIDENCE_THRESHOLD,
  detectIntent,
};
