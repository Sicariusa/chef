# Blank Starter E-Commerce Template

Minimal starting point with basic layout and neutral styling. Perfect for building your own custom design.

## Design Philosophy

- **Minimal by Design**: Clean slate for customization
- **Neutral Colors**: Professional gray and indigo palette
- **Simple Animations**: Basic transitions only
- **Foundation First**: Essential components only

## Color Palette

- **Primary**: Indigo (#4f46e5) - Versatile brand color
- **Secondary**: Gray (#6b7280) - Neutral secondary
- **Accent**: Purple (#8b5cf6) - Optional accent
- **Background**: White (#ffffff) - Clean base
- **Surface**: Light Gray (#f9fafb) - Subtle surface

## Typography

- **Font Family**: Inter
- **Weight Range**: 400-700
- **Style**: Clean, modern, versatile

## Animations

Minimal animations (200ms) with simple easing:

- **Fade In**: Basic opacity transition
- **Hover**: Simple shadow enhancement
- **No Complex Animations**: Keep it simple

## Components

### Product Cards
- Clean white background
- Simple border
- Basic hover effect
- Standard layout

### Navigation
- Simple header
- Minimal styling
- Clear navigation
- Basic cart counter

### Buttons
- Standard styles
- Three variants: primary, secondary, outline
- Simple hover effects
- Focus states

## Layout

- **Grid System**: 1 column (mobile), 2 (tablet), 3 (desktop)
- **Spacing**: Standard 1.5rem gap
- **Max Width**: Standard container
- **Section Spacing**: 2rem vertical

## What's Included

### Essential Styles
- Reset and base styles
- Form input styles
- Button variants
- Card components

### Minimal Components
- Basic navbar
- Simple product cards
- Standard forms
- Clean footer

### No Extras
- No decorative elements
- No complex animations
- No heavy styling
- No opinionated design

## Customization

This template is designed to be easily customized:

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    DEFAULT: "#your-color",
    hover: "#your-hover-color",
  },
}
```

### Add Your Fonts
Update in `index.css`:
```css
body {
  font-family: "YourFont", sans-serif;
}
```

### Extend Styles
Add your custom components in `index.css`:
```css
@layer components {
  .your-component {
    /* your styles */
  }
}
```

## Best Practices

1. **Start Simple**: Build from this foundation
2. **Add Gradually**: Introduce complexity as needed
3. **Stay Consistent**: Maintain design system
4. **Test Often**: Ensure changes work across devices
5. **Keep Accessible**: Maintain WCAG standards

## Ideal For

- Custom design projects
- Learning and experimentation
- Brand-specific styling
- Rapid prototyping
- Minimal aesthetic preference
- Full creative control

## Next Steps

### 1. Customize Colors
Choose your brand colors and update the theme

### 2. Select Typography
Pick fonts that match your brand identity

### 3. Add Components
Build additional components as needed

### 4. Enhance Interactions
Add animations and transitions to taste

### 5. Polish Details
Refine spacing, shadows, and finishing touches

## File Structure

```
blank-starter/
├── tailwind.config.js    # Theme configuration
├── index.css            # Base styles
└── README.md           # This file
```

## Extending the Template

### Add Animations
```js
// tailwind.config.js
animation: {
  'your-animation': 'your-animation 1s ease-in-out',
},
keyframes: {
  'your-animation': {
    '0%': { /* start */ },
    '100%': { /* end */ },
  },
}
```

### Add Custom Colors
```js
// tailwind.config.js
colors: {
  brand: {
    50: '#...',
    100: '#...',
    // ... etc
  },
}
```

### Add Utility Classes
```css
/* index.css */
@layer utilities {
  .your-utility {
    /* your styles */
  }
}
```

## Support

This is a minimal template. You'll need to:
- Add your own components
- Implement additional features
- Customize to your needs
- Build on top of this foundation

## Philosophy

This template follows the principle of "less is more." It provides:
- ✅ Essential structure
- ✅ Clean foundation
- ✅ Easy customization
- ❌ No unnecessary styling
- ❌ No opinionated design
- ❌ No complex features

Start here and build exactly what you need, nothing more, nothing less.
