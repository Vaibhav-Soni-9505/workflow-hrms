// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — Zustand Global Store (Relational Mock Database)
// ──────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { mockOnboardingEmployee } from "../lib/mock-data/onboarding";

// ── Shared Types ──────────────────────────────────────────────────────────────

export type Role = "Employee" | "Manager" | "HR" | "Admin";
export type LeaveType = "Casual" | "Sick" | "Privilege" | "Comp-off";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface User {
  id: string;
  name: string;
  role: Role;
  managerId: string | null;
  designation: string;
  avatar: string; // two-letter initials
}

/** Per-user, per-type leave balance (relational). */
export interface LeaveBalance {
  id: string;
  userId: string; // FK → User.id
  leaveType: LeaveType;
  total: number;
  used: number;
  pending: number;
  available: number;
}

export interface LeaveRequest {
  id: string;
  userId: string; // FK → User.id
  leaveType: LeaveType;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string; // ISO date
  approvedBy?: string; // name of approver (set when status → Approved)
}

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "Half-day"
  | "On-leave";

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  status: AttendanceStatus;
  totalHours?: number;
}

export interface ActiveSession {
  userId: string;
  startTime: string;
  isClockedIn: boolean;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: number;
  year: number;
  earnings: { basic: number; hra: number; specialAllowance: number };
  deductions: { tax: number; pf: number; esi: number };
  status: "Draft" | "Processing" | "Approved" | "Paid";
}

export interface TaxDocument {
  id: string;
  userId: string;
  name: string;
  type: string;
  year: number;
  url: string;
}

export type DocumentCategory =
  | "identity"
  | "employment"
  | "work-auth"
  | "tax"
  | "education"
  | "other";

export type DocumentStatus = "missing" | "uploaded" | "verified" | "rejected";

export interface UserDocument {
  id: string;
  userId: string;
  category: DocumentCategory;
  status: DocumentStatus;
  fileName: string;
  fileType: string;
  fileSize: string;
  expiryDate?: string;
  verificationDate?: string;
  rejectionReason?: string;
  uploadedAt: string;
}

export type ReimbursementCategory =
  | "travel"
  | "food"
  | "accommodation"
  | "communication"
  | "medical"
  | "office-supplies"
  | "other";

export type ReimbursementStatus =
  | "draft"
  | "submitted"
  | "pending-approval"
  | "approved"
  | "rejected"
  | "paid";

export interface Mileage {
  distance: number;
  rate: number;
}

export interface Reimbursement {
  id: string;
  userId: string;
  category: ReimbursementCategory;
  amount: number;
  currency: string;
  date: string;
  description: string;
  receiptUrl?: string;
  isTaxable: boolean;
  mileage?: Mileage;
  status: ReimbursementStatus;
  managerComment?: string;
}

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
}

export type GoalCategory = "individual" | "team" | "organizational";
export type GoalType = "quarterly" | "annual";
export type GoalStatus =
  | "not-started"
  | "in-progress"
  | "on-track"
  | "at-risk"
  | "completed";

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory;
  type: GoalType;
  weight: number;
  dueDate: string;
  status: GoalStatus;
  progress: number;
  keyResults: KeyResult[];
}

export type ReviewType = "quarterly" | "annual";

export interface PerformanceReview {
  id: string;
  userId: string;
  reviewerId: string;
  type: ReviewType;
  overallRating: number;
  strengths: string[];
  improvements: string[];
  recommendations: string;
  date: string;
}

export interface TrainingContent {
  id: string;
  title: string;
  type: "video" | "document" | "quiz" | "interactive";
  duration: string;
  isCompleted: boolean;
}

