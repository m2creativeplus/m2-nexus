'use client';

import { motion } from 'framer-motion';
import { useLiveLogs } from '@/hooks/useDataFeeds';
import { AlertCircle, CheckCircle2, Info, Activity } from 'lucide-react';

interface LiveLog {
  agent: string;
  action: string;
  type: 'info' | 'success' | 'error' | 'running';
  timestamp?: string;
}

export function LiveLogsFeed() {
  const { data, loading } = useLiveLogs();
  const logs = (data as LiveLog[]) || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      default:
        return <Info className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#22c55e';
      case 'error':
        return '#ef4444';
      case 'running':
        return '#3b82f6';
      default:
        return '#f59e0b';
    }
  };

  if (loading && !logs.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-3"
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-2 max-h-96 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--m2-text-secondary)' }}>
          Live Activity Log
        </h3>
        <span
          className="text-[10px] px-2 py-1 rounded font-mono"
          style={{
            background: 'var(--m2-surface)',
            color: 'var(--m2-green)',
          }}
        >
          {logs.length} events
        </span>
      </div>

      <div className="space-y-1">
        {logs.map((log: LiveLog, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="pt-0.5 shrink-0">{getIcon(log.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: getColor(log.type) }}>
                {log.agent}
              </div>
              <div className="text-[11px] truncate" style={{ color: 'var(--m2-text-muted)' }}>
                {log.action}
              </div>
              {log.timestamp && (
                <div className="text-[9px] mt-0.5" style={{ color: 'var(--m2-text-muted)' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: `${getColor(log.type)}20`,
                color: getColor(log.type),
              }}
            >
              {log.type}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
