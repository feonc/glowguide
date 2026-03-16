import type { Product, ProductsQueryParams, ProductDatabase } from "@/types";
import productData from "@/data/products.json";

const db = productData as ProductDatabase;

/**
 * Typed product query helpers (reads from data/products.json).
 */
export function loadProductDatabase(): ProductDatabase {
  return db;
}

export function queryProducts(_params: ProductsQueryParams): Product[] {
  // Full filter logic to be implemented; for now return all.
  return db.products;
}
