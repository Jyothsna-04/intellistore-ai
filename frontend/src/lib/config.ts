/**
 * VITE_API_URL must be set in .env.local (Railway backend URL).
 * Falls back to localhost:8085 for local development.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8085';

export const API_URL = API_BASE;
export const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8001';
