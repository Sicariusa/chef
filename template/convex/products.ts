import { query, mutation, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Helper function to check if the current user is an admin
 * @throws Error if user is not authenticated or not an admin
 */
async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<void> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const user = await ctx.db.get(userId);
  if (!user || user.role !== "admin") throw new Error("Forbidden");
}

/** List all products (public) */
export const listProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

/** Get a product by id */
export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/** Create product (admin only) */
export const createProduct = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    image: v.optional(v.string()),
    stock: v.optional(v.number()),
  },
  handler: async (ctx, product) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("products", {
      ...product,
      createdAt: Date.now(),
    });
  },
});

/** Update product (admin only) */
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    image: v.optional(v.string()),
    stock: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireAdmin(ctx);
    return await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
  },
});

/** Delete (admin only) */
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    return await ctx.db.delete(id);
  },
});
