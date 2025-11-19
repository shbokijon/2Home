import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
  totalSteps: 9,
  formData: {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {},
    step7: {},
    step8: {},
    step9: {},
  },
  errors: {},
  isLoading: false,
  hasUnsavedChanges: false,
  lastAutoSave: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    updateFormData: (state, action) => {
      const { step, data } = action.payload;
      state.formData[`step${step}`] = {
        ...state.formData[`step${step}`],
        ...data,
      };
      state.hasUnsavedChanges = true;
    },
    setFormErrors: (state, action) => {
      state.errors = action.payload;
    },
    clearFormErrors: (state) => {
      state.errors = {};
    },
    setFormLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    markAsSaved: (state) => {
      state.hasUnsavedChanges = false;
      state.lastAutoSave = new Date().toISOString();
    },
    setHasUnsavedChanges: (state, action) => {
      state.hasUnsavedChanges = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  updateFormData,
  setFormErrors,
  clearFormErrors,
  setFormLoading,
  markAsSaved,
  setHasUnsavedChanges,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
