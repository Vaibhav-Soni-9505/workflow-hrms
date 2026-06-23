import type { Metadata } from 'next';
import OnboardingDashboard from '../../../components/onboarding/OnboardingDashboard';

export const metadata: Metadata = {
  title: 'Onboarding — WorkFlow HRMS',
  description: 'Your personalized onboarding journey — complete pre-joining tasks, meet your team, and get ready for Day 1.',
};

export default function OnboardingPage() {
  return <OnboardingDashboard />;
}
