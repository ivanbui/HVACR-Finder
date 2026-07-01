export type Seller = {
  id: number;
  logo_url?: string | null;
  shop_name: string;
  slug: string;
  phone?: string | null;
  zalo?: string | null;
  city?: string | null;
  is_verified: boolean;
};

export type ProductOffer = {
  id: number;
  price?: number | null;
  created_at: string;
  image_url?: string | null;
  stock_qty?: number | null;
  unit: string;
  condition: string;
  city?: string | null;
  warranty?: string | null;
  note?: string | null;
  seller: Seller;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  model_code?: string | null;
  refrigerant?: string | null;
  horsepower?: string | null;
  voltage?: string | null;
  short_description?: string | null;
  brand?: {
    id: number;
    name: string;
    slug: string;
    country?: string | null;
  } | null;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  offers: ProductOffer[];
};