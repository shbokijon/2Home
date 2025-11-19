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
import { Input } from '../../components/ui/Input';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { COLORS } from '../../constants/colors';
import { validateHourlyRate, validateMinimumCharge } from '../../utils/validation';
import { updatePricing } from '../../store/slices/profileSlice';
import { updateFormData, nextStep, previousStep } from '../../store/slices/formSlice';

export const Step5Pricing = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.form.formData.step5);

  const [hourlyRate, setHourlyRate] = useState(savedData.hourlyRate || 150000);
  const [minimumCharge, setMinimumCharge] = useState(savedData.minimumCharge || 100000);
  const [tripFee, setTripFee] = useState(savedData.tripFee || 50000);
  const [weekendSurcharge, setWeekendSurcharge] = useState(savedData.weekendSurcharge || false);
  const [nightSurcharge, setNightSurcharge] = useState(savedData.nightSurcharge || false);
  const [emergencySurcharge, setEmergencySurcharge] = useState(savedData.emergencySurcharge || false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 5,
        data: {
          hourlyRate,
          minimumCharge,
          tripFee,
          weekendSurcharge,
          nightSurcharge,
          emergencySurcharge,
        },
      })
    );
  }, [hourlyRate, minimumCharge, tripFee, weekendSurcharge, nightSurcharge, emergencySurcharge]);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const calculateExample = () => {
    const hours = 3;
    const base = hourlyRate * hours;
    const weekend = weekendSurcharge ? base * 0.1 : 0;
    const trip = tripFee;
    const total = base + weekend + trip;

    return {
      base,
      weekend,
      trip,
      total,
      hours,
    };
  };

  const example = calculateExample();

  const validateForm = () => {
    const newErrors = {};

    const rateValidation = validateHourlyRate(hourlyRate);
    if (!rateValidation.valid) {
      newErrors.hourlyRate = rateValidation.error;
    }

    const chargeValidation = validateMinimumCharge(minimumCharge);
    if (!chargeValidation.valid) {
      newErrors.minimumCharge = chargeValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(
        updatePricing({
          hourlyRate,
          minimumCharge,
          tripFee,
          surcharges: {
            weekend: weekendSurcharge,
            night: nightSurcharge,
            emergency: emergencySurcharge,
          },
        })
      );

      dispatch(nextStep());
      navigation.navigate('Step6Schedule');
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={5} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>💰</Text>
          <Text style={styles.title}>Narxlar</Text>
          <Text style={styles.subtitle}>
            Sizning xizmat narxingiz
          </Text>
        </View>

        <View style={styles.section}>
          <Input
            label="Soatlik Narx (UZS) *"
            value={hourlyRate.toString()}
            onChangeText={(text) => setHourlyRate(parseInt(text) || 0)}
            placeholder="150,000"
            keyboardType="numeric"
            error={errors.hourlyRate}
            helperText="Min: 50,000 so'm, Max: 1,000,000 so'm"
          />
          <Text style={styles.priceDisplay}>
            {formatPrice(hourlyRate)} so'm/soat
          </Text>
        </View>

        <View style={styles.section}>
          <Input
            label="Minimal Xizmat Narxi (UZS) *"
            value={minimumCharge.toString()}
            onChangeText={(text) => setMinimumCharge(parseInt(text) || 0)}
            placeholder="100,000"
            keyboardType="numeric"
            error={errors.minimumCharge}
            helperText="Eng kam project narxi"
          />
          <Text style={styles.priceDisplay}>
            {formatPrice(minimumCharge)} so'm
          </Text>
        </View>

        <View style={styles.section}>
          <Input
            label="Yo'l Xarajati (Ixtiyoriy)"
            value={tripFee.toString()}
            onChangeText={(text) => setTripFee(parseInt(text) || 0)}
            placeholder="50,000"
            keyboardType="numeric"
            helperText="0 = Yo'l xarajati kiritilmagan"
          />
          <Text style={styles.priceDisplay}>
            {formatPrice(tripFee)} so'm
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qo'shimcha To'lovlar</Text>
          
          <TouchableOpacity
            style={styles.surchargeItem}
            onPress={() => setWeekendSurcharge(!weekendSurcharge)}
          >
            <View style={styles.surchargeLeft}>
              <Text style={styles.surchargeCheckbox}>
                {weekendSurcharge ? '☑' : '☐'}
              </Text>
              <View>
                <Text style={styles.surchargeTitle}>Dam olish kunlari</Text>
                <Text style={styles.surchargeSubtitle}>Shanba/Yakshanba +10%</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.surchargeItem}
            onPress={() => setNightSurcharge(!nightSurcharge)}
          >
            <View style={styles.surchargeLeft}>
              <Text style={styles.surchargeCheckbox}>
                {nightSurcharge ? '☑' : '☐'}
              </Text>
              <View>
                <Text style={styles.surchargeTitle}>Tungi ish</Text>
                <Text style={styles.surchargeSubtitle}>18:00-06:00 +20%</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.surchargeItem}
            onPress={() => setEmergencySurcharge(!emergencySurcharge)}
          >
            <View style={styles.surchargeLeft}>
              <Text style={styles.surchargeCheckbox}>
                {emergencySurcharge ? '☑' : '☐'}
              </Text>
              <View>
                <Text style={styles.surchargeTitle}>Tezkor xizmat</Text>
                <Text style={styles.surchargeSubtitle}>O'sha kunda +30%</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>💡 Narx Misoli</Text>
          <Text style={styles.exampleText}>
            Siz bugun (juma) 15:00 bilan {example.hours} soatlik buyurtma qabul qilsangiz:
          </Text>
          <View style={styles.exampleCalc}>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Asosiy:</Text>
              <Text style={styles.exampleValue}>
                {formatPrice(hourlyRate)} × {example.hours}h = {formatPrice(example.base)} so'm
              </Text>
            </View>
            {weekendSurcharge && (
              <View style={styles.exampleRow}>
                <Text style={styles.exampleLabel}>Dam olish:</Text>
                <Text style={styles.exampleValue}>+{formatPrice(example.weekend)} so'm</Text>
              </View>
            )}
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Yo'l:</Text>
              <Text style={styles.exampleValue}>+{formatPrice(example.trip)} so'm</Text>
            </View>
            <View style={styles.exampleDivider} />
            <View style={styles.exampleRow}>
              <Text style={styles.exampleTotalLabel}>Jami:</Text>
              <Text style={styles.exampleTotalValue}>
                {formatPrice(example.total)} so'm
              </Text>
            </View>
          </View>
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
    marginBottom: 12,
  },
  priceDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  surchargeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  surchargeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  surchargeCheckbox: {
    fontSize: 24,
    color: COLORS.primary,
  },
  surchargeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  surchargeSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  exampleBox: {
    backgroundColor: COLORS.accentGold + '20',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentGold,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  exampleCalc: {
    gap: 8,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exampleLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  exampleValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  exampleDivider: {
    height: 1,
    backgroundColor: COLORS.gray[300],
    marginVertical: 8,
  },
  exampleTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  exampleTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
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

export default Step5Pricing;
