// ============================================================
// Onboarding Module — TypeScript Type Definitions
// Matches: Global HRMS Product Specification v1.0
// ============================================================

export type TaskPhase = 'pre-joining' | 'day-1' | 'week-1' | 'week-2' | 'month-1';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskAssignee = 'employee' | 'hr' | 'it' | 'manager' | 'buddy';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  phase: TaskPhase;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: TaskAssignee;
  completedDate?: string;
  category: string;
}

export interface WelcomeMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  message: string;
  hasVideo: boolean;
  videoUrl?: string;
  timestamp: string;
}

export interface RelocationTicket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
}

export interface RelocationSupport {
  visaStatus: 'pending' | 'processing' | 'approved' | 'not-required';
  accommodationStatus: 'searching' | 'confirmed' | 'not-required';
  travelStatus: 'pending' | 'booked' | 'completed' | 'not-required';
  allowanceStatus: 'pending' | 'approved' | 'disbursed';
  localBuddy: {
    name: string;
    phone: string;
    email: string;
    avatarInitials: string;
  };
  tickets: RelocationTicket[];
}

export interface TrainingModule {
  id: string;
  title: string;
  category: 'orientation' | 'technical' | 'compliance' | 'soft-skills' | 'product';
  duration: number; // minutes
  dueDate: string;
  mandatory: boolean;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  certificateEligible: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  expertise: string[];
  funFact: string;
  avatarInitials: string;
  avatarColor: string;
  linkedIn?: string;
  introductionStatus: 'pending' | 'introduced' | 'connected';
  welcomeMessageSent: boolean;
}

export interface OnboardingMilestone {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  status: 'upcoming' | 'completed' | 'missed';
  type: 'check-in' | 'review' | 'celebration';
}

export interface OnboardingEmployee {
  id: string;
  name: string;
  firstName: string;
  designation: string;
  department: string;
  manager: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  buddy: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  joiningDate: string;
  employeeId: string;
  location: string;
  country: 'IN' | 'US';
  isRelocating: boolean;
  onboardingCompleted: boolean;
  tasks: OnboardingTask[];
  welcomeMessages: WelcomeMessage[];
  relocationSupport?: RelocationSupport;
  trainingModules: TrainingModule[];
  teamMembers: TeamMember[];
  milestones: OnboardingMilestone[];
}
