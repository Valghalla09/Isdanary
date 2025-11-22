export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  discountPercent?: number;
  createdAt: number; // timestamp (ms)
}

export interface NewSale {
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  discountPercent?: number;
}
