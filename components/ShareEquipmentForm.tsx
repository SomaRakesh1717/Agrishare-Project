"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ShareEquipmentForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "Tractors",
    horsepower: 50,
    fuelType: "Diesel",
    workingWidth: "2.4 m",
    pricePerDay: 2200,
    pricePerHour: 320,
    address: user?.address || "Nizamabad Rural, Telangana",
    city: "Nizamabad",
    state: "Telangana",
    description: "",
    images: "https://lh3.googleusercontent.com/aida-public/AB6AXuB15P_70TIaXjHUnSrSCTlyLn7A5ZL1xD_WPbLXawrSTrTzoaHuf91DmmBu3xX3BiGxFcxbbvOIWBIEXcz5Bb2sWX0VqO7uY-E-Ln4QyWD7D0SMBiPWEIDI8B5mU3VZIO5bfzqMIWXorAwUzl56nM1xPZPPtX8G3_7hP-943uSR-NbRWUq14RD8tii_TqiIEEB3ibAZBsI0sL1t6DThm4FT4jg3GjIRqVzHSYSYouw1X-8IkETK7c0y",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.machinery.create({
        ...formData,
        latitude: user?.latitude || 18.6725,
        longitude: user?.longitude || 78.0941,
        images: [formData.images],
        available: true,
      });
      setSuccess(true);
      onSuccess?.();
    } catch (e: any) {
      alert("Error listing equipment: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      {/* Editorial Header from Stitch share_equipment screen */}
      <div className="bg-secondary-fixed text-on-secondary-fixed p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-secondary-fixed text-secondary-fixed text-xs font-bold self-start">
            <span className="material-symbols-outlined text-[16px]">monetization_on</span>
            <span>Community Sharing Hub</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-secondary-fixed tracking-tight">
            Earn Extra Income from Your Idle Farm Assets
          </h1>
          <p className="text-xs sm:text-sm text-on-secondary-fixed-variant max-w-xl">
            Rent out your tractor, cultivator, or rotavator to trusted local farmers when not in active use. Earn ₹1,200 to ₹3,500 daily with insured agreements.
          </p>
        </div>
      </div>

      {success ? (
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container shadow-sm flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 className="font-headline font-bold text-xl text-primary">Equipment Successfully Listed!</h3>
          <p className="text-xs text-on-surface-variant max-w-md">
            Your implement is now visible on the AgriRent marketplace and field radar map. Local farmers in your cluster can send booking requests.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow"
          >
            List Another Asset
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-5">
          <h3 className="font-headline font-bold text-lg text-on-surface">Equipment Specifications</h3>

          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase block mb-1">
              Equipment Title & Model
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mahindra 575 DI (45 HP) with Disc Harrow"
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl text-xs sm:text-sm text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none"
              >
                {["Tractors", "Harvesters", "Rotavators", "Cultivators", "Seeders", "Sprayers", "Ploughs", "Water pumps", "Threshers", "Tractor trailers"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase block mb-1">Horsepower (HP)</label>
              <input
                type="number"
                value={formData.horsepower}
                onChange={(e) => setFormData({ ...formData, horsepower: Number(e.target.value) })}
                className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase block mb-1">Daily Rental (₹)</label>
              <input
                required
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase block mb-1">Working Width / Size</label>
              <input
                type="text"
                value={formData.workingWidth}
                onChange={(e) => setFormData({ ...formData, workingWidth: e.target.value })}
                placeholder="e.g. 2.2 m / 7 Feet"
                className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase block mb-1">Image URL</label>
              <input
                type="text"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase block mb-1">Location Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase block mb-1">Description & Maintenance</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="State working condition, tyre condition, implement attachments included..."
              className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow hover:bg-primary-container transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Publishing to Marketplace...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">publish</span>
                <span>Publish Equipment Listing</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
