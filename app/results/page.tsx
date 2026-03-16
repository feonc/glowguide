"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Sun, Moon, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ANALYSIS_STORAGE_KEY } from "@/lib/constants";
import type { AIAnalysisResult, RoutineStep } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AIAnalysisResult | null | undefined>(
    undefined
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ANALYSIS_STORAGE_KEY);
      if (!raw) {
        setResult(null);
        return;
      }
      setResult(JSON.parse(raw) as AIAnalysisResult);
    } catch {
      setResult(null);
    }
  }, []);

  // Redirect gently if there is no stored result
  useEffect(() => {
    if (result === null) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [result, router]);

  // Focus on unique products used in the routine (limit to keep page compact)
  const keyProducts = useMemo(() => {
    if (!result) return [];
    const { routine } = result;
    const allSteps: RoutineStep[] = [
      ...routine.morning,
      ...routine.evening,
    ].sort((a, b) => a.order - b.order);
    const seen = new Set<string>();
    const unique: RoutineStep[] = [];
    for (const step of allSteps) {
      if (!seen.has(step.product.id)) {
        seen.add(step.product.id);
        unique.push(step);
      }
      if (unique.length >= 4) break; // cap for brevity
    }
    return unique.map((s) => s.product);
  }, [result]);

  const combinedSteps = useMemo(() => {
    if (!result) return [];
    const { routine } = result;
    const am = routine.morning.map((s) => ({ ...s, period: "AM" as const }));
    const pm = routine.evening.map((s) => ({ ...s, period: "PM" as const }));
    return [...am, ...pm].sort((a, b) => a.order - b.order).slice(0, 6);
  }, [result]);

  const handleStartOver = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ANALYSIS_STORAGE_KEY);
    }
    router.push("/quiz");
  };

  if (result === undefined) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] px-6 py-16">
        <div className="mx-auto max-w-xl text-center text-[#4b5563]">
          Loading…
        </div>
      </div>
    );
  }

  if (result === null) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[#4b5563]">
            No results found, redirecting you to start again…
          </p>
        </div>
      </div>
    );
  }

  const { skinAssessment, routine, warnings, generalAdvice } = result;

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-[#111827] hover:underline"
          >
            ← Home
          </Link>
          <button
            type="button"
            onClick={handleStartOver}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111827] hover:underline"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </button>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="sm:max-w-[70%]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6f76]">
                Your GlowGuide assessment
              </p>
              <h1 className="mt-2 text-xl font-semibold text-[#111827]">
                Personalized skin summary
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5563] whitespace-pre-wrap">
                {skinAssessment}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 self-stretch rounded-2xl bg-[#f3f4f6] px-4 py-3 text-xs text-[#4b5563] shadow-sm sm:mt-0 sm:w-52 sm:flex-col sm:items-start">
              <Sparkles className="h-4 w-4 text-[#2563eb]" />
              <div>
                <p className="font-medium text-[#111827]">Your routine is ready</p>
                <p className="mt-1 text-xs text-[#6b7280]">
                  A few targeted steps, morning and night — nothing extra.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#ebddd4] bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
              Key concerns
            </p>
            <p className="mt-1 text-sm text-[#4b5563]">
              {routine.morning.length + routine.evening.length > 0
                ? "Targeted support for your main issues."
                : "Soft routine focused on maintenance."}
            </p>
          </div>
          <div className="rounded-xl border border-[#ebddd4] bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
              Priority ingredients
            </p>
            <p className="mt-1 text-sm text-[#4b5563]">
              Look for the highlighted actives in each product card.
            </p>
          </div>
          <div className="rounded-xl border border-[#ebddd4] bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
              Routine intensity
            </p>
            <p className="mt-1 text-sm text-[#4b5563]">
              {warnings.length > 0 ? "Balanced, with a few care notes." : "Gentle, beginner‑friendly routine."}
            </p>
          </div>
        </section>

        {warnings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-amber-100 bg-amber-50/60 p-3"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-amber-900">Soft care notes</p>
                <ul className="mt-1 list-inside list-disc text-xs text-amber-800">
                  {warnings.slice(0, 3).map((w, i) => {
                    const firstSentence = w.split(".")[0];
                    return <li key={firstSentence}>{firstSentence.trim()}.</li>;
                  })}
                </ul>
              </div>
            </div>
          </motion.section>
        )}

        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-medium text-[#111827]">
            <Sun className="h-5 w-5 text-[#2563eb]" />
            Your daily routine
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            A paired morning and evening plan built to stay lean but effective.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
                Morning
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-[#4b5563]">
                {combinedSteps
                  .filter((s) => s.period === "AM")
                  .map((step) => (
                    <li key={`am-${step.order}-${step.product.id}`}>
                      <span className="font-medium text-[#111827]">
                        Step {step.order} · {step.product.name}
                      </span>
                      <span className="block text-[11px] text-[#6b7280]">
                        {step.product.category.charAt(0).toUpperCase() +
                          step.product.category.slice(1)}
                        {" · "}
                        {step.usage}
                      </span>
                    </li>
                  ))}
                {combinedSteps.filter((s) => s.period === "AM").length === 0 && (
                  <li>No morning steps in this routine.</li>
                )}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
                Evening
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-[#4b5563]">
                {combinedSteps
                  .filter((s) => s.period === "PM")
                  .map((step) => (
                    <li key={`pm-${step.order}-${step.product.id}`}>
                      <span className="font-medium text-[#111827]">
                        Step {step.order} · {step.product.name}
                      </span>
                      <span className="block text-[11px] text-[#6b7280]">
                        {step.product.category.charAt(0).toUpperCase() +
                          step.product.category.slice(1)}
                        {" · "}
                        {step.usage}
                      </span>
                    </li>
                  ))}
                {combinedSteps.filter((s) => s.period === "PM").length === 0 && (
                  <li>No evening steps in this routine.</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {keyProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-medium text-[#111827]">
              Your key products
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              The few formulas doing most of the work for your skin.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#4b5563]">
              {keyProducts.map((product) => (
                <li key={product.id} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e5f0ff] text-[#2563eb] text-xs">
                    🧴
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-[#111827]">
                      {product.name}{" "}
                      <span className="text-xs font-normal text-[#6b7280]">
                        · {product.brand}
                      </span>
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      Key ingredient:{" "}
                      <span className="font-semibold">
                        {product.keyIngredients[0]}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {generalAdvice && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl border border-[#ebddd4] bg-white p-4 shadow-sm"
          >
            <h3 className="text-sm font-medium text-[#111827]">
              GlowGuide care notes
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#4b5563]">
              {generalAdvice}
            </p>
          </motion.section>
        )}

        <div className="mt-10 pb-8">
          <button
            type="button"
            onClick={handleStartOver}
            className="w-full rounded-full border-2 border-[#A8907A] py-3 font-medium text-[#A8907A] transition hover:bg-[#A8907A]/10"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
