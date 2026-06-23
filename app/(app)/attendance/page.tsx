import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Attendance — WorkFlow' };
export default function AttendancePage() {
  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-xl font-black text-foreground mb-2">Attendance</h1>
      <p className="text-sm text-foreground-muted">Module coming in Step 2.</p>
    </div>
  );
}
