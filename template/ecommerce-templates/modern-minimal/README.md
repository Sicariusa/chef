# Modern Minimal E-Commerce Template

A clean, minimalist e-commerce design with subtle animations and focus on typography.

## Design Philosophy

- **Simplicity First**: Clean layouts with plenty of white space
- **Typography-Driven**: Inter font family for crisp, modern text
- **Subtle Interactions**: Gentle animations and transitions
- **Mobile-First**: Responsive design that works on all devices

## Color Palette

- **Primary**: Blue (#2563eb) - For primary actions and links
- **Secondary**: Slate (#64748b) - For secondary content
- **Accent**: Sky Blue (#0ea5e9) - For highlights and accents
- **Background**: White (#ffffff) - Clean base
- **Surface**: Slate (#f8fafc) - For cards and containers

## Typography

- **Font Family**: Inter
- **Heading Sizes**: 2xl to 5xl
- **Body Text**: Base with increased line height
- **Weight Range**: Regular (400) to Bold (700)

## Animations

All animations use a 300ms duration with cubic-bezier easing:

- **Fade In**: Smooth opacity transitions
- **Slide Up**: Elements enter from below
- **Scale In**: Gentle scale-up effect
- **Hover**: Subtle lift and shadow enhancement

## Components

### Product Cards
- Minimal design with soft shadows
- Hover effects: lift and enhanced shadow
- Clean product images
- Clear typography hierarchy

### Navigation
- Sticky header with subtle shadow
- Smooth scroll behavior
- Mobile hamburger menu
- Cart counter badge

### Buttons
- Primary: Solid blue background
- Secondary: Outline style
- Consistent padding and rounded corners
- Focus states for accessibility

## Layout

- **Grid System**: 1 column (mobile), 2 (tablet), 4 (desktop)
- **Spacing**: Consistent 1.5rem gap
- **Max Width**: 1280px container
- **Padding**: Responsive horizontal padding

## Customization

To customize the theme, edit `tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: "#2563eb",  // Change primary color
    hover: "#1d4ed8",
  },
  // ...
}
```

## Best Practices

1. **Keep it Simple**: Don't over-design, let content shine
2. **Use White Space**: Give elements room to breathe
3. **Consistent Spacing**: Use Tailwind spacing scale
4. **Accessible Colors**: Ensure sufficient contrast
5. **Performance**: Optimize images, use lazy loading

## Responsive Breakpoints

- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Laptops
- **xl**: 1280px - Desktops
