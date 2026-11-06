"use client";

import React, { useEffect, useState } from "react";
import { api, Machinery } from "@/lib/api";

interface MachineryMarketplaceProps {
  onBook: (machinery: Machinery) => void;
  onContact: (machinery: Machinery) => void;
}

export default function MachineryMarketplace({ onBook, onContact }: MachineryMarketplaceProps) {
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<Machinery | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Tractors",
    "Harvesters",
    "Rotavators",
    "Cultivators",
    "Seeders",
    "Sprayers",
    "Ploughs",
    "Water pumps",
    "Threshers",
    "Tractor trailers",
  ];

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const data = await api.machinery.getAll({
        search: search.trim() || undefined,
        category: category !== "All" ? category : undefined,
        maxPrice: maxPrice || undefined,
      });
      setMachinery(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMachinery();
  };

  return (
    <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      {/* Header Banner from Stitch design */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-surface-container">
        <div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
            Verified Community Fleet
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Machinery & Implement Rental Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Access 45HP to 75HP tractors, GPS tracked tracked combine harvesters, rotavators and sprayers directly from neighboring farms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {machinery.length} Active Implements
          </span>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col gap-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container focus-within:ring-2 focus-within:ring-primary">
            <span className="material-symbols-outlined text-outline text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tractors, harvesters, brand, HP or location..."
              className="w-full bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-surface-container px-3 py-2 rounded-xl text-xs text-on-surface">
              <span className="text-outline">Max Price:</span>
              <select
                value={maxPrice || ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="bg-transparent font-bold text-primary focus:outline-none"
              >
                <option value="">Any Price</option>
                <option value="1500">Under ₹1,500/day</option>
                <option value="2500">Under ₹2,500/day</option>
                <option value="5000">Under ₹5,000/day</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow shrink-0"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Machinery Cards */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-outline gap-3">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-semibold">Loading verified agricultural machinery...</span>
        </div>
      ) : machinery.length === 0 ? (
        <div className="py-20 text-center bg-surface-container-lowest rounded-2xl border border-surface-container p-8">
          <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2">agriculture</span>
          <h3 className="font-headline font-bold text-base text-on-surface">No Machinery Found</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
            Try adjusting your search query, price limit, or category selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machinery.map((m) => (
            <div
              key={m.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-low">
                <img
                  alt={m.title}
                  src={m.images?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuB15P_70TIaXjHUnSrSCTlyLn7A5ZL1xD_WPbLXawrSTrTzoaHuf91DmmBu3xX3BiGxFcxbbvOIWBIEXcz5Bb2sWX0VqO7uY-E-Ln4QyWD7D0SMBiPWEIDI8B5mU3VZIO5bfzqMIWXorAwUzl56nM1xPZPPtX8G3_7hP-943uSR-NbRWUq14RD8tii_TqiIEEB3ibAZBsI0sL1t6DThm4FT4jg3GjIRqVzHSYSYouw1X-8IkETK7c0y"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#121c2c]/80 backdrop-blur-md text-white text-[11px] font-bold">
                    {m.horsepower} HP
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary-fixed/90 backdrop-blur-md text-primary text-[11px] font-bold">
                    {m.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-secondary shadow-sm">
                  <span>★</span>
                  <span>{m.rating || 4.9}</span>
                  <span className="text-[10px] text-outline font-normal">({m.reviewCount || 24})</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {m.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {m.description}
                  </p>
                </div>

                {/* Specs row */}
                <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2.5 rounded-xl text-[11px]">
                  <div>
                    <span className="text-outline block">Fuel & Drive:</span>
                    <span className="font-semibold text-on-surface">{m.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-outline block">Working Width:</span>
                    <span className="font-semibold text-on-surface">{m.workingWidth || "Standard"}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-surface-container flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                    <span className="truncate">{m.address || `${m.city}, ${m.state}`}</span>
                  </div>
                </div>

                {/* Pricing & Booking CTAs */}
                <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-outline block uppercase font-bold">Rental Rate</span>
                    <span className="font-headline font-bold text-lg text-primary">
                      ₹{m.pricePerDay}
                      <span className="text-xs font-normal text-on-surface-variant">/day</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onContact(m)}
                      title="Contact Owner via Real-time Chat"
                      className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>
                    <button
                      onClick={() => onBook(m)}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      <span>Book</span>
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