export interface TrainingModule {
  id: string;
  userId: string;
  title: string;
  description: string;
  category:
    | "orientation"
    | "technical"
    | "compliance"
    | "soft-skills"
    | "product";
  totalDuration: string;
  dueDate: string;
  isMandatory: boolean;
  certificateEligible: boolean;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  content: TrainingContent[];
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract";
  experience: string;
  salaryRange: string;
  requirements: string[];
  responsibilities: string[];
  status: "active" | "closed";
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  status:
    | "new"
    | "screening"
    | "shortlisted"
    | "interview-scheduled"
    | "interviewed"
    | "offer-extended"
    | "hired"
    | "rejected";
  skills: string[];
  experience: string;
  expectedSalary: string;
  noticePeriod: string;
  rating: number;
  notes: string;
  interviewDate?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface OnboardingProfile {
  userId: string;
  currentStep: number;
  tasks: OnboardingTask[];
  isCompleted: boolean;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_USERS: User[] = [
  {
    id: "1",
    name: "Alex",
    role: "Employee",
    managerId: "2",
    designation: "Software Engineer",
    avatar: "AL",
  },
  {
    id: "2",
    name: "Priya",
    role: "Manager",
    managerId: "3",
    designation: "Engineering Manager",
    avatar: "PR",
  },
  {
    id: "3",
    name: "Meera",
    role: "HR",
    managerId: "4",
    designation: "HR Business Partner",
    avatar: "ME",
  },
  {
    id: "4",
    name: "Admin",
    role: "Admin",
    managerId: null,
    designation: "System Administrator",
    avatar: "AD",
  },
];

/**
 * Seed balances for Alex (userId: '1').
 * Values already account for the two pre-approved historical requests:
 *   req-001: Casual × 2 days (Approved)
 *   req-002: Sick   × 1 day  (Approved)
 * Pending counts reflect pending requests still awaiting approval.
 */
const SEED_LEAVE_BALANCES: LeaveBalance[] = [
  {
    id: "bal-1-cas",
    userId: "1",
    leaveType: "Casual",
    total: 12,
    used: 4,
    pending: 1,
    available: 7,
  },
  {
    id: "bal-1-sik",
    userId: "1",
    leaveType: "Sick",
    total: 10,
    used: 2,
    pending: 0,
    available: 8,
  },
  {
    id: "bal-1-pri",
    userId: "1",
    leaveType: "Privilege",
    total: 15,
    used: 6,
    pending: 2,
    available: 7,
  },
  {
    id: "bal-1-cmp",
    userId: "1",
    leaveType: "Comp-off",
    total: 3,
    used: 0,
    pending: 0,
    available: 3,
  },
  // Seed balances for Priya (userId: '2') so she can also see her own balance widget
  {
    id: "bal-2-cas",
    userId: "2",
    leaveType: "Casual",
    total: 12,
    used: 0,
    pending: 0,
    available: 12,
  },
  {
    id: "bal-2-sik",
    userId: "2",
    leaveType: "Sick",
    total: 10,
    used: 1,
    pending: 0,
    available: 9,
  },
  {
    id: "bal-2-pri",
    userId: "2",
    leaveType: "Privilege",
    total: 15,
    used: 3,
    pending: 0,
    available: 12,
  },
  {
    id: "bal-2-cmp",
    userId: "2",
    leaveType: "Comp-off",
    total: 3,
    used: 0,
    pending: 0,
    available: 3,
  },
  // Meera (userId: '3')
  {
    id: "bal-3-cas",
    userId: "3",
    leaveType: "Casual",
    total: 12,
    used: 2,
    pending: 0,
    available: 10,
  },
  {
    id: "bal-3-sik",
    userId: "3",
    leaveType: "Sick",
    total: 10,
    used: 0,
    pending: 0,
    available: 10,
  },
  {
    id: "bal-3-pri",
    userId: "3",
    leaveType: "Privilege",
    total: 15,
    used: 5,
    pending: 0,
    available: 10,
  },
  {
    id: "bal-3-cmp",
    userId: "3",
    leaveType: "Comp-off",
    total: 3,
    used: 0,
    pending: 0,
    available: 3,
  },
];

/** Pre-seeded leave history for Alex (userId: '1') */
const SEED_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "req-001",
    userId: "1",
    leaveType: "Casual",
    startDate: "2026-06-10",
    endDate: "2026-06-11",
    totalDays: 2,
    reason: "Personal work and family function",
    status: "Approved",
    appliedOn: "2026-06-05",
    approvedBy: "Priya",
  },
  {
    id: "req-002",
    userId: "1",
    leaveType: "Sick",
    startDate: "2026-05-22",
    endDate: "2026-05-22",
    totalDays: 1,
    reason: "Fever and body ache, doctor visit required",
    status: "Approved",
    appliedOn: "2026-05-22",
    approvedBy: "Priya",
  },
  {
    id: "req-003",
    userId: "1",
    leaveType: "Privilege",
    startDate: "2026-07-01",
    endDate: "2026-07-03",
    totalDays: 3,
    reason: "Annual family vacation",
    status: "Pending",
    appliedOn: "2026-06-20",
  },
  {
    id: "req-004",
    userId: "1",
    leaveType: "Casual",
    startDate: "2026-04-15",
    endDate: "2026-04-15",
    totalDays: 1,
    reason: "Municipal election voting day",
    status: "Rejected",
    appliedOn: "2026-04-12",
  },
  {
    id: "req-005",
    userId: "1",
    leaveType: "Privilege",
    startDate: "2026-07-14",
    endDate: "2026-07-15",
    totalDays: 2,
    reason: "Travel and personal errands",
    status: "Pending",
    appliedOn: "2026-06-22",
  },
];

