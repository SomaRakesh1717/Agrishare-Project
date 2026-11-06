"use client";

import React, { useEffect, useState } from "react";
import { api, User, Machinery, Seed, Labour, Operator, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminPortal() {
  const { user, role } = useAuth();

  const [stats, setStats] = useState<any>({
    totalUsers: 3,
    totalMachinery: 13,
    totalSeeds: 12,
    totalLabour: 6,
    totalOperators: 6,
    totalBookings: 1,
  });

  const [activeTab, setActiveTab] = useState<"overview" | "machinery" | "seeds" | "labour" | "operators" | "bookings" | "users">("overview");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [machineryList, setMachineryList] = useState<Machinery[]>([]);
  const [seedsList, setSeedsList] = useState<Seed[]>([]);
  const [labourList, setLabourList] = useState<Labour[]>([]);
  const [operatorsList, setOperatorsList] = useState<Operator[]>([]);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [notification, setNotification] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals for Add Forms
  const [showAddModal, setShowAddModal] = useState<"MACHINERY" | "SEEDS" | "LABOUR" | "OPERATOR" | null>(null);

  // Form states
  const [mForm, setMForm] = useState({
    title: "",
    category: "Tractors",
    horsepower: 50,
    fuelType: "Diesel",
    workingWidth: "2.4 m",
    pricePerDay: 2500,
    pricePerHour: 350,
    address: "Nizamabad Rural, Telangana",
    city: "Nizamabad",
    state: "Telangana",
    description: "",
    images: "https://lh3.googleusercontent.com/aida-public/AB6AXuB15P_70TIaXjHUnSrSCTlyLn7A5ZL1xD_WPbLXawrSTrTzoaHuf91DmmBu3xX3BiGxFcxbbvOIWBIEXcz5Bb2sWX0VqO7uY-E-Ln4QyWD7D0SMBiPWEIDI8B5mU3VZIO5bfzqMIWXorAwUzl56nM1xPZPPtX8G3_7hP-943uSR-NbRWUq14RD8tii_TqiIEEB3ibAZBsI0sL1t6DThm4FT4jg3GjIRqVzHSYSYouw1X-8IkETK7c0y",
  });

  const [sForm, setSForm] = useState({
    name: "",
    cropType: "Rice",
    variety: "",
    pricePerKg: 75,
    stockKg: 1000,
    germinationRate: 95,
    maturityDays: 120,
    packageSize: "25 kg Bag",
    address: "Nizamabad Seed Hub, Telangana",
    city: "Nizamabad",
    state: "Telangana",
    description: "",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7FRiIFe1rMsm62a4cba8b-n6yUe08iU17qY7a7s8d9f0g1h2j3k4",
  });

  const [lForm, setLForm] = useState({
    fullName: "",
    skills: "Harvesting, Weeding",
    dailyWage: 550,
    experienceYears: 10,
    crewSize: 8,
    gender: "Mixed Crew",
    address: "Armoor, Nizamabad, Telangana",
    city: "Armoor",
    state: "Telangana",
    contactPhone: "+91 98481 00000",
    bio: "",
  });

  const [oForm, setOForm] = useState({
    fullName: "",
    machineryExpertise: "Tractor, Rotavator, MB Plough",
    dailyWage: 950,
    experienceYears: 8,
    licenseNumber: "TS-16-OP-2024-001",
    address: "Bodhan, Nizamabad, Telangana",
    city: "Bodhan",
    state: "Telangana",
    contactPhone: "+91 98482 00000",
    bio: "",
  });

  const loadAllData = async () => {
    try {
      const [s, u, m, sd, l, o, b] = await Promise.all([
        api.admin.getStats().catch(() => ({})),
        api.admin.getUsers().catch(() => []),
        api.machinery.getAll().catch(() => []),
        api.seeds.getAll().catch(() => []),
        api.labour.getAll().catch(() => []),
        api.operators.getAll().catch(() => []),
        api.bookings.getAll().catch(() => []),
      ]);

      if (s && Object.keys(s).length > 0) setStats(s);
      setUsersList(u);
      setMachineryList(m);
      setSeedsList(sd);
      setLabourList(l);
      setOperatorsList(o);
      setBookingsList(b);
    } catch (e) {
      console.error("Admin data load error", e);
    }
  };

  useEffect(() => {
    if (role === "ROLE_ADMIN") {
      loadAllData();
    }
  }, [role]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // Export platform audit log as JSON download
  const exportAuditLog = () => {
    const auditData = {
      exportedAt: new Date().toISOString(),
      cluster: "Nizamabad Co-op Depot #4",
      operationalCycle: "Operational Cycle '26",
      telemetryStatus: "Active Telematics Stream",
      stats: {
        totalFarmers: stats.totalUsers || usersList.length,
        activeMachinery: stats.totalMachinery || machineryList.length,
        activeBookings: stats.totalBookings || bookingsList.length,
        labourProviders: stats.totalLabour || labourList.length,
        seedListings: stats.totalSeeds || seedsList.length,
        operators: stats.totalOperators || operatorsList.length,
      },
      machinery: machineryList.map((m) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        horsepower: m.horsepower,
        pricePerDay: m.pricePerDay,
        available: m.available,
        location: `${m.city}, ${m.state}`,
      })),
      seeds: seedsList.map((s) => ({
        id: s.id,
        name: s.name,
        cropType: s.cropType,
        variety: s.variety,
        pricePerKg: s.pricePerKg,
        stockKg: s.stockKg,
        germinationRate: s.germinationRate,
      })),
      labour: labourList.map((l) => ({
        id: l.id,
        fullName: l.fullName,
        skills: l.skills,
        crewSize: l.crewSize,
        dailyWage: l.dailyWage,
        available: l.available,
      })),
      operators: operatorsList.map((o) => ({
        id: o.id,
        fullName: o.fullName,
        machineryExpertise: o.machineryExpertise,
        licenseNumber: o.licenseNumber,
        dailyWage: o.dailyWage,
        available: o.available,
      })),
      bookings: bookingsList.map((b) => ({
        bookingNumber: b.bookingNumber,
        resourceTitle: b.resourceTitle,
        bookedBy: b.bookedByUserName,
        dates: `${b.startDate} to ${b.endDate}`,
        totalPrice: b.totalPrice,
        status: b.status,
      })),
      users: usersList.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agrishare-regional-audit-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Platform Audit Log generated and downloaded.");
  };

  // Add Machinery Submit
  const handleAddMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.machinery.create({
        ...mForm,
        latitude: 18.6725,
        longitude: 78.0941,
        images: [mForm.images],
        available: true,
      });
      showToast("Machinery item added to MongoDB successfully!");
      setShowAddModal(null);
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Add Seeds Submit
  const handleAddSeeds = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.seeds.create({
        ...sForm,
        latitude: 18.6725,
        longitude: 78.0941,
        available: true,
      });
      showToast("Seed variety cataloged in MongoDB successfully!");
      setShowAddModal(null);
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Add Labour Submit
  const handleAddLabour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.labour.create({
        ...lForm,
        skills: lForm.skills.split(",").map((s) => s.trim()),
        latitude: 18.6725,
        longitude: 78.0941,
        avatarUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBaWtx0LXnvtyDcEUDwPKVOyoMFtuft-eTmXcjgbamUUvOAmh27SXlbk1kOpi1XtjJIsd6BKCNy9crq8r0p4tN-3KKEqJXjVgvQR3AATdRFgexx0clfy-to6Of2O_-pFoNT3bos5Q858wNmrRfVHdKG8GpuXnvsm_ZIkhuIsTdNITH5nJbhX0u18XI1itJIMVb1ntnkKzH3y5TMSGoqB5GPa82cpRXzP9CaCKEE0e6XB57SQq_9q9_1",
        available: true,
      });
      showToast("Labour crew profile registered in MongoDB!");
      setShowAddModal(null);
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Add Operator Submit
  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.operators.create({
        ...oForm,
        machineryExpertise: oForm.machineryExpertise.split(",").map((s) => s.trim()),
        latitude: 18.6725,
        longitude: 78.0941,
        avatarUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCYm_A7Xzl9jJeovt579j7wrfvyTU3Tijoc1BevMTqaz61OZ9kBGZW6O73enQ506wJmPOWMIc3s3mVnjmj0yc0zB0T4YchhBL-iFywbKwPnONGWTa-lSykH3X7hUEnYt9bXmt21dm9QKUV9RVlFZG5PpQQDN8AtRwhcBq42wkX3L3suRqp8T-SUj5B5G198zt8qPdkCWswXHCU0PjTu0XTcT7t8i9PV3ilkMIK9PYQAARs0z1dRU9UZ",
        available: true,
      });
      showToast("Machinery operator certified and saved in MongoDB!");
      setShowAddModal(null);
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Status update
  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      await api.bookings.updateStatus(bookingId, status);
      showToast(`Booking status updated to ${status}`);
      loadAllData();
    } catch (e: any) {
      alert("Error updating status: " + e.message);
    }
  };

  // Toggle Resource Availability
  const handleToggleAvailability = async (type: "machinery" | "seeds" | "labour" | "operator", item: any) => {
    try {
      const newStatus = !item.available;
      if (type === "machinery") await api.machinery.update(item.id, { available: newStatus });
      if (type === "seeds") await api.seeds.update(item.id, { available: newStatus });
      if (type === "labour") await api.labour.update(item.id, { available: newStatus });
      if (type === "operator") await api.operators.update(item.id, { available: newStatus });
      showToast(`Status updated to: ${newStatus ? "Available" : "In-Field / Reserved"}`);
      loadAllData();
    } catch (e: any) {
      alert("Error toggling status: " + e.message);
    }
  };

  // Delete Resource
  const handleDeleteResource = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      if (type === "machinery") await api.machinery.delete(id);
      if (type === "seeds") await api.seeds.delete(id);
      if (type === "labour") await api.labour.delete(id);
      if (type === "operator") await api.operators.delete(id);
      showToast("Resource deleted successfully");
      loadAllData();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  // Edit Resource State & Handlers
  const [editTarget, setEditTarget] = useState<{ type: "MACHINERY" | "SEEDS" | "LABOUR" | "OPERATOR"; id: string } | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const openEditModal = (type: "MACHINERY" | "SEEDS" | "LABOUR" | "OPERATOR", item: any) => {
    setEditTarget({ type, id: item.id });
    if (type === "MACHINERY") {
      setEditForm({
        title: item.title || "",
        category: item.category || "Tractors",
        horsepower: item.horsepower || 50,
        pricePerDay: item.pricePerDay || 2000,
        pricePerHour: item.pricePerHour || 300,
        workingWidth: item.workingWidth || "2.4 m",
        city: item.city || "Nizamabad",
        state: item.state || "Telangana",
        description: item.description || "",
        available: item.available ?? true,
      });
    } else if (type === "SEEDS") {
      setEditForm({
        name: item.name || "",
        cropType: item.cropType || "Rice",
        variety: item.variety || "",
        pricePerKg: item.pricePerKg || 75,
        stockKg: item.stockKg || 500,
        germinationRate: item.germinationRate || 95,
        maturityDays: item.maturityDays || 120,
        city: item.city || "Nizamabad",
        available: item.available ?? true,
      });
    } else if (type === "LABOUR") {
      setEditForm({
        fullName: item.fullName || "",
        skills: Array.isArray(item.skills) ? item.skills.join(", ") : item.skills || "",
        dailyWage: item.dailyWage || 550,
        crewSize: item.crewSize || 8,
        experienceYears: item.experienceYears || 5,
        contactPhone: item.contactPhone || "",
        city: item.city || "Armoor",
        available: item.available ?? true,
      });
    } else if (type === "OPERATOR") {
      setEditForm({
        fullName: item.fullName || "",
        machineryExpertise: Array.isArray(item.machineryExpertise) ? item.machineryExpertise.join(", ") : item.machineryExpertise || "",
        dailyWage: item.dailyWage || 900,
        experienceYears: item.experienceYears || 5,
        licenseNumber: item.licenseNumber || "",
        contactPhone: item.contactPhone || "",
        city: item.city || "Bodhan",
        available: item.available ?? true,
      });
    }
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      if (editTarget.type === "MACHINERY") {
        await api.machinery.update(editTarget.id, editForm);
      } else if (editTarget.type === "SEEDS") {
        await api.seeds.update(editTarget.id, editForm);
      } else if (editTarget.type === "LABOUR") {
        const skills = typeof editForm.skills === "string"
          ? editForm.skills.split(",").map((s: string) => s.trim())
          : editForm.skills;
        await api.labour.update(editTarget.id, { ...editForm, skills });
      } else if (editTarget.type === "OPERATOR") {
        const machineryExpertise = typeof editForm.machineryExpertise === "string"
          ? editForm.machineryExpertise.split(",").map((s: string) => s.trim())
          : editForm.machineryExpertise;
        await api.operators.update(editTarget.id, { ...editForm, machineryExpertise });
      }
      showToast(`${editTarget.type.charAt(0) + editTarget.type.slice(1).toLowerCase()} updated successfully in MongoDB!`);
      setEditTarget(null);
      loadAllData();
    } catch (err: any) {
      alert("Error updating resource: " + err.message);
    }
  };

  // Security Check: Role Authorization Barrier
  if (role !== "ROLE_ADMIN") {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-error-container text-error flex items-center justify-center mb-4 shadow-sm">
          <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
        </div>
        <h2 className="font-headline font-bold text-2xl text-on-surface">Restricted Platform Administration</h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mt-2 mb-6">
          The Admin Operations Console is reserved exclusively for authorized co-op depot staff and platform administrators.
        </p>
      </div>
    );
  }

  // Filtered queries for active search
  const q = searchQuery.toLowerCase();
  const filteredMachinery = machineryList.filter(
    (m) => !q || m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.city?.toLowerCase().includes(q)
  );
  const filteredSeeds = seedsList.filter(
    (s) => !q || s.name.toLowerCase().includes(q) || s.cropType.toLowerCase().includes(q) || s.variety?.toLowerCase().includes(q)
  );
  const filteredLabour = labourList.filter(
    (l) => !q || l.fullName.toLowerCase().includes(q) || l.skills?.some((sk) => sk.toLowerCase().includes(q))
  );
  const filteredOperators = operatorsList.filter(
    (o) => !q || o.fullName.toLowerCase().includes(q) || o.machineryExpertise?.some((me) => me.toLowerCase().includes(q)) || o.licenseNumber?.toLowerCase().includes(q)
  );
  const filteredBookings = bookingsList.filter(
    (b) => !q || b.bookingNumber?.toLowerCase().includes(q) || b.resourceTitle?.toLowerCase().includes(q) || b.bookedByUserName?.toLowerCase().includes(q)
  );
  const filteredUsers = usersList.filter(
    (u) => !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q)
  );

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1540px] mx-auto px-4 sm:px-8 py-6">
      {/* Toast Notification Matching Stitch adminToast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121c2c] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-primary-fixed text-[20px]">check_circle</span>
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Regional Platform Governance Header (Stitch admin.html) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-surface-container">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
              Admin Operations Console
            </span>
            <span className="text-outline text-xs">/</span>
            <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface text-[11px] font-semibold">
              Nizamabad Co-op Depot #4
            </span>
          </div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
            Platform Overview & Regional Governance
          </h1>
          <p className="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
            <span>Central Cluster Management</span>
            <span>•</span>
            <span className="text-primary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">sync</span> Live Telematics & MongoDB Cluster
            </span>
          </p>
        </div>

        {/* Action Controls & Audit Export */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-xl shadow-sm gap-2 border border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[18px]">calendar_month</span>
            <span className="text-xs text-on-surface font-semibold">Operational Cycle &apos;26</span>
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
          </div>

          <button
            onClick={() => setShowAddModal("MACHINERY")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Machinery
          </button>
          <button
            onClick={() => setShowAddModal("SEEDS")}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low text-on-surface hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Seeds
          </button>
          <button
            onClick={() => setShowAddModal("LABOUR")}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low text-on-surface hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Labour
          </button>
          <button
            onClick={() => setShowAddModal("OPERATOR")}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low text-on-surface hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Operator
          </button>
          <button
            onClick={exportAuditLog}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border border-outline-variant/30 text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            Export Audit Log
          </button>
        </div>
      </div>

      {/* 6-Metric High Impact Grid (Stitch admin.html) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Total Farmers</span>
            <span className="material-symbols-outlined text-primary text-[20px]">group</span>
          </div>
          <div>
            <div className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
              {stats.totalUsers || usersList.length}
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-tertiary font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_up</span> Registered
              </span>
              <span className="text-outline uppercase bg-surface-container px-1.5 py-0.5 rounded font-bold">Live</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Active Machinery</span>
            <span className="material-symbols-outlined text-primary text-[20px]">agriculture</span>
          </div>
          <div>
            <div className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
              {stats.totalMachinery || machineryList.length} <span className="text-xs font-normal text-on-surface-variant">Units</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-tertiary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 100% In Field
              </span>
              <span className="text-outline uppercase bg-surface-container px-1.5 py-0.5 rounded font-bold">Telematics</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Active Bookings</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">calendar_today</span>
          </div>
          <div>
            <div className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
              {stats.totalBookings || bookingsList.length} <span className="text-xs font-normal text-on-surface-variant">Total</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-secondary font-semibold">Scheduled</span>
              <span className="text-outline uppercase bg-surface-container px-1.5 py-0.5 rounded font-bold">Escrow</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Labour Providers</span>
            <span className="material-symbols-outlined text-primary text-[20px]">engineering</span>
          </div>
          <div>
            <div className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
              {stats.totalLabour || labourList.length} <span className="text-xs font-normal text-on-surface-variant">Crews</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-tertiary font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">check</span> Verified
              </span>
              <span className="text-outline uppercase bg-surface-container px-1.5 py-0.5 rounded font-bold">Depot</span>
            </div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Seed Listings</span>
            <span className="material-symbols-outlined text-primary text-[20px]">grain</span>
          </div>
          <div>
            <div className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
              {stats.totalSeeds || seedsList.length} <span className="text-xs font-normal text-on-surface-variant">Lots</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-tertiary font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">verified</span> In Stock
              </span>
              <span className="text-outline uppercase bg-surface-container px-1.5 py-0.5 rounded font-bold">Certified</span>
            </div>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-secondary-fixed/30 p-4 rounded-2xl shadow-sm border border-secondary-fixed flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-on-secondary-fixed mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">Operators</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">badge</span>
          </div>
          <div>
            <div className="font-headline text-xl sm:text-2xl font-bold text-on-secondary-fixed">
              {stats.totalOperators || operatorsList.length} <span className="text-xs font-normal text-secondary">Drivers</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="font-semibold text-on-secondary-container">Licensed Pilots</span>
              <span className="bg-secondary text-white px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Data Visualization Section: 2 Split Columns (Stitch admin.html) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Chart Left: Machinery Usage Category Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline font-bold text-base text-on-surface tracking-tight">Machinery Fleet Allocation</h2>
                <p className="text-xs text-on-surface-variant">Real-time telematics utilization index across district</p>
              </div>
              <span className="material-symbols-outlined text-outline text-[22px]">bar_chart</span>
            </div>

            {/* Stacked Custom Progress Ribbon */}
            <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden flex my-4">
              <div className="h-full bg-primary" style={{ width: "48%" }} title="Tractors: 48%"></div>
              <div className="h-full bg-secondary-container" style={{ width: "26%" }} title="Harvesters: 26%"></div>
              <div className="h-full bg-tertiary-fixed-dim" style={{ width: "14%" }} title="Rotavators: 14%"></div>
              <div className="h-full bg-outline-variant" style={{ width: "12%" }} title="Sprayers: 12%"></div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded bg-primary"></span>
                  <div>
                    <div className="font-bold text-on-surface">Tractors (45HP - 75HP)</div>
                    <div className="text-[11px] text-outline">High-torque field tilling units</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-on-surface">48%</div>
                  <div className="text-[10px] text-tertiary font-semibold">+3% vs last wk</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded bg-secondary-container"></span>
                  <div>
                    <div className="font-bold text-on-surface">Paddy Combine Harvesters</div>
                    <div className="text-[11px] text-outline">Seasonal harvest surge capacity</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-on-surface">26%</div>
                  <div className="text-[10px] text-secondary font-semibold">Seasonal Surge</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded bg-tertiary-fixed-dim"></span>
                  <div>
                    <div className="font-bold text-on-surface">Heavy Rotary Tillers & Rotavators</div>
                    <div className="text-[11px] text-outline">Soil pulverization & seedbeds</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-on-surface">14%</div>
                  <div className="text-[10px] text-outline">Steady</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded bg-outline-variant"></span>
                  <div>
                    <div className="font-bold text-on-surface">Boom & Drone Sprayers</div>
                    <div className="text-[11px] text-outline">Pest control & liquid fertilizer</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-on-surface">12%</div>
                  <div className="text-[10px] text-tertiary font-semibold">+1.2%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 flex items-center justify-between border-t border-surface-container text-xs">
            <span className="text-[11px] text-outline">Total active fleet capacity: {machineryList.length} assets</span>
            <span className="text-[11px] text-primary font-bold flex items-center gap-1">
              Telemetry Feed <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* Chart Right: Weekly Booking Activity & Escrow Releases (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="font-headline font-bold text-base text-on-surface tracking-tight">Booking Velocity & Escrow Releases</h2>
                <p className="text-xs text-on-surface-variant">Daily volume peak correlated with regional harvest schedule</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                  <span className="w-3 h-3 rounded-full bg-primary"></span> Daily Bookings
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                  <span className="w-3 h-3 rounded-full bg-secondary-container"></span> Settlement Payouts (₹)
                </span>
              </div>
            </div>

            {/* Weekly Histogram Area */}
            <div className="w-full h-52 flex flex-col justify-end">
              <div className="grid grid-cols-7 gap-3 h-40 items-end px-2">
                {/* Mon */}
                <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-outline group-hover:text-primary transition-colors font-semibold">310</span>
                  <div className="w-full flex items-end justify-center gap-1 h-full max-h-28">
                    <div className="w-1/2 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: "52%" }}></div>
                    <div className="w-1/2 bg-secondary-container rounded-t" style={{ height: "38%" }}></div>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium">Mon</span>
                </div>

                {/* Tue */}
                <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-outline group-hover:text-primary transition-colors font-semibold">345</span>
                  <div className="w-full flex items-end justify-center gap-1 h-full max-h-28">
                    <div className="w-1/2 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: "60%" }}></div>
                    <div className="w-1/2 bg-secondary-container rounded-t" style={{ height: "45%" }}></div>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium">Tue</span>
                </div>

                {/* Wed */}
                <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-outline group-hover:text-primary transition-colors font-semibold">412</span>
                  <div className="w-full flex items-end justify-center gap-1 h-full max-h-28">
                    <div className="w-1/2 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: "72%" }}></div>
                    <div className="w-1/2 bg-secondary-container rounded-t" style={{ height: "55%" }}></div>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium">Wed</span>
                </div>

                {/* Thu (Surge Day) */}
                <div className="flex flex-col items-center gap-1.5 h-full justify-end group relative">
                  <span className="absolute -top-6 px-1.5 py-0.5 bg-secondary text-white text-[9px] font-bold rounded shadow-sm">Rain Surge</span>
                  <span className="text-[10px] text-secondary font-bold">530</span>
                  <div className="w-full flex items-end justify-center gap-1 h-full max-h-28">
                    <div className="w-1/2 bg-primary rounded-t shadow group-hover:bg-primary-container transition-all" style={{ height: "94%" }}></div>
                    <div className="w-1/2 bg-secondary-container rounded-t" style={{ height: "85%" }}></div>
                  </div>
                  <span className="text-[11px] text-on-surface font-bold">Thu</span>
                </div>

                {/* Fri */}
                <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-outline group-hover:text-primary transition-colors font-semibold">490</span>
                  <div className="w-full flex items-end justify-center gap-1 h-full max-h-28">
                    <div className="w-1/2 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: "84%" }}></div>
                    <div className="w-1/2 bg-secondary-container rounded-t" style={{ height: "70%" }}></div>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium">Fri</span>
                </div>

                {/* Sat */}
                <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-outline group-hover:text-primary transition-colors font-semibold">460</span>
                  <div className="w-full flex items-end justify-center gap-1 h-full max-h-28">
                    <div className="w-1/2 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: "78%" }}></div>
                    <div className="w-1/2 bg-secondary-container rounded-t" style={{ height: "65%" }}></div>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium">Sat</span>
                </div>

                {/* Sun */}
                <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-primary font-bold">482</span>
                  <div className="w-full flex items-end justify-center gap-1 h-full max-h-28">
                    <div className="w-1/2 bg-primary rounded-t shadow-sm" style={{ height: "82%" }}></div>
                    <div className="w-1/2 bg-secondary-container rounded-t" style={{ height: "68%" }}></div>
                  </div>
                  <span className="text-[11px] text-primary font-bold">Sun</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-3 mt-4 flex items-center justify-between text-xs text-on-surface">
            <span className="text-[11px] text-on-surface-variant">Live clearing escrow throughput: ₹4.8 Lakhs</span>
            <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock_clock</span> 100% Guaranteed Escrow
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Workflows & Inspection Tables */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container overflow-hidden flex flex-col">
        {/* Navigation Tabs & Search Controls */}
        <div className="p-4 sm:p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "overview", label: "Overview", count: null },
              { id: "machinery", label: "Machinery Fleet", count: machineryList.length },
              { id: "seeds", label: "Seed Inventory", count: seedsList.length },
              { id: "labour", label: "Labour Crews", count: labourList.length },
              { id: "operators", label: "Operators", count: operatorsList.length },
              { id: "bookings", label: "Bookings", count: bookingsList.length },
              { id: "users", label: "Registered Users", count: usersList.length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive ? "bg-white/20 text-white" : "bg-surface-container text-on-surface-variant font-semibold"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Filter */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings, crops, IDs..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-surface-container"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-2 text-outline hover:text-on-surface rounded-lg"
                title="Clear Search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: OVERVIEW SUMMARY TABLE */}
        {activeTab === "overview" && (
          <div className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
                <h3 className="font-headline font-bold text-sm text-on-surface mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  Cluster Compliance & Verification
                </h3>
                <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                  All equipment items in Nizamabad Depot Zone 4 adhere to telematics standards, driver licensing verification, and organic certified seed packaging criteria.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-primary-fixed text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span> 100% Machinery Verified
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span> Licensed Drivers
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span> Lab Certified Seeds
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
                <h3 className="font-headline font-bold text-sm text-on-surface mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">hub</span>
                  Hub Dispatch & Mediation Console
                </h3>
                <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                  Active monitoring of seasonal demand surges, rain forecasts, combine harvester allocation, and farm dispute resolutions.
                </p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-container">
                  <span className="text-outline">Depot Coordinators: 12 Active</span>
                  <span className="font-bold text-primary">Mean Response: 14 mins</span>
                </div>
              </div>
            </div>

            {/* Quick overview of latest registered resources */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-headline font-bold text-sm text-on-surface">Recent Machinery Fleet Additions</h4>
                <button onClick={() => setActiveTab("machinery")} className="text-xs text-primary font-bold hover:underline">
                  View Full Fleet →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-surface-container">
                    <tr>
                      <th className="p-3">Resource / Model</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Rate / Shift</th>
                      <th className="p-3">District Hub</th>
                      <th className="p-3">Availability</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {machineryList.slice(0, 5).map((m) => (
                      <tr key={m.id} className="hover:bg-surface-container-low/70 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-on-surface">{m.title}</div>
                          <span className="text-[10px] text-outline">{m.horsepower} HP • {m.workingWidth || "Standard"}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed text-primary">
                            {m.category}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-primary">₹{m.pricePerDay}</td>
                        <td className="p-3 text-on-surface-variant">{m.city}, {m.state}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              m.available ? "bg-tertiary-fixed/40 text-tertiary" : "bg-secondary-fixed/50 text-secondary"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {m.available ? "Available" : "In-Field"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openEditModal("MACHINERY", m)}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MACHINERY MANAGEMENT */}
        {activeTab === "machinery" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-surface-container">
                <tr>
                  <th className="p-3 px-4">Machinery Asset</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">HP & Specs</th>
                  <th className="p-3">Daily Rate</th>
                  <th className="p-3">District Hub</th>
                  <th className="p-3">Live Status</th>
                  <th className="p-3 text-right px-4">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredMachinery.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                      No machinery matches your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMachinery.map((m) => (
                    <tr key={m.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container overflow-hidden shrink-0">
                            {m.images && m.images[0] ? (
                              <img src={m.images[0]} alt={m.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-outline">
                                <span className="material-symbols-outlined text-[20px]">agriculture</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-on-surface">{m.title}</div>
                            <span className="text-[10px] text-outline truncate max-w-[200px] block">
                              Owner: {m.ownerName || "Platform Fleet"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed text-primary">
                          {m.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{m.horsepower} HP</div>
                        <span className="text-[10px] text-outline">{m.workingWidth || "Standard"}</span>
                      </td>
                      <td className="p-3 font-bold text-primary">₹{m.pricePerDay}</td>
                      <td className="p-3 text-on-surface-variant">{m.city}, {m.state}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleAvailability("machinery", m)}
                          title="Click to toggle availability"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-transform active:scale-95 ${
                            m.available ? "bg-tertiary-fixed/40 text-tertiary hover:bg-tertiary-fixed/60" : "bg-surface-container text-outline hover:bg-surface-container-high"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {m.available ? "Available" : "In-Field"}
                        </button>
                      </td>
                      <td className="p-3 text-right px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal("MACHINERY", m)}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResource("machinery", m.id)}
                            className="px-2.5 py-1 rounded-lg bg-error-container/40 hover:bg-error-container text-xs font-semibold text-error"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SEEDS INVENTORY */}
        {activeTab === "seeds" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-surface-container">
                <tr>
                  <th className="p-3 px-4">Seed Variety & Crop</th>
                  <th className="p-3">Crop Category</th>
                  <th className="p-3">Price / Kg</th>
                  <th className="p-3">Stock Available</th>
                  <th className="p-3">Germination & Maturity</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3 text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredSeeds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                      No seed varieties match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSeeds.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3 px-4">
                        <div className="font-bold text-on-surface">{s.name}</div>
                        <span className="text-[10px] text-outline">Variety: {s.variety || "Foundation Seed"}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed">
                          {s.cropType}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-primary">₹{s.pricePerKg}</td>
                      <td className="p-3 font-semibold">{s.stockKg} kg</td>
                      <td className="p-3">
                        <div className="text-tertiary font-bold">{s.germinationRate}% Germination</div>
                        <span className="text-[10px] text-outline">{s.maturityDays} Days</span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleAvailability("seeds", s)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            s.available ? "bg-tertiary-fixed/40 text-tertiary" : "bg-surface-container text-outline"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {s.available ? "In Stock" : "Out of Stock"}
                        </button>
                      </td>
                      <td className="p-3 text-right px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal("SEEDS", s)}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResource("seeds", s.id)}
                            className="px-2.5 py-1 rounded-lg bg-error-container/40 hover:bg-error-container text-xs font-semibold text-error"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: LABOUR CREWS */}
        {activeTab === "labour" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-surface-container">
                <tr>
                  <th className="p-3 px-4">Crew Lead & Name</th>
                  <th className="p-3">Agronomic Skills</th>
                  <th className="p-3">Daily Wage</th>
                  <th className="p-3">Crew Size</th>
                  <th className="p-3">Location & Phone</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3 text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredLabour.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                      No labour crews match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLabour.map((l) => (
                    <tr key={l.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3 px-4 font-bold text-on-surface">{l.fullName}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {l.skills.map((sk) => (
                            <span key={sk} className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] text-on-surface font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-primary">₹{l.dailyWage}/day</td>
                      <td className="p-3 font-semibold">{l.crewSize} Workers</td>
                      <td className="p-3 text-on-surface-variant">
                        <div>{l.city}, {l.state}</div>
                        <span className="text-[10px] text-outline">{l.contactPhone}</span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleAvailability("labour", l)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            l.available ? "bg-tertiary-fixed/40 text-tertiary" : "bg-surface-container text-outline"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {l.available ? "Available" : "In-Field"}
                        </button>
                      </td>
                      <td className="p-3 text-right px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal("LABOUR", l)}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResource("labour", l.id)}
                            className="px-2.5 py-1 rounded-lg bg-error-container/40 hover:bg-error-container text-xs font-semibold text-error"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: OPERATORS */}
        {activeTab === "operators" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-surface-container">
                <tr>
                  <th className="p-3 px-4">Operator Name</th>
                  <th className="p-3">Certified Expertise</th>
                  <th className="p-3">Daily Wage</th>
                  <th className="p-3">License Number</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3 text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredOperators.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                      No machinery operators match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOperators.map((o) => (
                    <tr key={o.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3 px-4 font-bold text-on-surface">{o.fullName}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {o.machineryExpertise.map((ex) => (
                            <span key={ex} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-primary">₹{o.dailyWage}/day</td>
                      <td className="p-3 font-mono text-[11px] text-outline">{o.licenseNumber}</td>
                      <td className="p-3">{o.experienceYears} Years</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleAvailability("operator", o)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            o.available ? "bg-tertiary-fixed/40 text-tertiary" : "bg-surface-container text-outline"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {o.available ? "Available" : "On Job"}
                        </button>
                      </td>
                      <td className="p-3 text-right px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal("OPERATOR", o)}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResource("operator", o.id)}
                            className="px-2.5 py-1 rounded-lg bg-error-container/40 hover:bg-error-container text-xs font-semibold text-error"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-surface-container">
                <tr>
                  <th className="p-3 px-4">Order Ref</th>
                  <th className="p-3">Resource & Type</th>
                  <th className="p-3">Farmer Details</th>
                  <th className="p-3">Rental Schedule</th>
                  <th className="p-3">Escrow Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right px-4">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                      No booking orders match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3 px-4 font-mono font-bold text-primary">{b.bookingNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-on-surface">{b.resourceTitle}</div>
                        <span className="text-[10px] text-outline uppercase font-semibold">{b.resourceType}</span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-on-surface">{b.bookedByUserName}</div>
                        <span className="text-[10px] text-outline">{b.bookedByUserPhone}</span>
                      </td>
                      <td className="p-3">
                        <div>{b.startDate} to {b.endDate}</div>
                        {b.quantity && <span className="text-[10px] text-secondary font-semibold">{b.quantity} {b.rentalDurationUnit}</span>}
                      </td>
                      <td className="p-3 font-bold text-on-surface">₹{b.totalPrice}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === "ACCEPTED"
                              ? "bg-primary-fixed text-primary"
                              : b.status === "PENDING"
                              ? "bg-secondary-fixed text-on-secondary-fixed"
                              : b.status === "COMPLETED"
                              ? "bg-tertiary-fixed text-tertiary"
                              : "bg-surface-container text-outline"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStatusChange(b.id, "ACCEPTED")}
                            className="px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-container shadow-sm transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(b.id, "COMPLETED")}
                            className="px-2.5 py-1 rounded-lg bg-tertiary text-white text-[11px] font-bold hover:bg-tertiary-container shadow-sm transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleStatusChange(b.id, "REJECTED")}
                            className="px-2.5 py-1 rounded-lg bg-error text-white text-[11px] font-bold hover:opacity-90 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 7: USERS */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-surface-container">
                <tr>
                  <th className="p-3 px-4">Farmer / User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Address</th>
                  <th className="p-3 text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                      No registered farmers match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3 px-4 font-bold text-on-surface">{u.name}</td>
                      <td className="p-3 text-on-surface-variant">{u.email}</td>
                      <td className="p-3 text-outline">{u.phone || "—"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === "ROLE_ADMIN" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-primary-fixed text-primary"
                          }`}
                        >
                          {u.role === "ROLE_ADMIN" ? "ADMIN" : "FARMER"}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface-variant">{u.address || "—"}</td>
                      <td className="p-3 text-right px-4">
                        {u.role !== "ROLE_ADMIN" && (
                          <button
                            onClick={async () => {
                              if (confirm(`Remove farmer ${u.name}?`)) {
                                await api.admin.deleteUser(u.id);
                                showToast(`User ${u.name} removed.`);
                                loadAllData();
                              }
                            }}
                            className="text-error hover:underline text-xs font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live Regional Field Dispatch & Co-op Logistics Feed (Asymmetric Bento from Stitch admin.html) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
        {/* Card 1: Hub Operations Status */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Hub Operations Status</span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            </div>
            <h3 className="font-headline font-bold text-base text-on-surface">Nizamabad Central Depot</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Storage & staging capacity allocated. Fleet reserves active for harvest distribution across Armoor and Bodhan sub-districts.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-surface-container text-xs">
            <span className="text-tertiary font-semibold">12 Field Coordinators Active</span>
            <span className="text-primary font-bold">Depot Logistics →</span>
          </div>
        </div>

        {/* Card 2: Listing Compliance Feed */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Listing Compliance Feed</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">science</span>
            </div>
            <h3 className="font-headline font-bold text-base text-on-surface">Quality & Telematics Standard</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              All regional equipment meets the 2026 tractor inspection standard. Seed batches authenticated by PJTSAU certified quality checklist.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-surface-container text-xs">
            <span className="text-outline">Provider Standard 100%</span>
            <span className="text-primary font-bold">Audit View →</span>
          </div>
        </div>

        {/* Card 3: Field Support Hotline */}
        <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Immediate Resolution</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">support_agent</span>
            </div>
            <h3 className="font-headline font-bold text-base text-on-surface">Field Support Hotline</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Real-time hotline for operator mediation, booking extension, and emergency breakdown equipment dispatch.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-surface-container/60">
            <button
              onClick={() => showToast("Support console operational. All lines clear.")}
              className="w-full py-2.5 px-4 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary-container transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              Support Console Active
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ADD MACHINERY */}
      {showAddModal === "MACHINERY" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-surface-container overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-base text-on-surface">Add New Machinery to Fleet</h3>
              <button onClick={() => setShowAddModal(null)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddMachinery} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Title</label>
                <input
                  required
                  type="text"
                  value={mForm.title}
                  onChange={(e) => setMForm({ ...mForm, title: e.target.value })}
                  placeholder="e.g. John Deere 5050D (50 HP)"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Category</label>
                  <select
                    value={mForm.category}
                    onChange={(e) => setMForm({ ...mForm, category: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container focus:outline-none"
                  >
                    {["Tractors", "Harvesters", "Rotavators", "Cultivators", "Seeders", "Sprayers", "Ploughs", "Water pumps", "Threshers", "Tractor trailers"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Horsepower (HP)</label>
                  <input
                    type="number"
                    value={mForm.horsepower}
                    onChange={(e) => setMForm({ ...mForm, horsepower: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Daily Rate (₹)</label>
                  <input
                    type="number"
                    value={mForm.pricePerDay}
                    onChange={(e) => setMForm({ ...mForm, pricePerDay: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Working Width</label>
                  <input
                    type="text"
                    value={mForm.workingWidth}
                    onChange={(e) => setMForm({ ...mForm, workingWidth: e.target.value })}
                    placeholder="e.g. 2.4 m"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Location Address</label>
                <input
                  type="text"
                  value={mForm.address}
                  onChange={(e) => setMForm({ ...mForm, address: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={mForm.description}
                  onChange={(e) => setMForm({ ...mForm, description: e.target.value })}
                  placeholder="Engine details, included implements, PTO specs..."
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(null)} className="flex-1 py-2.5 rounded-xl bg-surface-container font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-container">
                  Save Machinery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SEEDS */}
      {showAddModal === "SEEDS" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-surface-container overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-base text-on-surface">Add Certified Seed Variety</h3>
              <button onClick={() => setShowAddModal(null)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSeeds} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Seed Variety Name</label>
                <input
                  required
                  type="text"
                  value={sForm.name}
                  onChange={(e) => setSForm({ ...sForm, name: e.target.value })}
                  placeholder="e.g. Telangana Sona (RNR 15048)"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Crop Type</label>
                  <select
                    value={sForm.cropType}
                    onChange={(e) => setSForm({ ...sForm, cropType: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  >
                    {["Rice", "Wheat", "Maize", "Cotton", "Tomato", "Chilli", "Groundnut", "Soybean", "Vegetable"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Price per Kg (₹)</label>
                  <input
                    type="number"
                    value={sForm.pricePerKg}
                    onChange={(e) => setSForm({ ...sForm, pricePerKg: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Stock (kg)</label>
                  <input
                    type="number"
                    value={sForm.stockKg}
                    onChange={(e) => setSForm({ ...sForm, stockKg: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Germination Rate (%)</label>
                  <input
                    type="number"
                    value={sForm.germinationRate}
                    onChange={(e) => setSForm({ ...sForm, germinationRate: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Package Size</label>
                <input
                  type="text"
                  value={sForm.packageSize}
                  onChange={(e) => setSForm({ ...sForm, packageSize: e.target.value })}
                  placeholder="e.g. 25 kg Bag"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(null)} className="flex-1 py-2.5 rounded-xl bg-surface-container font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-container">
                  Catalog Seeds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD LABOUR */}
      {showAddModal === "LABOUR" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-surface-container overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-base text-on-surface">Register Farm Labour Crew</h3>
              <button onClick={() => setShowAddModal(null)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddLabour} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Crew Name / Leader</label>
                <input
                  required
                  type="text"
                  value={lForm.fullName}
                  onChange={(e) => setLForm({ ...lForm, fullName: e.target.value })}
                  placeholder="e.g. Balaram & Sri Lakshmi Crew"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={lForm.skills}
                  onChange={(e) => setLForm({ ...lForm, skills: e.target.value })}
                  placeholder="Harvesting, Sowing, Weeding, Irrigation, Spraying, Ploughing"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Daily Wage (₹)</label>
                  <input
                    type="number"
                    value={lForm.dailyWage}
                    onChange={(e) => setLForm({ ...lForm, dailyWage: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Crew Size</label>
                  <input
                    type="number"
                    value={lForm.crewSize}
                    onChange={(e) => setLForm({ ...lForm, crewSize: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Phone Contact</label>
                <input
                  type="text"
                  value={lForm.contactPhone}
                  onChange={(e) => setLForm({ ...lForm, contactPhone: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(null)} className="flex-1 py-2.5 rounded-xl bg-surface-container font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-container">
                  Register Crew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD OPERATOR */}
      {showAddModal === "OPERATOR" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-surface-container overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-base text-on-surface">Certify Machinery Operator</h3>
              <button onClick={() => setShowAddModal(null)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddOperator} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={oForm.fullName}
                  onChange={(e) => setOForm({ ...oForm, fullName: e.target.value })}
                  placeholder="e.g. Ravi Kumar"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Machinery Expertise (comma separated)</label>
                <input
                  type="text"
                  value={oForm.machineryExpertise}
                  onChange={(e) => setOForm({ ...oForm, machineryExpertise: e.target.value })}
                  placeholder="Tractor, Combine Harvester, Rotavator, Boom Sprayer"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Daily Wage (₹)</label>
                  <input
                    type="number"
                    value={oForm.dailyWage}
                    onChange={(e) => setOForm({ ...oForm, dailyWage: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={oForm.experienceYears}
                    onChange={(e) => setOForm({ ...oForm, experienceYears: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">License / Badge Number</label>
                <input
                  type="text"
                  value={oForm.licenseNumber}
                  onChange={(e) => setOForm({ ...oForm, licenseNumber: e.target.value })}
                  placeholder="TS-16-OP-2024-..."
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(null)} className="flex-1 py-2.5 rounded-xl bg-surface-container font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-container">
                  Certify Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT RESOURCE */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-surface-container overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Edit {editTarget.type.charAt(0) + editTarget.type.slice(1).toLowerCase()}
                </h3>
                <span className="text-[11px] text-outline">ID: {editTarget.id}</span>
              </div>
              <button onClick={() => setEditTarget(null)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateResource} className="flex flex-col gap-3 text-xs">
              {/* MACHINERY EDIT FORM */}
              {editTarget.type === "MACHINERY" && (
                <>
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase block mb-1">Title</label>
                    <input
                      required
                      type="text"
                      value={editForm.title || ""}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Category</label>
                      <select
                        value={editForm.category || "Tractors"}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      >
                        {["Tractors", "Harvesters", "Rotavators", "Cultivators", "Seeders", "Sprayers", "Ploughs", "Water pumps", "Threshers", "Tractor trailers"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Horsepower (HP)</label>
                      <input
                        type="number"
                        value={editForm.horsepower || 0}
                        onChange={(e) => setEditForm({ ...editForm, horsepower: Number(e.target.value) })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Daily Rate (₹)</label>
                      <input
                        type="number"
                        value={editForm.pricePerDay || 0}
                        onChange={(e) => setEditForm({ ...editForm, pricePerDay: Number(e.target.value) })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Working Width</label>
                      <input
                        type="text"
                        value={editForm.workingWidth || ""}
                        onChange={(e) => setEditForm({ ...editForm, workingWidth: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">City</label>
                      <input
                        type="text"
                        value={editForm.city || ""}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Availability</label>
                      <select
                        value={editForm.available ? "true" : "false"}
                        onChange={(e) => setEditForm({ ...editForm, available: e.target.value === "true" })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable / Booked</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container resize-none"
                    />
                  </div>
                </>
              )}

              {/* SEEDS EDIT FORM */}
              {editTarget.type === "SEEDS" && (
                <>
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase block mb-1">Variety Name</label>
                    <input
                      required
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Crop Type</label>
                      <select
                        value={editForm.cropType || "Rice"}
                        onChange={(e) => setEditForm({ ...editForm, cropType: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      >
                        {["Rice", "Wheat", "Maize", "Cotton", "Tomato", "Chilli", "Groundnut", "Soybean", "Vegetable"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Price / Kg (₹)</label>
                      <input
                        type="number"
                        value={editForm.pricePerKg || 0}
                        onChange={(e) => setEditForm({ ...editForm, pricePerKg: Number(e.target.value) })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Available Stock (kg)</label>
                      <input
                        type="number"
                        value={editForm.stockKg || 0}
                        onChange={(e) => setEditForm({ ...editForm, stockKg: Number(e.target.value) })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Germination (%)</label>
                      <input
                        type="number"
                        value={editForm.germinationRate || 95}
                        onChange={(e) => setEditForm({ ...editForm, germinationRate: Number(e.target.value) })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">City</label>
                      <input
                        type="text"
                        value={editForm.city || ""}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Availability</label>
                      <select
                        value={editForm.available ? "true" : "false"}
                        onChange={(e) => setEditForm({ ...editForm, available: e.target.value === "true" })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* LABOUR EDIT FORM */}
              {editTarget.type === "LABOUR" && (
                <>
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase block mb-1">Crew Name</label>
                    <input
                      required
                      type="text"
                      value={editForm.fullName || ""}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase block mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={editForm.skills || ""}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Daily Wage (₹)</label>
                      <input
                        type="number"
                        value={editForm.dailyWage || 0}
                        onChange={(e) => setEditForm({ ...editForm, dailyWage: Number(e.target.value) })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Crew Size</label>
                      <input
                        type="number"
                        value={editForm.crewSize || 1}
                        onChange={(e) => setEditForm({ ...editForm, crewSize: Number(e.target.value) })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.contactPhone || ""}
                        onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Availability</label>
                      <select
                        value={editForm.available ? "true" : "false"}
                        onChange={(e) => setEditForm({ ...editForm, available: e.target.value === "true" })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* OPERATOR EDIT FORM */}
              {editTarget.type === "OPERATOR" && (
                <>
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase block mb-1">Operator Name</label>
                    <input
                      required
                      type="text"
                      value={editForm.fullName || ""}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase block mb-1">Machinery Expertise</label>
                    <input
                      type="text"
                      value={editForm.machineryExpertise || ""}
                      onChange={(e) => setEditForm({ ...editForm, machineryExpertise: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Daily Wage (₹)</label>
                      <input
                        type="number"
                        value={editForm.dailyWage || 0}
                        onChange={(e) => setEditForm({ ...editForm, dailyWage: Number(e.target.value) })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">License #</label>
                      <input
                        type="text"
                        value={editForm.licenseNumber || ""}
                        onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.contactPhone || ""}
                        onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface-variant uppercase block mb-1">Availability</label>
                      <select
                        value={editForm.available ? "true" : "false"}
                        onChange={(e) => setEditForm({ ...editForm, available: e.target.value === "true" })}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface border border-surface-container"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold shadow hover:bg-primary-container"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
