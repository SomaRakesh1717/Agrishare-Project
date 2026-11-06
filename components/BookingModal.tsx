"use client";

import React, { useState } from "react";
import { api, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: any;
  resourceType: "MACHINERY" | "SEEDS" | "LABOUR" | "OPERATOR";
  onSuccess?: (booking: Booking) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  resource,
  resourceType,
  onSuccess,
}: BookingModalProps) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantity, setQuantity] = useState<number>(resourceType === "SEEDS" ? 25 : 1);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "Field Block B, Nizamabad, Telangana");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  if (!isOpen || !resource) return null;

  // Calculate pricing
  const calculateTotal = () => {
    if (resourceType === "SEEDS") {
      const priceKg = resource.pricePerKg || 100;
      return quantity * priceKg;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    if (resourceType === "MACHINERY") {
      return (resource.pricePerDay || 2000) * days;
    }
    if (resourceType === "LABOUR") {
      return (resource.dailyWage || 500) * days;
    }
    if (resourceType === "OPERATOR") {
      return (resource.dailyWage || 800) * days;
    }
    return 1000;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = await api.bookings.create({
        resourceType,
        resourceId: resource.id,
        startDate,
        endDate,
        quantity,
        rentalDurationUnit: resourceType === "SEEDS" ? "KG" : "DAYS",
        deliveryAddress,
        notes,
      });

      setSuccessBooking(result);
      onSuccess?.(result);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to complete booking. Please check date availability.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-on-surface">
                {successBooking ? "Booking Confirmed" : `Book ${resourceType.toLowerCase()}`}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {resource.title || resource.name || resource.fullName}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSuccessBooking(null);
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        {successBooking ? (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-lg text-primary">
                Order Successfully Placed!
              </h4>
              <p className="text-xs text-on-surface-variant mt-1">
                Your reservation request has been dispatched to the owner/provider.
              </p>
            </div>

            <div className="w-full bg-surface-container-low p-4 rounded-xl flex flex-col gap-2 text-left text-xs">
              <div className="flex justify-between border-b border-surface-container pb-1.5">
                <span className="text-outline">Booking Reference:</span>
                <span className="font-bold text-on-surface">{successBooking.bookingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-1.5">
                <span className="text-outline">Resource:</span>
                <span className="font-semibold text-on-surface">{successBooking.resourceTitle}</span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-1.5">
                <span className="text-outline">Scheduled Dates:</span>
                <span className="font-semibold text-on-surface">
                  {successBooking.startDate} to {successBooking.endDate}
                </span>
              </div>
              <div className="flex justify-between border-b border-surface-container pb-1.5">
                <span className="text-outline">Total Estimated Cost:</span>
                <span className="font-bold text-primary text-sm">₹{successBooking.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-outline">Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-[10px]">
                  {successBooking.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessBooking(null);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow hover:bg-primary-container transition-all"
            >
              Done & View Bookings
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="p-5 flex flex-col gap-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-error-container text-error text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Quantity for Seeds or Duration */}
            {resourceType === "SEEDS" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                    Quantity (kg)
                  </label>
                  <span className="text-[11px] text-tertiary font-semibold">
                    Stock available: {resource.stockKg || 500} kg
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min={1}
                  max={resource.stockKg || 1000}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {/* Delivery / Field Location */}
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                Farm Delivery / Field Location
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Block B, Near Nizamabad Canal, Telangana"
                className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                Special Field Requirements / Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need rotavator calibrated for wet soil puddling..."
                className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-surface-container p-3 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-outline text-[11px] block">Estimated Total</span>
                <span className="font-bold text-on-surface text-base text-primary">
                  ₹{calculateTotal().toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-secondary font-semibold block">
                  ✓ Verified Fair Pricing
                </span>
                <span className="text-[10px] text-outline">
                  Zero commission middle-layers
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary-container transition-all flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
