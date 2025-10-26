import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';
import { convexGuidelines } from './convexGuidelines.js';

export function solutionConstraints(options: SystemPromptOptions) {
  return stripIndents`
  <solution_constraints>

    <ecommerce_only>
      ═══════════════════════════════════════════════════════════════
      # E-COMMERCE TEMPLATE STRUCTURE
      ═══════════════════════════════════════════════════════════════
      
      ⚠️ CRITICAL: READ TEMPLATE FILES FROM template/ecommerce/ (NOT template/)
      
      TEMPLATE SOURCE: template/ecommerce/
      - Backend files: template/ecommerce/convex/
      - Frontend files: template/ecommerce/src/
      
      The project starts with a COMPLETE e-commerce template at /home/project.
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      📁 EXISTING TEMPLATE STRUCTURE (DO NOT RECREATE)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      Backend (/home/project/convex/):
        SOURCE: template/ecommerce/convex/
        ✓ schema.ts         - Database schema (products, cart, orders, roles)
        ✓ products.ts       - Product management functions
        ✓ cart.ts           - Shopping cart functions
        ✓ orders.ts         - Order processing functions
        ✓ roles.ts          - User role management (getMyRole, setMyRole)
        🔒 auth.ts          - LOCKED: DO NOT MODIFY
        🔒 http.ts          - LOCKED: DO NOT MODIFY
      
      Frontend (/home/project/src/):
        SOURCE: template/ecommerce/src/
        ✓ pages/HomePage.tsx          - Product listing
        ✓ pages/CartPage.tsx          - Shopping cart
        ✓ pages/OrdersPage.tsx        - Order history
        ✓ pages/AdminDashboard.tsx    - Admin panel
        ✓ components/Navbar.tsx       - Navigation bar
        ✓ components/ProductCard.tsx  - Product display
        ✓ contexts/LanguageContext.tsx - Language switching
        ✓ i18n/locales/en.ts          - English translations
        ✓ i18n/locales/ar.ts          - Arabic translations
        ✓ App.tsx                     - Main application
        ✓ index.css                   - Global styles
        🔒 main.tsx                   - LOCKED: DO NOT MODIFY
        🔒 SignInForm.tsx             - WITH ROLE DROPDOWN - LOCKED: DO NOT MODIFY
        🔒 SignOutButton.tsx          - LOCKED: DO NOT MODIFY
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      📋 USAGE GUIDELINES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      When user selects basic "E-Commerce Store":
        → COPY the template files directly to /home/project
        → Use the structure as-is
      
      When user customizes (NovaWear, TerraMarket, Luxora, etc.):
        → ENHANCE existing template files (don't recreate)
        → Modify content, not structure
        → Keep all existing functionality
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ✅ TEMPLATE FEATURES (ALREADY INCLUDED)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      ✓ Complete product catalog system
      ✓ Shopping cart with add/update/remove
      ✓ Order processing and history
      ✓ Role-based access control (user/admin)
      ✓ User authentication with role selection
      ✓ Modern glassmorphism UI design
      ✓ Smooth animations and transitions
      ✓ Responsive mobile-first layout
      ✓ Arabic language support with RTL
      ✓ English ⇄ Arabic language toggle
      ✓ Toast notifications (sonner)
      ✓ Loading states
      ✓ Error handling
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      🚫 CRITICAL RULES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      ⚠️ READ FROM: template/ecommerce/ (NOT template/)
      
      ❌ DO NOT read from template/src/ (old version, missing role selection)
      ❌ DO NOT read from template/convex/ (old version)
      ❌ DO NOT recreate files that already exist
      ❌ DO NOT modify locked files (marked with 🔒)
      ❌ DO NOT use HTML entities (use &&, <, > instead of &amp;&amp;, &lt;, &gt;)
      ❌ DO NOT create convex/users.ts (use convex/roles.ts)
      ❌ DO NOT use api.users.* (use api.roles.*, api.products.*, etc.)
      
      ✅ DO read all files from template/ecommerce/ directory
      ✅ DO use template/ecommerce/src/SignInForm.tsx (has role dropdown)
      ✅ DO modify existing template files to match user requirements
      ✅ DO maintain the existing file structure
      ✅ DO keep all existing functionality
      ✅ DO use proper Convex syntax (see guidelines below)
    </ecommerce_only>

    ${options.includeTemplate ? templateInfo() : ''}

    <convex_guidelines>
      You MUST use Convex for the database, realtime, file storage, functions, scheduling, HTTP handlers,
      and search functionality. Convex is realtime, by default, so you never need to manually refresh
      subscriptions. Here are some guidelines, documentation, and best practices for using Convex effectively:

      ${convexGuidelines(options)}

      <http_guidelines>
        - All user-defined HTTP endpoints are defined in \`convex/router.ts\` and require an \`httpAction\` decorator.
        - The \`convex/http.ts\` file contains the authentication handler for Convex Auth. Do NOT modify this file because it is locked. Instead define all new http actions in \`convex/router.ts\`.
      </http_guidelines>

      <auth_server_guidelines>
        Here are some guidelines for using the template's auth within the app:

        When writing Convex handlers, use the 'getAuthUserId' function to get the logged in user's ID. You
        can then pass this to 'ctx.db.get' in queries or mutations to get the user's data. But, you can only
        do this within the \`convex/\` directory. For example:
        \`\`\`ts "convex/users.ts"
        import { getAuthUserId } from "@convex-dev/auth/server";

        export const currentLoggedInUser = query({
          handler: async (ctx) => {
            const userId = await getAuthUserId(ctx);
            if (!userId) {
              return null;
            }
            const user = await ctx.db.get(userId);
            if (!user) {
              return null;
            }
            console.log("User", user.name, user.image, user.email);
            return user;
          }
        })
        \`\`\`

        If you want to get the current logged in user's data on the frontend, you should use the following function
        that is defined in \`convex/auth.ts\`:

        \`\`\`ts "convex/auth.ts"
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
        \`\`\`

        Then, you can use the \`loggedInUser\` query in your React component like this:

        \`\`\`tsx "src/App.tsx"
        const user = useQuery(api.auth.loggedInUser);
        \`\`\`

        The "users" table within 'authTables' has a schema that looks like:
        \`\`\`ts
        const users = defineTable({
          name: v.optional(v.string()),
          image: v.optional(v.string()),
          email: v.optional(v.string()),
          emailVerificationTime: v.optional(v.number()),
          phone: v.optional(v.string()),
          phoneVerificationTime: v.optional(v.number()),
          isAnonymous: v.optional(v.boolean()),
        })
          .index("email", ["email"])
          .index("phone", ["phone"]);
        \`\`\`
      </auth_server_guidelines>

      <client_guidelines>
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        🎯 REACT + CONVEX CLIENT PATTERNS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        ⚠️ CRITICAL: NEVER USE HTML ENTITIES IN JSX/TSX CODE
        
        ❌ WRONG (HTML entities - breaks React):
        \`\`\`tsx
        {user &amp;&amp; <div>Welcome</div>}
        {count &lt; 10 &amp;&amp; <span>Low</span>}
        {price &gt; 100 ? "Expensive" : "Cheap"}
        \`\`\`
        
        ✅ CORRECT (Real operators):
        \`\`\`tsx
        {user && <div>Welcome</div>}
        {count < 10 && <span>Low</span>}
        {price > 100 ? "Expensive" : "Cheap"}
        \`\`\`
        
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        📚 CONVEX REACT HOOKS USAGE
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        Basic Example:
        \`\`\`tsx
        import React, { useState } from "react";
        import { useMutation, useQuery } from "convex/react";
        import { api } from "../convex/_generated/api";

        export default function App() {
          // ✅ CORRECT: useQuery for reading data (live-updating!)
          const messages = useQuery(api.messages.list) || [];
          
          // ✅ CORRECT: useMutation for writing data
          const sendMessage = useMutation(api.messages.send);

          const [newMessageText, setNewMessageText] = useState("");
          const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
          
          async function handleSendMessage(event) {
            event.preventDefault();
            await sendMessage({ body: newMessageText, author: name });
            setNewMessageText("");
          }
          
          return (
            <main>
              <h1>Convex Chat</h1>
              <p className="badge">
                <span>{name}</span>
              </p>
              <ul>
                {messages.map((message) => (
                  <li key={message._id}>
                    <span>{message.author}:</span>
                    <span>{message.body}</span>
                    <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleSendMessage}>
                <input
                  value={newMessageText}
                  onChange={(event) => setNewMessageText(event.target.value)}
                  placeholder="Write a message…"
                />
                <button type="submit" disabled={!newMessageText}>
                  Send
                </button>
              </form>
            </main>
          );
        }
        \`\`\`

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        🚫 CONDITIONAL HOOKS (NEVER DO THIS)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ❌ WRONG (Conditional hook call):
        \`\`\`tsx
        const avatarUrl = profile?.avatarId 
          ? useQuery(api.profiles.getAvatarUrl, { storageId: profile.avatarId }) 
          : null;
        \`\`\`

        ✅ CORRECT (Use "skip" parameter):
        \`\`\`tsx
        const avatarUrl = useQuery(
          api.profiles.getAvatarUrl,
          profile?.avatarId ? { storageId: profile.avatarId } : "skip"
        );
        \`\`\`

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        📝 IMPORTANT RULES
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ✅ The useQuery() hook is LIVE-UPDATING automatically
        ✅ Always import api from "../convex/_generated/api"
        ✅ Check that functions exist in convex/ directory before calling
        ✅ Verify correct arguments (non-optional args can't be null)
        ✅ Create custom UI components (don't use Shadcn/UI)
        ✅ Use canvas for image compression (not sharp)
        ✅ Support anonymous users in UI
        ✅ Handle loading states (useQuery can return undefined initially)
        ✅ Use proper TypeScript types from convex/_generated/dataModel
        
        ❌ NEVER use HTML entities (&amp;&amp;, &lt;, &gt;)
        ❌ NEVER use hooks conditionally
        ❌ NEVER call functions that don't exist
        ❌ NEVER pass null for required arguments
        ❌ NEVER use external UI libraries
        
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        💡 E-COMMERCE SPECIFIC EXAMPLES
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        Loading Products:
        \`\`\`tsx
        import { useQuery } from "convex/react";
        import { api } from "../convex/_generated/api";
        
        function ProductList() {
          const products = useQuery(api.products.list);
          
          if (!products) {
            return <div>Loading products...</div>;
          }
          
          return (
            <div className="grid grid-cols-3 gap-4">
              {products.length > 0 && products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          );
        }
        \`\`\`
        
        Adding to Cart:
        \`\`\`tsx
        import { useMutation } from "convex/react";
        import { api } from "../convex/_generated/api";
        import type { Id } from "../convex/_generated/dataModel";
        
        function AddToCartButton({ productId }: { productId: Id<"products"> }) {
          const addToCart = useMutation(api.cart.add);
          const [loading, setLoading] = useState(false);
          
          async function handleClick() {
            setLoading(true);
            try {
              await addToCart({ productId, quantity: 1 });
              toast.success("Added to cart!");
            } catch (error) {
              toast.error("Failed to add to cart");
            } finally {
              setLoading(false);
            }
          }
          
          return (
            <button onClick={handleClick} disabled={loading}>
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          );
        }
        \`\`\`
        
        Checking User Role:
        \`\`\`tsx
        import { useQuery } from "convex/react";
        import { api } from "../convex/_generated/api";
        
        function AdminPanel() {
          const role = useQuery(api.roles.getMyRole);
          
          // Handle loading state
          if (role === undefined) {
            return <div>Loading...</div>;
          }
          
          // Check admin access
          if (role !== "admin") {
            return <div>Access denied. Admin only.</div>;
          }
          
          return <div>Admin Dashboard Content</div>;
        }
        \`\`\`
      </client_guidelines>
    </convex_guidelines>
  </solution_constraints>
  `;
}

