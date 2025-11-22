import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';
import { useExpenses } from '../hooks/useExpenses';

interface StatCardProps {
  title: string;
  description: string;
  value?: string | null;
  loading?: boolean;
}

function StatCard({ title, description, value, loading }: StatCardProps) {
  let pillText: string;

  if (loading) {
    pillText = 'Loading...';
  } else if (value) {
    pillText = value;
  } else {
    pillText = 'No data yet';
  }

  return (
    <div className="rounded-xl border border-muted bg-card px-4 py-4 text-textDark shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-textMuted">{title}</p>
      <div className="mt-3 text-sm text-textMuted">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-textDark">
          {pillText}
        </span>
        <p className="mt-2 leading-snug">{description}</p>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  to: string;
}

function QuickActionCard({ title, description, to }: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between rounded-xl border border-accent/15 bg-white/90 px-4 py-4 text-left shadow-sm transition hover:border-primary hover:bg-muted"
    >
      <p className="text-sm font-medium text-textDark group-hover:text-primary">{title}</p>
      <p className="mt-1 text-xs text-textMuted">{description}</p>
    </Link>
  );
}

function DashboardOverviewPage() {
  const { user } = useAuth();
  const { products, loading: loadingProducts } = useProducts();
  const { sales, loading: loadingSales } = useSales();
  const { expenses, loading: loadingExpenses } = useExpenses();
  const emailName = user?.email ? user.email.split('@')[0] : null;
  const displayName = emailName || 'there';

  const todaySalesTotal = useMemo(() => {
    if (!sales.length) return 0;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    return sales.reduce((sum, sale) => {
      const saleDate = new Date(sale.createdAt);
      if (
        saleDate.getFullYear() === year &&
        saleDate.getMonth() === month &&
        saleDate.getDate() === day
      ) {
        return sum + sale.totalPrice;
      }
      return sum;
    }, 0);
  }, [sales]);

  const lowStockCount = useMemo(() => {
    if (!products.length) return 0;
    return products.filter((product) => {
      const reorder = Number(product.reorderLevel ?? 0);
      if (!reorder || Number.isNaN(reorder)) return false;
      return product.currentStock <= reorder;
    }).length;
  }, [products]);

  const monthlyExpensesTotal = useMemo(() => {
    if (!expenses.length) return 0;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return expenses.reduce((sum, expense) => {
      const expDate = new Date(expense.createdAt);
      if (expDate.getFullYear() === year && expDate.getMonth() === month) {
        return sum + expense.amount;
      }
      return sum;
    }, 0);
  }, [expenses]);

  const todaySalesLabel = todaySalesTotal > 0 ? `₱${todaySalesTotal.toFixed(2)}` : null;
  const lowStockLabel =
    lowStockCount > 0 ? `${lowStockCount} item${lowStockCount === 1 ? '' : 's'}` : null;
  const monthlyExpensesLabel =
    monthlyExpensesTotal > 0 ? `₱${monthlyExpensesTotal.toFixed(2)}` : null;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-muted bg-card shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">
              IsdaNary dashboard
            </p>
            <h1 className="text-2xl font-semibold text-textDark sm:text-3xl">
              Welcome back, {displayName}!
            </h1>
            <p className="text-sm text-textMuted">
              Keep an eye on your fish shop&apos;s inventory, sales, and expenses in one place.
            </p>
          </div>
          <div className="flex-1">
            <div className="overflow-hidden rounded-xl bg-muted shadow-md">
              <img
                src="/isdanary-hero.jpg"
                alt="IsdaNary illustration"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Today&apos;s sales"
          description="Once you record sales, we&apos;ll show today&apos;s total and a quick trend here."
          value={todaySalesLabel}
          loading={loadingSales}
        />
        <StatCard
          title="Low stock alerts"
          description="We&apos;ll highlight products that are running low so you know when to restock."
          value={lowStockLabel}
          loading={loadingProducts}
        />
        <StatCard
          title="Monthly expenses"
          description="Track fuel, ice, maintenance, and other shop expenses to see where money goes."
          value={monthlyExpensesLabel}
          loading={loadingExpenses}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-textDark">Quick actions</h2>
          <p className="text-xs text-textMuted">
            Start by adding products, recording a sale, or logging an expense.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickActionCard
            title="Manage inventory"
            description="Add new fish, update stock levels, and see what&apos;s available."
            to="/inventory"
          />
          <QuickActionCard
            title="Record a sale"
            description="Capture today&apos;s sales so your dashboard can stay up to date."
            to="/sales"
          />
          <QuickActionCard
            title="Log an expense"
            description="Track fuel, ice, and other costs to understand your profit."
            to="/expenses"
          />
        </div>
      </section>

      <section className="rounded-xl border border-accent/15 bg-card px-4 py-4 text-sm text-textDark">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-textDark">Tips for getting started</p>
            <p className="text-xs text-textMuted">
              Add a few products to your inventory, then record a sample sale and expense to see
              how the dashboard updates.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/inventory">
              <Button type="button" className="px-3 py-1 text-xs">
                Add products
              </Button>
            </Link>
            <Link to="/sales">
              <Button type="button" variant="outline" className="px-3 py-1 text-xs">
                Record a sale
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardOverviewPage;
