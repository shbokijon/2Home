import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { COLORS } from '../../constants/colors';
import { addCertification, removeCertification } from '../../store/slices/profileSlice';
import { updateFormData, nextStep, previousStep } from '../../store/slices/formSlice';

export const Step7Certifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.form.formData.step7);
  const profileCerts = useSelector((state) => state.profile.certifications);

  const [certifications, setCertifications] = useState(savedData.certifications || []);
  const [specialSkills, setSpecialSkills] = useState(savedData.specialSkills || []);

  const SKILLS = [
    { id: 'first_aid', name: 'Birinchi yordam sertifikati' },
    { id: 'food_safety', name: 'Oziq-ovqat xavfsizligi' },
    { id: 'electrical', name: 'Elektr litsenziyasi' },
    { id: 'gas', name: 'Gaz o\'rnatish litsenziyasi' },
    { id: 'insurance', name: 'Sug\'urta tasdiqlangan' },
  ];

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 7,
        data: { certifications, specialSkills },
      })
    );
  }, [certifications, specialSkills]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newCert = {
          id: Date.now().toString(),
          name: file.name,
          uri: file.uri,
          type: file.mimeType,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };

        setCertifications([...certifications, newCert]);
        dispatch(addCertification(newCert));

        Alert.alert('Muvaffaqiyatli', 'Hujjat yuklandi');
      }
    } catch (error) {
      Alert.alert('Xato', 'Hujjatni yuklashda xatolik yuz berdi');
    }
  };

  const removeDocument = (certId) => {
    Alert.alert(
      'O\'chirish',
      'Hujjatni o\'chirishga ishonchingiz komilmi?',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'O\'chirish',
          style: 'destructive',
          onPress: () => {
            setCertifications(certifications.filter((c) => c.id !== certId));
            dispatch(removeCertification(certId));
          },
        },
      ]
    );
  };

  const toggleSkill = (skillId) => {
    if (specialSkills.includes(skillId)) {
      setSpecialSkills(specialSkills.filter((id) => id !== skillId));
    } else {
      setSpecialSkills([...specialSkills, skillId]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleNext = () => {
    // Certifications are optional, so we can proceed
    dispatch(nextStep());
    navigation.navigate('Step8Payment');
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={7} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>🎓</Text>
          <Text style={styles.title}>Sertifikatlar va Ko'nikmalar</Text>
          <Text style={styles.subtitle}>
            Professional malaka va sertifikatlaringiz (Ixtiyoriy)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hujjatlar</Text>
          <Text style={styles.sectionSubtitle}>
            Diplom, sertifikat, litsenziya va boshqa hujjatlar
          </Text>

          {certifications.length === 0 ? (
            <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
              <Text style={styles.uploadIcon}>📄</Text>
              <Text style={styles.uploadText}>Hujjat yuklash</Text>
              <Text style={styles.uploadSubtext}>
                PDF yoki rasm (max 10MB)
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.documentsContainer}>
              {certifications.map((cert) => (
                <View key={cert.id} style={styles.documentItem}>
                  <View style={styles.documentIcon}>
                    <Text style={styles.documentIconText}>
                      {cert.type?.includes('pdf') ? '📄' : '🖼️'}
                    </Text>
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName} numberOfLines={1}>
                      {cert.name}
                    </Text>
                    <Text style={styles.documentSize}>
                      {formatFileSize(cert.size)}
                    </Text>
                  </View>
                  <View style={styles.documentActions}>
                    <TouchableOpacity
                      style={styles.documentButton}
                      onPress={() => Alert.alert('Ko\'rish', cert.name)}
                    >
                      <Text style={styles.documentButtonText}>Ko'rish</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.documentButton, styles.deleteButton]}
                      onPress={() => removeDocument(cert.id)}
                    >
                      <Text style={styles.deleteButtonText}>O'chirish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <Button
                title="+ Yana qo'shish"
                onPress={pickDocument}
                variant="outline"
                style={styles.addMoreButton}
              />
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maxsus Ko'nikmalar</Text>
          <Text style={styles.sectionSubtitle}>
            Qo'shimcha sertifikatlar va litsenziyalar
          </Text>

          <View style={styles.skillsList}>
            {SKILLS.map((skill) => (
              <TouchableOpacity
                key={skill.id}
                style={[
                  styles.skillItem,
                  specialSkills.includes(skill.id) && styles.skillItemActive,
                ]}
                onPress={() => toggleSkill(skill.id)}
              >
                <Text
                  style={[
                    styles.skillText,
                    specialSkills.includes(skill.id) && styles.skillTextActive,
                  ]}
                >
                  {specialSkills.includes(skill.id) ? '☑' : '☐'} {skill.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>
              Sertifikatlar ixtiyoriy, lekin ular sizning ishonchingizni oshiradi
              va ko'proq buyurtma olish imkonini beradi.
            </Text>
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
  uploadIcon: {
    fontSize: 64,
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
  documentsContainer: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLightest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentIconText: {
    fontSize: 24,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  documentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  documentButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  addMoreButton: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 24,
  },
  skillsList: {
    gap: 8,
  },
  skillItem: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  skillItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLightest,
  },
  skillText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  skillTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.accentGold + '20',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accentGold,
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
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

export default Step7Certifications;
