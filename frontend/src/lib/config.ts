/**
 * VITE_API_URL must be set in environment variables (Render backend URL).
 * Falls back to localhost:8085 for local development.
 */
const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://intellistore-ai.onrender.com'
    : 'http://localhost:8085'
);

export const API_URL = API_BASE;
export const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8001';
