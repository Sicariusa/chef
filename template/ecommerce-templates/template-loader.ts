/**
 * Template Loader Utility
 * 
 * Dynamically loads and applies e-commerce templates based on user selection.
 */

import { TEMPLATE_REGISTRY, type TemplateConfig } from './template-config';
import type { TemplateTheme } from './template-config';

export interface TemplateAssets {
  css: string;
  tailwindConfig: string;
  readme: string;
}

/**
 * Get the path to a template's assets
 */
export function getTemplatePath(templateId: string): string {
  return `/template/ecommerce-templates/${templateId}`;
}

/**
 * Load template configuration
 */
export async function loadTemplateConfig(templateId: string): Promise<TemplateConfig | null> {
  const config = TEMPLATE_REGISTRY[templateId];
  if (!config) {
    console.error(`Template "${templateId}" not found in registry`);
    return null;
  }
  return config;
}

/**
 * Apply template theme to Tailwind configuration
 */
export function applyTemplateTheme(templateId: string, baseConfig: any): any {
  const config = TEMPLATE_REGISTRY[templateId];
  if (!config) {
    return baseConfig;
  }

  const { theme } = config;
  
  return {
    ...baseConfig,
    theme: {
      ...baseConfig.theme,
      extend: {
        ...baseConfig.theme?.extend,
        colors: {
          ...baseConfig.theme?.extend?.colors,
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
          ...baseConfig.theme?.extend?.backgroundColor,
          base: theme.background,
          surface: theme.surface,
        },
        textColor: {
          ...baseConfig.theme?.extend?.textColor,
          primary: theme.text,
          secondary: theme.textSecondary,
        },
        borderColor: {
          ...baseConfig.theme?.extend?.borderColor,
          DEFAULT: theme.border,
        },
      },
    },
  };
}

/**
 * Generate CSS variables from template theme
 */
export function generateThemeVariables(theme: TemplateTheme): string {
  return `
:root {
  --color-primary: ${theme.primary};
  --color-primary-hover: ${theme.primaryHover};
  --color-secondary: ${theme.secondary};
  --color-secondary-hover: ${theme.secondaryHover};
  --color-accent: ${theme.accent};
  --color-accent-hover: ${theme.accentHover};
  --color-background: ${theme.background};
  --color-surface: ${theme.surface};
  --color-text: ${theme.text};
  --color-text-secondary: ${theme.textSecondary};
  --color-border: ${theme.border};
}
`.trim();
}

/**
 * Get animation CSS based on template configuration
 */
export function getAnimationCSS(templateId: string): string {
  const config = TEMPLATE_REGISTRY[templateId];
  if (!config) return '';

  const { animations } = config;
  let css = '';

  if (animations.fadeIn) {
    css += `
.animate-fade-in {
  animation: fade-in ${animations.duration} ${animations.easing};
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`;
  }

  if (animations.slideIn) {
    css += `
.animate-slide-up {
  animation: slide-up ${animations.duration} ${animations.easing};
}

@keyframes slide-up {
  0% { 
    transform: translateY(20px); 
    opacity: 0; 
  }
  100% { 
    transform: translateY(0); 
    opacity: 1; 
  }
}
`;
  }

  if (animations.scale) {
    css += `
.animate-scale-in {
  animation: scale-in ${animations.duration} ${animations.easing};
}

@keyframes scale-in {
  0% { 
    transform: scale(0.95); 
    opacity: 0; 
  }
  100% { 
    transform: scale(1); 
    opacity: 1; 
  }
}
`;
  }

  return css;
}

/**
 * Get card style CSS based on template configuration
 */
export function getCardStyleCSS(templateId: string): string {
  const config = TEMPLATE_REGISTRY[templateId];
  if (!config) return '';

  const { layout } = config;

  switch (layout.cardStyle) {
    case 'minimal':
      return `
.card {
  @apply bg-white rounded-lg border border-gray-100 transition-all;
}
.card:hover {
  @apply shadow-sm;
}
`;

    case 'elevated':
      return `
.card {
  @apply bg-white rounded-lg shadow-md transition-all;
}
.card:hover {
  @apply shadow-lg transform -translate-y-1;
}
`;

    case 'bordered':
      return `
.card {
  @apply bg-white rounded-lg border-2 border-gray-200 transition-all;
}
.card:hover {
  @apply border-primary shadow-md;
}
`;

    case 'glass':
      return `
.card {
  @apply rounded-lg backdrop-blur-md bg-white/70 border border-white/20 transition-all;
}
.card:hover {
  @apply bg-white/80 shadow-lg;
}
`;

    default:
      return '';
  }
}

/**
 * Get grid configuration for product layout
 */
export function getGridConfig(templateId: string): {
  mobile: number;
  tablet: number;
  desktop: number;
} {
  const config = TEMPLATE_REGISTRY[templateId];
  if (!config) {
    return { mobile: 1, tablet: 2, desktop: 3 };
  }
  return config.layout.columns;
}

/**
 * Get font imports for template
 */
export function getFontImports(templateId: string): string {
  const config = TEMPLATE_REGISTRY[templateId];
  if (!config) return '';

  const { fonts } = config;
  const fontFamilies: string[] = [];

  if (fonts.heading && fonts.heading !== 'Inter') {
    fontFamilies.push(fonts.heading.replace(' ', '+'));
  }
  if (fonts.body && fonts.body !== fonts.heading && fonts.body !== 'Inter') {
    fontFamilies.push(fonts.body.replace(' ', '+'));
  }
  if (fonts.mono) {
    fontFamilies.push(fonts.mono.replace(' ', '+'));
  }

  if (fontFamilies.length === 0) {
    return '';
  }

  const fontQuery = fontFamilies.map(f => `family=${f}:wght@300;400;500;600;700`).join('&');
  return `@import url('https://fonts.googleapis.com/css2?${fontQuery}&display=swap');`;
}

/**
 * Generate complete template styles
 */
export async function generateTemplateStyles(templateId: string): Promise<string> {
  const config = TEMPLATE_REGISTRY[templateId];
  if (!config) {
    throw new Error(`Template "${templateId}" not found`);
  }

  const fontImports = getFontImports(templateId);
  const themeVars = generateThemeVariables(config.theme);
  const animations = getAnimationCSS(templateId);
  const cardStyles = getCardStyleCSS(templateId);

  return `
${fontImports}

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  ${themeVars}

  body {
    font-family: "${config.fonts.body}", ui-sans-serif, system-ui, sans-serif;
    color: var(--color-text);
    background: var(--color-background);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ${config.fonts.heading !== config.fonts.body ? `
  h1, h2, h3, h4, h5, h6 {
    font-family: "${config.fonts.heading}", serif;
  }
  ` : ''}
}

@layer components {
  ${cardStyles}
}

${animations}

@media (prefers-reduced-motion: no-preference) {
  * {
    scroll-behavior: smooth;
  }
}
`.trim();
}

/**
 * Validate template ID
 */
export function isValidTemplateId(templateId: string): boolean {
  return templateId in TEMPLATE_REGISTRY;
}

/**
 * Get all available template IDs
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}

/**
 * Get template display information for UI
 */
export function getTemplateDisplayInfo(templateId: string): {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
} | null {
  const config = TEMPLATE_REGISTRY[templateId];
  if (!config) return null;

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    category: config.category,
    features: config.features,
  };
}
