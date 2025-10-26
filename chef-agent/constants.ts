export const SUGGESTIONS = [
  {
    title: 'E-Commerce Store',
    prompt: `Build a fully-featured e-commerce store using the Chef e-commerce template. The template already includes:
- Complete backend: products, cart, orders, and roles tables
- Signup with role selection (customer or admin)
- Frontend pages: HomePage, CartPage, OrdersPage, AdminDashboard
- Modern glassmorphism UI with smooth animations
- Arabic language support with RTL layout

Build it exactly as the template provides. Enhance or customize based on user requests.`,
  },

  // --- Enhanced UI Prompt 1: NovaWear ---
  {
    title: 'Enhanced UI – NovaWear',
    prompt: `Build a modern, futuristic e-commerce website UI for a brand called **NovaWear** — an online clothing and accessories store.

🖥️ **Overall Theme**
- Blue-violet gradient background with soft neon glow effects.
- Modern sans-serif font (e.g., Poppins or Inter).
- Rounded corners, smooth hover transitions, and subtle shadows.
- Responsive, with dark/light mode toggle on all pages.

🧭 **Pages**
1. Home: Hero banner, featured categories, bestsellers, and newsletter signup.
2. Shop: Product grid with category/price filters, sorting, and pagination.
3. Product Details: Image gallery, zoom, size/price info, tabs for description and reviews.
4. Cart: Editable item list, subtotal/tax/total summary, and checkout CTA.
5. Checkout: Step-based form for shipping, payment, and order review.
6. About: Brand story, mission, and optional team photos.
7. Contact: Contact form + social links.
8. Login/Register: Split layout with glowing buttons and modern form styling.`,
  },

  // --- Enhanced UI Prompt 2: TerraMarket ---
  {
    title: 'Enhanced UI – TerraMarket',
    prompt: `Design and build a sustainable, earthy-themed e-commerce website for a brand called **TerraMarket** — focused on eco-friendly home goods and lifestyle products.

🌿 **Theme**
- Color palette: forest green, beige, and off-white tones.
- Natural textures, soft drop shadows, and rounded cards.
- Uses an elegant serif + sans-serif font pairing.
- Clean layout emphasizing sustainability.

🧭 **Pages**
1. Home: Eco-focused hero banner with CTA to "Shop Sustainably".
2. Shop: Grid with product category filters (Home, Kitchen, Wellness, Gifts).
3. Product Details: Minimalist layout with eco-certification badges and sustainability rating.
4. Cart + Checkout: Simple, uncluttered flow emphasizing carbon-neutral shipping.
5. About: Brand mission, sustainability efforts, and partner organizations.
6. Blog: Optional page with sustainability articles.
7. Login/Register: Clean form design with leaf icon accents.`,
  },

  // --- Enhanced UI Prompt 3: Luxora ---
  {
    title: 'Enhanced UI – Luxora',
    prompt: `Create a luxurious and high-end e-commerce experience for **Luxora**, a jewelry and fashion accessories brand.

💎 **Design Goals**
- Premium black-and-gold color scheme with elegant typography.
- Subtle animations and transitions.
- Floating nav bar with minimal icons and elegant cart counter.
- High-resolution product visuals with 3D hover or zoom effects.

🧭 **Pages**
1. Home: Cinematic hero banner with call-to-action "Discover Elegance".
2. Collections: Filterable grid for Necklaces, Rings, and Watches.
3. Product Page: Image carousel, material details, price, and “Add to Wishlist”.
4. Cart: Polished layout with glassmorphism and summary popup.
5. Checkout: Minimal form with visual progress tracker.
6. Journal: Lifestyle/editorial section to feature brand stories.
7. Login/Register: Gold-accented form UI with animation transitions.`,
  },

  // --- Enhanced UI Prompt 4: PixelMart ---
  {
    title: 'Enhanced UI – PixelMart',
    prompt: `Build a tech-themed e-commerce web app for **PixelMart**, an electronics and gaming store.

⚡ **Theme**
- Futuristic, tech-inspired UI with blue and gray gradients.
- Uses Inter or Space Grotesk font.
- Smooth animations, card hover glow, and fast-feeling transitions.
- Responsive layout optimized for both desktop and mobile.

🧭 **Pages**
1. Home: Featured products, trending tech deals, and dynamic hero carousel.
2. Products: Grid view with specs preview, filter by brand/specs/price.
3. Product Details: Product gallery, specs tab, review system, and stock status.
4. Cart: Modern design with auto-updating totals.
5. Checkout: Simplified 2-step flow (info + payment).
6. Support: Contact form and live chat widget placeholder.
7. Admin: Product management dashboard (add/edit/remove).`,
  },
];

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;

export const PREWARM_PATHS = [
  `${WORK_DIR}/package.json`,
  `${WORK_DIR}/convex/schema.ts`,
  `${WORK_DIR}/convex/products.ts`,
  `${WORK_DIR}/convex/cart.ts`,
  `${WORK_DIR}/convex/orders.ts`,
  `${WORK_DIR}/convex/roles.ts`,
  `${WORK_DIR}/src/App.tsx`,
  `${WORK_DIR}/src/pages/HomePage.tsx`,
  `${WORK_DIR}/src/components/ProductCard.tsx`,
  `${WORK_DIR}/src/index.css`,
];

// A list of files that we block the LLM from modifying
export const EXCLUDED_FILE_PATHS = [
  'convex/auth.ts',
  'convex/http.ts',
  'src/main.tsx',
  'src/SignInForm.tsx',
  'src/SignOutButton.tsx',
  'vite.config.ts',
  'package.json',
];
