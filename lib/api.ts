const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
import stitchData from "./stitchData.json";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ROLE_ADMIN" | "ROLE_FARMER";
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  avatarUrl?: string;
}

export interface Machinery {
  id: string;
  title: string;
  category: string;
  description: string;
  horsepower: number;
  fuelType: string;
  workingWidth: string;
  pricePerDay: number;
  pricePerHour: number;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  images: string[];
  available: boolean;
  rating: number;
  reviewCount: number;
  createdAt?: string;
}

export interface Seed {
  id: string;
  name: string;
  cropType: string;
  variety: string;
  description: string;
  pricePerKg: number;
  stockKg: number;
  germinationRate: number;
  maturityDays: number;
  packageSize: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  imageUrl: string;
  available: boolean;
  rating: number;
  reviewCount: number;
}

export interface Labour {
  id: string;
  fullName: string;
  skills: string[];
  dailyWage: number;
  experienceYears: number;
  crewSize: number;
  gender: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  avatarUrl: string;
  available: boolean;
  rating: number;
  reviewCount: number;
}

export interface Operator {
  id: string;
  fullName: string;
  machineryExpertise: string[];
  experienceYears: number;
  dailyWage: number;
  licenseNumber: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  avatarUrl: string;
  available: boolean;
  rating: number;
  reviewCount: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  resourceType: "MACHINERY" | "SEEDS" | "LABOUR" | "OPERATOR";
  resourceId: string;
  resourceTitle: string;
  resourceImage?: string;
  bookedByUserId: string;
  bookedByUserName: string;
  bookedByUserEmail: string;
  bookedByUserPhone: string;
  ownerOrProviderId: string;
  ownerOrProviderName: string;
  ownerOrProviderPhone: string;
  startDate: string;
  endDate: string;
  quantity?: number;
  rentalDurationUnit?: string;
  totalPrice: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  resourceId?: string;
  resourceTitle?: string;
  content: string;
  timestamp: string;
  readStatus: boolean;
}

export interface ConversationSummary {
  peerId: string;
  peerName: string;
  peerAvatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  resourceTitle?: string;
}

