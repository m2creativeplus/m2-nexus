# M2 NEXUS — Real Data Feed Integration Guide

## Overview

This guide explains how to integrate real data feeds from your M2 projects (SAIP, Smart School SMS, SNPA) into the M2 NEXUS Dashboard with live updates.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   M2 NEXUS DASHBOARD                    │
│              (Next.js Frontend + React)                 │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   /api/feeds/*  useDataFeeds  Convex Queries
        │            │            │
        ├────────────┼────────────┤
        │     Real-Time Updates   │
        └────────────┼────────────┘
                     │
        ┌────────────┼────────────────────────────────┐
        │            │                                │
        ▼            ▼                                ▼
   SAIP API    Smart School SMS DB        SNPA Portal
   (Projects)     (Metrics)              (Intelligence)
```

---

## Available Data Feeds

### 1. **Project Metrics Feed**
**Endpoint:** `/api/feeds/projects`

Returns:
- Total projects count
- Breakdown by status (live, active, ready)
- Breakdown by priority (P1, P2, P3)
- List of all projects with status

**Usage in Components:**
```typescript
import { useProjectMetrics } from '@/hooks/useDataFeeds';

export function ProjectDashboard() {
  const { data, loading, error } = useProjectMetrics();
  
  return (
    <div>
      <p>Total: {data?.total}</p>
      <p>Live: {data?.byStatus.live}</p>
    </div>
  );
}
```

**Poll Interval:** 10 seconds

---

### 2. **System Statistics Feed**
**Endpoint:** `/api/feeds/system-stats`

Returns:
- CPU usage (%)
- RAM usage (%)
- Storage usage (%)
- Active agents count
- Processing tasks count
- Warnings count

**Usage in Components:**
```typescript
import { useSystemStats } from '@/hooks/useDataFeeds';

export function SystemHealth() {
  const { data } = useSystemStats();
  
  return (
    <div>
      <p>CPU: {data?.cpu}%</p>
      <p>RAM: {data?.ram}%</p>
    </div>
  );
}
```

**Poll Interval:** 5 seconds

---

### 3. **Live Logs Feed**
**Endpoint:** `/api/feeds/logs`

Returns:
- Last 10 activity logs
- Agent name
- Action performed
- Log type (info, success, error, running)
- Timestamp

**Usage in Components:**
```typescript
import { useLiveLogs } from '@/hooks/useDataFeeds';

export function ActivityLog() {
  const { data: logs } = useLiveLogs();
  
  return (
    <ul>
      {logs?.map((log) => (
        <li key={log._id}>{log.action}</li>
      ))}
    </ul>
  );
}
```

**Poll Interval:** 3 seconds

---

### 4. **Agent Activity Feed**
**Endpoint:** `/api/feeds/agents`

Returns:
- Agent name and description
- Current status (idle, running, error)
- Last execution time
- Recent logs for each agent

**Usage in Components:**
```typescript
import { useAgentActivity } from '@/hooks/useDataFeeds';

export function Agents() {
  const { data: agents } = useAgentActivity();
  
  return (
    <ul>
      {agents?.map((agent) => (
        <li key={agent.name}>
          {agent.name} - {agent.status}
        </li>
      ))}
    </ul>
  );
}
```

**Poll Interval:** 8 seconds

---

### 5. **Dashboard Metrics (All-in-One)**
**Endpoint:** `/api/feeds/dashboard`

Returns aggregated data combining all feeds in one request.

**Usage:**
```typescript
import { useDashboardMetrics } from '@/hooks/useDataFeeds';

export function Dashboard() {
  const { data } = useDashboardMetrics();
  
  return (
    <div>
      <p>Projects: {data?.projects.total}</p>
      <p>System CPU: {data?.system.cpu}%</p>
    </div>
  );
}
```

**Poll Interval:** 5 seconds

---

## Integration with External Data Sources

### Step 1: Update Convex Queries

To integrate real SAIP or SNPA data, modify `convex/dataFeeds.ts`:

```typescript
/**
 * Example: Fetch real SAIP project metrics
 */
