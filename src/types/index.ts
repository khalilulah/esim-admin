export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description?: string;
  ingredients?: string[];
  howToUse?: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
  };
  items: {
    product: string; // just the id — not a nested object
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  totalPrice: number;
  shippingFee: number;
  grandTotal: number;
  paymentStatus: "pending" | "paid" | "failed";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin";
}
