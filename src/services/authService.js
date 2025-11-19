import api from './api';
import { AUTH_ENDPOINTS } from '../constants/api';

export const authService = {
  // Register new provider
  register: async (phoneNumber) => {
    return await api.post(AUTH_ENDPOINTS.REGISTER, { phoneNumber });
  },

  // Verify phone OTP
  verifyPhoneOTP: async (phoneNumber, otp) => {
    return await api.post(AUTH_ENDPOINTS.VERIFY_PHONE_OTP, {
      phoneNumber,
      otp,
    });
  },

  // Login
  login: async (phoneNumber, password) => {
    return await api.post(AUTH_ENDPOINTS.LOGIN, {
      phoneNumber,
      password,
    });
  },

  // Logout
  logout: async () => {
    return await api.post(AUTH_ENDPOINTS.LOGOUT);
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
  },
};

export default authService;
