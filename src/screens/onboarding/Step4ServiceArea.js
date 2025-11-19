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
import { DISTRICTS_TASHKENT } from '../../constants/categories';
import { updateServiceArea } from '../../store/slices/profileSlice';
import { updateFormData, nextStep, previousStep } from '../../store/slices/formSlice';

export const Step4ServiceArea = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.form.formData.step4);

  const [radius, setRadius] = useState(savedData.radius || 5);
  const [selectedDistricts, setSelectedDistricts] = useState(
    savedData.selectedDistricts || []
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 4,
        data: { radius, selectedDistricts },
      })
    );
  }, [radius, selectedDistricts]);

  const toggleDistrict = (districtId) => {
    if (selectedDistricts.includes(districtId)) {
      setSelectedDistricts(selectedDistricts.filter((id) => id !== districtId));
    } else {
      setSelectedDistricts([...selectedDistricts, districtId]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (radius < 1) {
      newErrors.radius = 'Kamida 1 km radius tanlang';
    }

    if (selectedDistricts.length === 0) {
      newErrors.districts = 'Kamida bitta hududni tanlang';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(
        updateServiceArea({
          radius,
          preferredAreas: selectedDistricts,
          coordinates: null, // Will be set with actual location
        })
      );

      dispatch(nextStep());
      navigation.navigate('Step5Pricing');
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={4} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.title}>Xizmat Hududi</Text>
          <Text style={styles.subtitle}>
            Qaysi hududlarda xizmat ko'rsatasiz?
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Xizmat Radiusi</Text>
          <View style={styles.radiusContainer}>
            <Text style={styles.radiusValue}>{radius} km</Text>
            <View style={styles.radiusSlider}>
              <TouchableOpacity
                style={styles.radiusButton}
                onPress={() => setRadius(Math.max(1, radius - 1))}
              >
                <Text style={styles.radiusButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.radiusTrack}>
                <View
                  style={[
                    styles.radiusFill,
                    { width: `${(radius / 50) * 100}%` },
                  ]}
                />
              </View>
              <TouchableOpacity
                style={styles.radiusButton}
                onPress={() => setRadius(Math.min(50, radius + 1))}
              >
                <Text style={styles.radiusButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.radiusHelp}>
              Sizning manzil atrofidagi {radius} km radiusda xizmat ko'rsatasiz
            </Text>
          </View>
          {errors.radius && <Text style={styles.errorText}>{errors.radius}</Text>}
        </View>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapText}>Xarita</Text>
          <Text style={styles.mapSubtext}>
            Toshkent shahri - {radius} km radius
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Afzal Ko'rilgan Hududlar</Text>
          <Text style={styles.sectionSubtitle}>
            Qaysi tumanlarda ishlashni xohlaysiz? (Ixtiyoriy, lekin tavsiya etiladi)
          </Text>
          <View style={styles.districtsList}>
            {DISTRICTS_TASHKENT.map((district) => (
              <TouchableOpacity
                key={district.id}
                style={[
                  styles.districtItem,
                  selectedDistricts.includes(district.id) &&
                    styles.districtItemActive,
                ]}
                onPress={() => toggleDistrict(district.id)}
              >
                <Text
                  style={[
                    styles.districtText,
                    selectedDistricts.includes(district.id) &&
                      styles.districtTextActive,
                  ]}
                >
                  {selectedDistricts.includes(district.id) ? '☑' : '☐'}{' '}
                  {district.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.districts && (
            <Text style={styles.errorText}>{errors.districts}</Text>
          )}
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Xizmat radiusi qayta manzil asosida hisoblanadi. Bu "qiyuv"
            bo'lmaydi - kengaytirishingiz mumkin.
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
    marginBottom: 32,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  radiusContainer: {
    paddingVertical: 8,
  },
  radiusValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  radiusSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  radiusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusButtonText: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  radiusTrack: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.gray[200],
    borderRadius: 5,
    overflow: 'hidden',
  },
  radiusFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  radiusHelp: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  mapSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  districtsList: {
    gap: 8,
  },
  districtItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  districtItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLightest,
  },
  districtText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  districtTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.warning + '20',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    gap: 12,
  },
  warningIcon: {
    fontSize: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 8,
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

export default Step4ServiceArea;
