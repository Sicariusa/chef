import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});

export const loggedInUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      subject: v.string(),
      role: v.optional(v.union(v.literal("customer"), v.literal("admin"))),
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      phone: v.optional(v.string()),
      phoneVerificationTime: v.optional(v.number()),
      image: v.optional(v.string()),
      isAnonymous: v.optional(v.boolean()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});

/**
 * Ensure the current user has a role (defaults to "customer" if none set)
 * This should be called after signup to ensure proper role assignment
 */
export const ensureUserRole = mutation({
  args: {},
  returns: v.object({
    role: v.union(v.literal("customer"), v.literal("admin")),
    wasSet: v.boolean(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    
    // If user doesn't have a role, set it to "customer"
    if (!user.role) {
      await ctx.db.patch(userId, { role: "customer" });
      return { role: "customer" as const, wasSet: true };
    }
    
    return { role: user.role as "customer" | "admin", wasSet: false };
  },
});

/**
 * Create or update user with proper role assignment
 * This handles the user creation process for authentication
 */
export const createOrUpdateUser = mutation({
  args: {
    user: v.object({
      subject: v.string(),
      isAnonymous: v.optional(v.boolean()),
    }),
  },
  returns: v.id("users"),
  handler: async (ctx, { user }) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", user.subject))
      .first();
    
    if (existingUser) {
      // Update existing user if needed
      if (!existingUser.role) {
        await ctx.db.patch(existingUser._id, { role: "customer" });
      }
      return existingUser._id;
    }
    
    // Create new user with default role
    const userId = await ctx.db.insert("users", {
      subject: user.subject,
      isAnonymous: user.isAnonymous ?? false,
      role: "customer", // Default role for new users
    });
    
    return userId;
  },
});

/**
 * Migration function to fix existing users without roles
 * This should be run once to fix any existing users
 */
export const migrateExistingUsers = mutation({
  args: {},
  returns: v.object({
    updated: v.number(),
    total: v.number(),
  }),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let updated = 0;
    
    for (const user of users) {
      if (!user.role) {
        await ctx.db.patch(user._id, { role: "customer" });
        updated++;
      }
    }
    
    return { updated, total: users.length };
  },
});

/**
 * Admin function to assign roles to users
 */
export const assignRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("customer"), v.literal("admin")),
  },
  returns: v.null(),
  handler: async (ctx, { userId, role }) => {
    // Check if current user is admin
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");
    
    const currentUser = await ctx.db.get(currentUserId);
    if (currentUser?.role !== "admin") {
      throw new Error("Only admins can assign roles");
    }
    
    await ctx.db.patch(userId, { role });
  },
});

/**
 * Seed admin role for current user (for development/testing)
 * This should only be used in development
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
    
    // Set current user as admin
    await ctx.db.patch(userId, { role: "admin" });
    
    return {
      success: true,
      message: "Admin role assigned successfully",
    };
  },
});
