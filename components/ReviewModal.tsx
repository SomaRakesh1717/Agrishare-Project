"use client";

import React, { useState } from "react";
import { api, Review } from "@/lib/api";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  targetType: "MACHINERY" | "LABOUR" | "OPERATOR" | "OWNER";
  targetId: string;
  targetTitle: string;
  onSuccess?: (review: Review) => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  targetType,
  targetId,
  targetTitle,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const saved = await api.reviews.create({
        bookingId,
        targetType,
        targetId,
        targetTitle,
        rating,
        comment: comment.trim(),
      });
      onSuccess?.(saved);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-surface-container overflow-hidden">
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">star</span>
            <h3 className="font-headline font-bold text-sm text-on-surface">Rate & Review</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-surface-container flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <h4 className="font-headline font-bold text-sm text-on-surface">{targetTitle}</h4>
            <span className="text-[11px] text-outline uppercase font-semibold">{targetType} Provider</span>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-error-container text-error text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Star selector */}
          <div className="flex flex-col items-center gap-1.5 py-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125"
                >
                  <span
                    className={`material-symbols-outlined text-[32px] ${
                      (hoverRating || rating) >= star ? "text-secondary" : "text-outline-variant"
                    }`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-secondary">
              {rating === 5 ? "Excellent (5 Stars)" : `${rating} Stars`}
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
              Field Feedback & Experience
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Excellent service, reached the field promptly at 7 AM. Clean plowing and polite driver."
              className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary-container transition-all flex items-center justify-center gap-1"
            >
              {isSubmitting ? "Submitting..." : "Post Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