const SEED_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: "att-1-20260622",
    userId: "1",
    date: "2026-06-22",
    clockInTime: "2026-06-22T09:02:00.000Z",
    clockOutTime: "2026-06-22T17:56:00.000Z",
    status: "Present",
    totalHours: 8.9,
  },
  {
    id: "att-1-20260623",
    userId: "1",
    date: "2026-06-23",
    clockInTime: "2026-06-23T09:45:00.000Z",
    clockOutTime: "2026-06-23T17:33:00.000Z",
    status: "Late",
    totalHours: 7.8,
  },
  {
    id: "att-1-20260624",
    userId: "1",
    date: "2026-06-24",
    clockInTime: "2026-06-24T09:00:00.000Z",
    clockOutTime: "2026-06-24T13:12:00.000Z",
    status: "Half-day",
    totalHours: 4.2,
  },
  {
    id: "att-1-20260625",
    userId: "1",
    date: "2026-06-25",
    clockInTime: "",
    status: "On-leave",
    totalHours: 0,
  },
  {
    id: "att-1-20260626",
    userId: "1",
    date: "2026-06-26",
    clockInTime: "2026-06-26T09:03:00.000Z",
    clockOutTime: "2026-06-26T17:27:00.000Z",
    status: "Present",
    totalHours: 8.4,
  },
  {
    id: "att-2-20260622",
    userId: "2",
    date: "2026-06-22",
    clockInTime: "2026-06-22T08:55:00.000Z",
    clockOutTime: "2026-06-22T18:01:00.000Z",
    status: "Present",
    totalHours: 9.1,
  },
  {
    id: "att-2-20260623",
    userId: "2",
    date: "2026-06-23",
    clockInTime: "2026-06-23T09:00:00.000Z",
    clockOutTime: "2026-06-23T17:42:00.000Z",
    status: "Present",
    totalHours: 8.7,
  },
  {
    id: "att-2-20260624",
    userId: "2",
    date: "2026-06-24",
    clockInTime: "2026-06-24T09:32:00.000Z",
    clockOutTime: "2026-06-24T17:02:00.000Z",
    status: "Late",
    totalHours: 7.5,
  },
  {
    id: "att-2-20260625",
    userId: "2",
    date: "2026-06-25",
    clockInTime: "2026-06-25T08:58:00.000Z",
    clockOutTime: "2026-06-25T17:46:00.000Z",
    status: "Present",
    totalHours: 8.8,
  },
  {
    id: "att-2-20260626",
    userId: "2",
    date: "2026-06-26",
    clockInTime: "2026-06-26T09:04:00.000Z",
    clockOutTime: "2026-06-26T17:40:00.000Z",
    status: "Present",
    totalHours: 8.6,
  },
  {
    id: "att-3-20260622",
    userId: "3",
    date: "2026-06-22",
    clockInTime: "2026-06-22T09:08:00.000Z",
    clockOutTime: "2026-06-22T17:38:00.000Z",
    status: "Present",
    totalHours: 8.5,
  },
  {
    id: "att-3-20260623",
    userId: "3",
    date: "2026-06-23",
    clockInTime: "2026-06-23T09:48:00.000Z",
    clockOutTime: "2026-06-23T17:00:00.000Z",
    status: "Late",
    totalHours: 7.2,
  },
  {
    id: "att-3-20260624",
    userId: "3",
    date: "2026-06-24",
    clockInTime: "2026-06-24T09:01:00.000Z",
    clockOutTime: "2026-06-24T17:55:00.000Z",
    status: "Present",
    totalHours: 8.9,
  },
  {
    id: "att-3-20260625",
    userId: "3",
    date: "2026-06-25",
    clockInTime: "",
    status: "On-leave",
    totalHours: 0,
  },
  {
    id: "att-3-20260626",
    userId: "3",
    date: "2026-06-26",
    clockInTime: "2026-06-26T09:12:00.000Z",
    clockOutTime: "2026-06-26T17:18:00.000Z",
    status: "Present",
    totalHours: 8.1,
  },
  {
    id: "att-4-20260622",
    userId: "4",
    date: "2026-06-22",
    clockInTime: "2026-06-22T09:04:00.000Z",
    clockOutTime: "2026-06-22T17:16:00.000Z",
    status: "Present",
    totalHours: 8.2,
  },
  {
    id: "att-4-20260623",
    userId: "4",
    date: "2026-06-23",
    clockInTime: "2026-06-23T09:01:00.000Z",
    clockOutTime: "2026-06-23T17:25:00.000Z",
    status: "Present",
    totalHours: 8.4,
  },
  {
    id: "att-4-20260624",
    userId: "4",
    date: "2026-06-24",
    clockInTime: "2026-06-24T08:58:00.000Z",
    clockOutTime: "2026-06-24T17:34:00.000Z",
    status: "Present",
    totalHours: 8.6,
  },
  {
    id: "att-4-20260625",
    userId: "4",
    date: "2026-06-25",
    clockInTime: "2026-06-25T09:03:00.000Z",
    clockOutTime: "2026-06-25T13:03:00.000Z",
    status: "Half-day",
    totalHours: 4,
  },
  {
    id: "att-4-20260626",
    userId: "4",
    date: "2026-06-26",
    clockInTime: "2026-06-26T09:06:00.000Z",
    clockOutTime: "2026-06-26T17:24:00.000Z",
    status: "Present",
    totalHours: 8.3,
  },
];

