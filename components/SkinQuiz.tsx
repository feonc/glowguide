"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Flame,
  Sparkles,
  Timer,
  Wind,
  Heart,
  CircleAlert,
  Sun,
  Eye,
  Scan,
  Target,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import type { SkinConcern, SkinType, SkinProfile } from "@/types";
import { PhotoUpload } from "./PhotoUpload";

const SKIN_TYPES: { value: SkinType; label: string }[] = [
  { value: "oily", label: "Oily" },
  { value: "dry", label: "Dry" },
  { value: "combination", label: "Combination" },
  { value: "normal", label: "Normal" },
  { value: "sensitive", label: "Sensitive" },
];

const CONCERNS: { value: SkinConcern; label: string; Icon: LucideIcon }[] = [
  { value: "acne", label: "Acne", Icon: Scan },
  { value: "dryness", label: "Dryness", Icon: Droplets },
  { value: "oiliness", label: "Oiliness", Icon: Flame },
  { value: "hyperpigmentation", label: "Hyperpigmentation", Icon: Sun },
  { value: "aging", label: "Aging", Icon: Timer },
  { value: "sensitivity", label: "Sensitivity", Icon: Heart },
  { value: "redness", label: "Redness", Icon: CircleAlert },
  { value: "dullness", label: "Dullness", Icon: Sparkles },
  { value: "darkCircles", label: "Dark circles", Icon: Eye },
  { value: "pores", label: "Pores", Icon: Wind },
];

const DEFAULT_STEPS = ["skinType", "concerns", "goals", "photo", "review"] as const;
const PHOTO_FIRST_STEPS = ["photo", "skinType", "concerns", "goals", "review"] as const;
type StepId = (typeof DEFAULT_STEPS)[number];

const stepLabels: Record<StepId, string> = {
  skinType: "Skin type",
  concerns: "Concerns",
  goals: "Goals",
  photo: "Photo",
  review: "Review",
};

export interface SkinQuizProps {
  onSubmit: (profile: SkinProfile) => Promise<void>;
  isSubmitting?: boolean;
}

