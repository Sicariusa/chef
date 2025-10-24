import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Utility: seed admin role for the current auth user.
 * Call once from the web UI after creating an account, or run from your admin console.
 */
export const seedMyAdmin = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    
    // Set admin role
    await ctx.db.patch(userId, { role: "admin" });
    return { success: true, message: "Admin role assigned successfully" };
  },
});

/**
 * Assign a role to a specific user (admin only)
 */
export const assignRole = mutation({
  args: { 
    userId: v.id("users"), 
    role: v.union(v.literal("customer"), v.literal("admin")) 
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, { userId, role }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");
    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.role !== "admin") throw new Error("Forbidden");
    
    // Update the user's role directly
    await ctx.db.patch(userId, { role });
    return { success: true, message: `Role updated to ${role}` };
  },
});
