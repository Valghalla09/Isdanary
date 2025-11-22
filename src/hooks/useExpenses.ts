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
import { Expense, NewExpense } from '../types/expense';

function mapExpense(id: string, data: any): Expense {
  const createdAt =
    data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Number(data.createdAt ?? 0);

  return {
    id,
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

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));

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
  }, []);

  const addExpense = async (payload: NewExpense) => {
    setError(null);
    const now = Date.now();
    await addDoc(collection(db, 'expenses'), {
      ...payload,
      createdAt: now,
    });
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
    deleteExpense,
    totalThisMonth,
  };
}
