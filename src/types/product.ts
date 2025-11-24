export interface Product {
  id: string;
  ownerId?: string;
  name: string;
  category: string;
  currentStock: number;
  price: number;
  supplier: string;
  reorderLevel: number;
  createdAt: number;
}

export type NewProduct = Omit<Product, 'id' | 'ownerId' | 'createdAt'>;