const SEED_ACTIVE_SESSIONS: ActiveSession[] = [];

const SEED_ONBOARDING_PROFILES: OnboardingProfile[] = [
  {
    userId: "1",
    currentStep: 0,
    tasks: mockOnboardingEmployee.tasks
      .filter((task) => task.assignee === "employee")
      .map((task) => ({
        id: task.id,
        title: task.title,
        isCompleted: task.status === "completed",
      })),
    isCompleted: false,
  },
];

// ── Store Shape ───────────────────────────────────────────────────────────────

// ── Seed Payroll & Tax Documents ───────────────────────────────────────────
const SEED_PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: "payroll-001",
    userId: "1",
    month: 6,
    year: 2026,
    earnings: {
      basic: 50000,
      hra: 20000,
      specialAllowance: 15000,
    },
    deductions: {
      tax: 5000,
      pf: 3000,
      esi: 500,
    },
    status: "Processing",
  },
];

const SEED_TAX_DOCUMENTS: TaxDocument[] = [
  {
    id: "taxdoc-001",
    userId: "1",
    name: "Form 16 - 2025",
    type: "Form 16",
    year: 2025,
    url: "#",
  },
];

const SEED_USER_DOCUMENTS: UserDocument[] = [
  {
    id: "doc-001",
    userId: "1",
    category: "identity",
    status: "verified",
    fileName: "Aadhaar_Card.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedAt: "2026-01-15",
    verificationDate: "2026-01-18",
  },
  {
    id: "doc-002",
    userId: "1",
    category: "work-auth",
    status: "uploaded",
    fileName: "Work_Authorization_2026.pdf",
    fileType: "PDF",
    fileSize: "1.8 MB",
    uploadedAt: "2026-05-20",
    expiryDate: "2026-12-31",
  },
  {
    id: "doc-003",
    userId: "1",
    category: "education",
    status: "rejected",
    fileName: "Bachelor_Degree_Scan.jpg",
    fileType: "JPEG",
    fileSize: "5.2 MB",
    uploadedAt: "2026-03-10",
    rejectionReason: "Scanned image is too blurry.",
  },
];

const SEED_REIMBURSEMENTS: Reimbursement[] = [
  {
    id: "exp-001",
    userId: "1",
    category: "food",
    amount: 45.0,
    currency: "USD",
    date: "2026-06-15",
    description: "Lunch with client",
    isTaxable: true,
    status: "paid",
  },
  {
    id: "exp-002",
    userId: "1",
    category: "travel",
    amount: 150.0,
    currency: "USD",
    date: "2026-06-20",
    description: "Round trip to office from client site",
    isTaxable: false,
    mileage: { distance: 100, rate: 1.5 },
    status: "pending-approval",
  },
];

const SEED_GOALS: Goal[] = [
  {
    id: "goal-001",
    userId: "1",
    title: "Launch new UI",
    description: "Redesign and launch the new dashboard UI",
    category: "individual",
    type: "quarterly",
    weight: 40,
    dueDate: "2026-09-30",
    status: "in-progress",
    progress: 50,
    keyResults: [
      {
        id: "kr-001",
        title: "Complete design mockups",
        target: 100,
        current: 100,
        completed: true,
      },
      {
        id: "kr-002",
        title: "Implement responsive layout",
        target: 100,
        current: 0,
        completed: false,
      },
    ],
  },
  {
    id: "goal-002",
    userId: "1",
    title: "Reduce load time",
    description: "Optimize initial page load to under 2 seconds",
    category: "individual",
    type: "quarterly",
    weight: 30,
    dueDate: "2026-09-30",
    status: "at-risk",
    progress: 20,
    keyResults: [
      {
        id: "kr-003",
        title: "Reduce image sizes",
        target: 100,
        current: 20,
        completed: false,
      },
    ],
  },
];

