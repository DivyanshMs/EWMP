import axiosInstance from '../../../lib/axios';

export const sendChatMessage = async (message) => {
  const response = await axiosInstance.post('/ai/chat', { message });
  return response.data?.data || response.data || {};
};

export const toAssistantListItems = (payload) => {
  if (Array.isArray(payload?.followUpSuggestions) && payload.followUpSuggestions.length > 0) {
    return payload.followUpSuggestions;
  }

  if (Array.isArray(payload?.recommendations) && payload.recommendations.length > 0) {
    return payload.recommendations.map((item) => {
      if (typeof item === 'string') return item;
      return item.title || item.name || item.description || 'Recommended action';
    });
  }

  if (Array.isArray(payload?.insights) && payload.insights.length > 0) {
    return payload.insights.map((item) => {
      if (typeof item === 'string') return item;
      return item.title || item.name || item.summary || 'Insight available';
    });
  }

  return [];
};
