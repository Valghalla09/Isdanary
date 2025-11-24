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
  updateDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Expense, NewExpense } from '../types/expense';
import { useAuth } from '../context/AuthContext';

function mapExpense(id: string, data: any): Expense {
  const createdAt =
    data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Number(data.createdAt ?? 0);

  return {
    id,
    ownerId: data.ownerId ? String(data.ownerId) : undefined,
    label: String(data.label ?? ''),
    amount: Number(data.amount ?? 0),
    category: (data.category ?? 'other') as Expense['category'],
    createdAt,
  };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'expenses'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next: Expense[] = snapshot.docs.map((docSnap) =>
          mapExpense(docSnap.id, docSnap.data()),
        );
        setExpenses(next);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading expenses', err);
        setError('Unable to load expenses right now.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const addExpense = async (payload: NewExpense) => {
    setError(null);
    if (!user) {
      throw new Error('You must be logged in to add expenses.');
    }
    const now = Date.now();
    await addDoc(collection(db, 'expenses'), {
      ...payload,
      ownerId: user.uid,
      createdAt: now,
    });
  };

  const updateExpense = async (id: string, payload: Partial<NewExpense>) => {
    setError(null);
    await updateDoc(doc(db, 'expenses', id), payload);
  };

  const deleteExpense = async (id: string) => {
    setError(null);
    await deleteDoc(doc(db, 'expenses', id));
  };

  const totalThisMonth = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    totalThisMonth,
  };
}
