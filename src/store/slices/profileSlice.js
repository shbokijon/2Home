import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Personal information
  personalInfo: {
    fullName: '',
    phoneNumber: '',
    dateOfBirth: null,
    gender: '',
    email: '',
    profilePhoto: null,
    idDocument: {
      front: null,
      back: null,
      idNumber: '',
      detectedInfo: null,
    },
  },

  // Professional information
  professionalInfo: {
    categories: [],
    subcategories: [],
    yearsOfExperience: 1,
    languages: ['uz'],
    bio: '',
  },

  // Service area
  serviceArea: {
    radius: 5, // km
    coordinates: null,
    preferredAreas: [],
  },

  // Pricing
  pricing: {
    hourlyRate: 100000, // UZS
    minimumCharge: 50000,
    tripFee: 0,
    surcharges: {
      weekend: false,
      night: false,
      emergency: false,
    },
  },

  // Schedule
  schedule: {
    weeklySchedule: {
      monday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
      tuesday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
      wednesday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
      thursday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
      friday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
      saturday: { available: false, slots: [] },
      sunday: { available: false, slots: [] },
    },
    unavailablePeriods: [],
  },

  // Payment information
  payments: {
    bankAccount: {
      bank: '',
      accountHolder: '',
      iban: '',
      verified: false,
    },
    card: {
      number: '',
      verified: false,
    },
    mobileMoney: {
      payme: '',
      click: '',
      uzum: '',
    },
    taxInfo: {
      hasUNN: false,
      unn: '',
    },
  },

  // Certifications and documents
  certifications: [],

  // Verification status
  verification: {
    idVerified: false,
    bankVerified: false,
    backgroundCheckStatus: 'pending', // pending, approved, rejected
    accountStatus: 'pending', // pending, approved, rejected, suspended
  },

  // Meta
  lastUpdated: null,
  isComplete: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateProfessionalInfo: (state, action) => {
      state.professionalInfo = { ...state.professionalInfo, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateServiceArea: (state, action) => {
      state.serviceArea = { ...state.serviceArea, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updatePricing: (state, action) => {
      state.pricing = { ...state.pricing, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateSchedule: (state, action) => {
      state.schedule = { ...state.schedule, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updatePayments: (state, action) => {
      state.payments = { ...state.payments, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    addCertification: (state, action) => {
      state.certifications.push(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    removeCertification: (state, action) => {
      state.certifications = state.certifications.filter(
        (cert) => cert.id !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    },
    updateVerification: (state, action) => {
      state.verification = { ...state.verification, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    setProfileComplete: (state, action) => {
      state.isComplete = action.payload;
    },
    resetProfile: () => initialState,
    loadProfile: (state, action) => {
      return { ...initialState, ...action.payload };
    },
  },
});

export const {
  updatePersonalInfo,
  updateProfessionalInfo,
  updateServiceArea,
  updatePricing,
  updateSchedule,
  updatePayments,
  addCertification,
  removeCertification,
  updateVerification,
  setProfileComplete,
  resetProfile,
  loadProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
