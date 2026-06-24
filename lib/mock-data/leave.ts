// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — Leave Management Mock Data Layer
// ──────────────────────────────────────────────────────────────────────────────

export type LeaveType = 'Casual' | 'Sick' | 'Privilege' | 'Comp-off';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface LeaveBalance {
  id: string;
  leaveType: LeaveType;
  total: number;
  used: number;
  pending: number;
  available: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  avatar: string;       // initials
  leaveType: LeaveType;
  startDate: string;    // ISO YYYY-MM-DD
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;    // ISO date
}

// ── Employee Balance (EMP-001) ────────────────────────────────────────────────

export const mockLeaveBalances: LeaveBalance[] = [
  { id: 'bal-001', leaveType: 'Casual',   total: 12, used: 4, pending: 1, available: 7 },
  { id: 'bal-002', leaveType: 'Sick',     total: 10, used: 2, pending: 0, available: 8 },
  { id: 'bal-003', leaveType: 'Privilege', total: 15, used: 6, pending: 2, available: 7 },
  { id: 'bal-004', leaveType: 'Comp-off', total:  3, used: 0, pending: 0, available: 3 },
];

// ── My Leave History (EMP-001 past requests) ──────────────────────────────────

export const mockMyLeaveRequests: LeaveRequest[] = [
  {
    id: 'req-001', employeeId: 'EMP-001', employeeName: 'You', designation: 'Software Engineer',
    avatar: 'YO', leaveType: 'Casual', startDate: '2026-06-10', endDate: '2026-06-11',
    totalDays: 2, reason: 'Personal work and family function', status: 'Approved', appliedOn: '2026-06-05',
  },
  {
    id: 'req-002', employeeId: 'EMP-001', employeeName: 'You', designation: 'Software Engineer',
    avatar: 'YO', leaveType: 'Sick', startDate: '2026-05-22', endDate: '2026-05-22',
    totalDays: 1, reason: 'Fever and body ache, doctor visit required', status: 'Approved', appliedOn: '2026-05-22',
  },
  {
    id: 'req-003', employeeId: 'EMP-001', employeeName: 'You', designation: 'Software Engineer',
    avatar: 'YO', leaveType: 'Privilege', startDate: '2026-07-01', endDate: '2026-07-03',
    totalDays: 3, reason: 'Annual family vacation', status: 'Pending', appliedOn: '2026-06-20',
  },
  {
    id: 'req-004', employeeId: 'EMP-001', employeeName: 'You', designation: 'Software Engineer',
    avatar: 'YO', leaveType: 'Casual', startDate: '2026-04-15', endDate: '2026-04-15',
    totalDays: 1, reason: 'Municipal election voting day', status: 'Rejected', appliedOn: '2026-04-12',
  },
  {
    id: 'req-005', employeeId: 'EMP-001', employeeName: 'You', designation: 'Software Engineer',
    avatar: 'YO', leaveType: 'Privilege', startDate: '2026-07-14', endDate: '2026-07-15',
    totalDays: 2, reason: 'Travel and personal errands', status: 'Pending', appliedOn: '2026-06-22',
  },
];

// ── Team Pending Requests (Manager / HR approval queue) ───────────────────────

export const mockTeamLeaveRequests: LeaveRequest[] = [
  {
    id: 'treq-001', employeeId: 'EMP-002', employeeName: 'Arjun Mehta', designation: 'Backend Engineer',
    avatar: 'AM', leaveType: 'Casual', startDate: '2026-06-26', endDate: '2026-06-27',
    totalDays: 2, reason: 'Home renovation work in progress', status: 'Pending', appliedOn: '2026-06-23',
  },
  {
    id: 'treq-002', employeeId: 'EMP-003', employeeName: 'Priya Sharma', designation: 'UI/UX Designer',
    avatar: 'PS', leaveType: 'Sick', startDate: '2026-06-24', endDate: '2026-06-24',
    totalDays: 1, reason: 'Migraine and doctor consultation', status: 'Pending', appliedOn: '2026-06-24',
  },
  {
    id: 'treq-003', employeeId: 'EMP-005', employeeName: 'Nidhi Verma', designation: 'QA Engineer',
    avatar: 'NV', leaveType: 'Privilege', startDate: '2026-07-07', endDate: '2026-07-11',
    totalDays: 5, reason: 'International travel — family trip', status: 'Pending', appliedOn: '2026-06-18',
  },
  {
    id: 'treq-004', employeeId: 'EMP-007', employeeName: 'Karan Singh', designation: 'DevOps Engineer',
    avatar: 'KS', leaveType: 'Comp-off', startDate: '2026-06-28', endDate: '2026-06-28',
    totalDays: 1, reason: 'Weekend production deployment compensation', status: 'Pending', appliedOn: '2026-06-21',
  },
  {
    id: 'treq-005', employeeId: 'EMP-009', employeeName: 'Riya Patel', designation: 'Product Manager',
    avatar: 'RP', leaveType: 'Casual', startDate: '2026-07-02', endDate: '2026-07-02',
    totalDays: 1, reason: 'Personal appointment that cannot be rescheduled', status: 'Pending', appliedOn: '2026-06-22',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Return the balance object for a given leave type */
export function getBalance(type: LeaveType): LeaveBalance | undefined {
  return mockLeaveBalances.find((b) => b.leaveType === type);
}

/** Calculate working days between two ISO date strings (Mon–Fri only) */
export function calcWorkingDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}
