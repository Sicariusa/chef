export const SUGGESTIONS = [
  {
    title: 'Fashion & Apparel Store',
    prompt: `Build a modern fashion e-commerce store for selling clothing and accessories. Include product categories (Men's, Women's, Kids), size selection, color variants, product image galleries, and a wishlist feature.`,
  },
  {
    title: 'Electronics Marketplace',
    prompt: `Create an electronics e-commerce store with product specifications, comparison features, customer reviews and ratings, warranty information, and advanced filtering by brand, price range, and features.`,
  },
  {
    title: 'Food & Grocery Delivery',
    prompt: `Build a food and grocery delivery e-commerce platform with categories (Fresh Produce, Dairy, Meat, Beverages), quantity selection, delivery time slots, and order tracking. Include a favorites section for frequently ordered items.`,
  },
];

export const ECOMMERCE_FEATURES = [
  { icon: '🛍️', text: 'Product Catalog' },
  { icon: '🛒', text: 'Shopping Cart' },
  { icon: '💰', text: 'Checkout Process' },
  { icon: '👤', text: 'Admin Dashboard' },
];

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;

export const PREWARM_PATHS = [
  `${WORK_DIR}/package.json`,
  `${WORK_DIR}/convex/schema.ts`,
  `${WORK_DIR}/convex/storeProducts.ts`,
  `${WORK_DIR}/convex/storeCart.ts`,
  `${WORK_DIR}/convex/storeOrders.ts`,
  `${WORK_DIR}/convex/storeRoles.ts`,
  `${WORK_DIR}/convex/router.ts`,
  `${WORK_DIR}/src/App.tsx`,
  `${WORK_DIR}/src/pages/HomePage.tsx`,
  `${WORK_DIR}/src/pages/CartPage.tsx`,
  `${WORK_DIR}/src/pages/OrdersPage.tsx`,
  `${WORK_DIR}/src/pages/AdminDashboard.tsx`,
  `${WORK_DIR}/src/components/Navbar.tsx`,
  `${WORK_DIR}/src/components/ProductCard.tsx`,
  `${WORK_DIR}/src/index.css`,
];

// A list of files that we block the LLM from modifying
export const EXCLUDED_FILE_PATHS = [
  'convex/auth.ts',
  'convex/http.ts',
  'convex/router.ts',
  'src/main.tsx',
  'src/SignInForm.tsx',
  'src/SignOutButton.tsx',
  'vite.config.ts',
  'package.json',
];
