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
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/40 text-sm text-slate-400">
        No inventory data yet. Add products to see stock levels.
      </div>
    );
  }

  const data = products.map((product) => ({
    name: product.name,
    stock: product.currentStock,
  }));

  return (
    <div className="h-72 w-full rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-100">Stock Levels</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: -20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#cbd5f5', fontSize: 10 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis tick={{ fill: '#cbd5f5', fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#020617',
              borderColor: '#1e293b',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Bar dataKey="stock" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InventoryChart;
