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
  where,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { NewSale, Sale } from '../types/sale';
import { useAuth } from '../context/AuthContext';

function mapSale(id: string, data: any): Sale {
  const createdAt =
    data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Number(data.createdAt ?? 0);

  return {
    id,
    ownerId: data.ownerId ? String(data.ownerId) : undefined,
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
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSales([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'sales'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );

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
  }, [user]);

  const addSale = async (payload: NewSale) => {
    setError(null);
    if (!user) {
      throw new Error('You must be logged in to record sales.');
    }
    const now = Date.now();
    const { discountPercent, ...rest } = payload;

    const data: Record<string, unknown> = {
      ...rest,
      ownerId: user.uid,
      createdAt: now,
    };

    if (discountPercent !== undefined) {
      data.discountPercent = discountPercent;
    }

    await addDoc(collection(db, 'sales'), data);
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
