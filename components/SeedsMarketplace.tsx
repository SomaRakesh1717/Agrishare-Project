"use client";

import React, { useEffect, useState } from "react";
import { api, Seed } from "@/lib/api";

interface SeedsMarketplaceProps {
  onOrder: (seed: Seed) => void;
  onContact: (seed: Seed) => void;
}

export default function SeedsMarketplace({ onOrder, onContact }: SeedsMarketplaceProps) {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [cropType, setCropType] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const cropTypes = [
    "All",
    "Rice",
    "Wheat",
    "Maize",
    "Cotton",
    "Tomato",
    "Chilli",
    "Groundnut",
    "Soybean",
    "Vegetable",
  ];

  const fetchSeeds = async () => {
    setLoading(true);
    try {
      const data = await api.seeds.getAll({
        search: search.trim() || undefined,
        cropType: cropType !== "All" ? cropType : undefined,
      });
      setSeeds(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeeds();
  }, [cropType]);

  return (
    <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-surface-container">
        <div>
          <span className="text-[11px] font-bold text-tertiary uppercase tracking-widest">
            Certified Seed Hub
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            High-Yield Hybrid & Breeder Seeds
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Certified paddy, wheat, maize, cotton, and vegetable seeds with 90%+ verified germination rates.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold self-start md:self-end">
          {seeds.length} Certified Seed Lots Available
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchSeeds();
          }}
          className="flex items-center gap-3"
        >
          <div className="flex-1 flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container focus-within:ring-2 focus-within:ring-primary">
            <span className="material-symbols-outlined text-outline text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by variety name (e.g. Telangana Sona, P3396, Abhinav F1)..."
              className="w-full bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary-container transition-colors"
          >
            Search
          </button>
        </form>

        {/* Crops Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {cropTypes.map((c) => (
            <button
              key={c}
              onClick={() => setCropType(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                cropType === c
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Seeds Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-outline gap-3">
          <span className="w-8 h-8 border-3 border-tertiary border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-semibold">Loading certified seed lots...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seeds.map((s) => (
            <div
              key={s.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-low">
                <img
                  alt={s.name}
                  src={s.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC7FRiIFekL9s8b8D4YqWj99h88K1Ua2qB6Ghy8"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#121c2c]/80 backdrop-blur-md text-white text-[11px] font-bold">
                    {s.cropType}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                    {s.germinationRate}% Germination
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-secondary shadow-sm">
                  <span>★</span>
                  <span>{s.rating}</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-headline font-bold text-base text-on-surface line-clamp-1 group-hover:text-tertiary transition-colors">
                    {s.name}
                  </h3>
                  <span className="text-xs font-semibold text-secondary block">
                    Variety: {s.variety} • Maturity: {s.maturityDays} Days
                  </span>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {s.description}
                  </p>
                </div>

                {/* Stock & Packaging */}
                <div className="bg-surface-container-low p-2.5 rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="text-outline text-[11px] block">Package:</span>
                    <span className="font-semibold text-on-surface">{s.packageSize}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-outline text-[11px] block">Stock:</span>
                    <span className="font-bold text-tertiary">{s.stockKg} kg Available</span>
                  </div>
                </div>

                {/* Pricing & Order */}
                <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-outline block uppercase font-bold">Price</span>
                    <span className="font-headline font-bold text-lg text-primary">
                      ₹{s.pricePerKg}
                      <span className="text-xs font-normal text-on-surface-variant">/kg</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onContact(s)}
                      className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                      title="Chat with seed distributor"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>
                    <button
                      onClick={() => onOrder(s)}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                      <span>Order Seeds</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
