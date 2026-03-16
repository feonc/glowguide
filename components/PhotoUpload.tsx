"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, X } from "lucide-react";

export interface PhotoUploadProps {
  value: string | undefined;
  onChange: (base64: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function PhotoUpload({ value, onChange, disabled, className = "" }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [disabled, readFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFile(file);
      e.target.value = "";
    },
    [readFile]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        aria-hidden
      />
      {value ? (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-xl border border-[#ebddd4] bg-white shadow-sm"
        >
          <img
            src={value}
            alt="Uploaded skin photo"
            className="h-56 w-full object-cover object-top sm:h-64"
          />
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 text-white transition hover:bg-black/60 disabled:opacity-50"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      ) : (
        <motion.button
          type="button"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          disabled={disabled}
          className={`flex h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition sm:h-56 ${
            isDragging
              ? "border-[#A8907A] bg-[#F2C4CE]/20"
              : "border-[#ebddd4] bg-white/60 hover:border-[#F2C4CE] hover:bg-[#F2C4CE]/10"
          } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2C4CE]/50 text-[#A8907A]">
            <Camera className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-[#6b5d52]">
            {isDragging ? "Drop image here" : "Drag and drop or click to upload"}
          </span>
        </motion.button>
      )}
    </div>
  );
}
