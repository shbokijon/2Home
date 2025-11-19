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
import { BANKS } from '../../constants/categories';
import { validateIBAN, validateCardNumber } from '../../utils/validation';
import { updatePayments } from '../../store/slices/profileSlice';
import { updateFormData, nextStep, previousStep } from '../../store/slices/formSlice';

export const Step8Payment = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.form.formData.step8);
  const personalInfo = useSelector((state) => state.profile.personalInfo);

  const [selectedBank, setSelectedBank] = useState(savedData.selectedBank || '');
  const [accountHolder, setAccountHolder] = useState(
    savedData.accountHolder || personalInfo.fullName || ''
  );
  const [iban, setIban] = useState(savedData.iban || '');
  const [cardNumber, setCardNumber] = useState(savedData.cardNumber || '');
  const [paymeHandle, setPaymeHandle] = useState(savedData.paymeHandle || '');
  const [clickHandle, setClickHandle] = useState(savedData.clickHandle || '');
  const [uzumHandle, setUzumHandle] = useState(savedData.uzumHandle || '');
  const [hasUNN, setHasUNN] = useState(savedData.hasUNN || false);
  const [unn, setUnn] = useState(savedData.unn || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 8,
        data: {
          selectedBank,
          accountHolder,
          iban,
          cardNumber,
          paymeHandle,
          clickHandle,
          uzumHandle,
          hasUNN,
          unn,
        },
      })
    );
  }, [
    selectedBank,
    accountHolder,
    iban,
    cardNumber,
    paymeHandle,
    clickHandle,
    uzumHandle,
    hasUNN,
    unn,
  ]);

  const formatIBAN = (text) => {
    const cleaned = text.replace(/\s/g, '').toUpperCase();
    if (!cleaned.startsWith('UZ')) {
      return 'UZ' + cleaned.replace('UZ', '');
    }
    return cleaned;
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const validateForm = () => {
    const newErrors = {};

    // At least one payment method required
    const hasPaymentMethod =
      iban || cardNumber || paymeHandle || clickHandle || uzumHandle;

    if (!hasPaymentMethod) {
      newErrors.payment = 'Kamida bitta to\'lov usulini kiriting';
    }

    if (iban) {
      const ibanValidation = validateIBAN(iban);
      if (!ibanValidation.valid) {
        newErrors.iban = ibanValidation.error;
      }
    }

    if (cardNumber) {
      const cardValidation = validateCardNumber(cardNumber);
      if (!cardValidation.valid) {
        newErrors.cardNumber = cardValidation.error;
      }
    }

    if (!selectedBank && iban) {
      newErrors.bank = 'Bankni tanlang';
    }

    if (!accountHolder) {
      newErrors.accountHolder = 'Hisob egasi nomini kiriting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(
        updatePayments({
          bankAccount: {
            bank: selectedBank,
            accountHolder,
            iban,
            verified: false,
          },
          card: {
            number: cardNumber.replace(/\s/g, ''),
            verified: false,
          },
          mobileMoney: {
            payme: paymeHandle,
            click: clickHandle,
            uzum: uzumHandle,
          },
          taxInfo: {
            hasUNN,
            unn,
          },
        })
      );

      dispatch(nextStep());
      navigation.navigate('Step9Terms');
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={8} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>🏦</Text>
          <Text style={styles.title}>To'lov Ma'lumotlari</Text>
          <Text style={styles.subtitle}>
            Daromadingiz qayerga o'tkaziladi?
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Hisob Raqami</Text>

          <View style={styles.bankSelect}>
            <Text style={styles.label}>Bank *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.bankList}>
                {BANKS.map((bank) => (
                  <TouchableOpacity
                    key={bank.id}
                    style={[
                      styles.bankItem,
                      selectedBank === bank.id && styles.bankItemActive,
                    ]}
                    onPress={() => setSelectedBank(bank.id)}
                  >
                    <Text
                      style={[
                        styles.bankText,
                        selectedBank === bank.id && styles.bankTextActive,
                      ]}
                    >
                      {bank.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.bank && <Text style={styles.errorText}>{errors.bank}</Text>}
          </View>

          <Input
            label="Hisob egasi *"
            value={accountHolder}
            onChangeText={setAccountHolder}
            placeholder="Alisher Karimov"
            error={errors.accountHolder}
          />

          <Input
            label="IBAN (Hisob raqami)"
            value={iban}
            onChangeText={(text) => setIban(formatIBAN(text))}
            placeholder="UZ000000000000000000000000"
            maxLength={26}
            error={errors.iban}
            helperText="UZ + 24 raqam"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UzCard / Humo Karta</Text>

          <Input
            label="Karta raqami"
            value={cardNumber}
            onChangeText={(text) =>
              setCardNumber(formatCardNumber(text.replace(/\s/g, '')))
            }
            placeholder="8600 0000 0000 0000"
            keyboardType="numeric"
            maxLength={19}
            error={errors.cardNumber}
            helperText="16 raqamli karta raqami"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mobil To'lovlar</Text>

          <Input
            label="Payme"
            value={paymeHandle}
            onChangeText={setPaymeHandle}
            placeholder="+998901234567 yoki @username"
            helperText="Payme telefon raqami yoki handle"
          />

          <Input
            label="Click"
            value={clickHandle}
            onChangeText={setClickHandle}
            placeholder="+998901234567"
            helperText="Click telefon raqami"
          />

          <Input
            label="Uzum Money"
            value={uzumHandle}
            onChangeText={setUzumHandle}
            placeholder="+998901234567"
            helperText="Uzum Money telefon raqami"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soliq Ma'lumotlari</Text>

          <TouchableOpacity
            style={styles.checkboxItem}
            onPress={() => setHasUNN(!hasUNN)}
          >
            <Text style={styles.checkboxIcon}>{hasUNN ? '☑' : '☐'}</Text>
            <Text style={styles.checkboxText}>
              Menda UNN (Soliq to'lovchi raqami) bor
            </Text>
          </TouchableOpacity>

          {hasUNN && (
            <Input
              label="UNN Raqami"
              value={unn}
              onChangeText={setUnn}
              placeholder="123456789"
              keyboardType="numeric"
              maxLength={9}
            />
          )}

          {!hasUNN && (
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoText}>
                Jismoniy shaxs sifatida ishlamoqchisiz. 2Home sizning nomingizdan
                soliq to'laydi (komissiya ichida).
              </Text>
            </View>
          )}
        </View>

        {errors.payment && (
          <Text style={styles.errorText}>{errors.payment}</Text>
        )}

        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>🔒</Text>
          <Text style={styles.warningText}>
            Sizning to'lov ma'lumotlaringiz xavfsiz saqlanadi va shifrlangan
            holda o'tkaziladi. Biz sizning karta ma'lumotlarini saqlamaymiz.
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  bankSelect: {
    marginBottom: 16,
  },
  bankList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  bankItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  bankItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLightest,
  },
  bankText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  bankTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 24,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginBottom: 16,
    gap: 12,
  },
  checkboxIcon: {
    fontSize: 24,
    color: COLORS.primary,
  },
  checkboxText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.accentBlue + '20',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentBlue,
    gap: 12,
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
  warningBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.success + '20',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    gap: 12,
    marginTop: 16,
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

export default Step8Payment;
