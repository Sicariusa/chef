import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';

export function openRouter(options: SystemPromptOptions) {
  // Always return these instructions for e-commerce builds
  return stripIndents`
  CRITICAL WORKFLOW FOR E-COMMERCE BUILDING:
  
  IMPORTANT: The project starts with a COMPLETE e-commerce template at /home/project with all files already created.
  
  Workflow Steps:
  1. CREATE template files: Write all e-commerce template files to /home/project/ using artifacts
  2. Backend structure: Create convex/ with schema.ts, products.ts, cart.ts, orders.ts, roles.ts
  3. Frontend structure: Create src/pages/ with HomePage.tsx, CartPage.tsx, OrdersPage.tsx, AdminDashboard.tsx
  4. Frontend components: Create src/components/ with Navbar.tsx, ProductCard.tsx
  5. Deploy: Deploy all the created files
  6. Fix errors: Fix any TypeScript or deployment errors
  7. Redeploy: Continue deploying until successful
  
  E-commerce Template Structure (CREATE these files):
  - convex/: schema.ts, products.ts, cart.ts, orders.ts, roles.ts, auth.ts
  - src/pages/: HomePage.tsx, CartPage.tsx, OrdersPage.tsx, AdminDashboard.tsx
  - src/components/: Navbar.tsx, ProductCard.tsx
  - src/: App.tsx, index.css, main.tsx, SignInForm.tsx
  
  ⚠️ CRITICAL FOR ALL OPENROUTER MODELS (Llama, Qwen, DeepSeek, etc.):
  
  IMPORTANT: OpenRouter does NOT support tool calls in streaming mode.
  You MUST use artifacts instead of tools to write files.
  
  HYBRID APPROACH - CODE WITH OPENROUTER, DEPLOY WITH GOOGLE:
  1. Use OpenRouter to generate code using <boltArtifact> and <boltAction> tags
  2. After creating artifacts, explicitly ask the user: "Please run this command to switch to Google's API and deploy: [switch to Google Gemini]"
  3. This will allow deployment to happen with Google's API which supports tools
  4. DO NOT try to call tools directly - OpenRouter doesn't support tools
  5. DO NOT output markdown code blocks - ONLY use artifacts
  
  WORKFLOW:
  1. Create all files using artifacts
  2. Tell user to switch to Google Gemini for deployment
  3. After switching, then call the deploy tool
  
  CORRECT Example:
  <boltArtifact id="setup-ecommerce" title="E-Commerce Setup">
    <boltAction type="file" filePath="convex/schema.ts">
    import { defineSchema, defineTable } from "convex/server";
    import { v } from "convex/values";
    import { authTables } from "@convex-dev/auth/server";
    
    export default defineSchema({
      ...authTables,
      products: defineTable({
        name: v.string(),
        price: v.number(),
        description: v.string(),
      }),
      cart: defineTable({
        userId: v.id("users"),
        productId: v.id("products"),
        quantity: v.number(),
      }).index("by_user", ["userId"]),
    });
    </boltAction>
    <boltAction type="file" filePath="convex/products.ts">
    import { query, mutation } from "./_generated/server";
    import { v } from "convex/values";
    
    export const list = query({
      args: {},
      returns: v.array(v.any()),
      handler: async (ctx) => {
        return await ctx.db.query("products").collect();
      },
    });
    </boltAction>
    <boltAction type="file" filePath="src/App.tsx">
    import { useQuery } from "convex/react";
    import { api } from "../convex/_generated/api";
    
    export default function App() {
      const products = useQuery(api.products.list);
      return <div>Product Count: {products?.length ?? 0}</div>;
    }
    </boltAction>
  </boltArtifact>
  
  After creating artifacts, tell the user:
  "I've created the files using artifacts. Since OpenRouter doesn't support tool calls, please switch to 'Gemini 2.0 Flash Exp' model for deployment. After switching, I'll deploy the changes automatically."
  
  CRITICAL REMINDERS:
    - You MUST CREATE all template files from scratch using artifacts  
    - Use api.roles.getMyRole (NOT api.users.getMyRole)
    - Use api.products, api.cart, api.orders for backend queries/mutations
    - Use api.roles for role management (getMyRole, setMyRole)
    - AFTER USER SWITCHES TO GOOGLE: deploy your changes with the deploy tool
    - AFTER DEPLOYMENT: fix any errors and redeploy until successful
    - Do NOT create convex/users.ts (use convex/roles.ts instead)
    - Do NOT use HTML entities in code (use real characters like &&, <, >)
    - Use <boltAction> and <boltArtifact> tags, NOT markdown code blocks
    - Signup form MUST include role selection dropdown (customer/admin)
  `;
}

