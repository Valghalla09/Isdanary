import { FormEvent, useState } from 'react';
import Button from '../components/UI/Button';
import { useExpenses } from '../hooks/useExpenses';
import type { ExpenseCategory } from '../types/expense';

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  fuel: 'Fuel',
  ice: 'Ice',
  maintenance: 'Maintenance',
  wages: 'Wages',
  rent: 'Rent',
  other: 'Other',
};

function ExpensesPage() {
  const { expenses, loading, error, addExpense, deleteExpense, totalThisMonth } = useExpenses();

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!label.trim()) {
      setFormError('Please enter a description.');
      return;
    }

    const numericAmount = typeof amount === 'number' ? amount : Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setFormError('Please enter a valid amount.');
      return;
    }

    try {
      setSubmitting(true);
      await addExpense({ label: label.trim(), amount: numericAmount, category });
      setLabel('');
      setAmount('');
      setCategory('other');
    } catch (err) {
      console.error('Error adding expense', err);
      setFormError('Unable to add expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
    } catch (err) {
      console.error('Error deleting expense', err);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h2 className="text-xl font-semibold text-textDark sm:text-2xl">Expenses</h2>
        <p className="text-sm text-textMuted">
          Log fuel, ice, maintenance and other costs so you can understand your real profit.
        </p>
      </section>

      <section className="rounded-xl border border-accent/15 bg-card px-4 py-4 text-sm shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-medium text-accent">Add a new expense</h3>
            <p className="mt-1 text-xs text-textMuted">
              Keep amounts realistic. You can adjust or delete entries later.
            </p>
          </div>
          <div className="rounded-lg bg-muted px-3 py-2 text-right text-xs text-textDark">
            <p className="text-[11px] uppercase tracking-wide">Total recorded</p>
            <p className="text-sm font-semibold">
              ₱{totalThisMonth.toFixed(2)}
            </p>
          </div>
        </div>

        {(formError || error) && (
          <div className="mt-3 rounded-md border border-rose-400 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {formError || error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-textDark">Description</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Diesel for boat, Ice blocks, Boat repair"
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={submitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-textDark">Amount (₱)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') setAmount('');
                else setAmount(Number(value));
              }}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={submitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-textDark">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={submitting}
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add expense'}
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-textDark">Recorded expenses</h3>
        </div>
        <div className="overflow-hidden rounded-xl border border-accent/10 bg-card">
          {loading ? (
            <div className="px-4 py-4 text-xs text-textMuted">Loading expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="px-4 py-4 text-xs text-textMuted">
              No expenses recorded yet. Add your first expense using the form above.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-accent/10 text-xs">
              <thead className="bg-muted text-left text-[11px] font-semibold uppercase tracking-wide text-textMuted">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10 bg-card">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-3 py-2 text-textMuted">
                      {new Date(expense.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-textDark">{expense.label}</td>
                    <td className="px-3 py-2 text-textDark">
                      {CATEGORY_LABELS[expense.category] ?? expense.category}
                    </td>
                    <td className="px-3 py-2 text-right text-textDark">
                      ₱{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-2 py-1 text-[11px]"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default ExpensesPage;
