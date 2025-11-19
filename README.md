# 2Home Pro - Service Provider App (Xizmat Ko'rsatuvchilar Ilovasi)

Uzbekistan uchun uy xizmatlari marketplace - **USTALAR (Service Providers) ilovasi**

## 🎯 Loyiha Haqida

2Home Pro - bu 2Home platformasining xizmat ko'rsatuvchilar (ustalar) uchun React Native mobil ilovasi. Ushbu ilova orqali ustalar o'zlarining professional profil ma'lumotlarini kiritishlari, xizmat narxlarini belgilashlari, ish jadvallarini boshqarishlari va buyurtmalarni qabul qilishlari mumkin.

2Home — bu uyingiz uchun kerak bo'lgan barcha xizmatlarni bir joyda topishingiz mumkin bo'lgan onlayn platforma. Tozalash, texnik ta'mirlash, ko'chirish, foto-video, go'zallik xizmatlari — hammasini bir ilovada!

## 📱 Tech Stack

- **React Native (Expo)** - Cross-platform mobile app
- **Redux Toolkit** - State management with persistence
- **React Navigation** - Navigation system
- **Axios** - API integration
- **Expo Camera & Image Picker** - Photo/document upload
- **React Native Maps** - Service area mapping (planned)
- **Green Theme (#10B981)** - Growth & earnings focus

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS (Mac required)
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📋 9-Step Registration Flow

### ✅ Completed Steps

1. **Step 1: Basic Info** - Name, phone, DOB, gender, email
2. **Step 2: Photo & ID** - Profile photo, ID card scan with OCR
3. **Step 3: Professional Info** - Categories, specialties, experience, bio
4. **Step 4: Service Area** - Radius, preferred districts
5. **Step 5: Pricing** - Hourly rate, minimum charge, surcharges

### 🔨 TODO Steps

6. **Step 6: Schedule** - Weekly availability, working hours
7. **Step 7: Certifications** - Upload diplomas, licenses
8. **Step 8: Payment** - Bank account, cards, mobile money
9. **Step 9: Terms** - Agreements, commission, background check

## 🗂️ Project Structure

```
2Home/
├── App.js                          # Main entry
├── src/
│   ├── components/ui/              # Reusable UI components
│   ├── screens/
│   │   ├── auth/                   # Phone verification
│   │   └── onboarding/             # 9-step registration
│   ├── store/slices/               # Redux slices
│   ├── services/                   # API services
│   ├── navigation/                 # Navigation setup
│   ├── utils/                      # Validation, helpers
│   ├── constants/                  # Colors, API, categories
│   └── hooks/                      # Custom hooks (auto-save)
```

## ✨ Key Features

- ✅ **Auto-save** every 30 seconds
- ✅ **Real-time validation** with helpful errors
- ✅ **Progressive disclosure** for better UX
- ✅ **Redux Persist** for session recovery
- ✅ **Multi-step form** with progress indicator

## 🎨 Design System

**Colors:**
- Primary: #10B981 (Green)
- Gold: #FBBF24 (Earnings)
- Blue: #2563EB (Actions)

**Components:** Button, Input, ProgressBar, and more

## 📝 Next Steps

- [ ] Complete Steps 6-9
- [ ] Profile management screens
- [ ] Provider dashboard
- [ ] Real map integration
- [ ] Document upload
- [ ] Backend API integration

## 📄 License

Copyright © 2025 2Home Pro. All rights reserved.
