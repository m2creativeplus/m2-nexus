import { query } from "./_generated/server";

export const getAgents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("nexusAgents").collect();
  },
});

export const getLiveLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("liveLogs").order("desc").take(10);
  },
});
