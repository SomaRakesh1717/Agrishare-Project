"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthView({ onSuccess }: { onSuccess?: () => void }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("Nizamabad, Telangana");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          phone,
          address,
          role: "ROLE_FARMER",
        });
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[640px]">
        {/* Left Column: Storytelling from Stitch auth.html */}
        <div className="lg:col-span-5 rounded-3xl bg-primary text-white p-8 lg:p-12 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary-fixed/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[24px]">agriculture</span>
              </div>
              <span className="font-headline font-bold text-2xl tracking-tight text-white">
                AgriRent
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-fixed">
                Sustainable Agronomic Mobility
              </span>
              <h2 className="font-headline text-3xl lg:text-4xl font-extrabold leading-tight text-white">
                Empowering <br />
                <span className="text-secondary-fixed">Local Fields</span> Together.
              </h2>
              <p className="text-xs sm:text-sm text-surface-variant/90 max-w-sm mt-2 leading-relaxed">
                Access modern harvesters, smart seed drills, and verified equipment directly from community farms without steep upfront capital.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[20px] text-primary-fixed">agriculture</span>
                <span className="text-xs text-white">Verified telematics machinery from neighbors</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[20px] text-secondary-fixed">currency_rupee</span>
                <span className="text-xs text-white">Zero commission middle layers & fair daily pricing</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[20px] text-primary-fixed">psychology</span>
                <span className="text-xs text-white">Built-in AI Crop Doctor & agronomy advisor</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-white/60 pt-6">
            Protected with BCrypt password hashing & JWT 256-bit cryptography.
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 sm:p-10 border border-surface-container shadow-sm flex flex-col justify-between gap-6">
          <div>
            {/* Tab switch: Sign In vs Register */}
            <div className="flex items-center gap-2 border-b border-surface-container pb-3 mb-5">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`font-headline text-base font-bold pb-1 transition-colors ${
                  isLogin ? "text-primary border-b-2 border-primary" : "text-outline hover:text-on-surface"
                }`}
              >
                Sign In to Account
              </button>
              <span className="text-outline">|</span>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`font-headline text-base font-bold pb-1 transition-colors ${
                  !isLogin ? "text-primary border-b-2 border-primary" : "text-outline hover:text-on-surface"
                }`}
              >
                Create New Account
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-error-container text-error text-xs flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98480 12345"
                        className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-on-surface-variant uppercase block mb-1">
                      Field / Village Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Nizamabad, Telangana"
                      className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">
                  Password
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>{isLogin ? "Sign In Securely" : "Create Verified Account"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
