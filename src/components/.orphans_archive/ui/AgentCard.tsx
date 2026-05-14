import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { ArrowRight, Cpu } from 'lucide-react';

interface AgentCardProps {
  name: string;
  purpose: string;
  status: 'active' | 'processing' | 'error' | 'offline' | 'idle';
  cpuLoad: number;
  lastTask: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AgentCard({ name, purpose, status, cpuLoad, lastTask, onClick, disabled }: AgentCardProps) {
  return (
    <GlassCard hoverEffect className="flex flex-col h-full group relative overflow-hidden p-6">
      <div className="absolute top-0 right-0 p-4">
        <StatusIndicator status={status} />
      </div>
      
      <div className="mb-6 mt-2">
        <h3 className="text-lg font-semibold text-white group-hover:text-gold-500 transition-colors">{name}</h3>
        <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">{purpose}</p>
      </div>

      <div className="space-y-4 mb-6 flex-1">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Load</span>
            <span>{cpuLoad}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold-500 rounded-full transition-all duration-1000" 
              style={{ width: `${cpuLoad}%`, backgroundColor: '#D4AF37' }}
            />
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-3 border border-white/5">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Last Action</p>
          <p className="text-xs text-zinc-300 font-mono truncate">{lastTask}</p>
        </div>
      </div>

      <GoldButton 
        variant="outline" 
        size="sm" 
        onClick={onClick}
        disabled={disabled}
        className="w-full group-hover:bg-gold-500 group-hover:text-black hover:bg-[#D4AF37] hover:text-black transition-all"
      >
        Enter Agent <ArrowRight className="w-3 h-3 ml-1" />
      </GoldButton>
    </GlassCard>
  );
}
