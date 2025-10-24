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

/** List current user's orders */
export const listOrdersForUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

/** Place order (checkout) */
export const placeOrder = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        priceAtPurchase: v.number(),
      }),
    ),
    total: v.number(),
  },
  handler: async (ctx, { items, total }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const order = await ctx.db.insert("orders", {
      userId,
      items,
      total,
      status: "pending",
      createdAt: Date.now(),
    });
    // Clear the user's cart
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(cartItems.map((i) => ctx.db.delete(i._id)));
    return order;
  },
});

/** Admin: list all orders */
export const listAllOrders = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("orders").collect();
  },
});

/** Admin: update order status */
export const updateOrderStatus = mutation({
  args: { id: v.id("orders"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await requireAdmin(ctx);
    return await ctx.db.patch(id, { status });
  },
});