export function SkinQuiz({ onSubmit, isSubmitting = false }: SkinQuizProps) {
  const searchParams = useSearchParams();
  const stepFromQuery = searchParams.get("step");
  const steps: StepId[] =
    stepFromQuery === "photo" ? [...PHOTO_FIRST_STEPS] : [...DEFAULT_STEPS];
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<SkinProfile>({
    skinType: "normal",
    concerns: [],
    goals: [],
  });
  const [goalsText, setGoalsText] = useState("");

  const GOAL_SUGGESTIONS = [
    "Reduce breakouts",
    "Fade dark spots",
    "Calm redness",
    "Boost glow",
    "Soften fine lines",
  ];

  const currentStep = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const setSkinType = useCallback((skinType: SkinType) => {
    setProfile((p) => ({ ...p, skinType }));
  }, []);

  const toggleConcern = useCallback((c: SkinConcern) => {
    setProfile((p) => ({
      ...p,
      concerns: p.concerns.includes(c)
        ? p.concerns.filter((x) => x !== c)
        : [...p.concerns, c],
    }));
  }, []);

  const setGoals = useCallback((goals: string[]) => {
    setProfile((p) => ({ ...p, goals }));
  }, []);

  const setPhotoBase64 = useCallback((photoBase64: string | undefined) => {
    setProfile((p) => ({ ...p, photoBase64 }));
  }, []);

  const goNext = useCallback(() => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  }, [stepIndex, steps.length]);

  const goPrev = useCallback(() => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const handleSubmit = useCallback(async () => {
    await onSubmit(profile);
  }, [onSubmit, profile]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ebddd4]">
          <motion.div
            className="h-full rounded-full bg-[#A8907A]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="mt-2 text-sm text-[#6b5d52]">
          Step {stepIndex + 1} of {steps.length}: {stepLabels[currentStep]}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === "skinType" && (
          <motion.div
            key="skinType"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-medium text-[#3d3630]">
              What&apos;s your skin type?
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SKIN_TYPES.map(({ value, label }) => (
                <motion.button
                  key={value}
                  type="button"
                  onClick={() => setSkinType(value)}
                  className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                    profile.skinType === value
                      ? "border-[#A8907A] bg-[#F2C4CE]/30 text-[#3d3630]"
                      : "border-[#ebddd4] bg-white text-[#6b5d52] hover:border-[#F2C4CE]"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === "concerns" && (
          <motion.div
            key="concerns"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-medium text-[#3d3630]">
              Select your main concerns
            </h2>
            <p className="text-sm text-[#6b5d52]">
              You can select more than one.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CONCERNS.map(({ value, label, Icon }) => (
                <motion.button
                  key={value}
                  type="button"
                  onClick={() => toggleConcern(value)}
                  className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                    profile.concerns.includes(value)
                      ? "border-[#A8907A] bg-[#F2C4CE]/30 text-[#3d3630]"
                      : "border-[#ebddd4] bg-white text-[#6b5d52] hover:border-[#F2C4CE]"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-5 w-5 shrink-0 text-[#A8907A]" />
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === "goals" && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-medium text-[#3d3630]">
              Any specific goals?
            </h2>
            <p className="text-sm text-[#6b5d52]">
              Optional — e.g. &quot;reduce redness&quot;, &quot;more glow&quot;
            </p>
            <textarea
              value={goalsText}
              onChange={(e) => {
                const value = e.target.value;
                setGoalsText(value);
                setGoals(
                  value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                );
              }}
              placeholder="Clearer skin, reduce fine lines..."
              rows={4}
              className="w-full rounded-xl border border-[#ebddd4] bg-white px-4 py-3 text-[#3d3630] placeholder:text-[#a89f95] focus:border-[#A8907A] focus:outline-none focus:ring-2 focus:ring-[#A8907A]/20"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              {GOAL_SUGGESTIONS.map((label) => {
                const isActive = profile.goals.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const nextGoals = isActive
                        ? profile.goals.filter((g) => g !== label)
                        : [...profile.goals, label];
                      setGoals(nextGoals);
                      setGoalsText(nextGoals.join(", "));
                    }}
                    className={`rounded-full border px-3 py-1 transition ${
                      isActive
                        ? "border-[#A8907A] bg-[#F2C4CE]/40 text-[#3d3630]"
                        : "border-[#ebddd4] bg-white text-[#6b5d52] hover:border-[#F2C4CE]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {currentStep === "photo" && (
          <motion.div
            key="photo"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-medium text-[#3d3630]">
              Upload a photo (optional)
            </h2>
            <p className="text-sm text-[#6b5d52]">
              For a more personalized analysis. We don&apos;t store your photos.
            </p>
            <PhotoUpload
              value={profile.photoBase64}
              onChange={setPhotoBase64}
              disabled={isSubmitting}
            />
          </motion.div>
        )}

        {currentStep === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-medium text-[#3d3630]">
              Review & get your personalized plan
            </h2>
            <div className="rounded-xl border border-[#ebddd4] bg-white p-4 text-sm text-[#3d3630] space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8907A]">
                  Your profile
                </p>
                <p className="mt-1">
                  <span className="font-medium text-[#6b5d52]">Skin type:</span>{" "}
                  {profile.skinType}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-[#6b5d52]">Concerns:</span>{" "}
                  {profile.concerns.length
                    ? profile.concerns.join(", ")
                    : "None selected"}
                </p>
                {profile.goals.length > 0 && (
                  <p className="mt-1">
                    <span className="font-medium text-[#6b5d52]">Goals:</span>{" "}
                    {profile.goals.join(", ")}
                  </p>
                )}
                {profile.photoBase64 && (
                  <p className="mt-1 font-medium text-[#6b5d52]">
                    Photo attached for analysis
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-[#FDF6F0] px-3 py-2 text-xs text-[#6b5d52]">
                We&apos;ll use this information to build a gentle, effective
                morning and evening routine with products that match your skin
                type and priorities.
              </div>
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#A8907A] py-3.5 font-medium text-[#FDF6F0] transition hover:bg-[#8b7355] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Target className="h-4 w-4 animate-pulse" />
                    Crafting your plan…
                  </>
                ) : (
                  "Get my routine"
                )}
              </button>
              <p className="text-center text-[11px] text-[#6b5d52]">
                This may take a few moments while we personalize your results.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#A8907A] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        {currentStep !== "review" && (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#A8907A]"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
