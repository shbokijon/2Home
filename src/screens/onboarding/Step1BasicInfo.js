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
import {
  validateFullName,
  validatePhoneNumber,
  validateDateOfBirth,
  validateEmail,
} from '../../utils/validation';
import { updatePersonalInfo } from '../../store/slices/profileSlice';
import { updateFormData, nextStep } from '../../store/slices/formSlice';

export const Step1BasicInfo = ({ navigation }) => {
  const dispatch = useDispatch();
  const phoneFromAuth = useSelector((state) => state.auth.phoneNumber);
  const savedData = useSelector((state) => state.form.formData.step1);

  const [fullName, setFullName] = useState(savedData.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(phoneFromAuth || savedData.phoneNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState(savedData.dateOfBirth || '');
  const [gender, setGender] = useState(savedData.gender || '');
  const [email, setEmail] = useState(savedData.email || '');

  const [errors, setErrors] = useState({});

  // Auto-save data to Redux when fields change
  useEffect(() => {
    dispatch(
      updateFormData({
        step: 1,
        data: { fullName, phoneNumber, dateOfBirth, gender, email },
      })
    );
  }, [fullName, phoneNumber, dateOfBirth, gender, email]);

  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateFullName(fullName);
    if (!nameValidation.valid) {
      newErrors.fullName = nameValidation.error;
    }

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      newErrors.phoneNumber = phoneValidation.error;
    }

    const dobValidation = validateDateOfBirth(dateOfBirth);
    if (!dobValidation.valid) {
      newErrors.dateOfBirth = dobValidation.error;
    }

    if (email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        newErrors.email = emailValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Update profile data
      dispatch(
        updatePersonalInfo({
          fullName,
          phoneNumber,
          dateOfBirth,
          gender,
          email,
        })
      );

      // Go to next step
      dispatch(nextStep());
      navigation.navigate('Step2PhotoId');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={1} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>🆔</Text>
          <Text style={styles.title}>Asosiy Ma'lumotlar</Text>
          <Text style={styles.subtitle}>
            Shaxsiy ma'lumotlaringizni kiriting
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="To'liq ism *"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Alisher Karimov"
            error={errors.fullName}
            helperText="Passport yoki ID karddagi ismingiz"
            maxLength={50}
          />

          <Input
            label="Telefon raqam *"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+998 90 123 45 67"
            keyboardType="phone-pad"
            editable={false}
            helperText="✓ Tasdiqlangan"
            error={errors.phoneNumber}
            style={styles.verifiedInput}
          />

          <Input
            label="Tug'ilgan sana *"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="1990-05-15 (YYYY-MM-DD)"
            keyboardType="numeric"
            error={errors.dateOfBirth}
            helperText="18 yoshdan katta bo'lishingiz kerak"
          />

          <View style={styles.genderContainer}>
            <Text style={styles.label}>Jinsi</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('male')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'male' && styles.genderButtonTextActive,
                  ]}
                >
                  Erkak
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('female')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'female' && styles.genderButtonTextActive,
                  ]}
                >
                  Ayol
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'other' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('other')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'other' && styles.genderButtonTextActive,
                  ]}
                >
                  Boshqa
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Input
            label="Email (ixtiyoriy)"
            value={email}
            onChangeText={setEmail}
            placeholder="alisher@mail.uz"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            helperText="Bildirishnomalar uchun"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Keyingi →"
          onPress={handleNext}
          variant="primary"
          size="large"
        />
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
  form: {
    marginBottom: 24,
  },
  verifiedInput: {
    opacity: 0.7,
  },
  genderContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLightest,
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  genderButtonTextActive: {
    color: COLORS.primary,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default Step1BasicInfo;
