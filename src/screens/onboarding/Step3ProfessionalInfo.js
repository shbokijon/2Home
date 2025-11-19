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
import { SERVICE_CATEGORIES, LANGUAGES } from '../../constants/categories';
import { validateCategories, validateBio } from '../../utils/validation';
import { updateProfessionalInfo } from '../../store/slices/profileSlice';
import { updateFormData, nextStep, previousStep } from '../../store/slices/formSlice';

export const Step3ProfessionalInfo = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.form.formData.step3);

  const [selectedCategory, setSelectedCategory] = useState(savedData.selectedCategory || null);
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    savedData.selectedSubcategories || []
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(
    savedData.yearsOfExperience || 1
  );
  const [selectedLanguages, setSelectedLanguages] = useState(
    savedData.selectedLanguages || ['uz']
  );
  const [bio, setBio] = useState(savedData.bio || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 3,
        data: {
          selectedCategory,
          selectedSubcategories,
          yearsOfExperience,
          selectedLanguages,
          bio,
        },
      })
    );
  }, [selectedCategory, selectedSubcategories, yearsOfExperience, selectedLanguages, bio]);

  const toggleSubcategory = (subcategoryId) => {
    if (selectedSubcategories.includes(subcategoryId)) {
      setSelectedSubcategories(
        selectedSubcategories.filter((id) => id !== subcategoryId)
      );
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategoryId]);
    }
  };

  const toggleLanguage = (languageId) => {
    if (selectedLanguages.includes(languageId)) {
      // Don't allow removing Uzbek (required)
      if (languageId === 'uz') return;
      setSelectedLanguages(selectedLanguages.filter((id) => id !== languageId));
    } else {
      setSelectedLanguages([...selectedLanguages, languageId]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedCategory) {
      newErrors.category = 'Xizmat turini tanlang';
    }

    if (selectedSubcategories.length === 0) {
      newErrors.subcategories = 'Kamida bitta mutaxassislikni tanlang';
    }

    const bioValidation = validateBio(bio);
    if (!bioValidation.valid) {
      newErrors.bio = bioValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(
        updateProfessionalInfo({
          categories: [selectedCategory],
          subcategories: selectedSubcategories,
          yearsOfExperience,
          languages: selectedLanguages,
          bio,
        })
      );

      dispatch(nextStep());
      navigation.navigate('Step4ServiceArea');
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
    navigation.goBack();
  };

  const currentCategory = SERVICE_CATEGORIES.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={3} totalSteps={9} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>💼</Text>
          <Text style={styles.title}>Professional Ma'lumot</Text>
          <Text style={styles.subtitle}>
            Sizning kasbingiz va tajribangiz
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asosiy xizmat turi *</Text>
          <View style={styles.categoryGrid}>
            {SERVICE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardActive,
                ]}
                onPress={() => {
                  setSelectedCategory(category.id);
                  setSelectedSubcategories([]);
                }}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        {currentCategory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mutaxassislik *</Text>
            <View style={styles.subcategoryList}>
              {currentCategory.subcategories.map((sub) => (
                <TouchableOpacity
                  key={sub.id}
                  style={[
                    styles.subcategoryItem,
                    selectedSubcategories.includes(sub.id) &&
                      styles.subcategoryItemActive,
                  ]}
                  onPress={() => toggleSubcategory(sub.id)}
                >
                  <Text
                    style={[
                      styles.subcategoryText,
                      selectedSubcategories.includes(sub.id) &&
                        styles.subcategoryTextActive,
                    ]}
                  >
                    {selectedSubcategories.includes(sub.id) ? '☑' : '☐'} {sub.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.subcategories && (
              <Text style={styles.errorText}>{errors.subcategories}</Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tajriba (yil) *</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>{yearsOfExperience} yil</Text>
            <View style={styles.sliderButtons}>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() =>
                  setYearsOfExperience(Math.max(1, yearsOfExperience - 1))
                }
              >
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${(yearsOfExperience / 30) * 100}%` },
                  ]}
                />
              </View>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() =>
                  setYearsOfExperience(Math.min(30, yearsOfExperience + 1))
                }
              >
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tillar *</Text>
          <View style={styles.languageList}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.languageItem,
                  selectedLanguages.includes(lang.id) && styles.languageItemActive,
                ]}
                onPress={() => toggleLanguage(lang.id)}
                disabled={lang.id === 'uz'}
              >
                <Text style={styles.languageIcon}>{lang.icon}</Text>
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguages.includes(lang.id) && styles.languageTextActive,
                  ]}
                >
                  {lang.name}
                </Text>
                {lang.id === 'uz' && (
                  <Text style={styles.languageRequired}>(Majburiy)</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Input
            label="Men haqimda (Professional tarjimayi hol) *"
            value={bio}
            onChangeText={setBio}
            placeholder="Men 5 yil davomida tozalash xizmatlarini ko'rsataman..."
            multiline
            numberOfLines={6}
            maxLength={500}
            error={errors.bio}
            helperText="Mijozlar sizning tajribangiz to'g'risida bilib olishni xohlaydi"
          />
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  categoryCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLightest,
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: COLORS.primary,
  },
  subcategoryList: {
    gap: 8,
  },
  subcategoryItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  subcategoryItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLightest,
  },
  subcategoryText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  subcategoryTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  sliderContainer: {
    paddingVertical: 8,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  languageItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLightest,
  },
  languageIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  languageText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  languageTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  languageRequired: {
    fontSize: 12,
    color: COLORS.textSecondary,
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

export default Step3ProfessionalInfo;
