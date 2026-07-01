import type { Product } from "@/types/catalog";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/catalog/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không tải được danh sách sản phẩm");
  }

  return res.json();
}

export async function getProduct(slug: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/catalog/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không tải được chi tiết sản phẩm");
  }

  return res.json();
}