export const getProjectMetrics = query({
  args: {},
  handler: async (ctx) => {
    // Option 1: Fetch from external API
    const response = await fetch('https://saip.vercel.app/api/metrics');
    const saipData = await response.json();
    
    // Option 2: Query Convex cross-project
    const projects = await ctx.db.query("nexusProjects").collect();
    
    // Merge and transform
    return {
      total: projects.length,
      saipMetrics: saipData,
      ...
    };
  },
});
```

### Step 2: Add Custom Feed Hook

```typescript
// src/hooks/useDataFeeds.ts
export function useSAIPMetrics() {
  return useDataFeed('/api/feeds/saip-metrics', { pollInterval: 10000 });
}
```

### Step 3: Create Corresponding API Route

```typescript
// src/app/api/feeds/saip-metrics/route.ts
export async function GET() {
  try {
    const data = await fetch('https://saip.vercel.app/api/metrics');
    const metrics = await data.json();
    return NextResponse.json({ status: 'success', data: metrics });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
```

---

## Configuring Poll Intervals

Adjust how frequently data updates by passing options:

```typescript
const { data } = useDataFeed('/api/feeds/projects', {
  pollInterval: 15000, // 15 seconds
  onError: (error) => console.error('Feed error:', error),
});
```

**Recommended Intervals:**
- System stats: 3-5s (frequent changes)
- Project metrics: 10-15s (stable data)
- Live logs: 2-3s (user-facing activity)
- Agent status: 8-10s (moderate changes)

---

## Real-Time Updates with WebSockets

For ultra-fast updates, upgrade to WebSocket connections:

```typescript
// src/hooks/useWebSocketFeed.ts
import { useEffect, useState } from 'react';

export function useWebSocketFeed<T>(url: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    
    return () => ws.close();
  }, [url]);

  return data;
}
```

*WebSocket upgrade recommended when feed volume exceeds 50+ events/minute*

---

## Seeding Test Data

To populate initial test data:

1. Run Convex development:
   ```bash
   cd M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/m2-nexus
   npx convex dev
   ```

2. In another terminal, seed data:
   ```bash
   npx convex run seedData:seedTestData
   ```

3. Refresh dashboard to see live feeds populate

---

## Monitoring Feed Health

Add a feed health indicator:

```typescript
export function FeedHealth() {
  const { data, error, loading } = useDashboardMetrics();
  
  return (
    <div>
      {loading && <span>🔄 Loading...</span>}
      {error && <span>🔴 Error: {error.message}</span>}
      {data && <span>🟢 Connected</span>}
    </div>
  );
}
```

---

## Production Deployment

When deploying to Vercel:

1. Ensure `NEXT_PUBLIC_CONVEX_URL` is set in environment variables
2. Verify Convex database is accessible from Vercel
3. Test each feed endpoint: `/api/feeds/dashboard`
4. Monitor CloudWatch/Convex logs for feed errors
5. Set appropriate TTLs on cached queries for rate limiting

---

## Troubleshooting

### Feed returns empty data
- Check Convex connection: `echo $NEXT_PUBLIC_CONVEX_URL`
- Verify seed data was inserted: `npx convex run nexus:getProjects`
- Check browser network tab for 500 errors on API routes

### High latency (>2s response time)
- Reduce number of items returned per query
- Increase poll intervals to 10-15s
- Add pagination: `.take(10).skip(offset)`
- Consider upgrading to WebSockets

### Convex rate limiting
- Limit polls to max 1 req/second per client
- Use `useQuery` caching instead of fetch for repeated calls
- Batch multiple feeds into single `/api/feeds/dashboard` endpoint

---

## Next Steps

1. ✅ API routes created and working
2. ⏭️ Integrate SAIP project data: Add SAIP API query to `convex/dataFeeds.ts`
3. ⏭️ Integrate Smart School SMS metrics: Add SMS DB query
4. ⏭️ Integrate SNPA intelligence: Add SNPA portal data
5. ⏭️ Upgrade to WebSockets for <100ms latency
6. ⏭️ Add alerting: Trigger notifications on critical metrics

---

*Last Updated: 2026-03-19*
*Maintained by: M2 Creative & Consulting*
