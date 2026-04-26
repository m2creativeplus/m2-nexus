import { FileText, Search, Activity, Users, FileBarChart, Globe, ShieldCheck, Zap } from "lucide-react";

export const SEO_CATEGORIES = [
  { id: "technical_seo", name: "Technical SEO", weight: 25, icon: "Zap" },
  { id: "onpage_seo", name: "On-Page SEO", weight: 15, icon: "Search" },
  { id: "performance", name: "Performance", weight: 10, icon: "Activity" },
  { id: "ux", name: "User Experience", weight: 10, icon: "Users" },
  { id: "content_transparency", name: "Content & Transparency", weight: 15, icon: "FileText" },
  { id: "digital_presence", name: "Digital Presence", weight: 10, icon: "Globe" },
  { id: "authority", name: "Authority & Trust", weight: 10, icon: "ShieldCheck" },
  { id: "open_data", name: "Open Data & Innovation", weight: 5, icon: "FileBarChart" }
];

export const SEO_CHECKLIST = [
  // 1. Technical SEO
  { id: 1, category: "technical_seo", title: "robots.txt exists", points: 1 },
  { id: 2, category: "technical_seo", title: "robots.txt valid syntax", points: 1 },
  { id: 3, category: "technical_seo", title: "XML sitemap present", points: 1 },
  { id: 4, category: "technical_seo", title: "XML sitemap accessible", points: 1 },
  { id: 5, category: "technical_seo", title: "Sitemap submitted to search engines", points: 1 },
  { id: 6, category: "technical_seo", title: "No crawl blocking errors", points: 1 },
  { id: 7, category: "technical_seo", title: "Correct robots meta tags", points: 1 },
  { id: 8, category: "technical_seo", title: "Crawl depth under 4 levels", points: 1 },
  { id: 9, category: "technical_seo", title: "No orphan pages", points: 1 },
  { id: 10, category: "technical_seo", title: "Correct internal crawl paths", points: 1 },
  { id: 11, category: "technical_seo", title: "Pages indexed correctly", points: 1 },
  { id: 12, category: "technical_seo", title: "No duplicate indexed pages", points: 1 },
  { id: 13, category: "technical_seo", title: "Canonical tags present", points: 1 },
  { id: 14, category: "technical_seo", title: "Canonical tags correct", points: 1 },
  { id: 15, category: "technical_seo", title: "No indexation of admin pages", points: 1 },
  { id: 16, category: "technical_seo", title: "Pagination handled properly", points: 1 },
  { id: 17, category: "technical_seo", title: "hreflang implemented (if multilingual)", points: 1 },
  { id: 18, category: "technical_seo", title: "SEO-friendly URLs", points: 1 },
  { id: 19, category: "technical_seo", title: "URLs lowercase", points: 1 },
  { id: 20, category: "technical_seo", title: "No spaces in URLs", points: 1 },
  { id: 21, category: "technical_seo", title: "No dynamic query parameters", points: 1 },
  { id: 22, category: "technical_seo", title: "Hyphen-separated URLs", points: 1 },
  { id: 23, category: "technical_seo", title: "Logical hierarchy in URLs", points: 1 },
  { id: 24, category: "technical_seo", title: "No redirect loops", points: 1 },
  { id: 25, category: "technical_seo", title: "No redirect chains", points: 1 },
  { id: 26, category: "technical_seo", title: "Proper 301 redirects", points: 1 },
  { id: 27, category: "technical_seo", title: "HTTP → HTTPS redirect", points: 1 },
  { id: 28, category: "technical_seo", title: "No 404 internal links", points: 1 },
  { id: 29, category: "technical_seo", title: "No server errors (5xx)", points: 1 },
  { id: 30, category: "technical_seo", title: "Correct status responses", points: 1 },
  // 2. Security (Merged into Technical SEO for this framework)
  { id: 31, category: "technical_seo", title: "HTTPS enabled", points: 1 },
  { id: 32, category: "technical_seo", title: "SSL certificate valid", points: 1 },
  { id: 33, category: "technical_seo", title: "No mixed content", points: 1 },
  { id: 34, category: "technical_seo", title: "HSTS header present", points: 1 },
  { id: 35, category: "technical_seo", title: "X-Frame-Options header", points: 1 },
  { id: 36, category: "technical_seo", title: "X-Content-Type-Options header", points: 1 },
  { id: 37, category: "technical_seo", title: "Content-Security-Policy", points: 1 },
  { id: 38, category: "technical_seo", title: "Secure cookies", points: 1 },
  { id: 39, category: "technical_seo", title: "Malware check", points: 1 },
  { id: 40, category: "technical_seo", title: "No exposed directories", points: 1 },
  // 3. Performance Optimization
  { id: 41, category: "performance", title: "LCP under 2.5 seconds", points: 1 },
  { id: 42, category: "performance", title: "CLS under 0.1", points: 1 },
  { id: 43, category: "performance", title: "INP/FID within acceptable range", points: 1 },
  { id: 44, category: "performance", title: "Page load under 2 seconds", points: 1 },
  { id: 45, category: "performance", title: "Server response under 200ms", points: 1 },
  { id: 46, category: "performance", title: "CDN implemented", points: 1 },
  { id: 47, category: "performance", title: "Browser caching enabled", points: 1 },
  { id: 48, category: "performance", title: "CSS minified", points: 1 },
  { id: 49, category: "performance", title: "JavaScript minified", points: 1 },
  { id: 50, category: "performance", title: "HTML minified", points: 1 },
  { id: 51, category: "performance", title: "GZIP or Brotli compression", points: 1 },
  { id: 52, category: "performance", title: "Images compressed", points: 1 },
  { id: 53, category: "performance", title: "WebP format used", points: 1 },
  { id: 54, category: "performance", title: "Lazy loading enabled", points: 1 },
  { id: 55, category: "performance", title: "Responsive images", points: 1 },
  { id: 56, category: "performance", title: "Reduce render blocking resources", points: 1 },
  { id: 57, category: "performance", title: "JS bundle size optimized", points: 1 },
  { id: 58, category: "performance", title: "Fonts optimized", points: 1 },
  { id: 59, category: "performance", title: "Preconnect and preload used", points: 1 },
  { id: 60, category: "performance", title: "Critical CSS implemented", points: 1 },
  // 4. On-Page SEO
  { id: 61, category: "onpage_seo", title: "Unique page titles", points: 1 },
  { id: 62, category: "onpage_seo", title: "Titles under 60 characters", points: 1 },
  { id: 63, category: "onpage_seo", title: "Keyword optimized titles", points: 1 },
  { id: 64, category: "onpage_seo", title: "Meta descriptions present", points: 1 },
  { id: 65, category: "onpage_seo", title: "Meta descriptions unique", points: 1 },
  { id: 66, category: "onpage_seo", title: "Descriptions under 160 characters", points: 1 },
  { id: 67, category: "onpage_seo", title: "Single H1 per page", points: 1 },
  { id: 68, category: "onpage_seo", title: "Logical heading hierarchy", points: 1 },
  { id: 69, category: "onpage_seo", title: "Keyword in H1", points: 1 },
  { id: 70, category: "onpage_seo", title: "Content length adequate", points: 1 },
  { id: 71, category: "onpage_seo", title: "Keyword density natural", points: 1 },
  { id: 72, category: "onpage_seo", title: "No duplicate content", points: 1 },
  { id: 73, category: "onpage_seo", title: "No thin pages", points: 1 },
  { id: 74, category: "onpage_seo", title: "Semantic keywords used", points: 1 },
  { id: 75, category: "onpage_seo", title: "Images have ALT attributes", points: 1 },
  { id: 76, category: "onpage_seo", title: "Image filenames optimized", points: 1 },
  { id: 77, category: "onpage_seo", title: "Internal links present", points: 1 },
  { id: 78, category: "onpage_seo", title: "Anchor text descriptive", points: 1 },
  { id: 79, category: "onpage_seo", title: "No broken internal links", points: 1 },
  { id: 80, category: "onpage_seo", title: "Logical internal linking structure", points: 1 },
  { id: 81, category: "onpage_seo", title: "External references credible", points: 1 },
  { id: 82, category: "onpage_seo", title: "No broken external links", points: 1 },
  { id: 83, category: "onpage_seo", title: "External links open in new tab", points: 1 },
  { id: 84, category: "onpage_seo", title: "OpenGraph tags", points: 1 },
  { id: 85, category: "onpage_seo", title: "Twitter cards", points: 1 },
  // 5. User Experience (UX)
  { id: 86, category: "ux", title: "Clear navigation structure", points: 1 },
  { id: 87, category: "ux", title: "Breadcrumb navigation", points: 1 },
  { id: 88, category: "ux", title: "Search function available", points: 1 },
  { id: 89, category: "ux", title: "Mobile responsive design", points: 1 },
  { id: 90, category: "ux", title: "Touch targets large enough", points: 1 },
  { id: 91, category: "ux", title: "Mobile navigation optimized", points: 1 },
  { id: 92, category: "ux", title: "Consistent layout", points: 1 },
  { id: 93, category: "ux", title: "Readable typography", points: 1 },
  { id: 94, category: "ux", title: "Adequate spacing", points: 1 },
  { id: 95, category: "ux", title: "WCAG compliance", points: 1 },
  { id: 96, category: "ux", title: "Color contrast sufficient", points: 1 },
  { id: 97, category: "ux", title: "ARIA labels used", points: 1 },
  { id: 98, category: "ux", title: "Keyboard navigation possible", points: 1 },
  { id: 99, category: "ux", title: "Accessible forms", points: 1 },
  { id: 100, category: "ux", title: "Fast UI interactions", points: 1 },
  // 6. Content Quality & Authority
  { id: 101, category: "authority", title: "Author information", points: 1 },
  { id: 102, category: "authority", title: "Content citations", points: 1 },
  { id: 103, category: "authority", title: "Expert authorship", points: 1 },
  { id: 104, category: "authority", title: "Institutional credibility", points: 1 },
  { id: 105, category: "authority", title: "Content accuracy", points: 1 },
  { id: 106, category: "authority", title: "Comprehensive topic coverage", points: 1 },
  { id: 107, category: "authority", title: "Multimedia use (images/video)", points: 1 },
  { id: 108, category: "authority", title: "Updated content regularly", points: 1 },
  { id: 109, category: "authority", title: "Content readability", points: 1 },
  { id: 110, category: "authority", title: "Contact details", points: 1 },
  { id: 111, category: "authority", title: "Privacy policy", points: 1 },
  { id: 112, category: "authority", title: "Terms of service", points: 1 },
  { id: 113, category: "authority", title: "About organization page", points: 1 },
  { id: 114, category: "authority", title: "Team profiles", points: 1 },
  { id: 115, category: "authority", title: "Institutional mission", points: 1 },
  // 7. Digital Presence & Social Media
  { id: 116, category: "digital_presence", title: "Facebook page linked", points: 1 },
  { id: 117, category: "digital_presence", title: "Twitter/X profile", points: 1 },
  { id: 118, category: "digital_presence", title: "YouTube channel", points: 1 },
  { id: 119, category: "digital_presence", title: "LinkedIn presence", points: 1 },
  { id: 120, category: "digital_presence", title: "Telegram or messaging channels", points: 1 },
  { id: 121, category: "digital_presence", title: "Regular posting", points: 1 },
  { id: 122, category: "digital_presence", title: "Social sharing buttons", points: 1 },
  { id: 123, category: "digital_presence", title: "Embedded media", points: 1 },
  { id: 124, category: "digital_presence", title: "Branding consistency", points: 1 },
  { id: 125, category: "digital_presence", title: "Social engagement indicators", points: 1 },
  // 8. Backlinks & Authority (Continued in Authority category)
  { id: 126, category: "authority", title: "Domain authority", points: 1 },
  { id: 127, category: "authority", title: "Number of backlinks", points: 1 },
  { id: 128, category: "authority", title: "Referring domains", points: 1 },
  { id: 129, category: "authority", title: "High-quality backlinks", points: 1 },
  { id: 130, category: "authority", title: "Government or academic backlinks", points: 1 },
  { id: 131, category: "authority", title: "No toxic backlinks", points: 1 },
  { id: 132, category: "authority", title: "Balanced anchor text profile", points: 1 },
  { id: 133, category: "authority", title: "Brand mentions online", points: 1 },
  { id: 134, category: "authority", title: "Media citations", points: 1 },
  { id: 135, category: "authority", title: "Academic citations", points: 1 },
  // 9. Government Transparency
  { id: 136, category: "content_transparency", title: "Leadership profiles published", points: 1 },
  { id: 137, category: "content_transparency", title: "Organizational structure visible", points: 1 },
  { id: 138, category: "content_transparency", title: "Strategic plans available", points: 1 },
  { id: 139, category: "content_transparency", title: "Public reports accessible", points: 1 },
  { id: 140, category: "content_transparency", title: "Budget or financial disclosures", points: 1 },
  { id: 141, category: "content_transparency", title: "Public laws or policies", points: 1 },
  { id: 142, category: "content_transparency", title: "Meeting records / sessions", points: 1 },
  { id: 143, category: "content_transparency", title: "Parliamentary votes or agendas", points: 1 },
  { id: 144, category: "content_transparency", title: "Public feedback channel", points: 1 },
  { id: 145, category: "content_transparency", title: "Citizen service information", points: 1 },
  // 10. Digital Innovation & Open Government
  { id: 146, category: "open_data", title: "Open data downloads", points: 1 },
  { id: 147, category: "open_data", title: "Public datasets", points: 1 },
  { id: 148, category: "open_data", title: "API availability", points: 1 },
  { id: 149, category: "open_data", title: "Digital dashboards", points: 1 },
  { id: 150, category: "open_data", title: "Interactive services", points: 1 }
];

export const calculateScore = (passedCheckIds: number[]) => {
  let totalScore = 0;
  
  SEO_CATEGORIES.forEach(category => {
    const categoryChecks = SEO_CHECKLIST.filter(c => c.category === category.id);
    const passedCategoryChecks = categoryChecks.filter(c => passedCheckIds.includes(c.id));
    
    if (categoryChecks.length > 0) {
      const categoryRatio = passedCategoryChecks.length / categoryChecks.length;
      totalScore += categoryRatio * category.weight;
    }
  });
  
  return {
    score: Math.round(totalScore),
    rating: getRating(Math.round(totalScore)),
    passedCount: passedCheckIds.length,
    totalCount: SEO_CHECKLIST.length
  };
};

const getRating = (score: number) => {
  if (score >= 90) return { label: "World-Class Government Portal", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" };
  if (score >= 75) return { label: "Advanced", color: "text-emerald-500", bg: "bg-emerald-500/10" };
  if (score >= 60) return { label: "Developing", color: "text-blue-500", bg: "bg-blue-500/10" };
  if (score >= 40) return { label: "Weak", color: "text-yellow-500", bg: "bg-yellow-500/10" };
  return { label: "Critical", color: "text-red-500", bg: "bg-red-500/10" };
};
