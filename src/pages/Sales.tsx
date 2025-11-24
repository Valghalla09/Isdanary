import { FormEvent, useMemo, useState } from 'react';
import Button from '../components/UI/Button';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';

function SalesPage() {
  const { products, loading: loadingProducts } = useProducts();
  const { sales, loading: loadingSales, error, addSale, deleteSale } = useSales();

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discountPercent, setDiscountPercent] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId) ?? null,
    [products, productId],
  );

  const computedTotal = useMemo(() => {
    if (!selectedProduct) return 0;
    const base = selectedProduct.price * (quantity || 0);
    const discount = typeof discountPercent === 'number' ? discountPercent : 0;
    const factor = discount > 0 ? 1 - discount / 100 : 1;
    return Math.max(0, base * factor);
  }, [selectedProduct, quantity, discountPercent]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!selectedProduct) {
      setFormError('Please choose a product.');
      return;
    }

    if (!quantity || quantity <= 0) {
      setFormError('Quantity should be at least 1.');
      return;
    }

    if (quantity > selectedProduct.currentStock) {
      setFormError('Not enough stock available for this sale.');
      return;
    }

    try {
      setSubmitting(true);
      await addSale({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        totalPrice: computedTotal,
        discountPercent: typeof discountPercent === 'number' ? discountPercent : undefined,
      });
      setQuantity(1);
      setDiscountPercent('');
    } catch (err) {
      console.error('Error recording sale', err);
      setFormError('Unable to record sale. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSale(id);
    } catch (err) {
      console.error('Error deleting sale', err);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h2 className="text-xl font-semibold text-textDark sm:text-2xl">Sales</h2>
        <p className="text-sm text-textMuted">
          Record sales for your products. Stock will only change after you update it from the
          inventory page.
        </p>
      </section>

      <section className="rounded-xl border border-accent/15 bg-card px-4 py-4 text-sm shadow-sm">
        <h3 className="text-sm font-medium text-textDark">Record a new sale</h3>
        <p className="mt-1 text-xs text-textMuted">
          Choose a product and quantity. You can optionally apply a discount.
        </p>

        {(formError || error) && (
          <div className="mt-3 rounded-md border border-rose-400 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {formError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-textDark">Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={loadingProducts || products.length === 0 || submitting}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (stock: {product.currentStock})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-textDark">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 0)}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-textDark">Discount (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={discountPercent}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setDiscountPercent('');
                } else {
                  setDiscountPercent(Number(value));
                }
              }}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-textDark">Estimated total</label>
            <div className="flex items-center justify-between rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark">
              <span className="text-xs text-textMuted">₱</span>
              <span className="font-semibold">
                {computedTotal > 0 ? computedTotal.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end">
            <Button type="submit" disabled={submitting || !selectedProduct || !quantity}>
              {submitting ? 'Saving...' : 'Record sale'}
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-textDark">Recent sales</h3>
        </div>
        <div className="overflow-hidden rounded-xl border border-accent/10 bg-card">
          {loadingSales ? (
            <div className="px-4 py-4 text-xs text-textMuted">Loading sales...</div>
          ) : sales.length === 0 ? (
            <div className="px-4 py-4 text-xs text-textMuted">
              No sales recorded yet. Add your first sale using the form above.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-accent/10 text-xs">
              <thead className="bg-muted text-left text-[11px] font-semibold uppercase tracking-wide text-textMuted">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-right">Discount</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10 bg-card">
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-3 py-2 text-textMuted">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-textDark">{sale.productName}</td>
                    <td className="px-3 py-2 text-right text-textDark">{sale.quantity}</td>
                    <td className="px-3 py-2 text-right text-textMuted">
                      {sale.discountPercent !== undefined && sale.discountPercent !== null
                        ? `${sale.discountPercent}%`
                        : '—'}
                    </td>
                    <td className="px-3 py-2 text-right text-textDark">
                      ₱{sale.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-2 py-1 text-[11px]"
                        onClick={() => handleDelete(sale.id)}
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

export default SalesPage;
