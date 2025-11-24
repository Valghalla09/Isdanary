export type ExpenseCategory =
  | 'fuel'
  | 'ice'
  | 'maintenance'
  | 'wages'
  | 'rent'
  | 'other';

export interface Expense {
  id: string;
  ownerId?: string;
  label: string;
  amount: number;
  category: ExpenseCategory;
  createdAt: number; // timestamp (ms)
}

export interface NewExpense {
  label: string;
  amount: number;
  category: ExpenseCategory;
}
