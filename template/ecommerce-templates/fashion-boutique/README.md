# Fashion Boutique E-Commerce Template

Trendy, colorful design with playful animations and modern typography for fashion-forward brands.

## Design Philosophy

- **Bold & Playful**: Vibrant colors with playful interactions
- **Fashion-Forward**: Trendy, contemporary aesthetic
- **Energetic**: Bouncy animations and dynamic effects
- **Feminine Elegance**: Soft pinks and purples

## Color Palette

- **Primary**: Hot Pink (#ec4899) - Main brand color
- **Secondary**: Pink (#f472b6) - Lighter accent
- **Accent**: Purple (#a855f7) - Complementary highlight
- **Background**: Very Light Pink (#fdf4ff) - Soft base
- **Surface**: White (#ffffff) - Clean cards

## Typography

- **Font Family**: Poppins
- **Weight Range**: 300-800 (Bold headings!)
- **Style**: Modern, geometric, friendly

## Visual Effects

### Playful Animations
- Scale transformations
- Wiggle on hover
- Bounce effects
- Rotation animations

### Decorative Elements
- Blob shapes with gradients
- Sparkle effects
- Floating animations
- Heart icons

### Shadow Effects
- Pink-tinted shadows
- Playful hover shadows
- Layered depth
- Soft glows

## Animations

Bouncy animations (350ms) with elastic easing:

- **Fade In**: Smooth opacity transitions
- **Slide Up**: Upward motion with bounce
- **Scale In**: Scale + rotation entrance
- **Wiggle**: Playful shake effect
- **Pulse**: Breathing animation

## Components

### Product Cards
- Rounded borders (2rem)
- Pink border accent
- Hover: Scale + rotate
- Masonry grid layout option

### Navigation
- Pink gradient accents
- Bouncy hover effects
- Heart icons
- Badge notifications

### Buttons
- Gradient backgrounds
- Scale on hover
- Pink shadows
- Bold typography

## Layout

- **Grid System**: 2 columns (mobile), 3 (tablet), 4 (desktop)
- **Masonry Option**: Dynamic grid layout
- **Spacing**: Tight 1rem gap
- **Section Spacing**: 2.5rem vertical

## Special Features

### Masonry Grid
- Dynamic height layout
- Pinterest-style arrangement
- Responsive breakpoints
- Auto-fill columns

### Interactive Elements
- Wiggle hover effects
- Scale transformations
- Rotation animations
- Pulse animations

### Decorative Blobs
- Abstract gradient shapes
- Background accents
- Floating animations
- Blur effects

## Customization

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: "#ec4899",  // Hot Pink
    hover: "#db2777",
  },
  accent: {
    DEFAULT: "#a855f7",  // Purple
    hover: "#9333ea",
  },
}
```

## Best Practices

1. **Color Balance**: Don't overwhelm with too much pink
2. **Animation Control**: Use sparingly for key interactions
3. **Image Quality**: Use high-quality fashion photography
4. **White Space**: Balance vibrant colors with clean space
5. **Accessibility**: Ensure text contrast meets WCAG standards

## Ideal For

- Women's fashion boutiques
- Clothing stores
- Accessories shops
- Beauty products
- Trendy lifestyle brands
- Youth-oriented fashion
- Contemporary style stores

## Layout Options

### Grid Layout (Default)
Standard grid with equal-sized cards

### Masonry Layout
Pinterest-style dynamic height grid:
- Add `masonry-grid` class to container
- Set `--row-span` CSS variable on items
- Creates dynamic, visually interesting layout

## Performance Notes

- Animations use GPU acceleration
- Hover effects are lightweight
- Consider reduced-motion preference
- Optimize large images for masonry

## Color Psychology

- **Pink**: Feminine, playful, youthful
- **Purple**: Creative, luxurious, unique
- **White**: Clean, pure, minimal

This palette creates an energetic, fashion-forward aesthetic perfect for trendy boutiques and contemporary brands.