function templateInfo() {
  return stripIndents`
  <template_info>
    ⚠️ CRITICAL: READ TEMPLATE FILES FROM template/ecommerce/ (NOT template/)
    
    The Chef WebContainer environment starts with a complete e-commerce template fully loaded at '/home/project',
    the current working directory. Its dependencies are specified in the 'package.json' file and already
    installed in the 'node_modules' directory. You MUST use this e-commerce template. This template includes:
    - Complete e-commerce backend with products, cart, orders, and roles tables
    - Full Convex authentication setup with signup/signin WITH ROLE SELECTION
    - Frontend pages: HomePage, CartPage, OrdersPage, AdminDashboard
    - Modern glassmorphism UI with smooth animations
    - Arabic language support with RTL layout
    - Technologies: Vite + React, TailwindCSS, Convex, Convex Auth
    
    TEMPLATE SOURCE LOCATION:
    - Backend: template/ecommerce/convex/
    - Frontend: template/ecommerce/src/
    - DO NOT USE: template/src/ or template/convex/ (old versions)

    Here are some important files within the template:

    <directory path="convex/">
      The 'convex/' directory contains the code deployed to the Convex backend.
    </directory>

    <file path="convex/auth.config.ts">
      The 'auth.config.ts' file links Convex Auth to the Convex deployment.
      IMPORTANT: Do NOT modify the \`convex/auth.config.ts\` file under any circumstances.
    </file>

    <file path="convex/auth.ts">
      This code configures Convex Auth to use just a username/password login method. Do NOT modify this
      file. If the user asks to support other login methods, tell them that this isn't currently possible
      within Chef. They can download the code and do it themselves.
      IMPORTANT: Do NOT modify the \`convex/auth.ts\`, \`src/SignInForm.tsx\`, or \`src/SignOutButton.tsx\` files under any circumstances. These files are locked, and
      your changes will not be persisted if you try to modify them.
      
      ⚠️ USE: template/ecommerce/src/SignInForm.tsx (has role selection dropdown)
      ❌ DON'T USE: template/src/SignInForm.tsx (missing role selection)
    </file>

    <file path="convex/http.ts">
      This file contains the HTTP handlers for the Convex backend. It starts with just the single
      handler for Convex Auth, but if the user's app needs other HTTP handlers, you can add them to this
      file. DO NOT modify the \`convex/http.ts\` file under any circumstances unless explicitly instructed to do so.
      DO NOT modify the \`convex/http.ts\` for file storage. Use an action instead.
    </file>

    <file path="convex/schema.ts">
      This file contains the schema for the Convex backend. It starts with just 'authTables' for setting
      up authentication. ONLY modify the 'applicationTables' object in this file: Do NOT modify the
      'authTables' object. Always include \`...authTables\` in the \`defineSchema\` call when modifying
      this file. The \`authTables\` object is imported with \`import { authTables } from "@convex-dev/auth/server";\`.
    </file>

    <file path="src/App.tsx">
      This is the main React component for the app. It starts with a simple login form and a button to add a
      random number to a list. It uses "src/SignInForm.tsx" and "src/SignOutButton.tsx" for the login and
      logout functionality. Add new React components to their own files in the 'src' directory to avoid
      cluttering the main file.
    </file>

    <file path="src/main.tsx">
      This file is the entry point for the app and sets up the 'ConvexAuthProvider'.

      IMPORTANT: Do NOT modify the \`src/main.tsx\` file under any circumstances.
    </file>

    <file path="index.html">
      This file is the entry point for Vite and includes the <head> and <body> tags.
    </file>
  </template_info>
  `;
}
