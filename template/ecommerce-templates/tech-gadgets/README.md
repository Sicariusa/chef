# Tech Gadgets E-Commerce Template

Futuristic dark theme design with glassmorphism, vibrant gradients, and dynamic animations.

## Design Philosophy

- **Dark Mode First**: Eye-friendly dark theme
- **Glassmorphism**: Frosted glass effects with blur
- **Vibrant Gradients**: Bold, modern color transitions
- **Tech Aesthetic**: Futuristic, cutting-edge design

## Color Palette

- **Primary**: Indigo (#6366f1) - Main brand color
- **Secondary**: Purple (#8b5cf6) - Complementary accent
- **Accent**: Cyan (#06b6d4) - Highlight color
- **Background**: Dark Navy (#0f172a) - Base background
- **Surface**: Dark Slate (#1e293b) - Card backgrounds

## Typography

- **Font Family**: Poppins (main), JetBrains Mono (code)
- **Weight Range**: 300-700
- **Style**: Modern, geometric, tech-forward

## Visual Effects

### Glassmorphism
- Frosted glass cards with backdrop blur
- Semi-transparent backgrounds
- Subtle border highlights
- Layered depth

### Neon Glow
- Box shadows with color glow
- Hover state enhancements
- Pulsing animations
- Glowing buttons

### Gradients
- Cyber gradient (Indigo → Purple → Cyan)
- Tech gradient (Blue → Purple)
- Animated gradient backgrounds
- Gradient text effects

## Animations

Fast, snappy animations (250ms) with bounce easing:

- **Fade In**: Quick opacity transitions
- **Slide Up**: Dynamic upward motion
- **Scale In**: Bouncy scale effect
- **Glow**: Pulsing neon effect
- **Float**: Gentle hovering animation

## Components

### Product Cards
- Glassmorphic design
- Neon glow on hover
- Gradient borders
- Tech badge labels

### Navigation
- Glass navbar with blur
- Neon underlines
- Gradient logo
- Smooth sticky behavior

### Buttons
- Gradient backgrounds
- Neon glow shadows
- Glass variants available
- Animated hover states

## Layout

- **Grid System**: 1 column (mobile), 2 (tablet), 4 (desktop)
- **Spacing**: Tight 1.25rem gap
- **Max Width**: 1400px container
- **Section Spacing**: 3rem vertical

## Special Features

### Background Effects
- Grid overlay pattern
- Animated gradient backgrounds
- Radial gradient accents
- Noise texture (optional)

### Interactive Elements
- Floating animation on hover
- Glow intensity changes
- Scale transformations
- Color transitions

### Custom Scrollbar
- Styled to match theme
- Indigo accent color
- Smooth rounded design

## Customization

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: "#6366f1",  // Indigo
    hover: "#4f46e5",
  },
  secondary: {
    DEFAULT: "#8b5cf6",  // Purple
    hover: "#7c3aed",
  },
}
```

## Best Practices

1. **Contrast**: Ensure text is readable on dark backgrounds
2. **Glow Sparingly**: Don't overuse neon effects
3. **Performance**: Use backdrop-filter carefully
4. **Accessibility**: Provide sufficient color contrast
5. **Loading States**: Use shimmer and skeleton loaders

## Ideal For

- Electronics stores
- Gaming gear shops
- Tech gadget retailers
- Computer hardware
- Smart home devices
- Wearable technology
- Innovation-focused brands

## Technical Notes

- Uses CSS backdrop-filter for glass effect
- Gradient animations may impact performance
- Custom scrollbar only works in WebKit browsers
- Neon shadows work best on dark backgrounds
