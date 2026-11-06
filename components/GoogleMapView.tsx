"use client";

import React, { useEffect, useRef, useState } from "react";
import { Machinery, Seed, Labour, Operator } from "@/lib/api";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleMapViewProps {
  machinery?: Machinery[];
  seeds?: Seed[];
  labour?: Labour[];
  operators?: Operator[];
  onSelectResource?: (resource: any, type: any) => void;
  onBookResource?: (resource: any, type: any) => void;
  onContactResource?: (resource: any, type: any) => void;
  onLocationSelect?: (lat: number, lon: number, address: string) => void;
  interactiveSelect?: boolean;
}

export default function GoogleMapView({
  machinery = [],
  seeds = [],
  labour = [],
  operators = [],
  onSelectResource,
  onBookResource,
  onContactResource,
  onLocationSelect,
  interactiveSelect = false,
}: GoogleMapViewProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 18.6725,
    lng: 78.0941, // Nizamabad default
  });
  const [hasPermission, setHasPermission] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<{ item: any; type: string } | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(30);
  const [mapKey, setMapKey] = useState<string>(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Geolocation request
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setHasPermission(true);
          onLocationSelect?.(loc.lat, loc.lng, "Current GPS Location");
          if (googleMapInstance.current) {
            googleMapInstance.current.setCenter(loc);
            googleMapInstance.current.setZoom(13);
          }
        },
        (err) => {
          console.warn("Geolocation permission error or declined:", err.message);
          setHasPermission(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  useEffect(() => {
    // Attempt to load Google Maps SDK if key exists
    if (mapKey && !window.google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleLoaded(true);
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      setGoogleLoaded(true);
    }
  }, [mapKey]);

  // Init Google Map if available
  useEffect(() => {
    if (googleLoaded && mapContainerRef.current && window.google?.maps) {
      const center = userLocation || { lat: 18.6725, lng: 78.0941 };
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
      googleMapInstance.current = map;

      // Click to pick location
      if (interactiveSelect) {
        map.addListener("click", (e: any) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setUserLocation({ lat, lng });
          onLocationSelect?.(lat, lng, `Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`);
        });
      }

      // Add user marker
      new window.google.maps.Marker({
        position: center,
        map,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: "#1b5e20",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });
    }
  }, [googleLoaded, interactiveSelect]);

  // Consolidate resource markers
  const allMarkers: Array<{ id: string; title: string; type: string; lat: number; lng: number; price: string; rating: number; item: any }> = [];

  if (activeCategory === "ALL" || activeCategory === "MACHINERY") {
    machinery.forEach((m) => {
      if (m.latitude && m.longitude) {
        allMarkers.push({
          id: m.id,
          title: m.title,
          type: "MACHINERY",
          lat: m.latitude,
          lng: m.longitude,
          price: `₹${m.pricePerDay}/day`,
          rating: m.rating,
          item: m,
        });
      }
    });
  }

  if (activeCategory === "ALL" || activeCategory === "SEEDS") {
    seeds.forEach((s) => {
      if (s.latitude && s.longitude) {
        allMarkers.push({
          id: s.id,
          title: `${s.name} (${s.variety})`,
          type: "SEEDS",
          lat: s.latitude,
          lng: s.longitude,
          price: `₹${s.pricePerKg}/kg`,
          rating: s.rating,
          item: s,
        });
      }
    });
  }

  if (activeCategory === "ALL" || activeCategory === "LABOUR") {
    labour.forEach((l) => {
      if (l.latitude && l.longitude) {
        allMarkers.push({
          id: l.id,
          title: `${l.fullName} (Crew of ${l.crewSize})`,
          type: "LABOUR",
          lat: l.latitude,
          lng: l.longitude,
          price: `₹${l.dailyWage}/day`,
          rating: l.rating,
          item: l,
        });
      }
    });
  }

  if (activeCategory === "ALL" || activeCategory === "OPERATORS") {
    operators.forEach((o) => {
      if (o.latitude && o.longitude) {
        allMarkers.push({
          id: o.id,
          title: `${o.fullName} (Operator)`,
          type: "OPERATOR",
          lat: o.latitude,
          lng: o.longitude,
          price: `₹${o.dailyWage}/day`,
          rating: o.rating,
          item: o,
        });
      }
    });
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "MACHINERY":
        return "#1b5e20";
      case "SEEDS":
        return "#064516";
      case "LABOUR":
        return "#c07d38";
      case "OPERATOR":
      case "OPERATORS":
        return "#2563eb";
      default:
        return "#1b5e20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "MACHINERY":
        return "agriculture";
      case "SEEDS":
        return "potted_plant";
      case "LABOUR":
        return "groups";
      case "OPERATOR":
      case "OPERATORS":
        return "engineering";
      default:
        return "location_on";
    }
  };

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container overflow-hidden flex flex-col">
      {/* Top Map Control Bar */}
      <div className="p-4 bg-surface-container-low border-b border-surface-container flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">map</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm text-on-surface">
              Interactive Agricultural Field Radar
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              Live telematics & verified providers around Nizamabad cluster
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "MACHINERY", "SEEDS", "LABOUR", "OPERATORS"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {cat === "ALL" ? "All Resources" : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Location & Radius */}
        <div className="flex items-center gap-2">
          <button
            onClick={requestLocation}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              hasPermission
                ? "bg-primary-fixed text-primary border border-primary/20"
                : "bg-primary text-white hover:bg-primary-container"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">my_location</span>
            {hasPermission ? "GPS Active" : "Allow My Location"}
          </button>

          <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1.5 rounded-xl text-xs text-on-surface">
            <span className="text-secondary font-bold">Radius:</span>
            <span>{searchRadiusKm} km</span>
          </div>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="relative w-full h-[520px] bg-[#eef3ea] overflow-hidden flex items-center justify-center">
        {googleLoaded && mapKey ? (
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          /* High-Fidelity Interactive Map Canvas */
          <div className="relative w-full h-full select-none cursor-crosshair overflow-hidden">
            {/* Map Grid and Field Background */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#1b5e20 1px, transparent 1px), radial-gradient(#8a510c 1px, #eef3ea 1px)",
                backgroundSize: "40px 40px",
                backgroundPosition: "0 0, 20px 20px",
              }}
            />

            {/* Simulated Waterway & Agricultural Blocks */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M -50 260 Q 200 220 400 300 T 900 240 T 1400 290"
                fill="none"
                stroke="#90caf9"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M -50 260 Q 200 220 400 300 T 900 240 T 1400 290"
                fill="none"
                stroke="#64b5f6"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Radar Rings from User Location */}
              <circle cx="50%" cy="50%" r="90" fill="none" stroke="#1b5e20" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="50%" cy="50%" r="180" fill="none" stroke="#1b5e20" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <circle cx="50%" cy="50%" r="280" fill="none" stroke="#1b5e20" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
            </svg>

            {/* Center User Location Pulse Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-30">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-75"></span>
                <div className="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[14px]">person_pin_circle</span>
                </div>
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-primary-container text-white text-[10px] font-bold shadow">
                Your Field
              </span>
            </div>

            {/* Interactive Markers scattered relative to Nizamabad Cluster */}
            {allMarkers.map((marker, index) => {
              // Convert lat/lng delta to percentage offset for visual projection
              const baseLat = 18.6725;
              const baseLng = 78.0941;
              const latDelta = (marker.lat - baseLat) * 800;
              const lngDelta = (marker.lng - baseLng) * 800;
              const topPercent = Math.max(10, Math.min(85, 50 - latDelta));
              const leftPercent = Math.max(10, Math.min(88, 50 + lngDelta));

              const isSelected = selectedItem?.item?.id === marker.id;

              return (
                <div
                  key={marker.id}
                  onClick={() => {
                    setSelectedItem({ item: marker.item, type: marker.type });
                    onSelectResource?.(marker.item, marker.type);
                  }}
                  style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 group"
                >
                  <div
                    style={{ backgroundColor: getTypeColor(marker.type) }}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md border-2 ${
                      isSelected ? "border-white scale-125 ring-4 ring-primary-fixed" : "border-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {getTypeIcon(marker.type)}
                    </span>
                  </div>

                  {/* Marker Tooltip on Hover */}
                  <div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#121c2c] text-white text-[11px] font-medium py-1 px-2.5 rounded-lg whitespace-nowrap shadow-xl flex-col items-center pointer-events-none z-40">
                    <span className="font-bold">{marker.title}</span>
                    <span className="text-secondary-fixed">{marker.price} • ★ {marker.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Resource Popover Card */}
        {selectedItem && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:w-96 bg-surface-container-lowest rounded-2xl p-4 shadow-2xl border border-surface-container z-40 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: getTypeColor(selectedItem.type) }}
                  className="w-3 h-3 rounded-full shrink-0"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                  {selectedItem.type}
                </span>
                <span className="text-xs text-outline">•</span>
                <span className="text-[11px] font-semibold text-secondary">
                  ★ {selectedItem.item.rating || 4.9}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-6 h-6 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <h4 className="font-headline font-bold text-sm text-on-surface line-clamp-1">
              {selectedItem.item.title || selectedItem.item.name || selectedItem.item.fullName}
            </h4>

            <p className="text-xs text-on-surface-variant line-clamp-2">
              {selectedItem.item.description || selectedItem.item.bio || selectedItem.item.variety}
            </p>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-container">
              <div>
                <span className="text-[10px] text-outline block">Price / Wage</span>
                <span className="font-bold text-primary text-sm">
                  {selectedItem.item.pricePerDay
                    ? `₹${selectedItem.item.pricePerDay}/day`
                    : selectedItem.item.pricePerKg
                    ? `₹${selectedItem.item.pricePerKg}/kg`
                    : `₹${selectedItem.item.dailyWage}/day`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onContactResource?.(selectedItem.item, selectedItem.type)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  Chat
                </button>
                <button
                  onClick={() => onBookResource?.(selectedItem.item, selectedItem.type)}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 bg-surface-container-low border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]" />
            <span>Machinery ({machinery.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#064516]" />
            <span>Seeds ({seeds.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c07d38]" />
            <span>Labour Crews ({labour.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
            <span>Operators ({operators.length})</span>
          </div>
        </div>
        <span className="text-[11px] text-outline">
          Showing resources within Nizamabad, Bodhan, Armoor & Kamareddy circles
        </span>
      </div>
    </div>
  );
}
