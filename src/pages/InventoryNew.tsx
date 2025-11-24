import { FormEvent, useMemo, useState } from 'react';
import Button from '../components/UI/Button';
import { useProducts } from '../hooks/useProducts';
import type { Product, NewProduct } from '../types/product';

interface ProductFormState {
  name: string;
  category: string;
  currentStock: string;
  price: string;
  supplier: string;
  reorderLevel: string;
}

function createEmptyForm(): ProductFormState {
  return {
    name: '',
    category: '',
    currentStock: '',
    price: '',
    supplier: '',
    reorderLevel: '',
  };
}

function InventoryPage() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();

  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState<'newest' | 'oldest'>('newest');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(createEmptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalProducts = products.length;

  const lowStockCount = useMemo(() => {
    if (!products.length) return 0;
    return products.filter((product) => {
      const reorder = Number(product.reorderLevel ?? 0);
      if (!reorder || Number.isNaN(reorder)) return false;
      return product.currentStock <= reorder;
    }).length;
  }, [products]);

  const inventoryValue = useMemo(() => {
    if (!products.length) return 0;
    return products.reduce((sum, product) => sum + product.currentStock * product.price, 0);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = products;
    if (term) {
      result = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.supplier.toLowerCase().includes(term)
        );
      });
    }

    const sorted = [...result].sort((a, b) => {
      const aTime = a.createdAt ?? 0;
      const bTime = b.createdAt ?? 0;
      return sortDirection === 'newest' ? bTime - aTime : aTime - bTime;
    });

    return sorted;
  }, [products, search, sortDirection]);

  const openAddModal = () => {
    setEditing(null);
    setForm(createEmptyForm());
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      currentStock: String(product.currentStock ?? ''),
      price: String(product.price ?? ''),
      supplier: product.supplier,
      reorderLevel: String(product.reorderLevel ?? ''),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const name = form.name.trim();
    if (!name) {
      setFormError('Please enter a product name.');
      return;
    }

    const parsed: NewProduct = {
      name,
      category: form.category.trim(),
      currentStock: Number(form.currentStock || 0),
      price: Number(form.price || 0),
      supplier: form.supplier.trim(),
      reorderLevel: Number(form.reorderLevel || 0),
    };

    if (Number.isNaN(parsed.currentStock) || parsed.currentStock < 0) {
      setFormError('Current stock should be zero or a positive number.');
      return;
    }

    if (Number.isNaN(parsed.price) || parsed.price < 0) {
      setFormError('Price should be zero or a positive number.');
      return;
    }

    if (Number.isNaN(parsed.reorderLevel) || parsed.reorderLevel < 0) {
      setFormError('Reorder level should be zero or a positive number.');
      return;
    }

    try {
      setSubmitting(true);
      if (editing) {
        await updateProduct(editing.id, parsed);
      } else {
        await createProduct(parsed);
      }
      setModalOpen(false);
      setEditing(null);
      setForm(createEmptyForm());
    } catch (err) {
      console.error('Error saving product', err);
      setFormError('Unable to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h2 className="text-xl font-semibold text-textDark sm:text-2xl">Inventory</h2>
        <p className="text-sm text-textMuted">
          Manage your fish and seafood products, stock levels, and pricing.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-muted bg-card px-4 py-4 text-sm text-textDark shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-textMuted">Total products</p>
          <p className="mt-2 text-2xl font-semibold">{totalProducts}</p>
          <p className="mt-1 text-xs text-textMuted">Number of products in your inventory.</p>
        </div>
        <div className="rounded-xl border border-muted bg-card px-4 py-4 text-sm text-textDark shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-textMuted">Low stock items</p>
          <p className="mt-2 text-2xl font-semibold">{lowStockCount}</p>
          <p className="mt-1 text-xs text-textMuted">
            Based on products where current stock is at or below the reorder level.
          </p>
        </div>
        <div className="rounded-xl border border-muted bg-card px-4 py-4 text-sm text-textDark shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-textMuted">Inventory value</p>
          <p className="mt-2 text-2xl font-semibold">
            ₱{inventoryValue > 0 ? inventoryValue.toFixed(2) : '0.00'}
          </p>
          <p className="mt-1 text-xs text-textMuted">Calculated from price × current stock.</p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, category, or supplier"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-1 text-xs"
              onClick={() =>
                setSortDirection((prev) => (prev === 'newest' ? 'oldest' : 'newest'))
              }
            >
              {sortDirection === 'newest' ? 'Newest first' : 'Oldest first'}
            </Button>
            <Button type="button" onClick={openAddModal}>
              Add product
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-accent/10 bg-card text-sm">
          {loading ? (
            <div className="px-4 py-4 text-xs text-textMuted">Loading inventory...</div>
          ) : error ? (
            <div className="px-4 py-4 text-xs text-rose-700">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-4 py-4 text-xs text-textMuted">
              No inventory data yet. Add a product to get started.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-accent/10 text-xs">
              <thead className="bg-muted text-left text-[11px] font-semibold uppercase tracking-wide text-textMuted">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2 text-right">Stock</th>
                  <th className="px-3 py-2 text-right">Reorder level</th>
                  <th className="px-3 py-2 text-right">Price (₱)</th>
                  <th className="px-3 py-2">Supplier</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10 bg-card">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-3 py-2 text-sm text-textDark">{product.name}</td>
                    <td className="px-3 py-2 text-xs text-textMuted">{product.category}</td>
                    <td className="px-3 py-2 text-right text-sm text-textDark">{product.currentStock}</td>
                    <td className="px-3 py-2 text-right text-xs text-textMuted">
                      {product.reorderLevel || 0}
                    </td>
                    <td className="px-3 py-2 text-right text-sm text-textDark">
                      ₱{product.price ? product.price.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-3 py-2 text-xs text-textMuted">{product.supplier}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 py-1 text-[11px]"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 py-1 text-[11px] text-rose-600 hover:text-rose-700"
                          onClick={() => handleDelete(product)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-textDark/40 px-4 py-8">
          <div className="w-full max-w-lg rounded-xl border border-muted bg-card p-5 text-sm text-textDark shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-textDark">
                  {editing ? 'Edit product' : 'Add product'}
                </h3>
                <p className="text-xs text-textMuted">
                  Set the reorder level to the stock level where you want to restock.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1 text-textMuted hover:bg-muted hover:text-textDark"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="mt-3 rounded-md border border-rose-400 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-textDark">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Fresh Tilapia, Bangus, Shrimp"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-textDark">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="Saltwater">Saltwater</option>
                  <option value="Freshwater">Freshwater</option>
                  <option value="Shellfish">Shellfish</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-textDark">Current stock</label>
                <input
                  type="number"
                  min={0}
                  value={form.currentStock}
                  onChange={(e) => handleChange('currentStock', e.target.value)}
                  className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-textDark">Price (₱)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-textDark">Reorder level</label>
                <input
                  type="number"
                  min={0}
                  value={form.reorderLevel}
                  onChange={(e) => handleChange('reorderLevel', e.target.value)}
                  className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="When to restock (e.g. 10)"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-textDark">Supplier</label>
                <input
                  type="text"
                  value={form.supplier}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                  className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Optional supplier name"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-3 py-1 text-xs"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-3 py-1 text-xs" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Save changes' : 'Add product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
