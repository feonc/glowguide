"use client";

import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import type { Product, ProductOrigin } from "@/types";

const ORIGIN_COLORS: Record<ProductOrigin, string> = {
  US: "bg-blue-100 text-blue-800",
  Korean: "bg-rose-100 text-rose-800",
  Chinese: "bg-amber-100 text-amber-800",
  Japanese: "bg-red-100 text-red-800",
  European: "bg-emerald-100 text-emerald-800",
};

export interface ProductCardProps {
  product: Product;
  /** Compact mode for use inside RoutineCard */
  compact?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  compact = false,
  className = "",
}: ProductCardProps) {
  const originStyle = ORIGIN_COLORS[product.origin] ?? "bg-gray-100 text-gray-800";

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
        <span className="font-medium text-[#3d3630]">{product.name}</span>
        <span className="text-[#6b5d52]">· {product.brand}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${originStyle}`}
        >
          {product.origin}
        </span>
        <span className="text-[#6b5d52]">
          {product.currency} {product.price}
        </span>
        {product.purchaseUrl && (
          <a
            href={product.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#A8907A] hover:underline"
          >
            Buy <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border border-[#ebddd4] bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex gap-3">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[#e5e7eb] text-[#4b5563]">
            <span className="text-xs font-semibold uppercase">
              {product.brand.slice(0, 8)}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-[#3d3630]">{product.name}</h3>
          <p className="text-sm text-[#6b5d52]">{product.brand}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${originStyle}`}
          >
            {product.origin}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="font-medium text-[#3d3630]">
          {product.currency} {product.price}
        </span>
        <span className="flex items-center gap-0.5 text-[#6b5d52]">
          <Star className="h-4 w-4 fill-[#A8907A] text-[#A8907A]" />
          {product.rating.toFixed(1)}
        </span>
      </div>
      {product.keyIngredients.length > 0 && (
        <p className="mt-2 text-xs text-[#6b5d52]">
          Key ingredient:{" "}
          <span className="font-semibold">
            {product.keyIngredients[0]}
          </span>
          {product.keyIngredients.length > 1
            ? `, ${product.keyIngredients.slice(1, 4).join(", ")}`
            : ""}
        </p>
      )}
      <p className="mt-2 line-clamp-2 text-sm text-[#6b5d52]">
        {product.description}
      </p>
      {product.purchaseUrl && (
        <a
          href={product.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#A8907A] hover:underline"
        >
          Buy <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </motion.div>
  );
}
