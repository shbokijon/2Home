// Validation utilities for form fields

/**
 * Validate phone number (Uzbekistan format)
 * Format: +998 XX XXX XX XX
 */
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+998\d{9}$/;
  if (!phone) {
    return { valid: false, error: 'Telefon raqam kiritilishi shart' };
  }
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Telefon raqam formati noto\'g\'ri (+998 XX XXX XX XX)' };
  }
  return { valid: true, error: null };
};

/**
 * Validate full name
 */
export const validateFullName = (name) => {
  if (!name || name.trim().length < 3) {
    return { valid: false, error: 'Ism kamida 3 ta belgidan iborat bo\'lishi kerak' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'Ism 50 ta belgidan oshmasligi kerak' };
  }
  // Check for valid characters (Cyrillic, Latin, spaces, hyphens)
  const nameRegex = /^[a-zA-Zа-яА-ЯўЎқҚғҒҳҲ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: 'Ism faqat harflardan iborat bo\'lishi kerak' };
  }
  return { valid: true, error: null };
};

/**
 * Validate date of birth (must be 18+ years old)
 */
export const validateDateOfBirth = (date) => {
  if (!date) {
    return { valid: false, error: 'Tug\'ilgan sana kiritilishi shart' };
  }

  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { valid: false, error: '18 yoshdan katta bo\'lishingiz kerak' };
  }

  if (age > 80) {
    return { valid: false, error: 'Tug\'ilgan sana noto\'g\'ri' };
  }

  return { valid: true, error: null };
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: true, error: null }; // Email is optional
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email formati noto\'g\'ri' };
  }

  return { valid: true, error: null };
};

/**
 * Validate IBAN (Uzbekistan format)
 * Format: UZ + 24 digits
 */
export const validateIBAN = (iban) => {
  if (!iban) {
    return { valid: false, error: 'IBAN kiritilishi shart' };
  }

  const ibanRegex = /^UZ\d{24}$/;
  if (!ibanRegex.test(iban.replace(/\s/g, ''))) {
    return { valid: false, error: 'IBAN formati noto\'g\'ri (UZ + 24 raqam)' };
  }

  return { valid: true, error: null };
};

/**
 * Validate card number (16 digits)
 */
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber) {
    return { valid: false, error: 'Karta raqami kiritilishi shart' };
  }

  const cardRegex = /^\d{16}$/;
  if (!cardRegex.test(cardNumber.replace(/\s/g, ''))) {
    return { valid: false, error: 'Karta raqami 16 ta raqamdan iborat bo\'lishi kerak' };
  }

  return { valid: true, error: null };
};

/**
 * Validate bio/description
 */
export const validateBio = (bio, minLength = 50, maxLength = 500) => {
  if (!bio) {
    return { valid: false, error: `Kamida ${minLength} ta belgi kiritilishi tavsiya etiladi` };
  }

  if (bio.length < minLength) {
    return { valid: false, error: `Kamida ${minLength} ta belgi kiritilishi tavsiya etiladi` };
  }

  if (bio.length > maxLength) {
    return { valid: false, error: `Maksimal ${maxLength} ta belgi` };
  }

  return { valid: true, error: null };
};

/**
 * Validate hourly rate
 */
export const validateHourlyRate = (rate) => {
  if (!rate || rate < 50000) {
    return { valid: false, error: 'Soatlik narx kamida 50,000 so\'m bo\'lishi kerak' };
  }

  if (rate > 1000000) {
    return { valid: false, error: 'Soatlik narx maksimal 1,000,000 so\'m' };
  }

  return { valid: true, error: null };
};

/**
 * Validate minimum charge
 */
export const validateMinimumCharge = (charge) => {
  if (!charge || charge < 50000) {
    return { valid: false, error: 'Minimal xizmat narxi kamida 50,000 so\'m' };
  }

  if (charge > 500000) {
    return { valid: false, error: 'Minimal xizmat narxi maksimal 500,000 so\'m' };
  }

  return { valid: true, error: null };
};

/**
 * Validate service categories
 */
export const validateCategories = (categories) => {
  if (!categories || categories.length === 0) {
    return { valid: false, error: 'Kamida bitta xizmat turini tanlang' };
  }

  return { valid: true, error: null };
};

/**
 * Validate schedule
 */
export const validateSchedule = (schedule) => {
  if (!schedule) {
    return { valid: false, error: 'Ish jadvali kiritilishi shart' };
  }

  // Check if at least one day is available
  const hasAvailableDay = Object.values(schedule).some((day) => day.available);

  if (!hasAvailableDay) {
    return { valid: false, error: 'Kamida bir kun mavjud bo\'lishi kerak' };
  }

  return { valid: true, error: null };
};

export default {
  validatePhoneNumber,
  validateFullName,
  validateDateOfBirth,
  validateEmail,
  validateIBAN,
  validateCardNumber,
  validateBio,
  validateHourlyRate,
  validateMinimumCharge,
  validateCategories,
  validateSchedule,
};
