"use client";

import React, { useEffect, useState } from "react";
import { api, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface MyBookingsViewProps {
  onOpenReview: (booking: Booking) => void;
  onOpenChat: (peerId: string, peerName: string, title?: string) => void;
}

export default function MyBookingsView({ onOpenReview, onOpenChat }: MyBookingsViewProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getMy();
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.bookings.updateStatus(id, "CANCELLED");
      fetchBookings();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleMarkComplete = async (id: string) => {
    try {
      await api.bookings.updateStatus(id, "COMPLETED");
      fetchBookings();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus === "ALL") return true;
    return b.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-primary-fixed text-primary font-bold";
      case "PENDING":
        return "bg-secondary-fixed text-on-secondary-fixed font-bold";
      case "COMPLETED":
        return "bg-tertiary-fixed text-tertiary font-bold";
      case "REJECTED":
        return "bg-error-container text-error font-bold";
      case "CANCELLED":
        return "bg-surface-container text-outline font-medium";
      default:
        return "bg-surface-container text-on-surface";
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-surface-container">
        <div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
            Farming Schedule & History
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            My Bookings & Field Orders
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Track machinery rentals, confirmed operators, seed shipments, and scheduled labour crews.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface self-start sm:self-auto transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {["ALL", "PENDING", "ACCEPTED", "COMPLETED", "CANCELLED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              filterStatus === s
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-container text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {s === "ALL" ? "All Bookings" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-outline gap-3">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-semibold">Loading your bookings...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-surface-container p-8">
          <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2">calendar_today</span>
          <h3 className="font-headline font-bold text-base text-on-surface">No bookings in this status</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
            Browse our machinery, seeds, or labour directory to reserve resources for your field.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative overflow-hidden"
            >
              {/* Left Color Indicator Strip */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-2 ${
                  b.status === "ACCEPTED" ? "bg-primary" : b.status === "PENDING" ? "bg-secondary" : "bg-outline-variant"
                }`}
              />

              <div className="flex items-start gap-4 pl-2">
                {b.resourceImage ? (
                  <img
                    alt=""
                    src={b.resourceImage}
                    className="w-16 h-16 rounded-xl object-cover border border-surface-container shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[28px]">agriculture</span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-outline">
                      #{b.bookingNumber}
                    </span>
                    <span className="text-xs text-outline">•</span>
                    <span className="text-[11px] font-semibold text-secondary uppercase">
                      {b.resourceType}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-base text-on-surface">
                    {b.resourceTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                      {b.startDate} to {b.endDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                      Provider: {b.ownerOrProviderName}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-primary text-sm">
                      ₹{b.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {b.deliveryAddress && (
                    <div className="flex items-center gap-1 text-[11px] text-outline mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span>{b.deliveryAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-surface-container pl-2">
                <button
                  onClick={() => onOpenChat(b.ownerOrProviderId, b.ownerOrProviderName, b.resourceTitle)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Contact</span>
                </button>

                {b.status === "PENDING" && (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-error-container text-error text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    <span>Cancel</span>
                  </button>
                )}

                {b.status === "ACCEPTED" && (
                  <button
                    onClick={() => handleMarkComplete(b.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Mark Completed</span>
                  </button>
                )}

                {b.status === "COMPLETED" && (
                  <button
                    onClick={() => onOpenReview(b)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:opacity-95 shadow transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">star</span>
                    <span>Rate Provider</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
