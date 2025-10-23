# CSS Guide - Vanilla CSS System

This project uses **vanilla CSS** instead of Tailwind CSS for a simpler, more maintainable approach. No build complexity, no configuration errors, just clean CSS.

## Why Vanilla CSS?

✅ **No Build Errors**: No Tailwind configuration issues or missing classes  
✅ **Simple & Clean**: Easy to understand and modify  
✅ **Better Performance**: No large CSS framework to download  
✅ **Full Control**: Complete control over styling without framework limitations  
✅ **Easy to Learn**: Standard CSS that works everywhere  

## CSS Architecture

The entire styling system is in `/src/index.css` with:
- CSS Variables for theming
- Utility classes for common patterns
- Component-specific classes
- Responsive design built-in

## Color System

All colors are defined as CSS variables:

```css
--primary: #2563eb        /* Main brand color (blue) */
--primary-hover: #1d4ed8  /* Hover state */
--secondary: #6b7280      /* Secondary text/elements */
--success: #10b981        /* Success states */
--warning: #f59e0b        /* Warnings */
--error: #ef4444          /* Errors/danger */
```

### Using Colors

```tsx
// In className
<div className="text-primary">Text</div>

// Or inline style
<div style={{ color: "var(--primary)" }}>Text</div>
```

## Component Classes

### Buttons

```tsx
// Primary button
<button className="btn btn-primary">Click Me</button>

// Secondary button
<button className="btn btn-secondary">Cancel</button>

// Outline button
<button className="btn btn-outline">View Details</button>

// Danger button
<button className="btn btn-danger">Delete</button>

// Size variants
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### Cards

```tsx
<div className="card">
  <h3 className="card-title">Card Title</h3>
  <div className="card-body">
    Content goes here
  </div>
</div>
```

### Product Cards

```tsx
<div className="product-card">
  <img src="..." className="product-image" />
  <div className="product-content">
    <h3 className="product-title">Product Name</h3>
    <p className="product-description">Description</p>
    <div className="product-footer">
      <span className="product-price">$99.99</span>
      <button className="btn btn-primary">Add to Cart</button>
    </div>
  </div>
</div>
```

### Forms

```tsx
<div className="form-group">
  <label className="form-label">Email</label>
  <input type="email" className="input" />
  <span className="form-error">Error message</span>
</div>
```

### Badges

```tsx
<span className="badge">Default</span>
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>
```

### Alerts

```tsx
<div className="alert alert-info">Information message</div>
<div className="alert alert-success">Success message</div>
<div className="alert alert-warning">Warning message</div>
<div className="alert alert-error">Error message</div>
```

## Layout Classes

### Container

```tsx
<div className="container">
  {/* Content will be centered with max-width */}
</div>
```

### Grid Layouts

```tsx
// Responsive grid
<div className="grid grid-cols-4">
  {/* Auto-adjusts: 4 cols -> 3 cols -> 2 cols -> 1 col */}
</div>

// Available grid options
<div className="grid grid-cols-1">1 column</div>
<div className="grid grid-cols-2">2 columns</div>
<div className="grid grid-cols-3">3 columns</div>
<div className="grid grid-cols-4">4 columns</div>
```

### Flexbox

```tsx
<div className="flex items-center justify-between gap-md">
  {/* Flex container */}
</div>

// Available flex classes:
// .flex - Display flex
// .flex-col - Column direction
// .items-center - Align items center
// .justify-center - Justify content center
// .justify-between - Space between
// .gap-sm, .gap-md, .gap-lg - Gap spacing
```

## Utility Classes

### Typography

```tsx
<h1 className="text-3xl font-bold text-primary">Heading</h1>
<p className="text-sm text-secondary">Small text</p>

// Sizes: text-sm, text-lg, text-xl, text-2xl, text-3xl
// Weights: font-semibold, font-bold
// Colors: text-primary, text-secondary, text-gray, text-success, text-error
```

### Spacing

```tsx
// Margin
<div className="mb-md">Margin bottom</div>
<div className="mt-lg">Margin top</div>

// Padding
<div className="p-md">Padding all sides</div>

// Available: sm, md, lg, xl (4px, 8px, 16px, 24px, 32px)
```

### Width & Height

```tsx
<div className="w-full">Full width</div>
<div className="h-full">Full height</div>
```

### Borders & Shadows

```tsx
<div className="rounded shadow">Rounded corners with shadow</div>
<div className="rounded-lg shadow-lg">Large rounded with large shadow</div>
```

## Animations

### Built-in Animations

```tsx
<div className="animate-fade-in">Fades in</div>
<div className="animate-scale-in">Scales in</div>
<div className="animate-slide-in">Slides in</div>
```

### Loading Spinner

```tsx
<div className="spinner"></div>
<div className="spinner spinner-lg"></div>
```

## Navigation

### Header & Navbar

```tsx
<header className="header">
  <div className="container">
    <nav className="navbar">
      <a href="/" className="nav-brand">Logo</a>
      <ul className="nav-menu">
        <li><a href="#" className="nav-link">Link</a></li>
        <li><a href="#" className="nav-link active">Active</a></li>
      </ul>
    </nav>
  </div>
</header>
```

## Tables

```tsx
<table className="table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

## Modals

```tsx
<div className="modal-overlay">
  <div className="modal">
    <div className="modal-header">
      <h2 className="modal-title">Modal Title</h2>
      <button className="modal-close">×</button>
    </div>
    <div>Modal content</div>
  </div>
</div>
```

## Empty States

```tsx
<div className="empty-state">
  <div className="empty-state-icon">🛒</div>
  <h3 className="empty-state-title">No Items</h3>
  <p className="empty-state-description">Your cart is empty</p>
  <button className="btn btn-primary">Start Shopping</button>
</div>
```

## Responsive Design

All components are mobile-first and responsive:

- **Desktop**: 4-column grids, full navigation
- **Tablet** (≤1024px): 3-column grids
- **Mobile** (≤768px): 2-column grids
- **Small Mobile** (≤480px): 1-column grids

## Customization

### Changing Colors

Edit CSS variables in `/src/index.css`:

```css
:root {
  --primary: #your-color;
  --primary-hover: #your-hover-color;
}
```

### Adding New Classes

Add to `/src/index.css`:

```css
.my-custom-class {
  /* Your styles */
}
```

### Modifying Existing Styles

Find the class in `/src/index.css` and modify directly.

## Best Practices

1. **Use Semantic Classes**: Use `.btn`, `.card`, `.product-card` instead of utility classes
2. **Combine with Inline Styles**: For one-off styles, inline styles are fine
3. **Keep CSS Variables**: Don't hardcode colors, use variables
4. **Mobile-First**: Test on mobile devices
5. **Accessibility**: Use semantic HTML and proper contrast

## Migration from Tailwind

If you see Tailwind classes, replace them:

```tsx
// Before (Tailwind)
<div className="flex items-center justify-between px-4 py-2 bg-primary text-white">

// After (Vanilla CSS)
<div className="flex items-center justify-between" style={{padding: "8px 16px", background: "var(--primary)", color: "white"}}>
```

## Tips

- Use className for reusable styles
- Use inline style for one-off adjustments
- Check `/src/index.css` for all available classes
- CSS variables make theming easy
- No build errors = faster development!

---

**Questions?** Check `/src/index.css` for all available classes and styles.

