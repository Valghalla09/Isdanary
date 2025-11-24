import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type { NewProduct, Product } from '../types/product';
import { useAuth } from '../context/AuthContext';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  createProduct: (input: NewProduct) => Promise<void>;
  updateProduct: (id: string, input: Partial<NewProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Product[] = snapshot.docs.map((docSnap) => {
          const raw = docSnap.data();
          return {
            id: docSnap.id,
            ownerId: String(raw.ownerId ?? ''),
            name: String(raw.name ?? ''),
            category: String(raw.category ?? ''),
            currentStock: Number(raw.currentStock ?? 0),
            price: Number(raw.price ?? 0),
            supplier: String(raw.supplier ?? ''),
            reorderLevel: Number(raw.reorderLevel ?? 0),
            createdAt: Number(raw.createdAt ?? 0),
          };
        });

        setProducts(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error loading products', err);
        setError('Failed to load inventory. Please try again.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const createProduct = async (input: NewProduct) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create products.');
      }
      const now = Date.now();
      await addDoc(collection(db, 'products'), {
        ...input,
        ownerId: user.uid,
        createdAt: now,
      });
    } catch (err) {
      console.error('Error creating product', err);
      throw new Error('Unable to create product. Please try again.');
    }
  };

  const updateProduct = async (id: string, input: Partial<NewProduct>) => {
    try {
      const ref = doc(db, 'products', id);
      await updateDoc(ref, input);
    } catch (err) {
      console.error('Error updating product', err);
      throw new Error('Unable to update product. Please try again.');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const ref = doc(db, 'products', id);
      await deleteDoc(ref);
    } catch (err) {
      console.error('Error deleting product', err);
      throw new Error('Unable to delete product. Please try again.');
    }
  };

  return { products, loading, error, createProduct, updateProduct, deleteProduct };
}