const SEED_PERFORMANCE_REVIEWS: PerformanceReview[] = [
  {
    id: "review-001",
    userId: "1",
    reviewerId: "2",
    type: "quarterly",
    overallRating: 4.5,
    strengths: ["Teamwork", "Problem Solving"],
    improvements: ["Documentation"],
    recommendations: "Continue mentoring junior team members",
    date: "2026-04-15",
  },
];

const SEED_TRAINING_MODULES: TrainingModule[] = [
  {
    id: "training-001",
    userId: "1",
    title: "Information Security 101",
    description: "Learn about basic security practices for the workplace",
    category: "compliance",
    totalDuration: "30 mins",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isMandatory: true,
    certificateEligible: true,
    status: "in-progress",
    progress: 50,
    content: [
      {
        id: "content-001",
        title: "Security Fundamentals",
        type: "video",
        duration: "15 mins",
        isCompleted: true,
      },
      {
        id: "content-002",
        title: "Security Quiz",
        type: "quiz",
        duration: "15 mins",
        isCompleted: false,
      },
    ],
  },
  {
    id: "training-002",
    userId: "1",
    title: "Advanced React Patterns",
    description: "Master advanced React patterns and techniques",
    category: "technical",
    totalDuration: "2 hours",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isMandatory: false,
    certificateEligible: true,
    status: "not-started",
    progress: 0,
    content: [
      {
        id: "content-003",
        title: "Compound Components",
        type: "video",
        duration: "45 mins",
        isCompleted: false,
      },
      {
        id: "content-004",
        title: "Render Props & Hooks",
        type: "interactive",
        duration: "1h 15 mins",
        isCompleted: false,
      },
    ],
  },
  {
    id: "training-003",
    userId: "2",
    title: "Leadership Fundamentals",
    description: "Essential skills for new team leaders",
    category: "soft-skills",
    totalDuration: "1 hour",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isMandatory: true,
    certificateEligible: true,
    status: "in-progress",
    progress: 75,
    content: [
      {
        id: "content-005",
        title: "Team Communication",
        type: "video",
        duration: "30 mins",
        isCompleted: true,
      },
      {
        id: "content-006",
        title: "1:1 Meeting Guide",
        type: "document",
        duration: "30 mins",
        isCompleted: false,
      },
    ],
  },
  {
    id: "training-004",
    userId: "3",
    title: "HR Compliance Training",
    description: "Latest updates to labor laws and company policies",
    category: "compliance",
    totalDuration: "45 mins",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isMandatory: true,
    certificateEligible: true,
    status: "completed",
    progress: 100,
    content: [
      {
        id: "content-007",
        title: "2026 Policy Changes",
        type: "document",
        duration: "30 mins",
        isCompleted: true,
      },
      {
        id: "content-008",
        title: "Compliance Quiz",
        type: "quiz",
        duration: "15 mins",
        isCompleted: true,
      },
    ],
  },
];

const SEED_JOB_POSTINGS: JobPosting[] = [
  {
    id: "job-001",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote (US)",
    employmentType: "Full-time",
    experience: "5+ years",
    salaryRange: "$120k - $160k",
    requirements: [
      "Proficiency in React and TypeScript",
      "Experience with Tailwind CSS",
      "Knowledge of modern frontend testing frameworks",
    ],
    responsibilities: [
      "Lead frontend development efforts",
      "Mentor junior developers",
      "Architect scalable frontend solutions",
    ],
    status: "active",
  },
  {
    id: "job-002",
    title: "Product Designer",
    department: "Design",
    location: "San Francisco, CA",
    employmentType: "Full-time",
    experience: "3+ years",
    salaryRange: "$90k - $120k",
    requirements: [
      "Strong portfolio of design work",
      "Proficiency in Figma",
      "Experience with user research",
    ],
    responsibilities: [
      "Design user interfaces for our products",
      "Collaborate with product and engineering teams",
      "Conduct usability testing",
    ],
    status: "active",
  },
];

