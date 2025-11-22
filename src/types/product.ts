export interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  price: number;
  supplier: string;
  reorderLevel: number;
}

export type NewProduct = Omit<Product, 'id'>;
