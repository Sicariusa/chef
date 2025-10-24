import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Get logged-in user's cart */
export const getCart = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("cart"),
    _creationTime: v.number(),
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
    addedAt: v.number(),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

/** Add item to cart */
export const addToCart = mutation({
  args: { productId: v.id("products"), quantity: v.number() },
  returns: v.null(),
  handler: async (ctx, { productId, quantity }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("cart")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", userId).eq("productId", productId),
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + quantity,
      });
      return null;
    }
    await ctx.db.insert("cart", {
      userId,
      productId,
      quantity,
      addedAt: Date.now(),
    });
    return null;
  },
});

/** Update cart item quantity */
export const updateCartItem = mutation({
  args: { id: v.id("cart"), quantity: v.number() },
  returns: v.null(),
  handler: async (ctx, { id, quantity }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const item = await ctx.db.get(id);
    if (!item || item.userId !== userId) throw new Error("Not found");
    if (quantity <= 0) {
      return await ctx.db.delete(id);
    }
    return await ctx.db.patch(id, { quantity });
  },
});

/** Remove from cart */
export const removeFromCart = mutation({
  args: { id: v.id("cart") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const item = await ctx.db.get(id);
    if (!item || item.userId !== userId) throw new Error("Not found");
    return await ctx.db.delete(id);
  },
});

/** Clear user's cart */
export const clearCart = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const items = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(items.map((item) => ctx.db.delete(item._id)));
  },
});