const SEED_CANDIDATES: Candidate[] = [
  {
    id: "cand-001",
    jobId: "job-001",
    name: "Sam Wilson",
    email: "sam.wilson@email.com",
    status: "shortlisted",
    skills: ["React", "TypeScript", "Tailwind"],
    experience: "6 years",
    expectedSalary: "$140k",
    noticePeriod: "2 weeks",
    rating: 4,
    notes: "Great technical interview, strong communication",
  },
  {
    id: "cand-002",
    jobId: "job-001",
    name: "Diana Prince",
    email: "diana.prince@email.com",
    status: "interview-scheduled",
    skills: ["React", "Next.js", "GraphQL"],
    experience: "7 years",
    expectedSalary: "$155k",
    noticePeriod: "1 month",
    rating: 5,
    notes: "Excellent portfolio, strong leadership potential",
    interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: "cand-003",
    jobId: "job-002",
    name: "Bruce Wayne",
    email: "bruce.wayne@email.com",
    status: "new",
    skills: ["Figma", "UI/UX", "User Research"],
    experience: "4 years",
    expectedSalary: "$100k",
    noticePeriod: "3 weeks",
    rating: 4,
    notes: "Great visual design skills",
  },
];

// ── Store Shape ───────────────────────────────────────────────────────────────

