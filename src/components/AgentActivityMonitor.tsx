'use client';

import { motion } from 'framer-motion';
import { useAgentActivity } from '@/hooks/useDataFeeds';
import { Cpu, Zap } from 'lucide-react';

interface Agent {
  name: string;
  icon: string;
  script: string;
  description: string;
  lastRun: string;
  status?: string;
  recentLogs?: Array<{ agent: string; action: string; type: string }>;
}

export function AgentActivityMonitor() {
  const { data, loading } = useAgentActivity();
  const agents = (data as any[]) || [];

  if (loading && !agents.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--m2-text-secondary)' }}>
          Agent Activity
        </h3>
        <span
          className="text-[10px] px-2 py-1 rounded font-mono"
          style={{
            background: 'var(--m2-surface)',
            color: 'var(--m2-green)',
          }}
        >
          {agents.filter((a: Agent) => a.status === 'running').length} active
        </span>
      </div>

      <div className="space-y-2">
        {agents.map((agent: Agent, i: number) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" style={{ color: 'var(--m2-gold)' }} />
                <div>
                  <div className="text-sm font-medium text-white">{agent.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--m2-text-muted)' }}>
                    {agent.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] px-2 py-1 rounded-full font-mono"
                  style={{
                    background:
                      agent.status === 'running'
                        ? '#22c55e20'
                        : '#f5a62220',
                    color:
                      agent.status === 'running'
                        ? '#22c55e'
                        : '#f5a622',
                  }}
                >
                  {agent.status || 'idle'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div style={{ color: 'var(--m2-text-muted)' }}>
                Last: {agent.lastRun}
              </div>
              <div className="flex items-center gap-1">
                {agent.status === 'running' && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-500 animate-pulse" />
                    <span style={{ color: '#3b82f6' }}>Processing</span>
                  </div>
                )}
              </div>
            </div>

            {agent.recentLogs && agent.recentLogs.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                {agent.recentLogs.slice(0, 2).map((log, j) => (
                  <div key={j} className="text-[10px]" style={{ color: 'var(--m2-text-muted)' }}>
                    → {log.action}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
