// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — Zustand Global Store (Relational Mock Database)
// ──────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';

// ── Shared Types ──────────────────────────────────────────────────────────────

export type Role        = 'Employee' | 'Manager' | 'HR' | 'Admin';
export type LeaveType   = 'Casual' | 'Sick' | 'Privilege' | 'Comp-off';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  id:          string;
  name:        string;
  role:        Role;
  managerId:   string | null;
  designation: string;
  avatar:      string; // two-letter initials
}

/** Per-user, per-type leave balance (relational). */
export interface LeaveBalance {
  id:        string;
  userId:    string;    // FK → User.id
  leaveType: LeaveType;
  total:     number;
  used:      number;
  pending:   number;
  available: number;
}

export interface LeaveRequest {
  id:          string;
  userId:      string;       // FK → User.id
  leaveType:   LeaveType;
  startDate:   string;       // ISO YYYY-MM-DD
  endDate:     string;
  totalDays:   number;
  reason:      string;
  status:      LeaveStatus;
  appliedOn:   string;       // ISO date
  approvedBy?: string;       // name of approver (set when status → Approved)
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_USERS: User[] = [
  { id: '1', name: 'Alex',  role: 'Employee', managerId: '2', designation: 'Software Engineer',   avatar: 'AL' },
  { id: '2', name: 'Priya', role: 'Manager',  managerId: '3', designation: 'Engineering Manager', avatar: 'PR' },
  { id: '3', name: 'Meera', role: 'HR',        managerId: '4', designation: 'HR Business Partner', avatar: 'ME' },
  { id: '4', name: 'Admin', role: 'Admin',     managerId: null, designation: 'System Administrator', avatar: 'AD' },
];

/**
 * Seed balances for Alex (userId: '1').
 * Values already account for the two pre-approved historical requests:
 *   req-001: Casual × 2 days (Approved)
 *   req-002: Sick   × 1 day  (Approved)
 * Pending counts reflect pending requests still awaiting approval.
 */
const SEED_LEAVE_BALANCES: LeaveBalance[] = [
  { id: 'bal-1-cas', userId: '1', leaveType: 'Casual',    total: 12, used: 4, pending: 1, available: 7 },
  { id: 'bal-1-sik', userId: '1', leaveType: 'Sick',      total: 10, used: 2, pending: 0, available: 8 },
  { id: 'bal-1-pri', userId: '1', leaveType: 'Privilege', total: 15, used: 6, pending: 2, available: 7 },
  { id: 'bal-1-cmp', userId: '1', leaveType: 'Comp-off',  total:  3, used: 0, pending: 0, available: 3 },
  // Seed balances for Priya (userId: '2') so she can also see her own balance widget
  { id: 'bal-2-cas', userId: '2', leaveType: 'Casual',    total: 12, used: 0, pending: 0, available: 12 },
  { id: 'bal-2-sik', userId: '2', leaveType: 'Sick',      total: 10, used: 1, pending: 0, available:  9 },
  { id: 'bal-2-pri', userId: '2', leaveType: 'Privilege', total: 15, used: 3, pending: 0, available: 12 },
  { id: 'bal-2-cmp', userId: '2', leaveType: 'Comp-off',  total:  3, used: 0, pending: 0, available:  3 },
  // Meera (userId: '3')
  { id: 'bal-3-cas', userId: '3', leaveType: 'Casual',    total: 12, used: 2, pending: 0, available: 10 },
  { id: 'bal-3-sik', userId: '3', leaveType: 'Sick',      total: 10, used: 0, pending: 0, available: 10 },
  { id: 'bal-3-pri', userId: '3', leaveType: 'Privilege', total: 15, used: 5, pending: 0, available: 10 },
  { id: 'bal-3-cmp', userId: '3', leaveType: 'Comp-off',  total:  3, used: 0, pending: 0, available:  3 },
];

/** Pre-seeded leave history for Alex (userId: '1') */
const SEED_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'req-001', userId: '1', leaveType: 'Casual',
    startDate: '2026-06-10', endDate: '2026-06-11', totalDays: 2,
    reason: 'Personal work and family function', status: 'Approved',
    appliedOn: '2026-06-05', approvedBy: 'Priya',
  },
  {
    id: 'req-002', userId: '1', leaveType: 'Sick',
    startDate: '2026-05-22', endDate: '2026-05-22', totalDays: 1,
    reason: 'Fever and body ache, doctor visit required', status: 'Approved',
    appliedOn: '2026-05-22', approvedBy: 'Priya',
  },
  {
    id: 'req-003', userId: '1', leaveType: 'Privilege',
    startDate: '2026-07-01', endDate: '2026-07-03', totalDays: 3,
    reason: 'Annual family vacation', status: 'Pending', appliedOn: '2026-06-20',
  },
  {
    id: 'req-004', userId: '1', leaveType: 'Casual',
    startDate: '2026-04-15', endDate: '2026-04-15', totalDays: 1,
    reason: 'Municipal election voting day', status: 'Rejected', appliedOn: '2026-04-12',
  },
  {
    id: 'req-005', userId: '1', leaveType: 'Privilege',
    startDate: '2026-07-14', endDate: '2026-07-15', totalDays: 2,
    reason: 'Travel and personal errands', status: 'Pending', appliedOn: '2026-06-22',
  },
];

