import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

// Auth Screens
import PhoneVerificationScreen from '../screens/auth/PhoneVerificationScreen';

// Onboarding Screens
import Step1BasicInfo from '../screens/onboarding/Step1BasicInfo';
import Step2PhotoId from '../screens/onboarding/Step2PhotoId';
import Step3ProfessionalInfo from '../screens/onboarding/Step3ProfessionalInfo';
import Step4ServiceArea from '../screens/onboarding/Step4ServiceArea';
import Step5Pricing from '../screens/onboarding/Step5Pricing';
// TODO: Import remaining steps (6, 7, 8, 9)

// Dashboard
// import DashboardScreen from '../screens/dashboard/DashboardScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isPhoneVerified = useSelector((state) => state.auth.isPhoneVerified);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isPhoneVerified ? (
          // Auth flow
          <Stack.Screen
            name="PhoneVerification"
            component={PhoneVerificationScreen}
          />
        ) : (
          // Onboarding flow
          <>
            <Stack.Screen name="Step1BasicInfo" component={Step1BasicInfo} />
            <Stack.Screen name="Step2PhotoId" component={Step2PhotoId} />
            <Stack.Screen
              name="Step3ProfessionalInfo"
              component={Step3ProfessionalInfo}
            />
            <Stack.Screen
              name="Step4ServiceArea"
              component={Step4ServiceArea}
            />
            <Stack.Screen name="Step5Pricing" component={Step5Pricing} />
            {/* TODO: Add remaining step screens */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
