"use client";

import React, { useState, useMemo } from "react";

// --- Types & Interfaces ---
export type ItemStatus = "lost" | "found" | "reunited";
export type ItemCategory =
  | "all"
  | "electronics"
  | "wallets_ids"
  | "keys"
  | "bags"
  | "pets"
  | "jewelry"
  | "clothing"
  | "other";

export interface LostFoundItem {
  id: string;
  title: string;
  type: "lost" | "found";
  category: ItemCategory;
  description: string;
  location: string;
  dateReported: string;
  timeAgo: string;
  reward?: number;
  imageUrl: string;
  reporterName: string;
  contactEmail: string;
  secretVerificationPrompt: string; // Anti-fraud verification question
  matchScore?: number;
  status: ItemStatus;
  urgent?: boolean;
}

// --- Initial Mock Data ---
const INITIAL_ITEMS: LostFoundItem[] = [
  {
    id: "LF-101",
    title: "Space Gray MacBook Pro 14\" (M2)",
    type: "lost",
    category: "electronics",
    description:
      "Left behind on the 3rd floor study carrels near the west window. Has a matte black dbrand skin with a tiny sticker of a pixelated coffee cup near the bottom hinge.",
    location: "Main Campus Library, 3rd Floor West",
    dateReported: "2026-11-19",
    timeAgo: "2 hours ago",
    reward: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    reporterName: "Elena Rostova",
    contactEmail: "elena.r@university.edu",
    secretVerificationPrompt: "What is the lock screen wallpaper quote?",
    status: "lost",
    urgent: true,
    matchScore: 94,
  },
  {
    id: "LF-102",
    title: "Toyota Smart Key Fob with Blue Lanyard",
    type: "found",
    category: "keys",
    description:
      "Found on the grass pathway between Science Hall B and the cafeteria. Attached to a navy woven lanyard with a small bronze turtle charm.",
    location: "Science Quad Walkway",
    dateReported: "2026-11-19",
    timeAgo: "4 hours ago",
    imageUrl:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    reporterName: "Campus Security Desk",
    contactEmail: "safety-desk@campus.org",
    secretVerificationPrompt: "What engraved word is on the back of the bronze charm?",
    status: "found",
  },
  {
    id: "LF-103",
    title: "Golden Beagle Pup 'Archie' - Red Collar",
    type: "lost",
    category: "pets",
    description:
      "Archie slipped his leash near the duck pond. He is very friendly, answers to Archie or 'Treat', wearing a red reflective collar with a missing bell tag.",
    location: "Riverside City Park, North Entrance",
    dateReported: "2026-11-18",
    timeAgo: "Yesterday",
    reward: 350,
    imageUrl:
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
    reporterName: "Marcus Vance",
    contactEmail: "marcus.v@gmail.com",
    secretVerificationPrompt: "What color is his microchip registered tag?",
    status: "lost",
    urgent: true,
  },
  {
    id: "LF-104",
    title: "Saddle Tan Leather Bifold Wallet",
    type: "found",
    category: "wallets_ids",
    description:
      "Found tucked into booth #4 at roasted bean coffee house. Contains driver's license ending in *894 and several membership cards. Handed to cafe manager.",
    location: "Roast & Bean Cafe, Downtown",
    dateReported: "2026-11-18",
    timeAgo: "1 day ago",
    imageUrl:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    reporterName: "Barista Jason",
    contactEmail: "jason@roastbean.coffee",
    secretVerificationPrompt: "State the first name on the student ID card inside.",
    status: "found",
  },
  {
    id: "LF-105",
    title: "Sony WH-1000XM5 Noise Canceling Headphones",
    type: "lost",
    category: "electronics",
    description:
      "Silver/off-white color inside the original hard zipper case. Forgot it under seat 18B on Metro Line 4 towards South Station.",
    location: "Metro Red Line, Train Car #18",
    dateReported: "2026-11-17",
    timeAgo: "2 days ago",
    reward: 75,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    reporterName: "Aaliyah Chen",
    contactEmail: "aaliyah.c@outlook.com",
    secretVerificationPrompt: "What sticker is inside the zippered audio cable pocket?",
    status: "lost",
  },
  {
    id: "LF-106",
    title: "Tortoiseshell Ray-Ban Aviators",
    type: "found",
    category: "jewelry",
    description:
      "Found on the bleachers right after the evening volleyball tournament. Preserved in good condition without scratches.",
    location: "Athletic Fieldhouse Bleachers",
    dateReported: "2026-11-17",
    timeAgo: "2 days ago",
    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    reporterName: "Coach Dave",
    contactEmail: "athletics@community.edu",
    secretVerificationPrompt: "What color is the cleaning cloth inside the case?",
    status: "found",
  },
  {
    id: "LF-107",
    title: "Navy Fjällräven Kånken Backpack",
    type: "found",
    category: "bags",
    description:
      "Contained architecture textbooks and draft sketchbooks. Successfully returned to owner through campus security lockbox!",
    location: "Design Studio Hallway",
    dateReported: "2026-11-15",
    timeAgo: "4 days ago",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    reporterName: "Campus Safety",
    contactEmail: "verified@safety.org",
    secretVerificationPrompt: "Reunited & closed",
    status: "reunited",
  },
];

