# E-Commerce Templates - Quick Reference

## 📋 Template Quick Comparison

| Template | Best For | Primary Color | Font | Animation | Special Features |
|----------|----------|--------------|------|-----------|------------------|
| **modern-minimal** | General retail | Blue #2563eb | Inter | 300ms smooth | Clean, minimal |
| **luxury-store** | High-end fashion | Gold #d4af37 | Playfair + Inter | 400ms refined | Gold accents, elegant |
| **tech-gadgets** | Electronics | Indigo #6366f1 | Poppins | 250ms bouncy | Dark theme, glassmorphism |
| **fashion-boutique** | Fashion/Youth | Pink #ec4899 | Poppins | 350ms playful | Vibrant, masonry grid |
| **organic-shop** | Natural products | Green #059669 | Poppins | 400ms gentle | Earthy, eco-friendly |
| **blank-starter** | Custom design | Indigo #4f46e5 | Inter | 200ms simple | Minimal baseline |

---

## 🎨 Color Palettes at a Glance

### Modern Minimal
```
Primary:   #2563eb (Blue)
Secondary: #64748b (Slate)
Accent:    #0ea5e9 (Sky Blue)
```

### Luxury Store
```
Primary:   #1e293b (Dark Slate)
Secondary: #94a3b8 (Gray)
Accent:    #d4af37 (Gold)
```

### Tech Gadgets
```
Primary:   #6366f1 (Indigo)
Secondary: #8b5cf6 (Purple)
Accent:    #06b6d4 (Cyan)
```

### Fashion Boutique
```
Primary:   #ec4899 (Hot Pink)
Secondary: #f472b6 (Pink)
Accent:    #a855f7 (Purple)
```

### Organic Shop
```
Primary:   #059669 (Emerald)
Secondary: #10b981 (Green)
Accent:    #f59e0b (Amber)
```

### Blank Starter
```
Primary:   #4f46e5 (Indigo)
Secondary: #6b7280 (Gray)
Accent:    #8b5cf6 (Purple)
```

---

## 📁 File Locations

```
/workspace/
├── template/ecommerce-templates/
│   ├── template-config.ts           ← Template registry
│   ├── template-loader.ts           ← Loading utilities
│   ├── modern-minimal/              ← Template 1
│   ├── luxury-store/                ← Template 2
│   ├── tech-gadgets/                ← Template 3
│   ├── fashion-boutique/            ← Template 4
│   ├── organic-shop/                ← Template 5
│   └── blank-starter/               ← Template 6
├── app/components/
│   └── TemplateSelector.tsx         ← UI component
├── chef-agent/
│   ├── constants.ts                 ← Updated suggestions
│   └── prompts/solutionConstraints.ts ← Enhanced prompts
└── documentation/
    ├── ECOMMERCE_TEMPLATES_GUIDE.md      ← Full guide
    ├── TEMPLATE_ENHANCEMENT_SUMMARY.md   ← Feature overview
    ├── INTEGRATION_SUMMARY.md            ← Integration details
    └── TEMPLATES_QUICK_REFERENCE.md      ← This file
```

---

## 🚀 Quick Usage Examples

### For Users

**Start with a template:**
```
"Create a luxury fashion store"
"Build a tech gadgets shop"
"Make an organic products store"
```

**Customize a template:**
```
"Use modern minimal but with green colors"
"Apply tech gadgets theme but lighter"
"Switch to fashion boutique template"
```

**Start blank:**
```
"Start with blank template"
"Build from scratch with minimal styling"
```

### For Developers

**Load template config:**
```typescript
import { getTemplateConfig } from './template-config';
const config = getTemplateConfig('modern-minimal');
```

**Generate template styles:**
```typescript
import { generateTemplateStyles } from './template-loader';
const css = await generateTemplateStyles('tech-gadgets');
```

**Use template selector:**
```tsx
<TemplateSelector
  selectedTemplateId={templateId}
  onSelectTemplate={setTemplateId}
/>
```

---

## 🎯 Template Selection Guide

### Choose Based On...

**Brand Identity:**
- Professional/Corporate → `modern-minimal`
- Luxury/Premium → `luxury-store`
- Tech/Innovation → `tech-gadgets`
- Trendy/Youth → `fashion-boutique`
- Natural/Eco → `organic-shop`
- Custom/Unique → `blank-starter`

**Product Type:**
- General goods → `modern-minimal`
- Jewelry/Fashion → `luxury-store`
- Electronics → `tech-gadgets`
- Clothing/Accessories → `fashion-boutique`
- Food/Wellness → `organic-shop`
- Any → `blank-starter`

**Aesthetic Preference:**
- Minimal → `modern-minimal`, `blank-starter`
- Elegant → `luxury-store`
- Edgy → `tech-gadgets`
- Playful → `fashion-boutique`
- Natural → `organic-shop`

