import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  users: defineTable({
    subject: v.string(), // Required by Convex Auth
    role: v.optional(v.union(v.literal("customer"), v.literal("admin"))), // defaults to 'customer'
    isAnonymous: v.optional(v.boolean()),
  })
    .index("by_subject", ["subject"]),
  products: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    image: v.optional(v.string()),
    stock: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),
  cart: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),
  orders: defineTable({
    userId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        priceAtPurchase: v.number(),
      }),
    ),
    total: v.number(),
    status: v.string(), // 'pending', 'paid', 'shipped'
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
