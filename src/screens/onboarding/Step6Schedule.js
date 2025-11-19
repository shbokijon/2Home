import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { COLORS } from '../../constants/colors';
import { validateSchedule } from '../../utils/validation';
import { updateSchedule } from '../../store/slices/profileSlice';
import { updateFormData, nextStep, previousStep } from '../../store/slices/formSlice';

const DAYS = [
  { id: 'monday', name: 'Dushanba', nameEn: 'Monday' },
  { id: 'tuesday', name: 'Seshanba', nameEn: 'Tuesday' },
  { id: 'wednesday', name: 'Chorshanba', nameEn: 'Wednesday' },
  { id: 'thursday', name: 'Payshanba', nameEn: 'Thursday' },
  { id: 'friday', name: 'Juma', nameEn: 'Friday' },
  { id: 'saturday', name: 'Shanba', nameEn: 'Saturday' },
  { id: 'sunday', name: 'Yakshanba', nameEn: 'Sunday' },
];

export const Step6Schedule = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.form.formData.step6);

  const defaultSchedule = {
    monday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
    tuesday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
    wednesday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
    thursday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
    friday: { available: true, slots: [{ start: '09:00', end: '18:00' }] },
    saturday: { available: false, slots: [] },
    sunday: { available: false, slots: [] },
  };

  const [weeklySchedule, setWeeklySchedule] = useState(
    savedData.weeklySchedule || defaultSchedule
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 6,
        data: { weeklySchedule },
      })
    );
  }, [weeklySchedule]);

  const toggleDayAvailability = (dayId) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [dayId]: {
        ...weeklySchedule[dayId],
        available: !weeklySchedule[dayId].available,
        slots: !weeklySchedule[dayId].available
          ? [{ start: '09:00', end: '18:00' }]
          : [],
      },
    });
  };

  const updateTimeSlot = (dayId, slotIndex, field, value) => {
    const newSchedule = { ...weeklySchedule };
    newSchedule[dayId].slots[slotIndex][field] = value;
    setWeeklySchedule(newSchedule);
  };

  const addTimeSlot = (dayId) => {
    const newSchedule = { ...weeklySchedule };
    newSchedule[dayId].slots.push({ start: '09:00', end: '18:00' });
    setWeeklySchedule(newSchedule);
  };

  const removeTimeSlot = (dayId, slotIndex) => {
    const newSchedule = { ...weeklySchedule };
    if (newSchedule[dayId].slots.length > 1) {
      newSchedule[dayId].slots.splice(slotIndex, 1);
      setWeeklySchedule(newSchedule);
    }
  };

  const copyToAllDays = () => {
    const mondaySchedule = weeklySchedule.monday;
    const newSchedule = {};
    DAYS.forEach((day) => {
      newSchedule[day.id] = {
        available: mondaySchedule.available,
        slots: JSON.parse(JSON.stringify(mondaySchedule.slots)),
      };
    });
    setWeeklySchedule(newSchedule);
  };

  const validateForm = () => {
    const scheduleValidation = validateSchedule(weeklySchedule);
    if (!scheduleValidation.valid) {
      setErrors({ schedule: scheduleValidation.error });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(
        updateSchedule({
          weeklySchedule,
          unavailablePeriods: [],
        })
      );

      dispatch(nextStep());
      navigation.navigate('Step7Certifications');
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={6} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.title}>Ish Jadvali</Text>
          <Text style={styles.subtitle}>
            Qaysi kunlar va soatlarda ishlaysiz?
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="📋 Dushanbani hammaga nusxalash"
            onPress={copyToAllDays}
            variant="outline"
            size="small"
          />
        </View>

        {DAYS.map((day) => (
          <View key={day.id} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <TouchableOpacity
                style={styles.dayToggle}
                onPress={() => toggleDayAvailability(day.id)}
              >
                <Text style={styles.dayToggleIcon}>
                  {weeklySchedule[day.id].available ? '☑' : '☐'}
                </Text>
                <View>
                  <Text style={styles.dayName}>{day.name}</Text>
                  <Text style={styles.dayStatus}>
                    {weeklySchedule[day.id].available
                      ? 'Mavjud'
                      : 'Dam olish kuni'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {weeklySchedule[day.id].available && (
              <View style={styles.timeSlots}>
                {weeklySchedule[day.id].slots.map((slot, index) => (
                  <View key={index} style={styles.timeSlot}>
                    <View style={styles.timeInputs}>
                      <View style={styles.timeInput}>
                        <Text style={styles.timeLabel}>Dan:</Text>
                        <TouchableOpacity style={styles.timePicker}>
                          <Text style={styles.timeText}>{slot.start}</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.timeSeparator}>-</Text>

                      <View style={styles.timeInput}>
                        <Text style={styles.timeLabel}>Gacha:</Text>
                        <TouchableOpacity style={styles.timePicker}>
                          <Text style={styles.timeText}>{slot.end}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {weeklySchedule[day.id].slots.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeSlotButton}
                        onPress={() => removeTimeSlot(day.id, index)}
                      >
                        <Text style={styles.removeSlotText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addSlotButton}
                  onPress={() => addTimeSlot(day.id)}
                >
                  <Text style={styles.addSlotText}>
                    + Tanaffus qo'shish
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {errors.schedule && (
          <Text style={styles.errorText}>{errors.schedule}</Text>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Ish jadvalingizni keyinchalik profile'dan o'zgartirishingiz mumkin.
            Tanaffus vaqtlari uchun "+" tugmasini bosing.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <Button
            title="← Orqaga"
            onPress={handleBack}
            variant="outline"
            size="large"
            style={styles.backButton}
          />
          <Button
            title="Keyingi →"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.nextButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: 24,
  },
  dayContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  dayHeader: {
    padding: 16,
    backgroundColor: COLORS.gray[50],
  },
  dayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayToggleIcon: {
    fontSize: 24,
    color: COLORS.primary,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dayStatus: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  timeSlots: {
    padding: 16,
    gap: 12,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  timePicker: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  removeSlotButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSlotText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  addSlotButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.accentBlue + '20',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentBlue,
    gap: 12,
    marginTop: 16,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

export default Step6Schedule;