// --- SVG Icons ---
function IconSearch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconPlus({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function IconLocation({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconShieldCheck({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconSparkles({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconX({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconGrid({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function IconList({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconShare({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function IconHeart({ className = "w-4 h-4", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

// --- Main Page Component ---
export default function LostAndFoundHub() {
  // State
  const [items, setItems] = useState<LostFoundItem[]>(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "lost" | "found" | "reunited">("all");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>("all");
  const [hasRewardOnly, setHasRewardOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<LostFoundItem | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimAnswer, setClaimAnswer] = useState("");
  const [claimClaimantContact, setClaimClaimantContact] = useState("");
  const [claimSuccess, setClaimSuccess] = useState(false);

  // New Item Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "lost" as "lost" | "found",
    category: "electronics" as ItemCategory,
    location: "",
    reward: "",
    description: "",
    reporterName: "",
    contactEmail: "",
    secretVerificationPrompt: "",
    imageUrl:
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
  });

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Save / Bookmark
  const toggleSave = (id: string) => {
    setSavedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast(
      savedItemIds.includes(id)
        ? "Item removed from bookmarks"
        : "Item saved to your watched list!"
    );
  };

  // Filtered Items Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type Filter
      if (selectedType !== "all" && item.type !== selectedType && item.status !== selectedType) {
        return false;
      }
      // Category Filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Reward Filter
      if (hasRewardOnly && (!item.reward || item.reward <= 0)) {
        return false;
      }
      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inLoc = item.location.toLowerCase().includes(q);
        const inReporter = item.reporterName.toLowerCase().includes(q);
        return inTitle || inDesc || inLoc || inReporter;
      }
      return true;
    });
  }, [items, selectedType, selectedCategory, hasRewardOnly, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalLost = items.filter((i) => i.type === "lost" && i.status !== "reunited").length;
    const totalFound = items.filter((i) => i.type === "found" && i.status !== "reunited").length;
    const totalReunited = items.filter((i) => i.status === "reunited").length;
    const totalRewards = items.reduce((acc, curr) => acc + (curr.reward || 0), 0);
    return { totalLost, totalFound, totalReunited, totalRewards };
  }, [items]);

  // Handle Form Submission
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      alert("Please fill in the required fields (Title, Location, and Description).");
      return;
    }

    const newItem: LostFoundItem = {
      id: `LF-${Date.now().toString().slice(-4)}`,
      title: formData.title,
      type: formData.type,
      category: formData.category,
      location: formData.location,
      reward: formData.reward ? parseFloat(formData.reward) : undefined,
      description: formData.description,
      reporterName: formData.reporterName || "Anonymous Resident",
      contactEmail: formData.contactEmail || "community@traceback.org",
      secretVerificationPrompt:
        formData.secretVerificationPrompt || "Identify a distinctive mark or serial prefix.",
      imageUrl:
        formData.imageUrl ||
        "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
      dateReported: new Date().toISOString().split("T")[0],
      timeAgo: "Just now",
      status: formData.type,
      urgent: formData.type === "lost" && Boolean(formData.reward && parseFloat(formData.reward) > 50),
    };

    setItems([newItem, ...items]);
    setIsReportModalOpen(false);
    showToast(`Your ${formData.type.toUpperCase()} report was published successfully!`);

    // Reset Form
    setFormData({
      title: "",
      type: "lost",
      category: "electronics",
      location: "",
      reward: "",
      description: "",
      reporterName: "",
      contactEmail: "",
      secretVerificationPrompt: "",
      imageUrl:
        "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
    });
  };

  // Handle Claim Submission
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setIsClaimModalOpen(false);
      showToast("Claim request submitted! The reporter and campus admin were notified.");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* --- Top Global Announcement Bar --- */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2">
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white">
          Active Hub
        </span>
        <span>
          Campus & Community Lost and Found Network • <strong>94%</strong> average recovery rate this semester
        </span>
      </div>

      {/* --- Main Navigation Bar --- */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-4 ring-indigo-50">
              <IconSparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Trace<span className="text-indigo-600">Back</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Lost & Found Community Exchange
              </p>
            </div>
          </div>

          {/* Quick Search in Nav (Medium+ screens) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search keys, phone, dog, laptop, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <IconX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, type: "lost" }));
                setIsReportModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-lg border border-rose-200 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Report Lost
            </button>

            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, type: "found" }));
                setIsReportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <IconPlus className="w-4 h-4" />
              <span>Report Item</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- Hero Banner & Fast Match Actions --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-medium mb-6">
            <IconShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Scam Verified Protocol with Secret Ownership Checks</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            Lost something precious? <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">
              We help you bring it back home.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-8 font-normal leading-relaxed">
            Report lost belongings, register discovered items, and use instant similarity matching to safely reunite with what was misplaced.
          </p>

          {/* Quick Filter Jump Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            <button
              onClick={() => {
                setSelectedType("lost");
                const el = document.getElementById("catalog-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${selectedType === "lost"
                  ? "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 ring-2 ring-rose-400"
                  : "bg-white/10 text-slate-100 hover:bg-white/15 border-white/20"
                }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              Browse Lost Items ({stats.totalLost})
            </button>

            <button
              onClick={() => {
                setSelectedType("found");
                const el = document.getElementById("catalog-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${selectedType === "found"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400"
                  : "bg-white/10 text-slate-100 hover:bg-white/15 border-white/20"
                }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Browse Found Items ({stats.totalFound})
            </button>

            <button
              onClick={() => {
                setSelectedType("reunited");
                const el = document.getElementById("catalog-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all border ${selectedType === "reunited"
                  ? "bg-indigo-600 text-white border-indigo-500"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border-white/10"
                }`}
            >
              <IconCheck className="w-4 h-4 text-indigo-400" />
              Reunited Hall ({stats.totalReunited})
            </button>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.totalLost}
            </div>
            <div className="text-xs uppercase tracking-wider text-rose-300 font-semibold mt-1">
              Active Missing
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.totalFound}
            </div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mt-1">
              Found & Safekept
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.totalReunited}
            </div>
            <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mt-1">
              Items Reunited
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
              ${stats.totalRewards}
            </div>
            <div className="text-xs uppercase tracking-wider text-amber-200 font-semibold mt-1">
              Active Rewards
            </div>
          </div>
        </div>
      </section>

      {/* --- Catalog Controls & Filter Section --- */}
      <section id="catalog-section" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm mb-8 space-y-5">
          {/* Top row: Status selection & View Mode */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedType === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                All Feed ({items.length})
              </button>
              <button
                onClick={() => setSelectedType("lost")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedType === "lost"
                    ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-200"></span>
                Lost ({items.filter((i) => i.type === "lost" && i.status !== "reunited").length})
              </button>
              <button
                onClick={() => setSelectedType("found")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedType === "found"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-200"></span>
                Found ({items.filter((i) => i.type === "found" && i.status !== "reunited").length})
              </button>
              <button
                onClick={() => setSelectedType("reunited")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedType === "reunited"
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Reunited ({items.filter((i) => i.status === "reunited").length})
              </button>
            </div>

            {/* Right side utilities: Rewards toggle & Layout toggle */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 bg-amber-50 hover:bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-200/80 transition-colors">
                <input
                  type="checkbox"
                  checked={hasRewardOnly}
                  onChange={(e) => setHasRewardOnly(e.target.checked)}
                  className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500 border-amber-300"
                />
                <span className="text-amber-900">With Reward ($)</span>
              </label>

              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-md ${viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-700"
                    }`}
                >
                  <IconGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`p-1.5 rounded-md ${viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-700"
                    }`}
                >
                  <IconList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Browse by category
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { id: "all", label: "All Items" },
                  { id: "electronics", label: "📱 Tech & Electronics" },
                  { id: "keys", label: "🔑 Keys & Keyfobs" },
                  { id: "wallets_ids", label: "💳 Wallets & IDs" },
                  { id: "bags", label: "🎒 Bags & Luggage" },
                  { id: "pets", label: "🐾 Pets & Animals" },
                  { id: "jewelry", label: "💍 Jewelry & Watches" },
                  { id: "clothing", label: "🧥 Clothing & Gear" },
                  { id: "other", label: "📦 Others" },
                ] as { id: ItemCategory; label: string }[]
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Summary Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredItems.length}</strong>{" "}
            {filteredItems.length === 1 ? "entry" : "entries"}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>

          {(searchQuery || selectedCategory !== "all" || selectedType !== "all" || hasRewardOnly) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedType("all");
                setHasRewardOnly(false);
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* --- Items Display Section --- */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
              <IconSearch className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No items found</h3>
            <p className="text-sm text-slate-500 mb-6">
              We couldn't find any listings matching your search criteria. Try loosening your filters or create a new report!
            </p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
            >
              <IconPlus className="w-4 h-4" />
              Publish a New Report
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isSaved = savedItemIds.includes(item.id);
              const isLost = item.type === "lost";
              const isReunited = item.status === "reunited";

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Status Ribbon Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isReunited ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-600 text-white shadow-md flex items-center gap-1">
                          <IconCheck className="w-3 h-3" /> Reunited
                        </span>
                      ) : isLost ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Lost
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          Found
                        </span>
                      )}

                      {item.urgent && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow">
                          Urgent
                        </span>
                      )}
                    </div>

                    {/* Reward Badge */}
                    {item.reward && item.reward > 0 && (
                      <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
                        <span>Reward: ${item.reward}</span>
                      </div>
                    )}

                    {/* AI Similarity Match Pill */}
                    {item.matchScore && (
                      <div className="absolute bottom-2 left-3 bg-slate-900/85 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                        <IconSparkles className="w-3 h-3 text-emerald-400" />
                        <span>{item.matchScore}% Match Found</span>
                      </div>
                    )}

                    {/* Bookmark quick button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(item.id);
                      }}
                      className={`absolute bottom-2 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSaved
                          ? "bg-rose-50 text-rose-600"
                          : "bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white"
                        }`}
                      aria-label="Save item"
                    >
                      <IconHeart className="w-4 h-4" filled={isSaved} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1.5">
                      <span className="uppercase tracking-wider font-semibold text-slate-500">
                        {item.category.replace("_", " & ")}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <IconClock className="w-3.5 h-3.5 text-slate-400" />
                        {item.timeAgo}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedItemForDetail(item)}
                      className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer mb-2"
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
                      {item.description}
                    </p>

                    {/* Location Pin */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100 mb-4">
                      <IconLocation className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedItemForDetail(item)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2"
                      >
                        View Full Details →
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined" && navigator.clipboard) {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/item/${item.id}`
                              );
                              showToast("Direct link copied to clipboard!");
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Share"
                        >
                          <IconShare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedItemForDetail(item);
                            setIsClaimModalOpen(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isReunited
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : isLost
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            }`}
                          disabled={isReunited}
                        >
                          {isReunited ? "Closed" : isLost ? "I Found This" : "Claim Item"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Layout */
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isSaved = savedItemIds.includes(item.id);
              const isLost = item.type === "lost";
              const isReunited = item.status === "reunited";

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemForDetail(item)}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                    />

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isReunited
                              ? "bg-violet-100 text-violet-800"
                              : isLost
                                ? "bg-rose-100 text-rose-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{item.timeAgo}</span>
                        {item.reward && (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            ${item.reward} Reward
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <IconLocation className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 self-end sm:self-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => toggleSave(item.id)}
                      className={`p-2 rounded-lg ${isSaved ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:bg-slate-100"
                        }`}
                    >
                      <IconHeart className="w-4 h-4" filled={isSaved} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedItemForDetail(item);
                        setIsClaimModalOpen(true);
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold ${isReunited
                          ? "bg-slate-100 text-slate-400"
                          : isLost
                            ? "bg-rose-600 text-white hover:bg-rose-700"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                    >
                      {isReunited ? "Reunited" : isLost ? "I Found This" : "Claim"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* --- Safety & Community Guidelines Section --- */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-slate-900">
              Safe Recovery Guidelines
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our 4-step framework engineered to prevent theft, false claims, and spam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Keep Secret Details
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                When posting, keep one identifier secret (e.g. lock screen photo, serial code, engraving) to test claimants.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                AI Match Radar
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our engine automatically matches lost reports against newly registered found items within radius.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Public Safe Zones
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Always arrange handovers at verified campus desks, station info booths, or monitored public places.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Verified Closure
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once exchanged, mark the report as Reunited to credit the finder and keep our directory clutter-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TraceBack</span>
            <span>• Built for Students, Commuters & Local Communities</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how" className="hover:text-indigo-600 transition-colors">
              Terms & Safety
            </a>
            <a href="#privacy" className="hover:text-indigo-600 transition-colors">
              Privacy Shield
            </a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">
              Campus Security Dispatch
            </a>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* --- MODAL: CREATE NEW REPORT (LOST OR FOUND) --- */}
      {/* ======================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <IconX className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${formData.type === "lost" ? "bg-rose-500" : "bg-emerald-600"
                  }`}
              >
                <IconPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {formData.type === "lost" ? "Report a Lost Item" : "Report a Found Item"}
                </h2>
                <p className="text-xs text-slate-500">
                  Provide descriptive details so our matching system can connect you quickly.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, type: "lost" }))}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${formData.type === "lost"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  🔴 I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, type: "found" }))}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${formData.type === "found"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  🟢 I Found Something
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Black Sony Over-Ear Headphones"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Category & Reward Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value as ItemCategory }))
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="electronics">Electronics & Tech</option>
                    <option value="keys">Keys & Badges</option>
                    <option value="wallets_ids">Wallets & IDs</option>
                    <option value="bags">Bags & Luggage</option>
                    <option value="pets">Pets & Animals</option>
                    <option value="jewelry">Jewelry & Accessories</option>
                    <option value="clothing">Clothing & Shoes</option>
                    <option value="other">Other Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reward (Optional $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={formData.reward}
                    onChange={(e) => setFormData((p) => ({ ...p, reward: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location (Where it was lost/found) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <IconLocation className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student Center, 2nd floor lounge near coffee shop"
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Details *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe color, brand, condition, stickers, approximate date and time..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Anti-Fraud Secret Verification Prompt */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3">
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Anti-Theft Secret Question
                </label>
                <p className="text-[11px] text-amber-700 mb-2">
                  Ask a question only the true owner can answer (e.g. "What color is the zipper pull inside?" or "What image is on the lock screen?")
                </p>
                <input
                  type="text"
                  placeholder="e.g. What is the keychain charm?"
                  value={formData.secretVerificationPrompt}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, secretVerificationPrompt: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Image URL / Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo URL (or choose preset)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        imageUrl:
                          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
                      }))
                    }
                    className="px-2.5 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                  >
                    Preset
                  </button>
                </div>
              </div>

              {/* Contact info row */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name / Handle"
                    value={formData.reporterName}
                    onChange={(e) => setFormData((p) => ({ ...p, reporterName: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email for alerts"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((p) => ({ ...p, contactEmail: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-md transition-all ${formData.type === "lost"
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                    }`}
                >
                  Publish {formData.type.toUpperCase()} Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL: ITEM DETAIL VIEW --- */}
      {/* ======================================================== */}
      {selectedItemForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItemForDetail(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>

            {/* Top Large Image Banner */}
            <div className="relative h-64 w-full bg-slate-900">
              <img
                src={selectedItemForDetail.imageUrl}
                alt={selectedItemForDetail.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full ${selectedItemForDetail.status === "reunited"
                        ? "bg-violet-500 text-white"
                        : selectedItemForDetail.type === "lost"
                          ? "bg-rose-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                  >
                    {selectedItemForDetail.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-300">• Reported {selectedItemForDetail.timeAgo}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black">{selectedItemForDetail.title}</h2>
              </div>
            </div>

            {/* Detail Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Rewards or Match Banner */}
              {selectedItemForDetail.reward && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900">
                    <span className="text-lg">💰</span>
                    <span className="text-xs sm:text-sm font-bold">
                      A reward of ${selectedItemForDetail.reward} is offered for safe recovery
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-amber-200 text-amber-900 rounded">
                    Verified
                  </span>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Description & Identifying Clues
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedItemForDetail.description}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Sighted Location
                  </div>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                    <IconLocation className="w-4 h-4 text-indigo-500" />
                    <span>{selectedItemForDetail.location}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Reported By
                  </div>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{selectedItemForDetail.reporterName}</span>
                  </div>
                </div>
              </div>

              {/* Anti-fraud challenge notice */}
              <div className="border border-indigo-100 bg-indigo-50/60 rounded-xl p-4 flex items-start gap-3">
                <IconShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900">
                  <span className="font-bold">Ownership Verification Required: </span>
                  Before this item is released, claimants must answer: &ldquo;
                  <span className="italic font-medium">
                    {selectedItemForDetail.secretVerificationPrompt}
                  </span>
                  &rdquo;
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => toggleSave(selectedItemForDetail.id)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <IconHeart
                    className="w-4 h-4"
                    filled={savedItemIds.includes(selectedItemForDetail.id)}
                  />
                  <span>
                    {savedItemIds.includes(selectedItemForDetail.id)
                      ? "Bookmarked"
                      : "Save Item"}
                  </span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setIsClaimModalOpen(true);
                    }}
                    disabled={selectedItemForDetail.status === "reunited"}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${selectedItemForDetail.status === "reunited"
                        ? "bg-slate-300 cursor-not-allowed"
                        : selectedItemForDetail.type === "lost"
                          ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                          : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                      }`}
                  >
                    {selectedItemForDetail.status === "reunited"
                      ? "Case Closed"
                      : selectedItemForDetail.type === "lost"
                        ? "I Found This Item"
                        : "Verify & Claim This Item"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL: CLAIM & VERIFICATION CHALLENGE --- */}
      {/* ======================================================== */}
      {isClaimModalOpen && selectedItemForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsClaimModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <IconX className="w-4 h-4" />
            </button>

            {claimSuccess ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <IconCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Verification Dispatched!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your verification response has been sent to the reporter and recorded with the campus lost & found administrator.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <IconShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Ownership Verification Challenge
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Item: <strong>{selectedItemForDetail.title}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 mb-4 text-xs text-amber-900">
                  <span className="font-bold">Required Question:</span>
                  <div className="italic text-slate-800 mt-1 font-medium bg-white/70 p-2 rounded-lg border border-amber-200/50">
                    &ldquo;{selectedItemForDetail.secretVerificationPrompt}&rdquo;
                  </div>
                </div>

                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Verification Answer *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Provide specific details, serial letters, or description answering the question..."
                      value={claimAnswer}
                      onChange={(e) => setClaimAnswer(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Contact Info (Email or Phone) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. yourname@university.edu or 555-0192"
                      value={claimClaimantContact}
                      onChange={(e) => setClaimClaimantContact(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsClaimModalOpen(false)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                    >
                      Submit Claim Request
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- TOAST NOTIFICATION --- */}
      {/* ======================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}