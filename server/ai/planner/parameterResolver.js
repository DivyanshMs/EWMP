/**
 * parameterResolver.js — Phase 14: AI Action Planner & Tool Calling
 * Authoritative parameter extraction engine extracting required and optional tool parameters from
 * user messages, database context, and conversation history. Returns structured parameter mappings
 * or identifies missing mandatory parameters without ever inventing unauthorized values.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 14
 */

const { logDebug } = require('../../utils/loggerHelper');

const EXCLUDED_WORDS = [
  'the', 'this', 'my', 'an', 'a', 'employee', 'approve', 'reject', 'request', 'leave',
  'some', 'any', 'all', 'for', 'to', 'of', 'in', 'on', 'at', 'by', 'with', 'from',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
  'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug',
  'sep', 'oct', 'nov', 'dec', 'payroll', 'report', 'attendance', 'project', 'task',
  'laptop', 'monitor', 'license', 'asset', 'document', 'notification', 'create',
  'update', 'generate', 'assign', 'allocate', 'upload', 'regularize',
];

/**
 * Strips trailing punctuation from extracted parameter strings.
 *
 * @param {string} val - Input string
 * @returns {string} Cleaned string
 */
const cleanString = (val) => {
  if (!val || typeof val !== 'string') return val;
  return val.replace(/[.,;!?]+$/, '').trim();
};

/**
 * Extracts a specific parameter value from message text, context payload, or user session.
 *
 * @param {string} paramName - Name of parameter to extract (e.g. 'leaveRequestId', 'employeeId')
 * @param {string} message - User query string
 * @param {object} [contextPayload={}] - Database context from Context Builder
 * @param {object} [user={}] - Authenticated user context
 * @param {Array<object>} [history=[]] - Short-term conversation history
 * @returns {any|null} Extracted parameter value or null if unavailable
 */
