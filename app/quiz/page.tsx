"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useCallback } from "react";
import { SkinQuiz } from "@/components/SkinQuiz";
import type { SkinProfile, AIAnalysisResult } from "@/types";
import { ANALYSIS_STORAGE_KEY } from "@/lib/constants";

function stripDataUrlPrefix(dataUrl: string): string {
  const i = dataUrl.indexOf(",");
  return i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
}

function QuizPageContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (profile: SkinProfile) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const body = {
          skinType: profile.skinType,
          concerns: profile.concerns,
          goals: profile.goals,
          photoBase64: profile.photoBase64
            ? stripDataUrlPrefix(profile.photoBase64)
            : undefined,
        };
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Analysis failed");
        }
        const result = data as AIAnalysisResult;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            ANALYSIS_STORAGE_KEY,
            JSON.stringify(result)
          );
        }
        router.push("/results");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-[#111827] hover:underline"
          >
            ← Back to home
          </Link>
        </div>
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">
              Your skin profile
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4b5563]">
              We&apos;ll ask a few focused questions so we can design a{" "}
              <span className="font-medium">small, high‑impact routine</span>{" "}
              that matches what your skin actually needs.
            </p>
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
              <SkinQuiz onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
          </div>
          <div className="space-y-4 text-sm text-[#4b5563]">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
                The products we look at
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                GlowGuide pulls from a curated set of derm‑trusted formulas
                across Korean, Japanese, Chinese and American brands. We look at
                textures, ingredients and skin‑type fit so your routine can stay
                focused on products that actually make sense for you.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
                Why finishing the quiz matters
              </p>
              <ul className="mt-2 space-y-1.5 text-xs">
                <li>
                  • A short morning and evening plan that avoids unnecessary
                  steps.
                </li>
                <li>
                  • Product ideas chosen around your skin type, concerns and
                  budget preferences.
                </li>
                <li>
                  • A clearer view of what to use now, and what you can safely
                  skip.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[#A8907A]">Loading...</p>
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
