import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Expenses — WorkFlow' };
export default function ExpensesPage() {
  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-xl font-black text-foreground mb-2">Expenses</h1>
      <p className="text-sm text-foreground-muted">Module coming soon.</p>
    </div>
  );
}
