import { type NextRequest, NextResponse } from "next/server";
import type { ProductsQueryParams, ProductsResponse } from "@/types";

/**
 * GET /api/products
 * Query curated product database by concerns, skin types, categories.
 * Logic to be implemented.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ProductsResponse>> {
  const { searchParams } = new URL(request.url);
  const _params: ProductsQueryParams = {
    concerns: searchParams.get("concerns")?.split(",").filter(Boolean) as ProductsQueryParams["concerns"],
    skinTypes: searchParams.get("skinTypes")?.split(",").filter(Boolean) as ProductsQueryParams["skinTypes"],
    categories: searchParams.get("categories")?.split(",").filter(Boolean) as ProductsQueryParams["categories"],
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  };
  void _params; // stub
  return NextResponse.json({ products: [] });
}