interface GlobalState {
  // ── Data ──────────────────────────────────────────────────────────────────
  users: User[];
  activeUserId: string;
  attendanceRecords: AttendanceRecord[];
  activeSessions: ActiveSession[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  payrollRecords: PayrollRecord[];
  taxDocuments: TaxDocument[];
  documents: UserDocument[];
  reimbursements: Reimbursement[];
  onboardingProfiles: OnboardingProfile[];
  goals: Goal[];
  performanceReviews: PerformanceReview[];
  trainingModules: TrainingModule[];
  jobPostings: JobPosting[];
  candidates: Candidate[];

  // ── Derived ───────────────────────────────────────────────────────────────
  getActiveUser: () => User;

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveUser: (userId: string) => void;
  clockIn: (userId: string) => void;
  clockOut: (userId: string) => void;
  updateOnboardingStep: (userId: string, stepIndex: number) => void;
  toggleOnboardingTask: (userId: string, taskId: string) => void;

  /**
   * Submit a new leave request for the currently active user.
   * Also increments the `pending` count on the matching balance entry.
   */
  addLeaveRequest: (
    partial: Omit<
      LeaveRequest,
      "id" | "userId" | "appliedOn" | "status" | "approvedBy"
    >,
  ) => void;

  /**
   * Approve or Reject a leave request.
   * @param requestId  ID of the LeaveRequest to update
   * @param status     'Approved' | 'Rejected'
   * @param approverName  Name of the person taking action (recorded on the request)
   *
   * Balance math when Approved:
   *   available -= totalDays
   *   used      += totalDays
   *   pending   -= totalDays
   *
   * Balance math when Rejected:
   *   pending   -= totalDays   (leaves restored)
   */
  updateLeaveStatus: (
    requestId: string,
    status: LeaveStatus,
    approverName?: string,
  ) => void;

  /**
   * Submit a new expense/reimbursement for the currently active user.
   */
  submitExpense: (
    partial: Omit<Reimbursement, "id" | "userId" | "status">,
  ) => void;

  /**
   * Update the status of an expense (approve/reject) with optional comment.
   */
  updateExpenseStatus: (
    expenseId: string,
    newStatus: ReimbursementStatus,
    comment?: string,
  ) => void;

  /**
   * Update a goal's progress and status.
   */
  updateGoalProgress: (
    goalId: string,
    newProgress: number,
    newStatus: GoalStatus,
  ) => void;

  markTrainingContentCompleted: (moduleId: string, contentId: string) => void;

  updateCandidateStatus: (
    candidateId: string,
    newStatus: Candidate["status"],
  ) => void;
  scheduleInterview: (candidateId: string, date: string) => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useGlobalStore = create<GlobalState>()((set, get) => ({
  // ── Initial State ──────────────────────────────────────────────────────────
  users: SEED_USERS,
  activeUserId: "1",
  attendanceRecords: SEED_ATTENDANCE_RECORDS,
  activeSessions: SEED_ACTIVE_SESSIONS,
  leaveRequests: SEED_LEAVE_REQUESTS,
  leaveBalances: SEED_LEAVE_BALANCES,
  payrollRecords: SEED_PAYROLL_RECORDS,
  taxDocuments: SEED_TAX_DOCUMENTS,
  documents: SEED_USER_DOCUMENTS,
  reimbursements: SEED_REIMBURSEMENTS,
  onboardingProfiles: SEED_ONBOARDING_PROFILES,
  goals: SEED_GOALS,
  performanceReviews: SEED_PERFORMANCE_REVIEWS,
  trainingModules: SEED_TRAINING_MODULES,
  jobPostings: SEED_JOB_POSTINGS,
  candidates: SEED_CANDIDATES,

  // ── Derived ───────────────────────────────────────────────────────────────
  getActiveUser: () => {
    const { users, activeUserId } = get();
    return users.find((u) => u.id === activeUserId) ?? users[0];
  },

  // ── Actions ───────────────────────────────────────────────────────────────

  setActiveUser: (userId) => set({ activeUserId: userId }),

  clockIn: (userId) => {
    const now = new Date().toISOString();

    set((state) => {
      const existingSession = state.activeSessions.find(
        (session) => session.userId === userId && session.isClockedIn,
      );

      if (existingSession) {
        return state;
      }

      return {
        activeSessions: [
          ...state.activeSessions.filter(
            (session) => session.userId !== userId,
          ),
          {
            userId,
            startTime: now,
            isClockedIn: true,
          },
        ],
      };
    });
  },

  clockOut: (userId) => {
    set((state) => {
      const activeSession = state.activeSessions.find(
        (session) => session.userId === userId && session.isClockedIn,
      );

      if (!activeSession) {
        return state;
      }

      const endTime = new Date();
      const startTime = new Date(activeSession.startTime);
      const totalHours = Number(
        ((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)).toFixed(
          2,
        ),
      );
      const recordDate = activeSession.startTime.split("T")[0];

      const newRecord: AttendanceRecord = {
        id: `att-${userId}-${Date.now()}`,
        userId,
        date: recordDate,
        clockInTime: activeSession.startTime,
        clockOutTime: endTime.toISOString(),
        status: totalHours >= 6 ? "Present" : "Half-day",
        totalHours,
      };

      const hasTodayRecord = state.attendanceRecords.some(
        (record) => record.userId === userId && record.date === recordDate,
      );

      return {
        attendanceRecords: hasTodayRecord
          ? state.attendanceRecords.map((record) =>
              record.userId === userId && record.date === recordDate
                ? newRecord
                : record,
            )
          : [newRecord, ...state.attendanceRecords],
        activeSessions: state.activeSessions.filter(
          (session) => session.userId !== userId,
        ),
      };
    });
  },

  updateOnboardingStep: (userId, stepIndex) => {
    set((state) => ({
      onboardingProfiles: state.onboardingProfiles.map((profile) =>
        profile.userId === userId
          ? {
              ...profile,
              currentStep: stepIndex,
            }
          : profile,
      ),
    }));
  },

  toggleOnboardingTask: (userId, taskId) => {
    set((state) => {
      const updatedProfiles = state.onboardingProfiles.map((profile) => {
        if (profile.userId !== userId) return profile;

        const updatedTasks = profile.tasks.map((task) =>
          task.id === taskId
            ? { ...task, isCompleted: !task.isCompleted }
            : task,
        );

        return {
          ...profile,
          tasks: updatedTasks,
          isCompleted:
            updatedTasks.length > 0 &&
            updatedTasks.every((task) => task.isCompleted),
        };
      });

      return { onboardingProfiles: updatedProfiles };
    });
  },

  addLeaveRequest: (partial) => {
    const { activeUserId } = get();
    const newRequest: LeaveRequest = {
      ...partial,
      id: `req-${Date.now()}`,
      userId: activeUserId,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };

    set((state) => ({
      leaveRequests: [newRequest, ...state.leaveRequests],
      // Increment pending count on the matching balance
      leaveBalances: state.leaveBalances.map((b) =>
        b.userId === activeUserId && b.leaveType === partial.leaveType
          ? { ...b, pending: b.pending + partial.totalDays }
          : b,
      ),
    }));
  },

  updateLeaveStatus: (requestId, status, approverName) => {
    set((state) => {
      // Find the target request to get its details for balance math
      const req = state.leaveRequests.find((r) => r.id === requestId);
      if (!req) return state;

      // Check if status is actually changing
      if (req.status === status) return state;

      const updatedRequests = state.leaveRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              ...(status === "Approved" && approverName
                ? { approvedBy: approverName }
                : {}),
            }
          : r,
      );

      // ── Balance math ────────────────────────────────────────────────────
      const updatedBalances = state.leaveBalances.map((b) => {
        if (b.userId !== req.userId || b.leaveType !== req.leaveType) return b;

        const totalDaysNum = Number(req.totalDays);

        // Handle status transition logic
        if (req.status === "Pending" && status === "Approved") {
          // Approve: move days from pending to used, subtract from available
          return {
            ...b,
            available: Math.max(0, b.available - totalDaysNum),
            used: b.used + totalDaysNum,
            pending: Math.max(0, b.pending - totalDaysNum),
          };
        }

        if (req.status === "Pending" && status === "Rejected") {
          // Reject: move days from pending back to available
          return {
            ...b,
            available: b.available + totalDaysNum,
            pending: Math.max(0, b.pending - totalDaysNum),
          };
        }

        return b;
      });

      return { leaveRequests: updatedRequests, leaveBalances: updatedBalances };
    });
  },

  uploadDocument: (
    partial: Omit<UserDocument, "id" | "userId" | "uploadedAt" | "status">,
  ) => {
    const { activeUserId } = get();
    const newDocument: UserDocument = {
      ...partial,
      id: `doc-${Date.now()}`,
      userId: activeUserId,
      status: "uploaded",
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    set((state) => ({
      documents: [newDocument, ...state.documents],
    }));
  },

  updateDocumentStatus: (
    docId: string,
    newStatus: DocumentStatus,
    additionalData?: { rejectionReason?: string },
  ) => {
    set((state) => {
      const updatedDocuments = state.documents.map((doc) => {
        if (doc.id !== docId) return doc;

        const updatedDoc: UserDocument = {
          ...doc,
          status: newStatus,
        };

        if (newStatus === "verified") {
          updatedDoc.verificationDate = new Date().toISOString().split("T")[0];
        }

        if (newStatus === "rejected" && additionalData?.rejectionReason) {
          updatedDoc.rejectionReason = additionalData.rejectionReason;
        }

        return updatedDoc;
      });

      return { documents: updatedDocuments };
    });
  },

  submitExpense: (partial) => {
    const { activeUserId } = get();
    const newExpense: Reimbursement = {
      ...partial,
      id: `exp-${Date.now()}`,
      userId: activeUserId,
      status: "pending-approval",
    };

    set((state) => ({
      reimbursements: [newExpense, ...state.reimbursements],
    }));
  },

  updateExpenseStatus: (expenseId, newStatus, comment) => {
    set((state) => {
      const updatedReimbursements = state.reimbursements.map((exp) => {
        if (exp.id !== expenseId) return exp;

        const updatedExp: Reimbursement = {
          ...exp,
          status: newStatus,
        };

        if (comment) {
          updatedExp.managerComment = comment;
        }

        return updatedExp;
      });

      return { reimbursements: updatedReimbursements };
    });
  },

  updateGoalProgress: (goalId, newProgress, newStatus) => {
    set((state) => {
      const updatedGoals = state.goals.map((goal) => {
        if (goal.id !== goalId) return goal;

        return {
          ...goal,
          progress: newProgress,
          status: newStatus,
        };
      });

      return { goals: updatedGoals };
    });
  },

  markTrainingContentCompleted: (moduleId, contentId) => {
    set((state) => {
      const updatedTrainingModules = state.trainingModules.map((module) => {
        if (module.id !== moduleId) return module;

        // Mark the specific content item as completed
        const updatedContent = module.content.map((content) =>
          content.id === contentId
            ? { ...content, isCompleted: true }
            : content,
        );

        // Calculate new progress percentage
        const completedCount = updatedContent.filter(
          (c) => c.isCompleted,
        ).length;
        const totalCount = updatedContent.length;
        const newProgress = Math.round((completedCount / totalCount) * 100);

        // Determine new status
        let newStatus: "not-started" | "in-progress" | "completed";
        if (newProgress === 100) {
          newStatus = "completed";
        } else if (newProgress > 0) {
          newStatus = "in-progress";
        } else {
          newStatus = "not-started";
        }

        return {
          ...module,
          content: updatedContent,
          progress: newProgress,
          status: newStatus,
        };
      });

      return { trainingModules: updatedTrainingModules };
    });
  },

  updateCandidateStatus: (candidateId, newStatus) => {
    set((state) => {
      const updatedCandidates = state.candidates.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, status: newStatus }
          : candidate,
      );
      return { candidates: updatedCandidates };
    });
  },

  scheduleInterview: (candidateId, date) => {
    set((state) => {
      const updatedCandidates = state.candidates.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, status: "interview-scheduled", interviewDate: date }
          : candidate,
      );
      return { candidates: updatedCandidates };
    });
  },
}));