export interface Review {
  id?: string;
  bookingId?: string;
  targetType: "MACHINERY" | "LABOUR" | "OPERATOR" | "OWNER";
  targetId: string;
  targetTitle?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface AiChatResponse {
  reply: string;
  source: string;
  suggestions: string[];
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("agrishare_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const api = {
  auth: {
    login: (body: { email: string; password: string }) =>
      request<{
        token: string;
        id: string;
        name: string;
        email: string;
        role: "ROLE_ADMIN" | "ROLE_FARMER";
        phone: string;
        address: string;
        latitude: number;
        longitude: number;
        avatarUrl: string;
      }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

    register: (body: any) =>
      request<any>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

    me: () => request<User>("/auth/me"),
  },

  machinery: {
    getAll: async (params?: { search?: string; category?: string; maxPrice?: number; location?: string; availableOnly?: boolean }) => {
      try {
        const q = new URLSearchParams();
        if (params?.search) q.set("search", params.search);
        if (params?.category && params.category !== "All") q.set("category", params.category);
        if (params?.maxPrice) q.set("maxPrice", params.maxPrice.toString());
        if (params?.location) q.set("location", params.location);
        if (params?.availableOnly) q.set("availableOnly", "true");
        const res = await request<Machinery[]>(`/machinery?${q.toString()}`);
        if (res && res.length > 0) return res;
      } catch (e) {
        // Fallback to rich Stitch dataset
      }
      let items = [...(stitchData.machinery as Machinery[])];
      if (params?.category && params.category !== "All") {
        items = items.filter(m => m.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        items = items.filter(m => m.title.toLowerCase().includes(s) || m.description.toLowerCase().includes(s) || m.address.toLowerCase().includes(s));
      }
      if (params?.maxPrice) {
        items = items.filter(m => m.pricePerDay <= params.maxPrice!);
      }
      return items;
    },
    getNearby: async (lat: number, lon: number, maxDistanceKm = 50) => {
      try {
        const res = await request<Machinery[]>(`/machinery/nearby?lat=${lat}&lon=${lon}&maxDistanceKm=${maxDistanceKm}`);
        if (res && res.length > 0) return res;
      } catch (e) {}
      return stitchData.machinery as Machinery[];
    },
    getById: (id: string) => {
      const found = (stitchData.machinery as Machinery[]).find(m => m.id === id);
      return request<Machinery>(`/machinery/${id}`).catch(() => found || (stitchData.machinery[0] as Machinery));
    },
    create: (data: Partial<Machinery>) =>
      request<Machinery>("/machinery", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Machinery>) =>
      request<Machinery>(`/machinery/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/machinery/${id}`, { method: "DELETE" }),
  },

  seeds: {
    getAll: async (params?: { search?: string; cropType?: string; maxPrice?: number; location?: string; availableOnly?: boolean }) => {
      try {
        const q = new URLSearchParams();
        if (params?.search) q.set("search", params.search);
        if (params?.cropType && params.cropType !== "All") q.set("cropType", params.cropType);
        if (params?.maxPrice) q.set("maxPrice", params.maxPrice.toString());
        if (params?.location) q.set("location", params.location);
        if (params?.availableOnly) q.set("availableOnly", "true");
        const res = await request<Seed[]>(`/seeds?${q.toString()}`);
        if (res && res.length > 0) return res;
      } catch (e) {}
      let items = [...(stitchData.seeds as Seed[])];
      if (params?.cropType && params.cropType !== "All") {
        items = items.filter(s => s.cropType.toLowerCase() === params.cropType!.toLowerCase());
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        items = items.filter(item => item.name.toLowerCase().includes(s) || item.variety.toLowerCase().includes(s) || item.description.toLowerCase().includes(s));
      }
      if (params?.maxPrice) {
        items = items.filter(s => s.pricePerKg <= params.maxPrice!);
      }
      return items;
    },
    getNearby: async (lat: number, lon: number, maxDistanceKm = 50) => {
      try {
        const res = await request<Seed[]>(`/seeds/nearby?lat=${lat}&lon=${lon}&maxDistanceKm=${maxDistanceKm}`);
        if (res && res.length > 0) return res;
      } catch (e) {}
      return stitchData.seeds as Seed[];
    },
    getById: (id: string) => {
      const found = (stitchData.seeds as Seed[]).find(s => s.id === id);
      return request<Seed>(`/seeds/${id}`).catch(() => found || (stitchData.seeds[0] as Seed));
    },
    create: (data: Partial<Seed>) =>
      request<Seed>("/seeds", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Seed>) =>
      request<Seed>(`/seeds/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/seeds/${id}`, { method: "DELETE" }),
  },

  labour: {
    getAll: async (params?: { search?: string; skill?: string; maxWage?: number; location?: string; availableOnly?: boolean }) => {
      try {
        const q = new URLSearchParams();
        if (params?.search) q.set("search", params.search);
        if (params?.skill && params.skill !== "All") q.set("skill", params.skill);
        if (params?.maxWage) q.set("maxWage", params.maxWage.toString());
        if (params?.location) q.set("location", params.location);
        if (params?.availableOnly) q.set("availableOnly", "true");
        const res = await request<Labour[]>(`/labour?${q.toString()}`);
        if (res && res.length > 0) return res;
      } catch (e) {}
      let items = [...(stitchData.labour as Labour[])];
      if (params?.skill && params.skill !== "All") {
        items = items.filter(l => l.skills.some(sk => sk.toLowerCase().includes(params.skill!.toLowerCase())));
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        items = items.filter(l => l.fullName.toLowerCase().includes(s) || l.bio.toLowerCase().includes(s) || l.city.toLowerCase().includes(s));
      }
      if (params?.maxWage) {
        items = items.filter(l => l.dailyWage <= params.maxWage!);
      }
      return items;
    },
    getNearby: async (lat: number, lon: number, maxDistanceKm = 50) => {
      try {
        const res = await request<Labour[]>(`/labour/nearby?lat=${lat}&lon=${lon}&maxDistanceKm=${maxDistanceKm}`);
        if (res && res.length > 0) return res;
      } catch (e) {}
      return stitchData.labour as Labour[];
    },
    getById: (id: string) => {
      const found = (stitchData.labour as Labour[]).find(l => l.id === id);
      return request<Labour>(`/labour/${id}`).catch(() => found || (stitchData.labour[0] as Labour));
    },
    create: (data: Partial<Labour>) =>
      request<Labour>("/labour", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Labour>) =>
      request<Labour>(`/labour/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/labour/${id}`, { method: "DELETE" }),
  },

  operators: {
    getAll: async (params?: { search?: string; expertise?: string; maxWage?: number; location?: string; availableOnly?: boolean }) => {
      try {
        const q = new URLSearchParams();
        if (params?.search) q.set("search", params.search);
        if (params?.expertise && params.expertise !== "All") q.set("expertise", params.expertise);
        if (params?.maxWage) q.set("maxWage", params.maxWage.toString());
        if (params?.location) q.set("location", params.location);
        if (params?.availableOnly) q.set("availableOnly", "true");
        const res = await request<Operator[]>(`/operators?${q.toString()}`);
        if (res && res.length > 0) return res;
      } catch (e) {}
      let items = [...(stitchData.operators as Operator[])];
      if (params?.expertise && params.expertise !== "All") {
        items = items.filter(o => o.machineryExpertise.some(ex => ex.toLowerCase().includes(params.expertise!.toLowerCase())));
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        items = items.filter(o => o.fullName.toLowerCase().includes(s) || o.bio.toLowerCase().includes(s) || o.city.toLowerCase().includes(s));
      }
      if (params?.maxWage) {
        items = items.filter(o => o.dailyWage <= params.maxWage!);
      }
      return items;
    },
    getNearby: async (lat: number, lon: number, maxDistanceKm = 50) => {
      try {
        const res = await request<Operator[]>(`/operators/nearby?lat=${lat}&lon=${lon}&maxDistanceKm=${maxDistanceKm}`);
        if (res && res.length > 0) return res;
      } catch (e) {}
      return stitchData.operators as Operator[];
    },
    getById: (id: string) => {
      const found = (stitchData.operators as Operator[]).find(o => o.id === id);
      return request<Operator>(`/operators/${id}`).catch(() => found || (stitchData.operators[0] as Operator));
    },
    create: (data: Partial<Operator>) =>
      request<Operator>("/operators", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Operator>) =>
      request<Operator>(`/operators/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/operators/${id}`, { method: "DELETE" }),
  },

  bookings: {
    create: (data: {
      resourceType: string;
      resourceId: string;
      startDate: string;
      endDate: string;
      quantity?: number;
      rentalDurationUnit?: string;
      deliveryAddress?: string;
      notes?: string;
    }) => request<Booking>("/bookings", { method: "POST", body: JSON.stringify(data) }),

    getMy: () => request<Booking[]>("/bookings/my"),
    getOwner: () => request<Booking[]>("/bookings/owner"),
    getAll: () => request<Booking[]>("/bookings"),
    getById: (id: string) => request<Booking>(`/bookings/${id}`),
    updateStatus: (id: string, status: string) =>
      request<Booking>(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  chat: {
    sendMessage: (data: { recipientId: string; resourceId?: string; resourceTitle?: string; content: string }) =>
      request<ChatMessage>("/chat/send", { method: "POST", body: JSON.stringify(data) }),

    getConversation: (peerId: string) =>
      request<ChatMessage[]>(`/chat/conversation/${peerId}`),

    getConversations: () =>
      request<ConversationSummary[]>("/chat/conversations"),
  },

  reviews: {
    create: (data: Review) =>
      request<Review>("/reviews", { method: "POST", body: JSON.stringify(data) }),
    getByTarget: (targetType: string, targetId: string) =>
      request<Review[]>(`/reviews/target/${targetType}/${targetId}`),
  },

  ai: {
    chat: (message: string, history?: { role: string; content: string }[]) =>
      request<AiChatResponse>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message, history: history || [] }),
      }),
  },

  admin: {
    getStats: () =>
      request<{
        totalUsers: number;
        totalMachinery: number;
        totalSeeds: number;
        totalLabour: number;
        totalOperators: number;
        totalBookings: number;
      }>("/admin/stats"),

    getUsers: () => request<User[]>("/admin/users"),
    deleteUser: (id: string) =>
      request<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" }),
  },
};
