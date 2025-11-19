// API Endpoints for 2Home Provider App

// Base URL - configure based on environment
export const BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.2home.uz/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/provider/auth/register',
  VERIFY_PHONE_OTP: '/provider/verify-phone-otp',
  LOGIN: '/provider/auth/login',
  LOGOUT: '/provider/auth/logout',
  REFRESH_TOKEN: '/provider/auth/refresh',
};

// Profile endpoints
export const PROFILE_ENDPOINTS = {
  GET_PROFILE: '/provider/profile',
  UPDATE_PROFILE: '/provider/profile',
  UPLOAD_PHOTO: '/provider/profile/photo',
  UPDATE_CATEGORIES: '/provider/profile/categories',
  UPDATE_PRICING: '/provider/profile/pricing',
  UPDATE_SCHEDULE: '/provider/profile/schedule',
  UPDATE_SERVICE_AREA: '/provider/profile/service-area',
  UPDATE_PAYMENT_METHODS: '/provider/profile/payment-methods',
};

// Verification endpoints
export const VERIFICATION_ENDPOINTS = {
  VERIFY_ID_DOCUMENT: '/provider/verify-id-document',
  VERIFY_BACKGROUND: '/provider/verify-background-check',
  VERIFY_BANK_ACCOUNT: '/provider/verify-bank-account',
  REVERIFY_ID: '/provider/reverify-id',
  REGISTRATION_STATUS: '/provider/registration-status',
};

// Document endpoints
export const DOCUMENT_ENDPOINTS = {
  UPLOAD_DOCUMENT: '/provider/upload-document',
  GET_DOCUMENTS: '/provider/documents',
  DELETE_DOCUMENT: '/provider/documents',
};

// Registration endpoint
export const REGISTRATION_ENDPOINTS = {
  SUBMIT_PROFILE: '/provider/submit-profile',
};

export default {
  BASE_URL,
  AUTH_ENDPOINTS,
  PROFILE_ENDPOINTS,
  VERIFICATION_ENDPOINTS,
  DOCUMENT_ENDPOINTS,
  REGISTRATION_ENDPOINTS,
};
