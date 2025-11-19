import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsSaved } from '../store/slices/formSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Auto-save hook that saves form data every 30 seconds
 * @param {number} interval - Save interval in milliseconds (default: 30000)
 */
export const useAutoSave = (interval = 30000) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);
  const hasUnsavedChanges = useSelector((state) => state.form.hasUnsavedChanges);
  const timerRef = useRef(null);

  useEffect(() => {
    // Auto-save function
    const autoSave = async () => {
      if (hasUnsavedChanges) {
        try {
          // Save to AsyncStorage
          await AsyncStorage.setItem(
            'providerRegistrationForm',
            JSON.stringify(formData)
          );

          // Mark as saved
          dispatch(markAsSaved());

          console.log('✓ Auto-saved at', new Date().toLocaleTimeString());
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    };

    // Set up interval
    timerRef.current = setInterval(autoSave, interval);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [formData, hasUnsavedChanges, dispatch, interval]);

  // Manual save function
  const manualSave = async () => {
    try {
      await AsyncStorage.setItem(
        'providerRegistrationForm',
        JSON.stringify(formData)
      );
      dispatch(markAsSaved());
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Restore saved data
  const restoreSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('providerRegistrationForm');
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Failed to restore saved data:', error);
      return null;
    }
  };

  // Clear saved data
  const clearSavedData = async () => {
    try {
      await AsyncStorage.removeItem('providerRegistrationForm');
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    manualSave,
    restoreSavedData,
    clearSavedData,
  };
};

export default useAutoSave;
