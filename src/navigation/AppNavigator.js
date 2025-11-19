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
import Step6Schedule from '../screens/onboarding/Step6Schedule';
import Step7Certifications from '../screens/onboarding/Step7Certifications';
import Step8Payment from '../screens/onboarding/Step8Payment';
import Step9Terms from '../screens/onboarding/Step9Terms';

// Dashboard
import PendingApprovalScreen from '../screens/dashboard/PendingApprovalScreen';

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
            <Stack.Screen name="Step6Schedule" component={Step6Schedule} />
            <Stack.Screen
              name="Step7Certifications"
              component={Step7Certifications}
            />
            <Stack.Screen name="Step8Payment" component={Step8Payment} />
            <Stack.Screen name="Step9Terms" component={Step9Terms} />
            <Stack.Screen
              name="PendingApproval"
              component={PendingApprovalScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
