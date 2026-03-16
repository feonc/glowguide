"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Camera, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:flex-row md:items-center md:gap-12">
        <div className="md:w-1/2">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#111827]">
              GLOWGUIDE
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
              Smarter routines,
              <br className="hidden sm:block" /> fewer products.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#4b5563] sm:text-base">
              In a few quick steps, GlowGuide builds a derm‑inspired morning and
              evening plan that keeps your routine lean, focused and tailored to
              your skin.
            </p>
          </motion.header>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center rounded-full bg-[#2563eb] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
            >
              Tell us your concerns
            </Link>
            <Link
              href="/quiz?step=photo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d1d5db] bg-white px-7 py-3 text-sm font-semibold text-[#111827] transition hover:border-[#2563eb] hover:text-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
            >
              <Camera className="h-4 w-4" />
              Upload a photo
            </Link>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap gap-3 text-xs text-[#6b7280]"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm">
              <Sparkles className="h-3 w-3 text-[#2563eb]" />
              <span>Derm‑inspired routines</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm">
              <MessageCircle className="h-3 w-3 text-[#2563eb]" />
              <span>No generic product spam</span>
            </div>
          </motion.div>
        </div>

        <motion.section
          className="mt-10 w-full md:mt-0 md:w-1/2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="rounded-3xl bg-white p-5 shadow-md sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
              A peek at your plan
            </p>
            <div className="mt-3 grid gap-4 text-sm text-[#111827] sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#6b6f76]">
                  Morning
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-[#4b5563]">
                  <li>• Gel cleanser</li>
                  <li>• Calming hydrating serum</li>
                  <li>• Lightweight SPF 50</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#6b6f76]">
                  Evening
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-[#4b5563]">
                  <li>• Gentle cleanse</li>
                  <li>• Targeted treatment serum</li>
                  <li>• Barrier‑supporting moisturizer</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[#f3f4f6] px-4 py-3 text-xs text-[#4b5563]">
              GlowGuide prioritizes a small, high‑impact routine over a long
              shelf of products, so you know exactly what matters most.
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
