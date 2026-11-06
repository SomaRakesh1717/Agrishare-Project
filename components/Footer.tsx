"use client";

import React from "react";

export default function Footer({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  return (
    <footer className="w-full bg-[#121c2c] text-white pt-12 pb-8 border-t border-surface-container mt-16">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-8 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-sm inline-flex items-center">
                <img
                  src="/agrishare-logo.svg"
                  alt="AgriShare"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
              Empowering local Indian fields with shared machinery, verified operators, skilled field crews, and certified seed access. Zero idle equipment, zero exploitation.
            </p>
            <div className="flex items-center gap-2 text-xs text-primary-fixed bg-primary-container/40 px-3 py-2 rounded-xl self-start">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
              Supported by Telangana Agricultural Innovation Mission
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline font-semibold text-sm text-secondary-fixed uppercase tracking-wider">
              Marketplace
            </h4>
            <button onClick={() => onNavigate?.("machinery")} className="text-sm text-gray-300 hover:text-white text-left transition-colors">
              Machinery & Tractors
            </button>
            <button onClick={() => onNavigate?.("seeds")} className="text-sm text-gray-300 hover:text-white text-left transition-colors">
              Certified Seeds
            </button>
            <button onClick={() => onNavigate?.("labour")} className="text-sm text-gray-300 hover:text-white text-left transition-colors">
              Skilled Farm Labour
            </button>
            <button onClick={() => onNavigate?.("labour")} className="text-sm text-gray-300 hover:text-white text-left transition-colors">
              Tractor Operators
            </button>
            <button onClick={() => onNavigate?.("share")} className="text-sm text-gray-300 hover:text-white text-left transition-colors">
              List Your Assets
            </button>
          </div>

          {/* Technology & Agronomy */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline font-semibold text-sm text-secondary-fixed uppercase tracking-wider">
              Smart Farming
            </h4>
            <button onClick={() => onNavigate?.("ai-assistant")} className="text-sm text-gray-300 hover:text-white text-left transition-colors">
              AI Crop Assistant
            </button>
            <button onClick={() => onNavigate?.("nearby")} className="text-sm text-gray-300 hover:text-white text-left transition-colors">
              Live Field Radar
            </button>
            <button onClick={() => onNavigate?.("my-bookings")} className="text-sm text-gray-300 hover:text-white text-left transition-colors">
              Booking History
            </button>
            <span className="text-sm text-gray-400">Weather & Soil Sensors</span>
            <span className="text-sm text-gray-400">GPS Fleet Tracking</span>
          </div>

          {/* Helpline & Support */}
          <div className="flex flex-col gap-3">
            <h4 className="font-headline font-semibold text-sm text-secondary-fixed uppercase tracking-wider">
              Farmer Helpline
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">call</span>
              <span>1800-425-AGRI (Toll Free)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">mail</span>
              <span>support@agrishare.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">pin_drop</span>
              <span>Nizamabad Depot #4, Telangana</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 AgriRent Platform. All agricultural sharing agreements verified and insured.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Rental</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