---

## 🔧 Common Customizations

### Change Primary Color
```
"Change primary color to [color]"
"Use navy blue as the primary color"
"Make the main color darker"
```

### Adjust Animations
```
"Make animations faster"
"Use slower transitions"
"Remove bounce effects"
```

### Modify Layout
```
"Show 5 products per row"
"Use masonry grid"
"Change to list view"
```

### Update Typography
```
"Use Roboto font"
"Change heading font to [font]"
"Make text larger"
```

---

## 📊 Technical Specs

### Animation Durations
- **Blank Starter**: 200ms (fastest)
- **Tech Gadgets**: 250ms (fast)
- **Modern Minimal**: 300ms (medium)
- **Fashion Boutique**: 350ms (medium-slow)
- **Luxury Store**: 400ms (slow)
- **Organic Shop**: 400ms (slow)

### Grid Columns (Desktop)
- **Modern Minimal**: 4 columns
- **Tech Gadgets**: 4 columns
- **Fashion Boutique**: 4 columns
- **Luxury Store**: 3 columns
- **Organic Shop**: 3 columns
- **Blank Starter**: 3 columns

### Card Styles
- **Minimal**: Flat with border (modern-minimal, organic-shop, blank-starter)
- **Elevated**: Prominent shadow (luxury-store)
- **Glass**: Translucent blur (tech-gadgets)
- **Bordered**: Thick border (fashion-boutique)

---

## 💡 Tips & Tricks

### Best Practices
1. ✅ Start with closest matching template
2. ✅ Make small customizations incrementally
3. ✅ Test on mobile devices
4. ✅ Maintain design consistency
5. ✅ Use template features (animations, colors)

### Performance Tips
1. ✅ Optimize images for web
2. ✅ Use lazy loading for products
3. ✅ Minimize custom CSS additions
4. ✅ Leverage Tailwind utilities
5. ✅ Test with reduced-motion preference

### Accessibility
1. ✅ Ensure color contrast meets WCAG AA
2. ✅ Provide focus states on interactive elements
3. ✅ Use semantic HTML
4. ✅ Test with screen readers
5. ✅ Support keyboard navigation

---

## 🐛 Troubleshooting

### Template Not Loading
```
✓ Check template ID is valid
✓ Verify files exist in folder
✓ Ensure template-config.ts imported
```

### Styles Not Applied
```
✓ Check tailwind.config.js updated
✓ Verify CSS imports correct
✓ Clear browser cache
✓ Rebuild with npm run build
```

### Animations Not Working
```
✓ Check animation config in template
✓ Verify keyframes defined
✓ Test without reduced-motion
```

### Colors Not Showing
```
✓ Verify hex codes in config
✓ Check CSS variable definitions
✓ Ensure Tailwind purge not removing classes
```

---

## 📚 Documentation Links

- **Full Guide**: `documentation/ECOMMERCE_TEMPLATES_GUIDE.md`
- **Integration**: `INTEGRATION_SUMMARY.md`
- **Summary**: `TEMPLATE_ENHANCEMENT_SUMMARY.md`
- **Template Configs**: `template/ecommerce-templates/template-config.ts`
- **Loader Utils**: `template/ecommerce-templates/template-loader.ts`

---

## 🎓 Learning Path

### For New Users
1. Read quick reference (this file)
2. Browse template options
3. Try "Create a [template] store"
4. Explore customization options
5. Read full guide when needed

### For Developers
1. Read integration summary
2. Study template-config.ts
3. Explore template-loader.ts
4. Review template implementations
5. Try adding custom template

### For AI Integration
1. Review chef-agent/constants.ts
2. Study solutionConstraints.ts
3. Test template detection
4. Verify style application
5. Practice customization requests

---

## ✨ Quick Wins

### 5-Minute Start
```
1. "Create a modern minimal store"
2. Wait for generation
3. Browse the result
4. Done! 🎉
```

### 10-Minute Customization
```
1. Start with a template
2. "Change primary color to [color]"
3. "Make animations [faster/slower]"
4. "Show [N] products per row"
5. Done! 🎨
```

### 30-Minute Full Setup
```
1. Choose template
2. Customize colors
3. Adjust typography
4. Modify animations
5. Add custom products
6. Test on mobile
7. Deploy! 🚀
```

---

## 🎉 Key Features Recap

✅ **6 Templates**: Modern minimal, Luxury, Tech, Fashion, Organic, Blank  
✅ **Dynamic Loading**: Template loader system  
✅ **AI Integration**: Smart detection and application  
✅ **Full Responsive**: Mobile, tablet, desktop  
✅ **Customizable**: Every aspect can be modified  
✅ **Production Ready**: Polished and tested  

---

**Quick Reference Version**: 1.0  
**Last Updated**: October 23, 2025  
**Total Templates**: 6
