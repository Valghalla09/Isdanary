import { useEffect, useState } from 'react';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { NewSale, Sale } from '../types/sale';

function mapSale(id: string, data: any): Sale {
  const createdAt =
    data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Number(data.createdAt ?? 0);

  return {
    id,
    productId: String(data.productId ?? ''),
    productName: String(data.productName ?? ''),
    quantity: Number(data.quantity ?? 0),
    totalPrice: Number(data.totalPrice ?? 0),
    discountPercent:
      data.discountPercent !== undefined && data.discountPercent !== null
        ? Number(data.discountPercent)
        : undefined,
    createdAt,
  };
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'sales'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next: Sale[] = snapshot.docs.map((docSnap) => mapSale(docSnap.id, docSnap.data()));
        setSales(next);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading sales', err);
        setError('Unable to load sales right now.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const addSale = async (payload: NewSale) => {
    setError(null);
    const now = Date.now();
    await addDoc(collection(db, 'sales'), {
      ...payload,
      createdAt: now,
    });
  };

  const deleteSale = async (id: string) => {
    setError(null);
    await deleteDoc(doc(db, 'sales', id));
  };

  return {
    sales,
    loading,
    error,
    addSale,
    deleteSale,
  };
}
