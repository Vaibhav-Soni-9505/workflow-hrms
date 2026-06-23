import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Payroll — WorkFlow' };
export default function PayrollPage() {
  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-xl font-black text-foreground mb-2">Payroll</h1>
      <p className="text-sm text-foreground-muted">Module coming soon.</p>
    </div>
  );
}
