"use client";

import { useState, useMemo } from "react";
import { SEO_CHECKLIST, SEO_CATEGORIES, calculateScore } from "@/lib/seo-framework";
import { Search, ChevronDown, ChevronRight, Activity, Globe, ShieldCheck, Zap, FileText, Users, FileBarChart, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Map lucide icons to strings
const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Zap": return <Zap className="w-5 h-5" />;
    case "Search": return <Search className="w-5 h-5" />;
    case "Activity": return <Activity className="w-5 h-5" />;
    case "Users": return <Users className="w-5 h-5" />;
    case "FileText": return <FileText className="w-5 h-5" />;
    case "Globe": return <Globe className="w-5 h-5" />;
    case "ShieldCheck": return <ShieldCheck className="w-5 h-5" />;
    case "FileBarChart": return <FileBarChart className="w-5 h-5" />;
    default: return <Search className="w-5 h-5" />;
  }
};

export default function SEOAuditPage() {
  const [passedChecks, setPassedChecks] = useState<number[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(SEO_CATEGORIES.map(c => c.id));
  const [targetUrl, setTargetUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const results = useMemo(() => calculateScore(passedChecks), [passedChecks]);

  const handleGenerateReport = async () => {
    if (!targetUrl) {
      alert("Please enter a target URL first.");
      return;
    }
    setIsSaving(true);
    try {
      const report = {
        targetUrl,
        score: results.score,
        passedChecks,
        rating: results.rating.label,
        timestamp: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem("m2_seo_audits") || "[]");
      localStorage.setItem("m2_seo_audits", JSON.stringify([report, ...existing].slice(0, 50)));
      alert("Audit Report Saved Successfully!");
    } catch (error) {
      console.error("Error saving audit:", error);
      alert("Failed to save audit.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCheck = (id: number) => {
    setPassedChecks(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const checkAllInCategory = (categoryId: string) => {
    const categoryChecks = SEO_CHECKLIST.filter(c => c.category === categoryId).map(c => c.id);
    const allPassed = categoryChecks.every(id => passedChecks.includes(id));
    
    if (allPassed) {
      setPassedChecks(prev => prev.filter(id => !categoryChecks.includes(id)));
    } else {
      setPassedChecks(prev => [...new Set([...prev, ...categoryChecks])]);
    }
  };

  return (
    <div className="flex h-full w-full bg-black text-zinc-300 font-sans p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Checklist */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Government Digital Audit Tool</h1>
            <p className="text-zinc-400">150-Point comprehensive framework for institutional transparency, SEO, and digital presence.</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex gap-4">
            <input 
              type="url" 
              placeholder="https://somaliland.gov.sl" 
              className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
            <Button className="bg-[#D4AF37] hover:bg-[#B3932F] text-black font-semibold">
              <Search className="w-4 h-4 mr-2" /> Auto-Scan (Demo)
            </Button>
          </div>

          <div className="space-y-4">
            {SEO_CATEGORIES.map(category => {
              const categoryChecks = SEO_CHECKLIST.filter(c => c.category === category.id);
              const passedInCategory = categoryChecks.filter(c => passedChecks.includes(c.id)).length;
              const isExpanded = expandedCategories.includes(category.id);

              return (
                <div key={category.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-black border border-zinc-800 text-[#D4AF37]`}>
                        {getIcon(category.icon)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-zinc-500">Weight: {category.weight}% • {passedInCategory}/{categoryChecks.length} Passed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-zinc-400 hover:text-white h-8"
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); checkAllInCategory(category.id); }}
                      >
                        {passedInCategory === categoryChecks.length ? "Uncheck All" : "Check All"}
                      </Button>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-zinc-500" /> : <ChevronRight className="w-5 h-5 text-zinc-500" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-zinc-800/50 bg-black/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {categoryChecks.map(check => {
                          const isPassed = passedChecks.includes(check.id);
                          return (
                            <div 
                              key={check.id} 
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                isPassed 
                                  ? "border-[#D4AF37]/30 bg-[#D4AF37]/5 text-white" 
                                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400"
                              }`}
                              onClick={() => toggleCheck(check.id)}
                            >
                              <div className="mt-0.5">
                                {isPassed ? (
                                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                                ) : (
                                  <Circle className="w-5 h-5 text-zinc-600" />
                                )}
                              </div>
                              <span className="text-sm">{check.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Scorecard */}
        <div className="col-span-1">
          <div className="sticky top-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Audit Scorecard</h2>
            
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[12px] border-zinc-800">
                <div 
                  className="absolute inset-0 rounded-full border-[12px] border-[#D4AF37]" 
                  style={{ 
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`, 
                    transform: `rotate(${(results.score / 100) * 360}deg)`,
                    transition: 'transform 1s ease-out'
                  }}
                />
                <div className="absolute inset-[2px] bg-black rounded-full flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white">{results.score}</span>
                  <span className="text-sm text-zinc-500 font-medium tracking-widest mt-1">/ 100</span>
                </div>
              </div>
              <div className={`mt-6 px-4 py-1.5 rounded-full border text-sm font-semibold tracking-wide ${results.rating.bg} ${results.rating.color} border-current`}>
                {results.rating.label}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Category Breakdown</h3>
              {SEO_CATEGORIES.map(category => {
                const categoryChecks = SEO_CHECKLIST.filter(c => c.category === category.id);
                const passedInCategory = categoryChecks.filter(c => passedChecks.includes(c.id)).length;
                const percentage = categoryChecks.length > 0 ? (passedInCategory / categoryChecks.length) * 100 : 0;
                
                return (
                  <div key={category.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300">{category.name}</span>
                      <span className="text-zinc-500 font-mono">{passedInCategory}/{categoryChecks.length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#D4AF37] rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <Button 
                onClick={handleGenerateReport}
                disabled={isSaving}
                className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-6 text-lg"
              >
                {isSaving ? "Saving Report..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
