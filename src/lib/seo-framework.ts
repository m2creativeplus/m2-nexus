import { FileText, Search, Activity, Users, FileBarChart, Globe, ShieldCheck, Zap, Lock, BrainCircuit } from "lucide-react";

export const SEO_CATEGORIES = [
  { id: "technical", name: "Technical SEO & Infrastructure", weight: 20, icon: "Zap", total: 50 },
  { id: "semantic", name: "On-Page SEO & Semantic Structure", weight: 10, icon: "Search", total: 30 },
  { id: "performance", name: "Performance & Core Web Vitals", weight: 10, icon: "Activity", total: 25 },
  { id: "ux", name: "UX, Accessibility & Mobile", weight: 10, icon: "Users", total: 25 },
  { id: "transparency", name: "Government Transparency & Public Info", weight: 15, icon: "FileText", total: 35 },
  { id: "presence", name: "Digital Presence & Communications", weight: 10, icon: "Globe", total: 25 },
  { id: "authority", name: "Authority & Institutional Legitimacy", weight: 10, icon: "ShieldCheck", total: 30 },
  { id: "open_data", name: "Open Data, APIs & Innovation", weight: 5, icon: "FileBarChart", total: 15 },
  { id: "security", name: "Security & Cyber Governance", weight: 5, icon: "Lock", total: 10 },
  { id: "ai_ready", name: "AI Readiness & LLM Visibility", weight: 5, icon: "BrainCircuit", total: 15 }
];

export const SEO_CHECKLIST = [
  // 1. Technical SEO & Infrastructure (50 Checks)
  { id: 1, category: "technical", title: "robots.txt exists", points: 1 },
  { id: 2, category: "technical", title: "robots.txt valid syntax", points: 1 },
  { id: 3, category: "technical", title: "XML sitemap present", points: 1 },
  { id: 4, category: "technical", title: "DNSSEC configured", points: 1 },
  { id: 5, category: "technical", title: "IPv6 enabled", points: 1 },
  { id: 6, category: "technical", title: "Stable uptime monitoring", points: 1 },
  { id: 7, category: "technical", title: "Organization Schema (JSON-LD)", points: 1 },
  { id: 8, category: "technical", title: "GovernmentOrganization Schema", points: 1 },
  { id: 9, category: "technical", title: "Person Schema (Ministers)", points: 1 },
  { id: 10, category: "technical", title: "Dataset Schema present", points: 1 },
  { id: 11, category: "technical", title: "Canonical tags present", points: 1 },
  { id: 12, category: "technical", title: "No crawl blocking errors", points: 1 },
  { id: 13, category: "technical", title: "Crawl depth < 4", points: 1 },
  { id: 14, category: "technical", title: "Correct status responses (200/404/301)", points: 1 },
  { id: 15, category: "technical", title: "HSTS header present", points: 1 },
  { id: 16, category: "technical", title: "X-Frame-Options header", points: 1 },
  { id: 17, category: "technical", title: "Content-Security-Policy", points: 1 },
  { id: 18, category: "technical", title: "SSL certificate valid", points: 1 },
  { id: 19, category: "technical", title: "Server-side rendering enabled", points: 1 },
  { id: 20, category: "technical", title: "Edge caching implemented", points: 1 },
  // ... (Full 260 checks would be too long for one edit, initializing the structure)

  // 5. Government Transparency & Public Information (35 Checks)
  { id: 101, category: "transparency", title: "Minister Profile published", points: 1 },
  { id: 102, category: "transparency", title: "Director General listed", points: 1 },
  { id: 103, category: "transparency", title: "Organizational Chart downloadable", points: 1 },
  { id: 104, category: "transparency", title: "Founding Law accessible", points: 1 },
  { id: 105, category: "transparency", title: "Strategic Plan 2024-2026 published", points: 1 },
  { id: 106, category: "transparency", title: "Annual Audit Reports visible", points: 1 },
  { id: 107, category: "transparency", title: "Procurement Tenders active", points: 1 },
  { id: 108, category: "transparency", title: "Budget Transparency disclosure", points: 1 },
  { id: 109, category: "transparency", title: "Public Information Officer contact", points: 1 },
  { id: 110, category: "transparency", title: "Official Gazette archives", points: 1 },

  // 10. AI Readiness & LLM Visibility (15 Checks)
  { id: 201, category: "ai_ready", title: "AI-readable structure (Semantic Chunking)", points: 1 },
  { id: 202, category: "ai_ready", title: "Clear entity definitions (Wikidata links)", points: 1 },
  { id: 203, category: "ai_ready", title: "FAQ optimized for NLP", points: 1 },
  { id: 204, category: "ai_ready", title: "Knowledge Graph readiness", points: 1 },
  { id: 205, category: "ai_ready", title: "ChatGPT discoverability optimized", points: 1 },
  { id: 206, category: "ai_ready", title: "Gemini visibility verified", points: 1 },
  { id: 207, category: "ai_ready", title: "Perplexity indexing functional", points: 1 },
  { id: 208, category: "ai_ready", title: "Structured summaries present", points: 1 }
];

export const calculateScore = (passedCheckIds: number[]) => {
  let totalWeightedScore = 0;
  
  SEO_CATEGORIES.forEach(category => {
    const categoryChecks = SEO_CHECKLIST.filter(c => c.category === category.id);
    const passedCategoryChecks = categoryChecks.filter(c => passedCheckIds.includes(c.id));
    
    if (categoryChecks.length > 0) {
      const categoryRatio = passedCategoryChecks.length / categoryChecks.length;
      totalWeightedScore += categoryRatio * category.weight;
    }
  });
  
  const score = Math.round(totalWeightedScore);
  
  return {
    score,
    rating: getRating(score),
    passedCount: passedCheckIds.length,
    totalCount: SEO_CHECKLIST.length
  };
};

const getRating = (score: number) => {
  if (score >= 90) return { label: "World-Class Digital Government", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" };
  if (score >= 75) return { label: "Advanced Institutional Presence", color: "text-emerald-500", bg: "bg-emerald-500/10" };
  if (score >= 60) return { label: "Functional but Weak", color: "text-blue-500", bg: "bg-blue-500/10" };
  if (score >= 40) return { label: "High Risk", color: "text-yellow-500", bg: "bg-yellow-500/10" };
  return { label: "Critical Failure", color: "text-red-500", bg: "bg-red-500/10" };
};
