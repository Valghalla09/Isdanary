import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Product } from '../../types/product';

interface InventoryChartProps {
  products: Product[];
}

function InventoryChart({ products }: InventoryChartProps) {
  if (!products.length) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-muted bg-muted/60 text-sm text-textMuted">
        No inventory data yet. Add products to see stock levels.
      </div>
    );
  }

  const data = products.map((product) => ({
    name: product.name,
    stock: product.currentStock,
  }));

  return (
    <div className="h-72 w-full rounded-lg border border-muted bg-card p-4">
      <h3 className="mb-3 text-sm font-medium text-textDark">Stock levels</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: -20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ECF1F1" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#486A77', fontSize: 10 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis tick={{ fill: '#486A77', fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#ECF1F1',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#2A2A2A' }}
          />
          <Bar dataKey="stock" fill="#0F9BB5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InventoryChart;
