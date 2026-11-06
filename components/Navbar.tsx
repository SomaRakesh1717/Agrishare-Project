"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenChat?: (peerId?: string, peerName?: string, resourceTitle?: string) => void;
}

export default function Navbar({ activeTab = "home", onTabChange, onOpenChat }: NavbarProps) {
  const { user, role, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [language, setLanguage] = useState("EN");

  const navItems = [
    { id: "home", label: "Home" },
    { id: "machinery", label: "Machinery" },
    { id: "share", label: "Share" },
    { id: "labour", label: "Labour" },
    { id: "seeds", label: "Seeds" },
    { id: "ai-assistant", label: "AI Assistant" },
    { id: "nearby", label: "Nearby Map" },
    { id: "my-bookings", label: "My Bookings" },
    ...(role === "ROLE_ADMIN" ? [{ id: "admin", label: "Admin Portal" }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f9f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="h-20 w-full px-4 sm:px-8 max-w-[1540px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Cluster Location */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onTabChange?.("home")}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <img
              src="/agrishare-logo.svg"
              alt="AgriShare"
              className="h-10 w-auto object-contain"
            />
          </button>

          <div className="hidden xl:flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-full text-on-surface text-xs font-medium border border-outline-variant/30">
            <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
            <span>{user?.address || "Nizamabad, Telangana"}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary-container text-white font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-medium"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Profile Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Selector */}
          <div className="hidden sm:flex items-center bg-surface-container px-2.5 py-1 rounded-lg text-xs font-semibold gap-1 text-on-surface border border-outline-variant/20">
            <button
              onClick={() => setLanguage("EN")}
              className={`${language === "EN" ? "text-primary font-bold" : "hover:text-primary"}`}
            >
              EN
            </button>
            <span className="text-outline">|</span>
            <button
              onClick={() => setLanguage("TE")}
              className={`${language === "TE" ? "text-primary font-bold" : "hover:text-primary"}`}
            >
              తె
            </button>
            <span className="text-outline">|</span>
            <button
              onClick={() => setLanguage("HI")}
              className={`${language === "HI" ? "text-primary font-bold" : "hover:text-primary"}`}
            >
              हिन्दी
            </button>
          </div>

          {/* Quick Chat Launcher */}
          <button
            onClick={() => onOpenChat?.()}
            title="Open Real-time Chat"
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          {/* User Profile & Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-container transition-colors text-left"
            >
              <img
                alt="Profile Avatar"
                className="w-9 h-9 rounded-full object-cover border border-primary/20 shadow-sm"
                src={user?.avatarUrl || "/farmer-hero.png"}
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-on-surface leading-tight">
                  {user?.name || "Guest Farmer"}
                </span>
                <span className="text-[10px] font-semibold text-secondary leading-none">
                  {role === "ROLE_ADMIN" ? "Platform Admin" : user ? "Verified Farmer" : "Not Signed In"}
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-outline">
                expand_more
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container p-3 z-50">
                <div className="p-2 border-b border-surface-container mb-2">
                  <p className="text-xs font-bold text-on-surface">{user?.name || "Guest Account"}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{user?.email || "Click below to sign in"}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold">
                    {role === "ROLE_ADMIN" ? "Admin Account" : user ? "Farmer Account" : "Guest"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {role === "ROLE_ADMIN" ? (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onTabChange?.("admin");
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg text-left text-xs bg-primary-fixed text-primary font-bold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      <div>
                        <div className="font-semibold">Admin Portal</div>
                        <div className="text-[10px] text-on-surface-variant font-normal">Manage machinery, seeds, labour</div>
                      </div>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenChat?.();
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg text-left text-xs hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-primary text-[18px]">support_agent</span>
                        <div>
                          <div className="font-semibold text-on-surface">Field Support Desk</div>
                          <div className="text-[10px] text-on-surface-variant">Inquire about equipment, seeds or dispatch</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onTabChange?.("my-bookings");
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg text-left text-xs hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-secondary text-[18px]">receipt_long</span>
                        <div>
                          <div className="font-semibold text-on-surface">My Bookings</div>
                          <div className="text-[10px] text-on-surface-variant">View order receipts and dispatch status</div>
                        </div>
                      </button>
                    </>
                  )}
                </div>

                <div className="border-t border-surface-container mt-2 pt-2">
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        onTabChange?.("auth");
                      }}
                      className="flex items-center gap-2 w-full p-2 text-left text-xs text-error hover:bg-error-container/20 rounded-lg transition-colors font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onTabChange?.("auth");
                      }}
                      className="flex items-center gap-2 w-full p-2 text-left text-xs text-primary hover:bg-primary-container/20 rounded-lg transition-colors font-bold"
                    >
                      <span className="material-symbols-outlined text-[18px]">login</span>
                      Sign In / Register
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Subnav Strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-surface-container-low border-t border-surface-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? "bg-primary text-white font-bold"
                : "bg-surface-container text-on-surface"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
