"use client";

import { motion } from "framer-motion";
import type { ChatBubbleMessage } from "@/types";

export interface ChatBubbleProps {
  message: ChatBubbleMessage;
  className?: string;
}

export function ChatBubble({ message, className = "" }: ChatBubbleProps) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${className} ${isUser ? "ml-auto max-w-[85%]" : "max-w-[95%]"}`}
    >
      <div
        className={`rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[#A8907A] text-[#FDF6F0]"
            : "bg-white border border-[#ebddd4] text-[#3d3630] shadow-sm"
        }`}
      >
        <p className="text-sm font-medium text-[#6b5d52]">
          {isUser ? "You" : "GlowGuide"}
        </p>
        <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
