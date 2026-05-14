import { Circle } from "lucide-react";

export function Badge({ status, label, color }: { status: string; label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {status === "live"
        ? <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: color }} />
        : <Circle className="w-2.5 h-2.5" />}
      {label}
    </span>
  );
}
