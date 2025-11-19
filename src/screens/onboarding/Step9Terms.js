import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { COLORS } from '../../constants/colors';
import { setProfileComplete, updateVerification } from '../../store/slices/profileSlice';
import { resetForm } from '../../store/slices/formSlice';
import { profileService } from '../../services/profileService';

export const Step9Terms = ({ navigation }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    partnership: false,
    guidelines: false,
    dataAccuracy: false,
    commission: false,
    backgroundCheck: false,
    suspension: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAgreement = (key) => {
    setAgreements({ ...agreements, [key]: !agreements[key] });
  };

  const allAgreed = Object.values(agreements).every((value) => value === true);

  const handleSubmit = async () => {
    if (!allAgreed) {
      Alert.alert('Diqqat', 'Iltimos, barcha shartlarga rozilik bering');
      return;
    }

    Alert.alert(
      'Tasdiqlash',
      'Barcha ma\'lumotlaringiz to\'g\'ri va to\'liq ekanligiga ishonchingiz komilmi?',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Ha, yuborish',
          onPress: async () => {
            setIsSubmitting(true);

            try {
              // Prepare full profile data
              const fullProfile = {
                personalInfo: profile.personalInfo,
                professionalInfo: profile.professionalInfo,
                serviceArea: profile.serviceArea,
                pricing: profile.pricing,
                schedule: profile.schedule,
                payments: profile.payments,
                certifications: profile.certifications,
                agreements,
              };

              // Submit to backend
              const response = await profileService.submitProfile(fullProfile);

              // Update verification status
              dispatch(
                updateVerification({
                  accountStatus: 'pending',
                  backgroundCheckStatus: 'pending',
                })
              );

              // Mark profile as complete
              dispatch(setProfileComplete(true));

              // Reset form
              dispatch(resetForm());

              // Show success message
              Alert.alert(
                'Muvaffaqiyatli!',
                'Profil ma\'lumotlaringiz yuborildi. 24-48 soat ichida tekshiriladi.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to dashboard or pending screen
                      navigation.navigate('PendingApproval');
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert(
                'Xato',
                error.message || 'Ma\'lumotlarni yuborishda xatolik yuz berdi'
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={9} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>✅</Text>
          <Text style={styles.title}>Shartlar va Kelishuv</Text>
          <Text style={styles.subtitle}>
            Oxirgi qadam - shartlarga rozilik
          </Text>
        </View>

        <View style={styles.agreementsContainer}>
          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('terms')}
          >
            <Text style={styles.checkbox}>
              {agreements.terms ? '☑' : '☐'}
            </Text>
            <View style={styles.agreementText}>
              <Text style={styles.agreementTitle}>
                Foydalanish shartlari *
              </Text>
              <TouchableOpacity>
                <Text style={styles.link}>📄 O'qish</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('privacy')}
          >
            <Text style={styles.checkbox}>
              {agreements.privacy ? '☑' : '☐'}
            </Text>
            <View style={styles.agreementText}>
              <Text style={styles.agreementTitle}>Maxfiylik siyosati *</Text>
              <TouchableOpacity>
                <Text style={styles.link}>📄 O'qish</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('partnership')}
          >
            <Text style={styles.checkbox}>
              {agreements.partnership ? '☑' : '☐'}
            </Text>
            <View style={styles.agreementText}>
              <Text style={styles.agreementTitle}>
                Hamkorlik shartnomasi *
              </Text>
              <TouchableOpacity>
                <Text style={styles.link}>📄 O'qish</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('guidelines')}
          >
            <Text style={styles.checkbox}>
              {agreements.guidelines ? '☑' : '☐'}
            </Text>
            <View style={styles.agreementText}>
              <Text style={styles.agreementTitle}>Jamiyat qoidalari *</Text>
              <TouchableOpacity>
                <Text style={styles.link}>📄 O'qish</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('dataAccuracy')}
          >
            <Text style={styles.checkbox}>
              {agreements.dataAccuracy ? '☑' : '☐'}
            </Text>
            <Text style={styles.agreementText}>
              <Text style={styles.agreementTitle}>
                Mening ma'lumotlarim to'g'ri va to'liq *
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.commissionBox}>
          <Text style={styles.commissionTitle}>💰 Komissiya Tushunishi</Text>
          <Text style={styles.commissionText}>
            2Home platformasi har bir xizmat uchun 10-15% komissiya oladi.
          </Text>
          <View style={styles.commissionExample}>
            <View style={styles.commissionRow}>
              <Text style={styles.commissionLabel}>Xizmat narxi:</Text>
              <Text style={styles.commissionValue}>500,000 so'm</Text>
            </View>
            <View style={styles.commissionRow}>
              <Text style={styles.commissionLabel}>2Home komissiyasi (12%):</Text>
              <Text style={styles.commissionValue}>-60,000 so'm</Text>
            </View>
            <View style={styles.commissionDivider} />
            <View style={styles.commissionRow}>
              <Text style={styles.commissionTotalLabel}>Sizga to'lanadi:</Text>
              <Text style={styles.commissionTotalValue}>440,000 so'm</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('commission')}
          >
            <Text style={styles.checkbox}>
              {agreements.commission ? '☑' : '☐'}
            </Text>
            <Text style={styles.agreementText}>
              <Text style={styles.agreementTitle}>
                Komissiya tuzilishini tushunaman *
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.verificationsContainer}>
          <Text style={styles.sectionTitle}>Tekshiruvlar</Text>

          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('backgroundCheck')}
          >
            <Text style={styles.checkbox}>
              {agreements.backgroundCheck ? '☑' : '☐'}
            </Text>
            <View style={styles.agreementText}>
              <Text style={styles.agreementTitle}>
                Background check (24-48 soat) ga roziman *
              </Text>
              <Text style={styles.agreementSubtitle}>
                Shaxsiy ma'lumotlar va jinoyat tarixi tekshiriladi
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('suspension')}
          >
            <Text style={styles.checkbox}>
              {agreements.suspension ? '☑' : '☐'}
            </Text>
            <View style={styles.agreementText}>
              <Text style={styles.agreementTitle}>
                Shubhali faoliyat to'xtatilishiga olib kelishi mumkinligini
                tushunaman *
              </Text>
              <Text style={styles.agreementSubtitle}>
                Qoidabuzarlik hollari hisobni bloklashga sabab bo'ladi
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>✨</Text>
          <Text style={styles.infoText}>
            Barcha shartlarga rozilik berganingizdan so'ng, profilingiz
            tekshiruvga yuboriladi. 24-48 soat ichida natija email va SMS orqali
            yuboriladi.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isSubmitting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Yuborilmoqda...</Text>
          </View>
        ) : (
          <View style={styles.footerButtons}>
            <Button
              title="← Orqaga"
              onPress={handleBack}
              variant="outline"
              size="large"
              style={styles.backButton}
              disabled={isSubmitting}
            />
            <Button
              title="✓ Yakunlash"
              onPress={handleSubmit}
              variant="primary"
              size="large"
              style={styles.nextButton}
              disabled={!allAgreed || isSubmitting}
            />
          </View>
        )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  agreementsContainer: {
    gap: 12,
  },
  agreementItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  checkbox: {
    fontSize: 24,
    color: COLORS.primary,
  },
  agreementText: {
    flex: 1,
  },
  agreementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  agreementSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  link: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 24,
  },
  commissionBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.accentGold + '10',
    borderWidth: 2,
    borderColor: COLORS.accentGold,
  },
  commissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  commissionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  commissionExample: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commissionLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  commissionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  commissionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  commissionTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  commissionTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  verificationsContainer: {
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.primaryLightest,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
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
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
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

export default Step9Terms;
