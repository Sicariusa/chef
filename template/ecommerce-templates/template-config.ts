/**
 * E-Commerce Template Configuration
 * 
 * This file defines metadata for all available e-commerce templates.
 * Each template includes theme configuration, animation preferences, and layout options.
 */

export interface TemplateTheme {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface AnimationConfig {
  duration: string;
  easing: string;
  fadeIn: boolean;
  slideIn: boolean;
  scale: boolean;
  hover: boolean;
}

export interface LayoutConfig {
  type: 'grid' | 'list' | 'masonry';
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap: string;
  cardStyle: 'minimal' | 'elevated' | 'bordered' | 'glass';
}

export interface FontConfig {
  heading: string;
  body: string;
  mono?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: string;
  theme: TemplateTheme;
  fonts: FontConfig;
  animations: AnimationConfig;
  layout: LayoutConfig;
  features: string[];
}

export const TEMPLATE_REGISTRY: Record<string, TemplateConfig> = {
  'modern-minimal': {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, minimalist design with subtle animations and focus on typography',
    category: 'General',
    theme: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      secondary: '#64748b',
      secondaryHover: '#475569',
      accent: '#0ea5e9',
      accentHover: '#0284c7',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    animations: {
      duration: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fadeIn: true,
      slideIn: true,
      scale: true,
      hover: true,
    },
    layout: {
      type: 'grid',
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 4,
      },
      gap: '1.5rem',
      cardStyle: 'minimal',
    },
    features: [
      'Clean minimal design',
      'Smooth transitions',
      'Mobile-first responsive',
      'Subtle shadows',
    ],
  },

  'luxury-store': {
    id: 'luxury-store',
    name: 'Luxury Store',
    description: 'Elegant, premium design with sophisticated animations and rich typography',
    category: 'Fashion & Luxury',
    theme: {
      primary: '#1e293b',
      primaryHover: '#0f172a',
      secondary: '#94a3b8',
      secondaryHover: '#64748b',
      accent: '#d4af37',
      accentHover: '#b8941f',
      background: '#fefefe',
      surface: '#f9fafb',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#e5e7eb',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    animations: {
      duration: '400ms',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fadeIn: true,
      slideIn: true,
      scale: true,
      hover: true,
    },
    layout: {
      type: 'grid',
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      gap: '2rem',
      cardStyle: 'elevated',
    },
    features: [
      'Elegant serif typography',
      'Gold accent colors',
      'Premium feel',
      'Refined animations',
    ],
  },

  'tech-gadgets': {
    id: 'tech-gadgets',
    name: 'Tech Gadgets',
    description: 'Futuristic design with vibrant colors and dynamic animations',
    category: 'Technology',
    theme: {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      secondary: '#8b5cf6',
      secondaryHover: '#7c3aed',
      accent: '#06b6d4',
      accentHover: '#0891b2',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: '#334155',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    animations: {
      duration: '250ms',
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fadeIn: true,
      slideIn: true,
      scale: true,
      hover: true,
    },
    layout: {
      type: 'grid',
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 4,
      },
      gap: '1.25rem',
      cardStyle: 'glass',
    },
    features: [
      'Dark mode by default',
      'Glassmorphism effects',
      'Vibrant gradients',
      'Tech-focused aesthetic',
    ],
  },

  'fashion-boutique': {
    id: 'fashion-boutique',
    name: 'Fashion Boutique',
    description: 'Trendy, colorful design with playful animations and modern typography',
    category: 'Fashion & Apparel',
    theme: {
      primary: '#ec4899',
      primaryHover: '#db2777',
      secondary: '#f472b6',
      secondaryHover: '#ec4899',
      accent: '#a855f7',
      accentHover: '#9333ea',
      background: '#fdf4ff',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#fce7f3',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
    animations: {
      duration: '350ms',
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      fadeIn: true,
      slideIn: true,
      scale: true,
      hover: true,
    },
    layout: {
      type: 'masonry',
      columns: {
        mobile: 2,
        tablet: 3,
        desktop: 4,
      },
      gap: '1rem',
      cardStyle: 'bordered',
    },
    features: [
      'Vibrant pink/purple palette',
      'Playful animations',
      'Fashion-forward design',
      'Masonry grid layout',
    ],
  },

  'organic-shop': {
    id: 'organic-shop',
    name: 'Organic Shop',
    description: 'Natural, earthy design with soft colors and gentle animations',
    category: 'Food & Wellness',
    theme: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#10b981',
      secondaryHover: '#059669',
      accent: '#f59e0b',
      accentHover: '#d97706',
      background: '#fefdf8',
      surface: '#f7f6f1',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#d1d5db',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
    animations: {
      duration: '400ms',
      easing: 'ease-in-out',
      fadeIn: true,
      slideIn: false,
      scale: false,
      hover: true,
    },
    layout: {
      type: 'grid',
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      gap: '2rem',
      cardStyle: 'minimal',
    },
    features: [
      'Earthy green palette',
      'Natural aesthetic',
      'Eco-friendly vibe',
      'Gentle transitions',
    ],
  },

  'blank-starter': {
    id: 'blank-starter',
    name: 'Blank Starter',
    description: 'Minimal starting point with basic layout and neutral styling',
    category: 'Starter',
    theme: {
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      secondary: '#6b7280',
      secondaryHover: '#4b5563',
      accent: '#8b5cf6',
      accentHover: '#7c3aed',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    animations: {
      duration: '200ms',
      easing: 'ease-in-out',
      fadeIn: true,
      slideIn: false,
      scale: false,
      hover: true,
    },
    layout: {
      type: 'grid',
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      gap: '1.5rem',
      cardStyle: 'minimal',
    },
    features: [
      'Clean starting point',
      'Minimal styling',
      'Easy to customize',
      'Basic components',
    ],
  },
};

/**
 * Get template configuration by ID
 */
export function getTemplateConfig(templateId: string): TemplateConfig | null {
  return TEMPLATE_REGISTRY[templateId] || null;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATE_REGISTRY);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): TemplateConfig[] {
  return Object.values(TEMPLATE_REGISTRY).filter((t) => t.category === category);
}

/**
 * Generate Tailwind theme configuration from template theme
 */
export function generateTailwindTheme(theme: TemplateTheme) {
  return {
    colors: {
      primary: {
        DEFAULT: theme.primary,
        hover: theme.primaryHover,
      },
      secondary: {
        DEFAULT: theme.secondary,
        hover: theme.secondaryHover,
      },
      accent: {
        DEFAULT: theme.accent,
        hover: theme.accentHover,
      },
    },
    backgroundColor: {
      base: theme.background,
      surface: theme.surface,
    },
    textColor: {
      primary: theme.text,
      secondary: theme.textSecondary,
    },
    borderColor: {
      DEFAULT: theme.border,
    },
  };
}
