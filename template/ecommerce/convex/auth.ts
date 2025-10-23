import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query, mutation } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});

export const loggedInUser = query({
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
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    
    // If user doesn't have a role, set it to "customer"
    if (!user.role) {
      await ctx.db.patch(userId, { role: "customer" });
      return { role: "customer", wasSet: true };
    }
    
    return { role: user.role, wasSet: false };
  },
});
