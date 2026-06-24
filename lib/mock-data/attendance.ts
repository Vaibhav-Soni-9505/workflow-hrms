// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — Attendance Mock Data Layer
// ──────────────────────────────────────────────────────────────────────────────

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Late'
  | 'Half-day'
  | 'On-leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // ISO date string YYYY-MM-DD
  checkInTime: string | null; // "09:02 AM"
  checkOutTime: string | null; // "06:14 PM"
  status: AttendanceStatus;
  totalHours: number; // decimal hours e.g. 8.5
  productiveHours: number;
  breakHours: number;
  overtimeHours: number;
  locationVerified: boolean;
  ipValidated: boolean;
}

export interface TeamMemberAttendance {
  employeeId: string;
  name: string;
  designation: string;
  avatarInitials: string;
  avatarColor: string; // Tailwind bg class
  checkInTime: string | null;
  checkOutTime: string | null;
  status: AttendanceStatus;
  locationVerified: boolean;
  ipValidated: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns a YYYY-MM-DD string offset from today */
function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/** Returns the Monday of the current ISO week as offset-0 */
function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  // Monday first
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

const WEEK_DATES = getWeekDates();
const TODAY = new Date().toISOString().split('T')[0];

// ── Employee weekly mock records (EMP-001 — Arjun Mehta) ─────────────────────

export const mockMyAttendance: AttendanceRecord[] = [
  {
    id: 'att-001',
    employeeId: 'EMP-001',
    date: WEEK_DATES[0], // Monday
    checkInTime: '09:02 AM',
    checkOutTime: '06:14 PM',
    status: 'Present',
    totalHours: 9.2,
    productiveHours: 7.8,
    breakHours: 1.0,
    overtimeHours: 1.2,
    locationVerified: true,
    ipValidated: true,
  },
  {
    id: 'att-002',
    employeeId: 'EMP-001',
    date: WEEK_DATES[1], // Tuesday
    checkInTime: '09:45 AM',
    checkOutTime: '06:00 PM',
    status: 'Late',
    totalHours: 8.25,
    productiveHours: 6.5,
    breakHours: 1.25,
    overtimeHours: 0.0,
    locationVerified: true,
    ipValidated: false,
  },
  {
    id: 'att-003',
    employeeId: 'EMP-001',
    date: WEEK_DATES[2], // Wednesday
    checkInTime: '09:00 AM',
    checkOutTime: '01:30 PM',
    status: 'Half-day',
    totalHours: 4.5,
    productiveHours: 3.8,
    breakHours: 0.5,
    overtimeHours: 0.0,
    locationVerified: true,
    ipValidated: true,
  },
  {
    id: 'att-004',
    employeeId: 'EMP-001',
    date: WEEK_DATES[3], // Thursday
    checkInTime: null,
    checkOutTime: null,
    status: 'On-leave',
    totalHours: 0,
    productiveHours: 0,
    breakHours: 0,
    overtimeHours: 0,
    locationVerified: false,
    ipValidated: false,
  },
  {
    id: 'att-005',
    employeeId: 'EMP-001',
    date: WEEK_DATES[4], // Friday (today for demo)
    checkInTime: null,
    checkOutTime: null,
    status: 'Present',
    totalHours: 0,
    productiveHours: 0,
    breakHours: 0,
    overtimeHours: 0,
    locationVerified: false,
    ipValidated: false,
  },
  {
    id: 'att-006',
    employeeId: 'EMP-001',
    date: WEEK_DATES[5], // Saturday
    checkInTime: null,
    checkOutTime: null,
    status: 'Absent',
    totalHours: 0,
    productiveHours: 0,
    breakHours: 0,
    overtimeHours: 0,
    locationVerified: false,
    ipValidated: false,
  },
  {
    id: 'att-007',
    employeeId: 'EMP-001',
    date: WEEK_DATES[6], // Sunday
    checkInTime: null,
    checkOutTime: null,
    status: 'Absent',
    totalHours: 0,
    productiveHours: 0,
    breakHours: 0,
    overtimeHours: 0,
    locationVerified: false,
    ipValidated: false,
  },
];

/** Returns the record for today, or null */
export function getTodayRecord(): AttendanceRecord | null {
  return mockMyAttendance.find((r) => r.date === TODAY) ?? null;
}

// ── Team attendance mock records (Manager / HR view) ─────────────────────────

export const mockTeamAttendance: TeamMemberAttendance[] = [
  {
    employeeId: 'EMP-002',
    name: 'Priya Sharma',
    designation: 'Senior Frontend Dev',
    avatarInitials: 'PS',
    avatarColor: 'bg-violet-500',
    checkInTime: '08:55 AM',
    checkOutTime: null,
    status: 'Present',
    locationVerified: true,
    ipValidated: true,
  },
  {
    employeeId: 'EMP-003',
    name: 'Rahul Gupta',
    designation: 'Backend Engineer',
    avatarInitials: 'RG',
    avatarColor: 'bg-blue-500',
    checkInTime: '09:47 AM',
    checkOutTime: null,
    status: 'Late',
    locationVerified: true,
    ipValidated: false,
  },
  {
    employeeId: 'EMP-004',
    name: 'Sneha Iyer',
    designation: 'Product Designer',
    avatarInitials: 'SI',
    avatarColor: 'bg-pink-500',
    checkInTime: null,
    checkOutTime: null,
    status: 'Absent',
    locationVerified: false,
    ipValidated: false,
  },
  {
    employeeId: 'EMP-005',
    name: 'Vikram Nair',
    designation: 'QA Engineer',
    avatarInitials: 'VN',
    avatarColor: 'bg-amber-500',
    checkInTime: '09:01 AM',
    checkOutTime: null,
    status: 'Present',
    locationVerified: true,
    ipValidated: true,
  },
  {
    employeeId: 'EMP-006',
    name: 'Anjali Patel',
    designation: 'DevOps Engineer',
    avatarInitials: 'AP',
    avatarColor: 'bg-emerald-500',
    checkInTime: null,
    checkOutTime: null,
    status: 'On-leave',
    locationVerified: false,
    ipValidated: false,
  },
  {
    employeeId: 'EMP-007',
    name: 'Dev Kapoor',
    designation: 'Data Analyst',
    avatarInitials: 'DK',
    avatarColor: 'bg-cyan-500',
    checkInTime: '09:05 AM',
    checkOutTime: '01:30 PM',
    status: 'Half-day',
    locationVerified: true,
    ipValidated: true,
  },
  {
    employeeId: 'EMP-008',
    name: 'Meera Reddy',
    designation: 'Scrum Master',
    avatarInitials: 'MR',
    avatarColor: 'bg-rose-500',
    checkInTime: '10:15 AM',
    checkOutTime: null,
    status: 'Late',
    locationVerified: false,
    ipValidated: true,
  },
];

// ── Scheduled shift config (for the calendar) ─────────────────────────────────

export interface ShiftDay {
  date: string; // YYYY-MM-DD
  dayName: string;
  dayShort: string;
  shiftStart: string | null; // "09:00 AM"
  shiftEnd: string | null; // "05:00 PM"
  isWeekend: boolean;
  isToday: boolean;
  status: AttendanceStatus | 'Scheduled' | 'Weekend';
}

export function getWeekShift(): ShiftDay[] {
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DAY_SHORTS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return WEEK_DATES.map((date, index) => {
    const d = new Date(date);
    const dayIndex = d.getDay();
    const isWeekend = dayIndex === 0 || dayIndex === 6;
    const isToday = date === TODAY;
    const record = mockMyAttendance.find((r) => r.date === date);

    let status: ShiftDay['status'];
    if (isWeekend) status = 'Weekend';
    else if (record) status = record.status;
    else status = 'Scheduled';

    return {
      date,
      dayName: DAY_NAMES[dayIndex],
      dayShort: DAY_SHORTS[dayIndex],
      shiftStart: isWeekend ? null : '09:00 AM',
      shiftEnd: isWeekend ? null : '05:00 PM',
      isWeekend,
      isToday,
      status,
    };
  });
}
