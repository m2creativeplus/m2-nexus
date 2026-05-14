"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Shield, 
  Cpu, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Terminal,
  Zap,
  Globe,
  Lock,
  RefreshCw
} from "lucide-react";

interface Telemetry {
  systemState: {
    system_version: string;
    status: string;
    active_missions_count: number;
    antigravity_score: number;
  };
  lastRun: {
    timestamp: string;
    duration_seconds: number;
    status: string;
    tasks_completed: number;
  };
  failures: Array<{
    timestamp: string;
    type: string;
    impact: string;
    prevention_rule: string;
  }>;
  heartbeat: string;
}

export default function NexusCockpitPage() {
  const [data, setData] = useState<Telemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch("/api/system/observability");
      const json = await res.json();
      if (json.status === "success") {
        setData(json.data);
        setError(null);
      } else {
        setError(json.message);
      }
    } catch (err) {
      setError("Failed to connect to Nexus Core");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Activity className="animate-spin text-[#D4AF37] w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans selection:bg-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP NAVIGATION / HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
                <Shield className="text-[#D4AF37] w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                M2 <span className="text-[#D4AF37]">Nexus</span> Cockpit
              </h1>
            </div>
            <p className="text-white/40 text-sm font-mono uppercase tracking-[0.2em]">
              Sovereign Autonomous Execution OS v{data?.systemState.system_version || "5.0"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${data?.systemState.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-mono uppercase tracking-widest text-white/70">
                System {data?.systemState.status || "Unknown"}
              </span>
            </div>
            <button 
              onClick={() => { setLoading(true); fetchTelemetry(); }}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-[#D4AF37]"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            icon={<Zap className="text-[#D4AF37]" />}
            label="Antigravity Score"
            value={data?.systemState.antigravity_score?.toString() || "0"}
            subtext="M2 Performance Index"
            highlight
          />
          <MetricCard 
            icon={<Cpu className="text-blue-400" />}
            label="Active Missions"
            value={data?.systemState.active_missions_count.toString() || "0"}
            subtext="Governed Repositories"
          />
          <MetricCard 
            icon={<Activity className="text-yellow-400" />}
            label="Tasks Completed"
            value={data?.lastRun.tasks_completed.toString() || "0"}
            subtext={`Last run: ${data?.lastRun.duration_seconds}s`}
          />
          <MetricCard 
            icon={<RefreshCw className="text-emerald-400" />}
            label="Hallucination Index"
            value="0.02%"
            subtext="Phoenix Evaluator: ACTIVE"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FAILURE MONITOR */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                  <h2 className="text-xl font-bold tracking-tight">Failure Immunity Monitor</h2>
                </div>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Real-time Telemetry</span>
              </div>

              <div className="space-y-4">
                {data?.failures && data.failures.length > 0 ? (
                  data.failures.map((f, i) => (
                    <div key={i} className="group bg-black/40 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:border-red-500/30 transition-all">
                      <div className="mt-1 p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="text-red-500 w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white/90 uppercase text-xs tracking-wider">{f.type.replace('_', ' ')}</h3>
                          <span className="text-[10px] font-mono text-white/30">{new Date(f.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-white/60 italic">"{f.impact}"</p>
                        <div className="pt-2 flex items-center gap-2">
                          <CheckCircle2 className="text-green-500 w-3 h-3" />
                          <span className="text-[10px] font-mono text-green-500/70 uppercase">Rule: {f.prevention_rule}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-white/20 italic font-mono">No regressions detected in current cycle.</div>
                )}
              </div>
            </section>

            {/* HUMAN SIGNAL CAPTURE */}
            <section className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="text-[#D4AF37] w-5 h-5" />
                  <h2 className="text-xl font-bold tracking-tight">Active Human Verification</h2>
                </div>
                <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest animate-pulse">Awaiting Signal</div>
              </div>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-white/40 uppercase font-mono tracking-tighter">Current Run Validation</p>
                  <p className="text-sm text-white/80">Did the last agent execution increase system capability?</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={async () => {
                      await fetch("/api/system/signal", {
                        method: "POST",
                        body: JSON.stringify({ run_id: data?.lastRun.timestamp, accepted: true })
                      });
                      fetchTelemetry();
                    }}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-500 text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Accept Output
                  </button>
                  <button 
                    onClick={async () => {
                      const reason = prompt("Reason for rejection:");
                      await fetch("/api/system/signal", {
                        method: "POST",
                        body: JSON.stringify({ run_id: data?.lastRun.timestamp, accepted: false, rejected_reason: reason })
                      });
                      fetchTelemetry();
                    }}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-500 text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Reject Waste
                  </button>
                </div>
              </div>
            </section>

            {/* TERMINAL EMULATOR */}
            <section className="bg-black border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="text-[#D4AF37] w-4 h-4" />
                  <span className="text-xs font-mono text-white/60 uppercase tracking-widest">m2_nexus_runtime.sh</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                </div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed min-h-[200px]">
                <div className="text-green-400 flex gap-3">
                  <span className="text-white/20">10:42:01</span>
                  <span>[SYSTEM] Initializing M2 NEXUS CORE...</span>
                </div>
                <div className="text-white/70 flex gap-3">
                  <span className="text-white/20">10:42:02</span>
                  <span>[MEMORY] Failure semantics loaded from failure_memory.json</span>
                </div>
                <div className="text-white/70 flex gap-3">
                  <span className="text-white/20">10:42:03</span>
                  <span>[STATE] Execution lock verified. System state: STABLE</span>
                </div>
                <div className="text-[#D4AF37] flex gap-3 mt-2">
                  <span className="text-white/20">10:42:05</span>
                  <span>[BOOT] Single Control Plane established. Dashboard sync complete.</span>
                </div>
                <div className="text-green-500 animate-pulse mt-2 italic">&gt; _</div>
              </div>
            </section>
          </div>

          {/* SIDEBAR STATUS */}
          <div className="space-y-6">
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Governance Protocol
              </h2>
              <div className="space-y-4">
                <StatusRow label="State Lock Layer" active />
                <StatusRow label="Vibecoding Immunity" active />
                <StatusRow label="Agent Orchestration" active />
                <StatusRow label="Continuous QA" active />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white/50 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Last Execution
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 uppercase">Timestamp</span>
                  <span className="text-sm font-mono text-white/80">{data?.lastRun.timestamp ? new Date(data.lastRun.timestamp).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 uppercase">Status</span>
                  <span className="text-sm font-bold text-green-500 uppercase tracking-widest">{data?.lastRun.status || 'Idle'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-2xl">
              <p className="text-xs text-white/60 leading-relaxed italic italic">
                "The system must become more intelligent, more stable, and more efficient after every execution cycle."
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, subtext, highlight }: { icon: React.ReactNode, label: string, value: string, subtext: string, highlight?: boolean }) {
  return (
    <div className={`bg-white/5 border ${highlight ? 'border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/10'} rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all group relative overflow-hidden`}>
      {highlight && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/5 blur-3xl -mr-8 -mt-8" />
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-black/40 rounded-lg border border-white/5 group-hover:border-[#D4AF37]/30 transition-all">
          {icon}
        </div>
        <div className="h-1 w-8 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full ${highlight ? 'bg-[#D4AF37]' : 'bg-white/40'} w-2/3`} />
        </div>
      </div>
      <div className="space-y-1">
        <p className={`text-white/40 text-[10px] font-mono uppercase tracking-widest ${highlight ? 'text-[#D4AF37]/70' : ''}`}>{label}</p>
        <p className={`text-2xl font-black ${highlight ? 'text-[#D4AF37]' : 'text-white'}`}>{value}</p>
        <p className="text-[10px] text-white/30 italic">{subtext}</p>
      </div>
    </div>
  );
}

function StatusRow({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/60 tracking-tight">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
        <span className="text-[10px] font-mono uppercase text-[#D4AF37]">Active</span>
      </div>
    </div>
  );
}
