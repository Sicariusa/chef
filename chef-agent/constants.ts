export const SUGGESTIONS = [
  {
    title: 'Modern Minimal Store',
    prompt: `Build a modern, minimalist e-commerce store with the "modern-minimal" template. Use clean design, subtle animations. Include:
- Home page with hero section and product catalog.
- Product page with product details and add to cart button.
- Shopping cart page with product details and checkout button.
- Checkout page with payment details and order confirmation.
- Order history page with order details.
- Admin dashboard for products and orders.
- Role-based access control.
- Soft shadows and gentle animations (300ms).
- Inter font family.
- Blue color scheme (#2563eb).`,
  },
  {
    title: 'Luxury Fashion Store',
    prompt: `Build an elegant luxury e-commerce store with the "luxury-store" template. Use sophisticated design with gold accents. Include:

- Premium product showcase
- Shopping cart and checkout
- Order history and management
- Admin dashboard
- Role-based access control
- Playfair Display headings with Inter body
- Dark slate and gold color scheme
- Refined animations (400ms)`,
  },
  {
    title: 'Tech Gadgets Shop',
    prompt: `Build a futuristic tech gadgets store with the "tech-gadgets" template. Use dark theme with glassmorphism. Include:

- Product catalog with glass card effects
- Shopping cart and checkout
- Order management
- Admin dashboard
- Role-based access control
- Dark theme (#0f172a background)
- Neon glow effects
- Vibrant gradients (Indigo → Purple → Cyan)
- Poppins font family`,
  },
  {
    title: 'Fashion Boutique',
    prompt: `Build a trendy fashion boutique with the "fashion-boutique" template. Use vibrant colors and playful animations. Include:

- Product catalog with masonry grid
- Shopping cart and checkout
- Order management
- Admin dashboard
- Role-based access control
- Hot pink and purple palette (#ec4899)
- Playful bounce animations (350ms)
- Poppins font family`,
  },
  {
    title: 'Organic Shop',
    prompt: `Build a natural organic products store with the "organic-shop" template. Use earthy colors and gentle animations. Include:

- Product catalog with natural styling
- Shopping cart and checkout
- Order management
- Admin dashboard
- Role-based access control
- Green and earth tone palette (#059669)
- Gentle transitions (400ms)
- Eco-friendly design aesthetic`,
  },
  {
    title: 'Custom Store (Blank)',
    prompt: `Build an e-commerce store starting from the "blank-starter" template. Use minimal styling for full customization. Include:

- Product catalog with basic grid
- Shopping cart and checkout
- Order management
- Admin dashboard
- Role-based access control
- Neutral color scheme
- Simple animations (200ms)
- Ready for custom styling`,
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
