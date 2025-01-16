// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile`,
};

// Event endpoints
export const EVENT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/api/events`,
  GET_MY_EVENTS: `${API_BASE_URL}/api/events/my-events`,
  GET_EVENT: (id: string) => `${API_BASE_URL}/api/events/${id}`,
  CREATE_EVENT: `${API_BASE_URL}/api/events`,
  UPDATE_EVENT: (id: string) => `${API_BASE_URL}/api/events/${id}`,
  DELETE_EVENT: (id: string) => `${API_BASE_URL}/api/events/${id}`,
  JOIN_EVENT: (id: string) => `${API_BASE_URL}/api/events/${id}/join`,
  GET_ATTENDEES: `${API_BASE_URL}/api/events/attendees/list`,
};

// Socket configuration
export const SOCKET_URL = API_BASE_URL;