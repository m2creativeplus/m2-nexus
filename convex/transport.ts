import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ TRANSPORT ROUTES ============
export const listRoutes = query({
  args: {},
  handler: async (ctx) => {
    const routes = await ctx.db.query("transportRoutes").collect();
    
    // Enrich with vehicle info
    const enriched = await Promise.all(
      routes.map(async (r) => {
        const vehicle = r.vehicleId ? await ctx.db.get(r.vehicleId) : null;
        return {
          ...r,
          vehicleNumber: vehicle?.vehicleNumber || "Not Assigned",
          driverName: vehicle?.driverName || "N/A",
        };
      })
    );
    
    return enriched;
  },
});

export const createRoute = mutation({
  args: {
    title: v.string(),
    fare: v.number(),
    vehicleId: v.optional(v.id("transportVehicles")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transportRoutes", args);
  },
});

export const updateRoute = mutation({
  args: {
    id: v.id("transportRoutes"),
    title: v.optional(v.string()),
    fare: v.optional(v.number()),
    vehicleId: v.optional(v.id("transportVehicles")),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeRoute = mutation({
  args: { id: v.id("transportRoutes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ TRANSPORT VEHICLES ============
export const listVehicles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("transportVehicles").collect();
  },
});

export const createVehicle = mutation({
  args: {
    vehicleNumber: v.string(),
    vehicleModel: v.string(),
    driverName: v.string(),
    driverPhone: v.optional(v.string()),
    driverLicense: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transportVehicles", args);
  },
});

export const updateVehicle = mutation({
  args: {
    id: v.id("transportVehicles"),
    vehicleNumber: v.optional(v.string()),
    vehicleModel: v.optional(v.string()),
    driverName: v.optional(v.string()),
    driverPhone: v.optional(v.string()),
    driverLicense: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeVehicle = mutation({
  args: { id: v.id("transportVehicles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get transport students
export const getTransportStudents = query({
  args: { routeId: v.optional(v.id("transportRoutes")) },
  handler: async (ctx, args) => {
    let students = await ctx.db.query("students").collect();
    students = students.filter((s) => s.isTransport && s.isActive);
    
    if (args.routeId) {
      students = students.filter((s) => s.routeId === args.routeId);
    }
    
    // Enrich with route info
    const enriched = await Promise.all(
      students.map(async (s) => {
        const route = s.routeId ? await ctx.db.get(s.routeId) : null;
        return {
          _id: s._id,
          name: `${s.firstName} ${s.lastName}`,
          admissionNo: s.admissionNo,
          routeName: route?.title || "Not Assigned",
          fare: route?.fare || 0,
        };
      })
    );
    
    return enriched;
  },
});

// Seed transport data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("transportVehicles").collect();
    if (existing.length > 0) return "Already seeded";

    // Create vehicles
    const bus1 = await ctx.db.insert("transportVehicles", {
      vehicleNumber: "SCH-001",
      vehicleModel: "Blue Bird School Bus",
      driverName: "Ahmed Hassan",
      driverPhone: "9876543220",
      driverLicense: "DL12345",
    });
    
    const bus2 = await ctx.db.insert("transportVehicles", {
      vehicleNumber: "SCH-002",
      vehicleModel: "Thomas Built Bus",
      driverName: "Mohammed Ali",
      driverPhone: "9876543221",
      driverLicense: "DL12346",
    });

    // Create routes
    await ctx.db.insert("transportRoutes", {
      title: "Route A - Downtown",
      fare: 1500,
      vehicleId: bus1,
    });
    
    await ctx.db.insert("transportRoutes", {
      title: "Route B - Suburbs",
      fare: 2000,
      vehicleId: bus2,
    });

    return "Transport seeded";
  },
});
