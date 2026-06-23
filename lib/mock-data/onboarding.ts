import type { OnboardingEmployee } from '../../types/onboarding';

// ============================================================
// Mock Data — Onboarding Module
// Persona: Alex (New Joiner) — per HRMS Product Spec v1.0
// ============================================================

export const mockOnboardingEmployee: OnboardingEmployee = {
  id: 'emp-001',
  name: 'Alex Johnson',
  firstName: 'Alex',
  designation: 'Senior Software Engineer',
  department: 'Engineering',
  employeeId: 'WF-2024-0082',
  location: 'Bangalore, India',
  country: 'IN',
  isRelocating: true,
  onboardingCompleted: false,
  joiningDate: '2024-07-01',

  manager: {
    name: 'Priya Sharma',
    role: 'Engineering Manager',
    avatarInitials: 'PS',
  },
  buddy: {
    name: 'Rahul Gupta',
    role: 'Senior Developer',
    avatarInitials: 'RG',
  },

  // ──────────────────────────────────────────────
  // Tasks (ON-02) — grouped by phase
  // ──────────────────────────────────────────────
  tasks: [
    // Pre-Joining
    {
      id: 'task-001',
      title: 'Sign offer letter',
      description: 'Digitally sign your offer letter via the HR portal.',
      phase: 'pre-joining',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-06-20',
      assignee: 'employee',
      completedDate: '2024-06-18',
      category: 'Documents',
    },
    {
      id: 'task-002',
      title: 'Submit KYC & identity documents',
      description: 'Upload Aadhaar, PAN, passport or government ID.',
      phase: 'pre-joining',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-06-25',
      assignee: 'employee',
      completedDate: '2024-06-22',
      category: 'Documents',
    },
    {
      id: 'task-003',
      title: 'Fill bank account details',
      description: 'Provide bank account details for salary transfer.',
      phase: 'pre-joining',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-06-28',
      assignee: 'employee',
      category: 'Finance',
    },
    {
      id: 'task-004',
      title: 'Submit tax declaration form',
      description: 'Complete Form 12BB for income tax exemptions (India).',
      phase: 'pre-joining',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-06-30',
      assignee: 'employee',
      category: 'Finance',
    },
    {
      id: 'task-005',
      title: 'Background verification consent',
      description: 'Provide consent for BGV checks. Initiated by HR.',
      phase: 'pre-joining',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-06-22',
      assignee: 'hr',
      completedDate: '2024-06-21',
      category: 'Compliance',
    },
    {
      id: 'task-006',
      title: 'Laptop provisioning',
      description: 'IT to set up and deliver your work laptop.',
      phase: 'pre-joining',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-06-30',
      assignee: 'it',
      category: 'IT Setup',
    },

    // Day 1
    {
      id: 'task-007',
      title: 'Attend orientation session',
      description: 'Join the 2-hour virtual orientation with HR.',
      phase: 'day-1',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-07-01',
      assignee: 'employee',
      category: 'Orientation',
    },
    {
      id: 'task-008',
      title: 'Setup corporate email & Slack',
      description: 'Configure your work email and join team Slack channels.',
      phase: 'day-1',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-07-01',
      assignee: 'employee',
      category: 'IT Setup',
    },
    {
      id: 'task-009',
      title: 'Meet your buddy',
      description: 'Schedule a 30-minute intro call with your onboarding buddy.',
      phase: 'day-1',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-07-01',
      assignee: 'employee',
      category: 'People',
    },

    // Week 1
    {
      id: 'task-010',
      title: 'Complete code access request',
      description: 'Submit GitHub & Jira access request through IT portal.',
      phase: 'week-1',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-07-05',
      assignee: 'employee',
      category: 'IT Setup',
    },
    {
      id: 'task-011',
      title: 'Read team handbook',
      description: 'Review the engineering team norms and processes document.',
      phase: 'week-1',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-07-05',
      assignee: 'employee',
      category: 'Learning',
    },
    {
      id: 'task-012',
      title: '1:1 meeting with manager',
      description: 'Initial goal-setting 1:1 with Priya Sharma.',
      phase: 'week-1',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-07-05',
      assignee: 'manager',
      category: 'People',
    },

    // Month 1
    {
      id: 'task-013',
      title: 'Complete mandatory compliance training',
      description: 'Finish POSH, data privacy, and code of conduct modules.',
      phase: 'month-1',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-07-31',
      assignee: 'employee',
      category: 'Compliance',
    },
    {
      id: 'task-014',
      title: 'Set 30-day goals with manager',
      description: 'Define and commit to your first 30-day OKRs.',
      phase: 'month-1',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-07-15',
      assignee: 'employee',
      category: 'Performance',
    },
  ],

  // ──────────────────────────────────────────────
  // Welcome Messages (ON-03)
  // ──────────────────────────────────────────────
  welcomeMessages: [
    {
      id: 'wm-001',
      senderName: 'Ananya Krishnan',
      senderRole: 'Chief Executive Officer',
      senderAvatar: 'AK',
      message:
        "Welcome to WorkFlow, Alex! We built this company on the belief that great people make great products. You've joined a team that's passionate, driven, and genuinely cares about each other's success. I'm excited to see the impact you'll make. Don't hesitate to reach out anytime.",
      hasVideo: true,
      videoUrl: '#',
      timestamp: '2024-06-28T09:00:00Z',
    },
    {
      id: 'wm-002',
      senderName: 'Priya Sharma',
      senderRole: 'Engineering Manager',
      senderAvatar: 'PS',
      message:
        "Alex, the team is so excited to have you join us! We have some great projects lined up and I can't wait to see your perspective. I've scheduled a 1:1 for your first week so we can align on goals. See you on Day 1! 🚀",
      hasVideo: false,
      timestamp: '2024-06-29T10:30:00Z',
    },
    {
      id: 'wm-003',
      senderName: 'Rahul Gupta',
      senderRole: 'Onboarding Buddy • Senior Developer',
      senderAvatar: 'RG',
      message:
        "Hey Alex! I'm your buddy for the next 90 days. Think of me as your go-to person for all the small questions you don't want to bother HR about 😄 My Slack handle is @rahulg. Let's grab virtual coffee on Day 1!",
      hasVideo: false,
      timestamp: '2024-06-30T14:00:00Z',
    },
    {
      id: 'wm-004',
      senderName: 'Meera Patel',
      senderRole: 'HR Business Partner',
      senderAvatar: 'MP',
      message:
        "Welcome aboard, Alex! Your onboarding checklist is live on WorkFlow. Please complete the pre-joining tasks before July 1st. If you have any questions about documents, payroll, or policies, I'm just a message away. Looking forward to your Day 1! 🎉",
      hasVideo: false,
      timestamp: '2024-06-28T11:00:00Z',
    },
  ],

  // ──────────────────────────────────────────────
  // Relocation Support (ON-04)
  // ──────────────────────────────────────────────
  relocationSupport: {
    visaStatus: 'not-required',
    accommodationStatus: 'confirmed',
    travelStatus: 'booked',
    allowanceStatus: 'approved',
    localBuddy: {
      name: 'Vikram Nair',
      phone: '+91 98765 43210',
      email: 'vikram.nair@workflow.com',
      avatarInitials: 'VN',
    },
    tickets: [
      {
        id: 'rt-001',
        title: 'Airport pickup coordination',
        status: 'resolved',
        priority: 'high',
      },
      {
        id: 'rt-002',
        title: 'PG accommodation deposit pending',
        status: 'in-progress',
        priority: 'medium',
      },
      {
        id: 'rt-003',
        title: 'Internet connection at accommodation',
        status: 'open',
        priority: 'low',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Training Modules (linked with onboarding)
  // ──────────────────────────────────────────────
  trainingModules: [
    {
      id: 'tm-001',
      title: 'Company Culture & Values',
      category: 'orientation',
      duration: 45,
      dueDate: '2024-07-05',
      mandatory: true,
      status: 'not-started',
      progress: 0,
      certificateEligible: false,
    },
    {
      id: 'tm-002',
      title: 'POSH & Workplace Safety',
      category: 'compliance',
      duration: 90,
      dueDate: '2024-07-15',
      mandatory: true,
      status: 'not-started',
      progress: 0,
      certificateEligible: true,
    },
    {
      id: 'tm-003',
      title: 'Data Privacy & Security',
      category: 'compliance',
      duration: 60,
      dueDate: '2024-07-15',
      mandatory: true,
      status: 'not-started',
      progress: 0,
      certificateEligible: true,
    },
    {
      id: 'tm-004',
      title: 'Engineering Toolchain Intro',
      category: 'technical',
      duration: 120,
      dueDate: '2024-07-20',
      mandatory: false,
      status: 'not-started',
      progress: 0,
      certificateEligible: false,
    },
  ],

  // ──────────────────────────────────────────────
  // Team Members (ON-05)
  // ──────────────────────────────────────────────
  teamMembers: [
    {
      id: 'tm-p-001',
      name: 'Priya Sharma',
      role: 'Engineering Manager',
      department: 'Engineering',
      bio: '8+ years leading product engineering teams. Passionate about developer experience and system design.',
      expertise: ['System Design', 'Team Leadership', 'React', 'Node.js'],
      funFact: 'Completed 3 Ironman triathlons while managing two product launches!',
      avatarInitials: 'PS',
      avatarColor: 'bg-blue-500',
      introductionStatus: 'introduced',
      welcomeMessageSent: true,
    },
    {
      id: 'tm-p-002',
      name: 'Rahul Gupta',
      role: 'Senior Developer',
      department: 'Engineering',
      bio: 'Full-stack engineer with a love for clean code. Goes deep on performance optimization.',
      expertise: ['TypeScript', 'Next.js', 'PostgreSQL', 'Redis'],
      funFact: 'Runs a tech blog with 20k monthly readers under a pseudonym.',
      avatarInitials: 'RG',
      avatarColor: 'bg-teal-500',
      introductionStatus: 'connected',
      welcomeMessageSent: true,
    },
    {
      id: 'tm-p-003',
      name: 'Sneha Iyer',
      role: 'Product Designer',
      department: 'Design',
      bio: 'UX-first designer obsessed with accessibility and motion design.',
      expertise: ['Figma', 'Design Systems', 'Motion', 'User Research'],
      funFact: 'Once won a 24-hour hackathon by designing entirely in 3D.',
      avatarInitials: 'SI',
      avatarColor: 'bg-pink-500',
      introductionStatus: 'pending',
      welcomeMessageSent: false,
    },
    {
      id: 'tm-p-004',
      name: 'Arjun Mehta',
      role: 'Backend Engineer',
      department: 'Engineering',
      bio: 'Infrastructure and distributed systems specialist. Keeps the platform running at 99.99% uptime.',
      expertise: ['Go', 'Kubernetes', 'AWS', 'Kafka'],
      funFact: 'Has a home server farm that generates more heat than his AC can handle.',
      avatarInitials: 'AM',
      avatarColor: 'bg-orange-500',
      introductionStatus: 'pending',
      welcomeMessageSent: false,
    },
    {
      id: 'tm-p-005',
      name: 'Divya Menon',
      role: 'QA Lead',
      department: 'Engineering',
      bio: 'Quality advocate who automates everything that moves. 0 prod bugs is the only acceptable metric.',
      expertise: ['Playwright', 'Cypress', 'k6', 'Test Strategy'],
      funFact: 'Has a spreadsheet tracking every bug she has ever found — 3,400 and counting.',
      avatarInitials: 'DM',
      avatarColor: 'bg-green-500',
      introductionStatus: 'pending',
      welcomeMessageSent: false,
    },
  ],

  // ──────────────────────────────────────────────
  // Milestones
  // ──────────────────────────────────────────────
  milestones: [
    {
      id: 'ms-001',
      title: 'Day 1 Kickoff',
      description: 'First day orientation and team meet-and-greet.',
      scheduledDate: '2024-07-01',
      status: 'upcoming',
      type: 'check-in',
    },
    {
      id: 'ms-002',
      title: '30-Day Check-in',
      description: 'First month review with manager and HR.',
      scheduledDate: '2024-07-31',
      status: 'upcoming',
      type: 'review',
    },
    {
      id: 'ms-003',
      title: '60-Day Review',
      description: 'Mid-probation goal review and feedback session.',
      scheduledDate: '2024-08-30',
      status: 'upcoming',
      type: 'review',
    },
    {
      id: 'ms-004',
      title: '90-Day Celebration 🎉',
      description: 'You made it! Onboarding completion celebration.',
      scheduledDate: '2024-09-30',
      status: 'upcoming',
      type: 'celebration',
    },
  ],
};

// ──────────────────────────────────────────────
// Computed Helpers
// ──────────────────────────────────────────────

export function getOnboardingProgress(employee: OnboardingEmployee): number {
  const employeeTasks = employee.tasks.filter((t) => t.assignee === 'employee');
  if (employeeTasks.length === 0) return 0;
  const completed = employeeTasks.filter((t) => t.status === 'completed').length;
  return Math.round((completed / employeeTasks.length) * 100);
}

export function getTasksByPhase(employee: OnboardingEmployee) {
  const phases = ['pre-joining', 'day-1', 'week-1', 'week-2', 'month-1'] as const;
  return phases.map((phase) => ({
    phase,
    tasks: employee.tasks.filter((t) => t.phase === phase),
  }));
}

export const PHASE_LABELS: Record<string, string> = {
  'pre-joining': 'Pre-Joining',
  'day-1': 'Day 1',
  'week-1': 'Week 1',
  'week-2': 'Week 2',
  'month-1': 'Month 1',
};

export const PHASE_DESCRIPTIONS: Record<string, string> = {
  'pre-joining': 'Complete before your first day',
  'day-1': 'Priority tasks for Day 1',
  'week-1': 'Complete in your first week',
  'week-2': 'Second week objectives',
  'month-1': 'Complete in your first month',
};
