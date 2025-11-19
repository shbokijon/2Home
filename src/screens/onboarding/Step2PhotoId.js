import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { COLORS } from '../../constants/colors';
import { updatePersonalInfo } from '../../store/slices/profileSlice';
import { updateFormData, nextStep, previousStep } from '../../store/slices/formSlice';

export const Step2PhotoId = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.form.formData.step2);

  const [profilePhoto, setProfilePhoto] = useState(savedData.profilePhoto || null);
  const [idFront, setIdFront] = useState(savedData.idFront || null);
  const [idBack, setIdBack] = useState(savedData.idBack || null);
  const [ocrData, setOcrData] = useState(savedData.ocrData || null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 2,
        data: { profilePhoto, idFront, idBack, ocrData },
      })
    );
  }, [profilePhoto, idFront, idBack, ocrData]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Ruxsat kerak',
        'Iltimos, kamera ruxsatini yoqing'
      );
      return false;
    }
    return true;
  };

  const pickProfilePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0]);
    }
  };

  const takeProfilePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0]);
    }
  };

  const pickIdDocument = async (side) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      if (side === 'front') {
        setIdFront(result.assets[0]);
        // Simulate OCR detection
        setTimeout(() => {
          setOcrData({
            name: 'Alisher Karimov',
            idNumber: '123456789ABC',
            birthDate: '1990-05-15',
          });
        }, 1000);
      } else {
        setIdBack(result.assets[0]);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profilePhoto) {
      newErrors.profilePhoto = 'Profil rasmini yuklang';
    }

    if (!idFront || !idBack) {
      newErrors.idDocument = 'ID card\'ning ikkala tomonini yuklang';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(
        updatePersonalInfo({
          profilePhoto: profilePhoto?.uri,
          idDocument: {
            front: idFront?.uri,
            back: idBack?.uri,
            detectedInfo: ocrData,
          },
        })
      );

      dispatch(nextStep());
      navigation.navigate('Step3ProfessionalInfo');
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={2} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>📸</Text>
          <Text style={styles.title}>Rasm va ID</Text>
          <Text style={styles.subtitle}>
            Profil rasmingiz va ID kartangizni yuklang
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil Rasmi</Text>
          {profilePhoto ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: profilePhoto.uri }} style={styles.profilePhoto} />
              <View style={styles.photoButtons}>
                <Button
                  title="O'zgartirish"
                  onPress={pickProfilePhoto}
                  variant="outline"
                  size="small"
                />
                <Button
                  title="O'chirish"
                  onPress={() => setProfilePhoto(null)}
                  variant="ghost"
                  size="small"
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={pickProfilePhoto}
            >
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Rasm yuklash</Text>
              <Text style={styles.uploadSubtext}>500x500px minimum</Text>
              <Text style={styles.uploadSubtext}>JPEG/PNG (max 5MB)</Text>
            </TouchableOpacity>
          )}

          {!profilePhoto && (
            <Button
              title="📸 Hozir suratga olish"
              onPress={takeProfilePhoto}
              variant="outline"
              style={styles.cameraButton}
            />
          )}

          {errors.profilePhoto && (
            <Text style={styles.errorText}>{errors.profilePhoto}</Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ID Card / Pasport</Text>

          <View style={styles.idSection}>
            <Text style={styles.label}>Old tomoni:</Text>
            {idFront ? (
              <View style={styles.idImageContainer}>
                <Image source={{ uri: idFront.uri }} style={styles.idImage} />
                <Button
                  title="O'zgartirish"
                  onPress={() => pickIdDocument('front')}
                  variant="outline"
                  size="small"
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBoxSmall}
                onPress={() => pickIdDocument('front')}
              >
                <Text style={styles.uploadIcon}>📄</Text>
                <Text style={styles.uploadText}>Old tomonini yuklash</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.idSection}>
            <Text style={styles.label}>Orqa tomoni:</Text>
            {idBack ? (
              <View style={styles.idImageContainer}>
                <Image source={{ uri: idBack.uri }} style={styles.idImage} />
                <Button
                  title="O'zgartirish"
                  onPress={() => pickIdDocument('back')}
                  variant="outline"
                  size="small"
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBoxSmall}
                onPress={() => pickIdDocument('back')}
              >
                <Text style={styles.uploadIcon}>📄</Text>
                <Text style={styles.uploadText}>Orqa tomonini yuklash</Text>
              </TouchableOpacity>
            )}
          </View>

          {ocrData && (
            <View style={styles.ocrBox}>
              <Text style={styles.ocrTitle}>✓ OCR Detected:</Text>
              <Text style={styles.ocrText}>Ism: {ocrData.name}</Text>
              <Text style={styles.ocrText}>ID: {ocrData.idNumber}</Text>
              <Text style={styles.ocrText}>Tug'ilgan sana: {ocrData.birthDate}</Text>
              <Text style={styles.ocrWarning}>
                ⚠️ Ma'lumotlar to'g'riligini tekshiring!
              </Text>
            </View>
          )}

          {errors.idDocument && (
            <Text style={styles.errorText}>{errors.idDocument}</Text>
          )}
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
  uploadBox: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
  uploadBoxSmall: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  photoContainer: {
    alignItems: 'center',
  },
  profilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cameraButton: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 24,
  },
  idSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  idImageContainer: {
    gap: 12,
  },
  idImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  ocrBox: {
    backgroundColor: COLORS.primaryLightest,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  ocrTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  ocrText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  ocrWarning: {
    fontSize: 12,
    color: COLORS.warning,
    marginTop: 8,
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

export default Step2PhotoId;