// ── Store Shape ───────────────────────────────────────────────────────────────

interface GlobalState {
  // ── Data ──────────────────────────────────────────────────────────────────
  users:          User[];
  activeUserId:   string;
  leaveRequests:  LeaveRequest[];
  leaveBalances:  LeaveBalance[];

  // ── Derived ───────────────────────────────────────────────────────────────
  getActiveUser: () => User;

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveUser:     (userId: string) => void;

  /**
   * Submit a new leave request for the currently active user.
   * Also increments the `pending` count on the matching balance entry.
   */
  addLeaveRequest: (partial: Omit<LeaveRequest, 'id' | 'userId' | 'appliedOn' | 'status' | 'approvedBy'>) => void;

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
  updateLeaveStatus: (requestId: string, status: LeaveStatus, approverName?: string) => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useGlobalStore = create<GlobalState>()((set, get) => ({
  // ── Initial State ──────────────────────────────────────────────────────────
  users:         SEED_USERS,
  activeUserId:  '1',
  leaveRequests: SEED_LEAVE_REQUESTS,
  leaveBalances: SEED_LEAVE_BALANCES,

  // ── Derived ───────────────────────────────────────────────────────────────
  getActiveUser: () => {
    const { users, activeUserId } = get();
    return users.find((u) => u.id === activeUserId) ?? users[0];
  },

  // ── Actions ───────────────────────────────────────────────────────────────

  setActiveUser: (userId) => set({ activeUserId: userId }),

  addLeaveRequest: (partial) => {
    const { activeUserId } = get();
    const newRequest: LeaveRequest = {
      ...partial,
      id:        `req-${Date.now()}`,
      userId:    activeUserId,
      status:    'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      leaveRequests: [newRequest, ...state.leaveRequests],
      // Increment pending count on the matching balance
      leaveBalances: state.leaveBalances.map((b) =>
        b.userId === activeUserId && b.leaveType === partial.leaveType
          ? { ...b, pending: b.pending + partial.totalDays }
          : b
      ),
    }));
  },

  updateLeaveStatus: (requestId, status, approverName) => {
    set((state) => {
      // Find the target request to get its details for balance math
      const req = state.leaveRequests.find((r) => r.id === requestId);
      if (!req) return state;

      const updatedRequests = state.leaveRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              ...(status === 'Approved' && approverName ? { approvedBy: approverName } : {}),
            }
          : r
      );

      // ── Balance math ────────────────────────────────────────────────────
      const updatedBalances = state.leaveBalances.map((b) => {
        if (b.userId !== req.userId || b.leaveType !== req.leaveType) return b;

        if (status === 'Approved') {
          return {
            ...b,
            available: Math.max(0, b.available - req.totalDays),
            used:      b.used + req.totalDays,
            pending:   Math.max(0, b.pending - req.totalDays),
          };
        }

        if (status === 'Rejected') {
          // Restore the days that were held in pending
          return {
            ...b,
            pending: Math.max(0, b.pending - req.totalDays),
          };
        }

        return b;
      });

      return { leaveRequests: updatedRequests, leaveBalances: updatedBalances };
    });
  },
}));
