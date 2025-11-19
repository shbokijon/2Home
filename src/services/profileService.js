import api from './api';
import {
  PROFILE_ENDPOINTS,
  VERIFICATION_ENDPOINTS,
  DOCUMENT_ENDPOINTS,
  REGISTRATION_ENDPOINTS,
} from '../constants/api';

export const profileService = {
  // Get provider profile
  getProfile: async () => {
    return await api.get(PROFILE_ENDPOINTS.GET_PROFILE);
  },

  // Update profile
  updateProfile: async (profileData) => {
    return await api.put(PROFILE_ENDPOINTS.UPDATE_PROFILE, profileData);
  },

  // Upload profile photo
  uploadPhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoFile.uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    return await api.post(PROFILE_ENDPOINTS.UPLOAD_PHOTO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update categories
  updateCategories: async (categories) => {
    return await api.put(PROFILE_ENDPOINTS.UPDATE_CATEGORIES, { categories });
  },

  // Update pricing
  updatePricing: async (pricing) => {
    return await api.put(PROFILE_ENDPOINTS.UPDATE_PRICING, pricing);
  },

  // Update schedule
  updateSchedule: async (schedule) => {
    return await api.put(PROFILE_ENDPOINTS.UPDATE_SCHEDULE, schedule);
  },

  // Update service area
  updateServiceArea: async (serviceArea) => {
    return await api.put(PROFILE_ENDPOINTS.UPDATE_SERVICE_AREA, serviceArea);
  },

  // Update payment methods
  updatePaymentMethods: async (paymentMethods) => {
    return await api.put(PROFILE_ENDPOINTS.UPDATE_PAYMENT_METHODS, paymentMethods);
  },

  // Verify ID document
  verifyIdDocument: async (frontImage, backImage) => {
    const formData = new FormData();
    formData.append('front', {
      uri: frontImage.uri,
      type: 'image/jpeg',
      name: 'id_front.jpg',
    });
    formData.append('back', {
      uri: backImage.uri,
      type: 'image/jpeg',
      name: 'id_back.jpg',
    });

    return await api.post(VERIFICATION_ENDPOINTS.VERIFY_ID_DOCUMENT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Request background check
  requestBackgroundCheck: async () => {
    return await api.post(VERIFICATION_ENDPOINTS.VERIFY_BACKGROUND);
  },

  // Verify bank account
  verifyBankAccount: async (bankDetails) => {
    return await api.post(VERIFICATION_ENDPOINTS.VERIFY_BANK_ACCOUNT, bankDetails);
  },

  // Get registration status
  getRegistrationStatus: async () => {
    return await api.get(VERIFICATION_ENDPOINTS.REGISTRATION_STATUS);
  },

  // Upload document (certificate, etc)
  uploadDocument: async (documentFile, documentType) => {
    const formData = new FormData();
    formData.append('document', {
      uri: documentFile.uri,
      type: documentFile.type,
      name: documentFile.name,
    });
    formData.append('type', documentType);

    return await api.post(DOCUMENT_ENDPOINTS.UPLOAD_DOCUMENT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all documents
  getDocuments: async () => {
    return await api.get(DOCUMENT_ENDPOINTS.GET_DOCUMENTS);
  },

  // Delete document
  deleteDocument: async (documentId) => {
    return await api.delete(`${DOCUMENT_ENDPOINTS.DELETE_DOCUMENT}/${documentId}`);
  },

  // Submit complete profile (all 9 steps)
  submitProfile: async (profileData) => {
    return await api.post(REGISTRATION_ENDPOINTS.SUBMIT_PROFILE, profileData);
  },
};

export default profileService;
