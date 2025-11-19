import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { COLORS } from '../../constants/colors';
import { validatePhoneNumber } from '../../utils/validation';
import { setPhoneNumber, setPhoneVerified } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

export const PhoneVerificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('+998 ');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format phone number as user types
  const handlePhoneChange = (text) => {
    // Always start with +998
    if (!text.startsWith('+998')) {
      text = '+998 ' + text.replace('+998', '').trim();
    }

    // Remove any non-digit characters except +
    let cleaned = text.replace(/[^\d+]/g, '');

    // Format: +998 XX XXX XX XX
    if (cleaned.length > 4) {
      let formatted = '+998 ';
      let numbers = cleaned.substring(4);

      if (numbers.length > 0) formatted += numbers.substring(0, 2);
      if (numbers.length > 2) formatted += ' ' + numbers.substring(2, 5);
      if (numbers.length > 5) formatted += ' ' + numbers.substring(5, 7);
      if (numbers.length > 7) formatted += ' ' + numbers.substring(7, 9);

      setPhone(formatted);
    } else {
      setPhone('+998 ');
    }
  };

  const handleSendOTP = async () => {
    setError('');

    // Validate phone number
    const validation = validatePhoneNumber(phone);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    try {
      // Call API to send OTP
      await authService.register(phone.replace(/\s/g, ''));

      // Show OTP input
      setShowOtpInput(true);
      dispatch(setPhoneNumber(phone));
    } catch (err) {
      setError(err.message || 'OTP jo\'natishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');

    if (otp.length !== 6) {
      setError('6 raqamli kodni kiriting');
      return;
    }

    setLoading(true);

    try {
      // Call API to verify OTP
      const response = await authService.verifyPhoneOTP(
        phone.replace(/\s/g, ''),
        otp
      );

      // Mark phone as verified
      dispatch(setPhoneVerified(true));

      // Navigate to onboarding
      navigation.navigate('Onboarding');
    } catch (err) {
      setError(err.message || 'Kod noto\'g\'ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>2Home Pro</Text>
          <Text style={styles.title}>Xizmat Ko'rsatuvchilar</Text>
          <Text style={styles.subtitle}>
            Telefon raqamingizni kiriting
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Telefon raqam"
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="+998 XX XXX XX XX"
            keyboardType="phone-pad"
            maxLength={17}
            editable={!showOtpInput}
            helperText="SMS orqali tasdiqlash kodi yuboriladi"
          />

          {showOtpInput && (
            <Input
              label="Tasdiqlash kodi"
              value={otp}
              onChangeText={setOtp}
              placeholder="6 raqamli kod"
              keyboardType="number-pad"
              maxLength={6}
              helperText={`${phone} raqamiga yuborilgan kodni kiriting`}
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonContainer}>
            {!showOtpInput ? (
              <Button
                title="Kodni yuborish"
                onPress={handleSendOTP}
                loading={loading}
                variant="primary"
                size="large"
              />
            ) : (
              <>
                <Button
                  title="Tasdiqlash"
                  onPress={handleVerifyOTP}
                  loading={loading}
                  variant="primary"
                  size="large"
                />
                <Button
                  title="Qayta yuborish"
                  onPress={handleSendOTP}
                  variant="ghost"
                  style={styles.resendButton}
                />
              </>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Davom etish orqali siz{' '}
            <Text style={styles.link}>Foydalanish shartlari</Text> va{' '}
            <Text style={styles.link}>Maxfiylik siyosati</Text>ga rozilik
            bildirasiz
          </Text>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -60,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  resendButton: {
    marginTop: 12,
  },
  footer: {
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default PhoneVerificationScreen;
