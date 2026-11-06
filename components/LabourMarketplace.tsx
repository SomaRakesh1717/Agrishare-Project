"use client";

import React, { useEffect, useState } from "react";
import { api, Labour, Operator } from "@/lib/api";

interface LabourMarketplaceProps {
  onHireLabour: (labour: Labour) => void;
  onHireOperator: (operator: Operator) => void;
  onContact: (person: any, type: string) => void;
}

export default function LabourMarketplace({
  onHireLabour,
  onHireOperator,
  onContact,
}: LabourMarketplaceProps) {
  const [subTab, setSubTab] = useState<"LABOUR" | "OPERATORS">("LABOUR");
  const [labour, setLabour] = useState<Labour[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [loading, setLoading] = useState(true);

  const skillsList = [
    "All",
    "Harvesting",
    "Sowing",
    "Weeding",
    "Irrigation",
    "Spraying",
    "Ploughing",
    "General farm work",
  ];

  const expertiseList = [
    "All",
    "Tractor",
    "Combine Harvester",
    "Rotavator",
    "Boom Sprayer",
    "Laser Land Leveller",
    "Seed Drill",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (subTab === "LABOUR") {
        const data = await api.labour.getAll({
          search: search.trim() || undefined,
          skill: selectedSkill !== "All" ? selectedSkill : undefined,
        });
        setLabour(data);
      } else {
        const data = await api.operators.getAll({
          search: search.trim() || undefined,
          expertise: selectedSkill !== "All" ? selectedSkill : undefined,
        });
        setOperators(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subTab, selectedSkill]);

  return (
    <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-surface-container">
        <div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
            Verified Rural Workforce
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Skilled Farm Labour & Certified Operators
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Hire verified transplanting & harvesting crews or licensed heavy machinery drivers for timely field operations.
          </p>
        </div>

        {/* Toggle between Labour and Operators */}
        <div className="flex items-center bg-surface-container p-1 rounded-2xl border border-surface-container">
          <button
            onClick={() => {
              setSubTab("LABOUR");
              setSelectedSkill("All");
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "LABOUR"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            <span>Labour Crews</span>
          </button>
          <button
            onClick={() => {
              setSubTab("OPERATORS");
              setSelectedSkill("All");
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "OPERATORS"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">engineering</span>
            <span>Machinery Operators</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData();
          }}
          className="flex items-center gap-3"
        >
          <div className="flex-1 flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container focus-within:ring-2 focus-within:ring-primary">
            <span className="material-symbols-outlined text-outline text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                subTab === "LABOUR"
                  ? "Search crews by skill, village, or leader name..."
                  : "Search operators by machine expertise, license or name..."
              }
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

        {/* Skill / Expertise Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {(subTab === "LABOUR" ? skillsList : expertiseList).map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSkill === sk
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Stream */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-outline gap-3">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-semibold">Loading workforce directory...</span>
        </div>
      ) : subTab === "LABOUR" ? (
        /* Labour Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labour.map((l) => (
            <div
              key={l.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3.5">
                <img
                  alt={l.fullName}
                  src={l.avatarUrl || "/farmer-hero.png"}
                  className="w-14 h-14 rounded-2xl object-cover border border-surface-container shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-bold text-base text-on-surface truncate">
                      {l.fullName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-secondary">
                      <span>★</span>
                      <span>{l.rating}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-secondary block">
                    {l.crewSize} Member Crew • {l.experienceYears} Years Exp.
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-outline mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                    <span>{l.city}, {l.state}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-2">
                {l.bio}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {l.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-outline block uppercase font-bold">Daily Wage</span>
                  <span className="font-headline font-bold text-base text-primary">
                    ₹{l.dailyWage}
                    <span className="text-xs font-normal text-on-surface-variant">/day/person</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onContact(l, "LABOUR")}
                    className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface"
                    title="Chat with crew lead"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </button>
                  <button
                    onClick={() => onHireLabour(l)}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                    <span>Hire Crew</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Operators Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operators.map((o) => (
            <div
              key={o.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3.5">
                <img
                  alt={o.fullName}
                  src={o.avatarUrl || "/farmer-hero.png"}
                  className="w-14 h-14 rounded-2xl object-cover border border-surface-container shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-bold text-base text-on-surface truncate">
                      {o.fullName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-secondary">
                      <span>★</span>
                      <span>{o.rating}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 block">
                    Certified Operator • {o.experienceYears} Years Exp.
                  </span>
                  <span className="text-[10px] font-mono text-outline block">
                    Badge: {o.licenseNumber}
                  </span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-2">
                {o.bio}
              </p>

              {/* Machinery Expertise Badges */}
              <div className="flex flex-wrap gap-1.5">
                {o.machineryExpertise.map((exp) => (
                  <span
                    key={exp}
                    className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200"
                  >
                    🚜 {exp}
                  </span>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-outline block uppercase font-bold">Daily Wage</span>
                  <span className="font-headline font-bold text-base text-primary">
                    ₹{o.dailyWage}
                    <span className="text-xs font-normal text-on-surface-variant">/day</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onContact(o, "OPERATOR")}
                    className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface"
                    title="Chat with operator"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </button>
                  <button
                    onClick={() => onHireOperator(o)}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">engineering</span>
                    <span>Hire Driver</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
