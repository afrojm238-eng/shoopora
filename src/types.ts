export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  soldCount: number;
  image: string;
  images?: string[];
  isChoice?: boolean;
  isSuperValue?: boolean;
  description?: string;
  categoryId?: string;
  isFlashDeal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  id: string;
  items: (Product & { quantity: number })[];
  total: number;
  status: 'Processing' | 'Approved' | 'Delivered' | 'Cancelled';
  date: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerCountry: string;
  customerZip: string;
  userId?: string;
}