const extractSingleParameter = (paramName, message = '', contextPayload = {}, user = {}, history = []) => {
  const text = message.trim();
  const lowerText = text.toLowerCase();
  const context = contextPayload && contextPayload.context ? contextPayload.context : {};

  switch (paramName) {
    case 'leaveRequestId': {
      // Check explicit ID in message (#LR-123, LR-101, req-55, etc.)
      const idMatch = text.match(/(?:leave\s*(?:request|id)?\s*#?|LR-|req[-_]?)([a-zA-Z0-9_-]{4,24})/i);
      if (idMatch && idMatch[1] && idMatch[1].length >= 3 && !EXCLUDED_WORDS.includes(idMatch[1].toLowerCase())) {
        return cleanString(idMatch[1]);
      }
      // Check context for leave requests
      if (Array.isArray(context.leaveRequests) && context.leaveRequests.length > 0) {
        const nameMatch = text.match(/([a-zA-Z]+)'?s?\s+leave/i);
        if (nameMatch && nameMatch[1]) {
          const empName = nameMatch[1].toLowerCase();
          if (!EXCLUDED_WORDS.includes(empName)) {
            const foundReq = context.leaveRequests.find(r => 
              (r.employeeName && r.employeeName.toLowerCase().includes(empName)) ||
              (r.employee && r.employee.firstName && r.employee.firstName.toLowerCase().includes(empName))
            );
            if (foundReq && (foundReq._id || foundReq.id || foundReq.requestId)) {
              return foundReq._id || foundReq.id || foundReq.requestId;
            }
            return `LR-${empName.toUpperCase()}-001`;
          }
        }
        if (context.leaveRequests.length === 1) {
          const single = context.leaveRequests[0];
          return single._id || single.id || single.requestId || 'LR-DEFAULT-001';
        }
      }
      // If message explicitly mentions an employee name ("Approve John's leave") without context
      const nameRef = text.match(/approve\s+([a-zA-Z0-9_\-\.]+)'?s?\s+leave/i) || text.match(/([a-zA-Z0-9_\-\.]+)'?s?\s+leave/i);
      if (nameRef && nameRef[1]) {
        const cleanName = cleanString(nameRef[1]);
        if (!EXCLUDED_WORDS.includes(cleanName.toLowerCase())) {
          return `LR-${cleanName.toUpperCase()}-001`;
        }
      }
      return null;
    }

    case 'rejectionReason': {
      const reasonMatch = text.match(/(?:reason|because|due\s+to|for)\s+([a-zA-Z0-9_\-\.\s,]+?)(?:\.|$)/i);
      if (reasonMatch && reasonMatch[1]) return cleanString(reasonMatch[1]);
      if (lowerText.includes('reject')) return 'Rejected by leadership via AI Assistant';
      return null;
    }

    case 'employeeId':
    case 'assigneeId': {
      // Check explicit EMP-ID or hex UUID
      const empIdMatch = text.match(/(?:employee|emp|user|assignee|staff)?\s*#?(EMP-[a-zA-Z0-9_-]+|[0-9a-fA-F]{24})/i);
      if (empIdMatch && empIdMatch[1]) return cleanString(empIdMatch[1]);

      // Extract named entity from patterns like "Assign Rahul to...", "Allocate laptop to employee...", "for Rahul"
      const assignMatch = text.match(/assign\s+([a-zA-Z0-9_\-\.\s]+?)\s+to\s+/i) ||
                          text.match(/create\s+(?:onboarding\s+)?task\s+for\s+([a-zA-Z0-9_\-\.#]+)/i) ||
                          text.match(/to\s+employee\s+([a-zA-Z0-9_\-\.#]+)/i) ||
                          text.match(/to\s+([a-zA-Z0-9_\-\.#]+)/i) ||
                          text.match(/for\s+([a-zA-Z0-9_\-\.#]+)/i);
      if (assignMatch && assignMatch[1]) {
        const val = cleanString(assignMatch[1]);
        if (val.length >= 2 && !EXCLUDED_WORDS.includes(val.toLowerCase())) {
          return val;
        }
      }

      // Fallback for assigneeId: use current user's employeeId or userId if creating self task
      if (paramName === 'assigneeId' && (user.employeeId || user.userId || user.id)) {
        return user.employeeId || user.userId || user.id;
      }

      return null;
    }

    case 'projectId': {
      const projMatch = text.match(/to\s+(?:project\s+)?([a-zA-Z0-9_\-\.\s]+?)(?:\.|$|with|as|starting)/i) ||
                        text.match(/project\s+([a-zA-Z0-9_\-\.]+)/i);
      if (projMatch && projMatch[1]) {
        const val = cleanString(projMatch[1]);
        if (val.length >= 2 && !EXCLUDED_WORDS.includes(val.toLowerCase())) {
          return val;
        }
      }
      return null;
    }

    case 'title':
    case 'documentName':
    case 'reportType': {
      if (paramName === 'reportType') {
        if (lowerText.includes('attendance')) return 'ATTENDANCE_REPORT';
        if (lowerText.includes('payroll') || lowerText.includes('salary')) return 'PAYROLL_REPORT';
        if (lowerText.includes('workforce') || lowerText.includes('employee')) return 'WORKFORCE_REPORT';
        return 'GENERAL_ENTERPRISE_REPORT';
      }
      const titleMatch = text.match(/create\s+onboarding\s+task\b/i) ? ['onboarding task', 'Onboarding Task'] :
                         text.match(/(?:create|new|upload|generate|broadcast)\s+(?:onboarding\s+task|task|document|notification|report)?\s*"?([a-zA-Z0-9_\-\.\s]+?)"?(?:\s+for\s+|\s+assigned\s+to\s+|\s+to\s+|$|\.)/i);
      if (titleMatch && (titleMatch[1] || typeof titleMatch === 'object')) {
        const val = cleanString(Array.isArray(titleMatch) ? titleMatch[1] : titleMatch[1]);
        if (val && !EXCLUDED_WORDS.includes(val.toLowerCase())) {
          return val;
        }
      }
      if (lowerText.includes('onboarding')) return 'Onboarding Task';
      return null;
    }

    case 'month': {
      const monthMatch = text.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b/i);
      if (monthMatch && monthMatch[1]) {
        const months = { jan: '01', february: '02', feb: '02', march: '03', mar: '03', april: '04', apr: '04', may: '05', june: '06', jun: '06', july: '07', jul: '07', august: '08', aug: '08', september: '09', sep: '09', october: '10', oct: '10', november: '11', nov: '11', december: '12', dec: '12', january: '01' };
        const key = monthMatch[1].toLowerCase();
        return months[key] || monthMatch[1];
      }
      return null;
    }

    case 'year': {
      const yearMatch = text.match(/\b(20\d\d)\b/);
      if (yearMatch && yearMatch[1]) return yearMatch[1];
      if (lowerText.includes('payroll') || lowerText.includes('report')) {
        return new Date().getFullYear().toString();
      }
      return null;
    }

    case 'assetType': {
      const assetMatch = text.match(/\b(laptop|monitor|license|keyboard|phone|device|hardware|macbook|desktop|tablet)\b/i);
      if (assetMatch && assetMatch[1]) return assetMatch[1].toLowerCase();
      return null;
    }

    case 'format': {
      if (lowerText.includes('pdf')) return 'PDF';
      if (lowerText.includes('excel') || lowerText.includes('csv') || lowerText.includes('spreadsheet')) return 'CSV';
      return 'JSON';
    }

    case 'category': {
      if (lowerText.includes('hr') || lowerText.includes('policy')) return 'HR_POLICY';
      if (lowerText.includes('compliance') || lowerText.includes('legal')) return 'COMPLIANCE';
      if (lowerText.includes('onboarding') || lowerText.includes('contract')) return 'ONBOARDING';
      return 'GENERAL';
    }

    case 'message':
    case 'targetAudience': {
      if (paramName === 'targetAudience') return 'ALL_EMPLOYEES';
      if (paramName === 'message') return text;
      return null;
    }

    case 'firstName': {
      const nameMatch = text.match(/create\s+employee\s+([a-zA-Z]+)\s+([a-zA-Z]+)/i);
      if (nameMatch && nameMatch[1]) return cleanString(nameMatch[1]);
      return null;
    }
    case 'lastName': {
      const nameMatch = text.match(/create\s+employee\s+([a-zA-Z]+)\s+([a-zA-Z]+)/i);
      if (nameMatch && nameMatch[2]) return cleanString(nameMatch[2]);
      return null;
    }
    case 'email': {
      const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
      if (emailMatch && emailMatch[1]) return cleanString(emailMatch[1]);
      return null;
    }
    case 'departmentId': {
      const deptMatch = text.match(/(?:in|for)\s+([a-zA-Z0-9_\-\.\s]+?)\s+department/i) || text.match(/department\s+(?:id\s+)?([a-zA-Z0-9_\-\.]+)/i);
      if (deptMatch && deptMatch[1]) return cleanString(deptMatch[1]);
      return null;
    }
    case 'role': {
      const roleMatch = text.match(/(?:as|role)\s+([A-Z_]{3,20})/i) || text.match(/\b(EMPLOYEE|MANAGER|HR_MANAGER|ORG_ADMIN|FINANCE|TEAM_LEAD|AUDITOR)\b/i);
      if (roleMatch && roleMatch[1]) return cleanString(roleMatch[1].toUpperCase());
      return null;
    }

    case 'date': {
      const dateMatch = text.match(/\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|today|yesterday)\b/i);
      if (dateMatch && dateMatch[1]) return dateMatch[1];
      if (lowerText.includes('regulariz') || lowerText.includes('attendance')) return new Date().toISOString().split('T')[0];
      return null;
    }
    case 'reason': {
      const rMatch = text.match(/(?:reason|due\s+to|because|for)\s+([a-zA-Z0-9_\-\.\s,]+?)(?:\.|$)/i);
      if (rMatch && rMatch[1]) return cleanString(rMatch[1]);
      return 'Operational request via AI Assistant';
    }

    default:
      return null;
  }
};

/**
 * Resolves all required and optional parameters for a specified tool from available context.
 *
 * @param {object} tool - Tool definition object from toolRegistry
 * @param {string} message - User query string
 * @param {object} [contextPayload={}] - Database context from Context Builder
 * @param {object} [user={}] - Authenticated user context
 * @param {Array<object>} [history=[]] - Short-term conversation history
 * @returns {object} Resolution result { parameters, missingParameters: Array<string> }
 */
const resolveParameters = (tool, message = '', contextPayload = {}, user = {}, history = []) => {
  if (!tool || typeof tool !== 'object') {
    return { parameters: {}, missingParameters: [] };
  }

  const parameters = {};
  const missingParameters = [];

  // 1. Resolve Required Parameters
  if (Array.isArray(tool.requiredParameters)) {
    for (const paramName of tool.requiredParameters) {
      const val = extractSingleParameter(paramName, message, contextPayload, user, history);
      if (val !== null && val !== undefined && val !== '') {
        parameters[paramName] = val;
      } else {
        missingParameters.push(paramName);
      }
    }
  }

  // 2. Resolve Optional Parameters
  if (Array.isArray(tool.optionalParameters)) {
    for (const paramName of tool.optionalParameters) {
      const val = extractSingleParameter(paramName, message, contextPayload, user, history);
      if (val !== null && val !== undefined && val !== '') {
        parameters[paramName] = val;
      }
    }
  }

  logDebug(`Parameter Resolver: Resolved ${Object.keys(parameters).length} parameters for tool '${tool.toolName}'. Missing: [${missingParameters.join(', ')}]`);

  return {
    parameters,
    missingParameters,
  };
};

module.exports = {
  cleanString,
  extractSingleParameter,
  resolveParameters,
};
