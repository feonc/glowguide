"use client";

import { motion } from "framer-motion";
import type { RoutineStep } from "@/types";
import { ProductCard } from "./ProductCard";

export interface RoutineCardProps {
  step: RoutineStep;
  className?: string;
}

export function RoutineCard({ step, className = "" }: RoutineCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border border-[#ebddd4] bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[#A8907A]">
        <span>Step {step.order}</span>
        <span className="text-[#6b5d52]">·</span>
        <span className="capitalize text-[#6b5d52]">{step.product.category}</span>
      </div>
      <p className="mt-2 text-[15px] text-[#3d3630]">{step.usage}</p>
      <p className="mt-1 text-sm text-[#6b5d52]">
        {step.frequency} — {step.tip}
      </p>
      <div className="mt-3 border-t border-[#ebddd4] pt-3">
        <ProductCard product={step.product} compact />
      </div>
    </motion.article>
  );
}
