"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleMapView from "@/components/GoogleMapView";
import BookingModal from "@/components/BookingModal";
import ChatModal from "@/components/ChatModal";
import ReviewModal from "@/components/ReviewModal";
import MachineryMarketplace from "@/components/MachineryMarketplace";
import SeedsMarketplace from "@/components/SeedsMarketplace";
import LabourMarketplace from "@/components/LabourMarketplace";
import ShareEquipmentForm from "@/components/ShareEquipmentForm";
import MyBookingsView from "@/components/MyBookingsView";
import AdminPortal from "@/components/AdminPortal";
import AiAssistantView from "@/components/AiAssistantView";
import AuthView from "@/components/AuthView";
import { api, Machinery, Seed, Labour, Operator, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("home");

  // Live collections
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [labour, setLabour] = useState<Labour[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);

  // Search input in Hero
  const [heroSearch, setHeroSearch] = useState("");
  const [heroCategory, setHeroCategory] = useState("ALL");

  // Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBookingResource, setSelectedBookingResource] = useState<any>(null);
  const [selectedResourceType, setSelectedResourceType] = useState<"MACHINERY" | "SEEDS" | "LABOUR" | "OPERATOR">("MACHINERY");

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatPeer, setChatPeer] = useState<{ id?: string; name?: string; title?: string }>({});

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ type: any; id: string; title: string; bookingId?: string }>({
    type: "MACHINERY",
    id: "",
    title: "",
  });

  const loadData = async () => {
    try {
      const [m, s, l, o, b] = await Promise.all([
        api.machinery.getAll().catch(() => []),
        api.seeds.getAll().catch(() => []),
        api.labour.getAll().catch(() => []),
        api.operators.getAll().catch(() => []),
        api.bookings.getMy().catch(() => []),
      ]);
      setMachinery(m);
      setSeeds(s);
      setLabour(l);
      setOperators(o);
      setActiveBookings(b);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Open Booking Modal Helper
  const handleOpenBooking = (resource: any, type: any) => {
    if (!user) {
      setActiveTab("auth");
      return;
    }
    setSelectedBookingResource(resource);
    setSelectedResourceType(type);
    setBookingModalOpen(true);
  };

  // Open Chat Modal Helper
  const handleOpenChat = (peerId?: string, peerName?: string, resourceTitle?: string) => {
    if (!user) {
      setActiveTab("auth");
      return;
    }
    setChatPeer({
      id: peerId || "support@agrishare.com",
      name: peerName || "AgriRent Helpdesk",
      title: resourceTitle || "Equipment & Labour Inquiry",
    });
    setChatModalOpen(true);
  };

  // Open Review Modal Helper
  const handleOpenReview = (booking: Booking) => {
    setReviewTarget({
      type: booking.resourceType,
      id: booking.resourceId,
      title: booking.resourceTitle,
      bookingId: booking.id,
    });
    setReviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body text-on-surface">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenChat={() => handleOpenChat()}
      />

      <main className="flex-1 pt-20">
        {/* VIEW 1: HOME / FARMER DASHBOARD */}
        {activeTab === "home" && (
          <div className="flex flex-col w-full">
            {/* HERO & SEARCH SECTION */}
            <div className="relative w-full overflow-hidden bg-surface-container-low px-4 sm:px-8 py-8 sm:py-12 border-b border-surface-container">
              <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none"></div>
              <div className="absolute left-1/3 -bottom-32 w-80 h-80 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>

              <div className="max-w-[1540px] mx-auto flex flex-col gap-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-headline font-extrabold text-2xl sm:text-4xl text-primary tracking-tight">
                        Everything You Need to Farm Smarter
                      </h1>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary font-bold text-xs">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        AgriShare Cluster
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl">
                      Rent verified tractors, schedule harvest crews, buy certified high-yield seeds, and chat directly with neighbors in Telangana.
                    </p>
                  </div>

                  {/* Weather & Soil Sensor + Farmer Headshot Banner */}
                  <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
                    <div className="flex items-center gap-3 bg-surface-container-lowest p-2.5 pr-4 rounded-2xl shadow-sm border border-surface-container">
                      <img
                        src="/farmer-hero.png"
                        alt="Progressive Telangana Farmer"
                        className="w-12 h-12 rounded-xl object-cover border border-primary/20 shadow-sm shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface">Verified Community Fleet</span>
                        <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          Telangana Agronomic Hub
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-3 bg-surface-container-lowest px-4 py-3 rounded-2xl shadow-sm self-start lg:self-center border border-surface-container">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold">
                        <span className="material-symbols-outlined text-[24px]">sunny</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs sm:text-sm text-on-surface flex items-center gap-1.5">
                          28°C Sunny
                          <span className="text-outline-variant">•</span>
                          <span className="text-tertiary">Soil Moisture 64%</span>
                        </span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                          Ideal for Plowing & Sowing Today
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Central Search Module */}
                <div className="w-full bg-surface-container-lowest p-4 rounded-2xl shadow-md border border-surface-container">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (heroCategory === "SEEDS") setActiveTab("seeds");
                      else if (heroCategory === "LABOUR") setActiveTab("labour");
                      else setActiveTab("machinery");
                    }}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex flex-col md:flex-row items-stretch gap-3">
                      <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container focus-within:ring-2 focus-within:ring-primary">
                        <span className="material-symbols-outlined text-outline text-[22px]">search</span>
                        <input
                          type="text"
                          value={heroSearch}
                          onChange={(e) => setHeroSearch(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none"
                          placeholder="Search across tractors, seed varieties, harvest crews, certified operators..."
                        />
                      </div>

                      <div
                        onClick={() => setActiveTab("nearby")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface shrink-0 cursor-pointer hover:bg-surface-container-highest transition-colors text-xs font-semibold"
                      >
                        <span className="material-symbols-outlined text-secondary text-[18px]">near_me</span>
                        <span>Within 30 km</span>
                        <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
                      </div>

                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-container font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">manage_search</span>
                        <span>Search Resources</span>
                      </button>
                    </div>

                    {/* Filter Category Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pt-1">
                      <span className="text-[11px] font-bold text-outline uppercase shrink-0">Filter By:</span>
                      {[
                        { id: "ALL", label: "All Categories" },
                        { id: "MACHINERY", label: "🚜 Machinery" },
                        { id: "SEEDS", label: "🌱 Seeds" },
                        { id: "LABOUR", label: "👨‍🌾 Labour" },
                        { id: "OPERATORS", label: "🧑‍🔧 Operators" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setHeroCategory(item.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                            heroCategory === item.id
                              ? "bg-primary text-white shadow-sm"
                              : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </form>
                </div>

                {/* 6 Category Quick Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={() => setActiveTab("machinery")}
                    className="group flex flex-col p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-surface-container text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform mb-3">
                      <span className="material-symbols-outlined text-[24px]">agriculture</span>
                    </div>
                    <span className="font-headline font-bold text-sm text-on-surface">Machinery</span>
                    <p className="text-[11px] text-on-surface-variant line-clamp-1">Tractors & implements</p>
                    <span className="text-[11px] text-primary font-bold mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      {machinery.length} Available
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("seeds")}
                    className="group flex flex-col p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-surface-container text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed group-hover:scale-105 transition-transform mb-3">
                      <span className="material-symbols-outlined text-[24px]">potted_plant</span>
                    </div>
                    <span className="font-headline font-bold text-sm text-on-surface">Seeds</span>
                    <p className="text-[11px] text-on-surface-variant line-clamp-1">Certified hybrids</p>
                    <span className="text-[11px] text-tertiary font-bold mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      {seeds.length} Varieties
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("labour")}
                    className="group flex flex-col p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-surface-container text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-105 transition-transform mb-3">
                      <span className="material-symbols-outlined text-[24px]">groups</span>
                    </div>
                    <span className="font-headline font-bold text-sm text-on-surface">Labour</span>
                    <p className="text-[11px] text-on-surface-variant line-clamp-1">Field workers</p>
                    <span className="text-[11px] text-secondary font-bold mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      {labour.length} Active Crews
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("labour")}
                    className="group flex flex-col p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-surface-container text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed group-hover:scale-105 transition-transform mb-3">
                      <span className="material-symbols-outlined text-[24px]">engineering</span>
                    </div>
                    <span className="font-headline font-bold text-sm text-on-surface">Operators</span>
                    <p className="text-[11px] text-on-surface-variant line-clamp-1">Certified drivers</p>
                    <span className="text-[11px] text-secondary font-bold mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      {operators.length} On Duty
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("ai-assistant")}
                    className="group flex flex-col p-4 rounded-2xl bg-gradient-to-br from-primary-container to-primary text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-primary-fixed group-hover:scale-105 transition-transform mb-3">
                      <span className="material-symbols-outlined text-[24px]">smart_toy</span>
                    </div>
                    <span className="font-headline font-bold text-sm text-white">AI Crop Doctor</span>
                    <p className="text-[11px] text-primary-fixed/90 line-clamp-1">Pest & soil diagnosis</p>
                    <span className="text-[11px] text-primary-fixed font-bold mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      Instant Guidance
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("share")}
                    className="group flex flex-col p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-surface-container text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform mb-3">
                      <span className="material-symbols-outlined text-[24px]">handshake</span>
                    </div>
                    <span className="font-headline font-bold text-sm text-on-surface">Share Asset</span>
                    <p className="text-[11px] text-on-surface-variant line-clamp-1">Rent idle implements</p>
                    <span className="text-[11px] text-secondary font-bold mt-2 flex items-center gap-1">
                      Earn ₹1,500+/day
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* FARM DASHBOARD OVERVIEW METRICS */}
            <div className="max-w-[1540px] mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight">
                    Farm Cluster Overview
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                    Live Cluster Status
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-outline uppercase">Active Bookings</span>
                    <span className="font-headline text-2xl font-bold text-primary">
                      {activeBookings.filter((b) => b.status === "ACCEPTED").length || 1}
                    </span>
                    <span className="text-xs text-on-surface-variant">Confirmed in field</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-outline uppercase">Upcoming Rental</span>
                    <span className="font-headline text-2xl font-bold text-secondary">Tomorrow</span>
                    <span className="text-xs text-on-surface-variant">7:00 AM • Block B</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-outline uppercase">Available Fleet</span>
                    <span className="font-headline text-2xl font-bold text-on-surface">{machinery.length} Units</span>
                    <span className="text-xs text-tertiary font-semibold">Telematics verified</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-outline uppercase">Workforce Providers</span>
                    <span className="font-headline text-2xl font-bold text-on-surface">
                      {labour.length + operators.length}
                    </span>
                    <span className="text-xs text-on-surface-variant">Crews & Drivers</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-outline uppercase">Nearby Resources</span>
                    <span className="font-headline text-2xl font-bold text-primary">
                      {machinery.length + seeds.length + labour.length + operators.length}
                    </span>
                    <span className="text-xs text-on-surface-variant">Within 30 km</span>
                  </div>
                </div>
              </div>

              {/* SPLIT SECTION: ACTIVE BOOKINGS & COMMUNITY SHARING */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Active Bookings Card */}
                <div className="lg:col-span-8 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <h2 className="font-headline font-bold text-lg text-on-surface tracking-tight">
                        Active Field Bookings & Dispatch Alerts
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab("my-bookings")}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View All ({activeBookings.length})</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>

                  {activeBookings.length > 0 ? (
                    <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-surface-container-low shrink-0 overflow-hidden">
                          <img
                            alt={activeBookings[0].resourceTitle}
                            className="w-full h-full object-cover"
                            src={activeBookings[0].resourceImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB15P_70TIaXjHUnSrSCTlyLn7A5ZL1xD_WPbLXawrSTrTzoaHuf91DmmBu3xX3BiGxFcxbbvOIWBIEXcz5Bb2sWX0VqO7uY-E-Ln4QyWD7D0SMBiPWEIDI8B5mU3VZIO5bfzqMIWXorAwUzl56nM1xPZPPtX8G3_7hP-943uSR-NbRWUq14RD8tii_TqiIEEB3ibAZBsI0sL1t6DThm4FT4jg3GjIRqVzHSYSYouw1X-8IkETK7c0y"}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
                              {activeBookings[0].status}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-outline">
                              Order #{activeBookings[0].bookingNumber}
                            </span>
                          </div>
                          <h3 className="font-headline font-bold text-sm sm:text-base text-on-surface">
                            {activeBookings[0].resourceTitle}
                          </h3>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                            {activeBookings[0].startDate} • {activeBookings[0].rentalDurationUnit} • {activeBookings[0].deliveryAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button
                          onClick={() => handleOpenChat(activeBookings[0].ownerOrProviderId || "support@agrishare.com", activeBookings[0].ownerOrProviderName || "Fleet Dispatch", activeBookings[0].resourceTitle)}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">support_agent</span>
                          <span>Dispatch Desk</span>
                        </button>
                        <button
                          onClick={() => setActiveTab("nearby")}
                          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[24px]">agriculture</span>
                        </div>
                        <div>
                          <h3 className="font-headline font-bold text-sm text-on-surface">
                            Verified Community Fleet & Field Hubs
                          </h3>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            Browse verified tractors, harvesters, certified seeds and skilled farm labour in your district.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                        <button
                          onClick={() => handleOpenChat("support@agrishare.com", "AgriRent Helpdesk", "Equipment & Resource Inquiry")}
                          className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-primary text-[16px]">support_agent</span>
                          <span>Contact Support</span>
                        </button>
                        <button
                          onClick={() => setActiveTab("machinery")}
                          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow transition-colors"
                        >
                          Explore Fleet
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Community Sharing Hub banner from Stitch */}
                <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-secondary-fixed text-on-secondary-fixed relative overflow-hidden shadow-sm">
                  <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-secondary-container/40 blur-xl pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-on-secondary-fixed text-secondary-fixed text-[10px] font-bold self-start">
                      Community Sharing Hub
                    </span>
                    <h3 className="font-headline font-bold text-lg leading-snug">
                      Earn extra income from idle tractors & rotavators
                    </h3>
                    <p className="text-xs text-on-secondary-fixed-variant">
                      Local farmers in Nizamabad are booking implements for upcoming Kharif preparations.
                    </p>
                  </div>
                  <div className="pt-4 relative z-10">
                    <button
                      onClick={() => setActiveTab("share")}
                      className="w-full py-2.5 px-4 rounded-xl bg-on-secondary-fixed text-secondary-fixed font-bold text-xs hover:opacity-95 shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      <span>List Your Equipment</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* NEARBY AVAILABLE MACHINERY SHOWCASE */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                      Fast Delivery Guaranteed
                    </span>
                    <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight">
                      Featured Nearby Machinery
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("machinery")}
                    className="text-xs font-bold text-primary hover:underline self-start sm:self-auto"
                  >
                    Browse Complete Machinery Catalog →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {machinery.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-low">
                        <img
                          alt={m.title}
                          src={m.images?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuB15P_70TIaXjHUnSrSCTlyLn7A5ZL1xD_WPbLXawrSTrTzoaHuf91DmmBu3xX3BiGxFcxbbvOIWBIEXcz5Bb2sWX0VqO7uY-E-Ln4QyWD7D0SMBiPWEIDI8B5mU3VZIO5bfzqMIWXorAwUzl56nM1xPZPPtX8G3_7hP-943uSR-NbRWUq14RD8tii_TqiIEEB3ibAZBsI0sL1t6DThm4FT4jg3GjIRqVzHSYSYouw1X-8IkETK7c0y"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#121c2c]/80 backdrop-blur-md text-white text-[10px] font-bold">
                          {m.horsepower} HP • {m.category}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-secondary">
                          ★ {m.rating}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <h3 className="font-headline font-bold text-sm text-on-surface line-clamp-1">
                            {m.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                            {m.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-outline uppercase font-bold block">Rate</span>
                            <span className="font-headline font-bold text-base text-primary">
                              ₹{m.pricePerDay}<span className="text-xs font-normal">/day</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenChat(m.ownerId, m.ownerName, m.title)}
                              className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface"
                              title="Chat with owner"
                            >
                              <span className="material-symbols-outlined text-[16px]">chat</span>
                            </button>
                            <button
                              onClick={() => handleOpenBooking(m, "MACHINERY")}
                              className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INTEGRATED INTERACTIVE MAP VIEW */}
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight">
                    Cluster Telematics & Live Field Map
                  </h2>
                  <button
                    onClick={() => setActiveTab("nearby")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Open Fullscreen Radar →
                  </button>
                </div>

                <GoogleMapView
                  machinery={machinery}
                  seeds={seeds}
                  labour={labour}
                  operators={operators}
                  onBookResource={handleOpenBooking}
                  onContactResource={(r, t) => handleOpenChat(r.ownerId || r.sellerId || "support@agrishare.com", r.ownerName || r.sellerName || "AgriRent Dispatch", r.title || r.name || `${t} inquiry`)}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MACHINERY MARKETPLACE */}
        {activeTab === "machinery" && (
          <MachineryMarketplace
            onBook={(m) => handleOpenBooking(m, "MACHINERY")}
            onContact={(m) => handleOpenChat(m.ownerId, m.ownerName, m.title)}
          />
        )}

        {/* VIEW 3: SEEDS MARKETPLACE */}
        {activeTab === "seeds" && (
          <SeedsMarketplace
            onOrder={(s) => handleOpenBooking(s, "SEEDS")}
            onContact={(s) => handleOpenChat(s.sellerId, s.sellerName, s.name)}
          />
        )}

        {/* VIEW 4: LABOUR & OPERATOR MARKETPLACE */}
        {activeTab === "labour" && (
          <LabourMarketplace
            onHireLabour={(l) => handleOpenBooking(l, "LABOUR")}
            onHireOperator={(o) => handleOpenBooking(o, "OPERATOR")}
            onContact={(person, type) => handleOpenChat("support@agrishare.com", "AgriRent Dispatch", `${type} hire inquiry: ${person.fullName}`)}
          />
        )}

        {/* VIEW 5: SHARE EQUIPMENT FORM */}
        {activeTab === "share" && (
          <ShareEquipmentForm
            onSuccess={() => {
              loadData();
              setActiveTab("machinery");
            }}
          />
        )}

        {/* VIEW 6: AI CROP ASSISTANT */}
        {activeTab === "ai-assistant" && (
          <AiAssistantView onBookMachinery={() => setActiveTab("machinery")} />
        )}

        {/* VIEW 7: FULLSCREEN FIELD MAP */}
        {activeTab === "nearby" && (
          <div className="max-w-[1540px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-4">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                Geospatial Agricultural Hub
              </span>
              <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                Live Field Radar & Nearby Equipment Locator
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Visualizing machinery, certified seeds, labour crews, and operators with GPS telematics across Nizamabad agro-zone.
              </p>
            </div>
            <GoogleMapView
              machinery={machinery}
              seeds={seeds}
              labour={labour}
              operators={operators}
              onBookResource={handleOpenBooking}
              onContactResource={(r, t) => handleOpenChat(r.ownerId || r.sellerId || "support@agrishare.com", r.ownerName || r.sellerName || "AgriRent Dispatch", r.title || r.name || `${t} inquiry`)}
            />
          </div>
        )}

        {/* VIEW 8: MY BOOKINGS */}
        {activeTab === "my-bookings" && (
          <MyBookingsView
            onOpenReview={handleOpenReview}
            onOpenChat={handleOpenChat}
          />
        )}

        {/* VIEW 9: ADMIN PORTAL */}
        {activeTab === "admin" && (
          role === "ROLE_ADMIN" ? (
            <AdminPortal />
          ) : (
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-error-container text-error flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <h2 className="font-headline font-bold text-xl text-on-surface">Admin Access Restricted</h2>
              <p className="text-xs text-on-surface-variant max-w-md mt-2 mb-6">
                You must be authenticated with verified platform administrator credentials to view the Admin Operations Console.
              </p>
              <button
                onClick={() => setActiveTab("auth")}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary-container transition-all"
              >
                Sign In with Authorized Account
              </button>
            </div>
          )
        )}

        {/* VIEW 10: AUTH VIEW */}
        {activeTab === "auth" && (
          <AuthView
            onSuccess={() => {
              loadData();
              setActiveTab("home");
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer onNavigate={setActiveTab} />

      {/* BOOKING MODAL */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        resource={selectedBookingResource}
        resourceType={selectedResourceType}
        onSuccess={() => loadData()}
      />

      {/* REAL-TIME CHAT MODAL */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        defaultPeerId={chatPeer.id}
        defaultPeerName={chatPeer.name}
        defaultResourceTitle={chatPeer.title}
      />

      {/* RATINGS & REVIEWS MODAL */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        bookingId={reviewTarget.bookingId}
        targetType={reviewTarget.type}
        targetId={reviewTarget.id}
        targetTitle={reviewTarget.title}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
