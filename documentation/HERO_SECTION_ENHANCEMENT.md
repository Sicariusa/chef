# Hero Section Enhancement Documentation

## Overview

This document describes the implementation of the enhanced hero section for the Chef homepage, featuring animated video backgrounds, dynamic text animations, and an expandable feature showcase.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Implementation Details](#implementation-details)
4. [Component Structure](#component-structure)
5. [Video Assets](#video-assets)
6. [Animation Details](#animation-details)
7. [Feature Showcase](#feature-showcase)

---

## Features

### 1. Video Background
- **Cycling Videos**: Three videos rotate automatically every 8 seconds
- **Smooth Transitions**: 1.5-second fade transitions between videos
- **Auto-play**: Videos play automatically, muted, and loop
- **Responsive**: Videos scale to cover the entire hero section

### 2. Animated Text
- **Dynamic Slogans**: Text changes every 3 seconds
  - "Build your"
  - "Create your"
  - "Design your"
  - "Launch your"
- **Dynamic Taglines**: Secondary text changes every 3 seconds
  - "e-commerce store"
  - "online business"
  - "digital storefront"
  - "shopping platform"
- **Smooth Animations**: Fade and slide transitions for text changes

### 3. Feature Showcase
- **Initial Features**: 5 core features displayed by default
- **Expandable**: "See More" button reveals 6 additional features
- **Animated Cards**: Each feature card has hover effects and entrance animations
- **Responsive Layout**: Features wrap and adapt to screen size

---

## Architecture

### Component Hierarchy

```
BaseChat.client.tsx
├── HeroVideoBackground (background layer, z-0)
├── HeroTextContent (text overlay, z-10)
└── Feature Showcase (content layer, z-10)
    ├── Initial Features (always visible)
    ├── Additional Features (expandable)
    └── See More/Less Button
```

### File Structure

```
app/components/chat/
├── BaseChat.client.tsx          # Main chat component with hero integration
└── AnimatedHero.client.tsx     # Hero components (video + text)

chef-agent/
└── constants.ts                 # Feature definitions

public/videos/
├── video-3.mp4                 # Video asset 1
├── video-4.mp4                 # Video asset 2
└── video-5.mp4                 # Video asset 3
```

---

## Implementation Details

### 1. Video Background Component

**Location**: `app/components/chat/AnimatedHero.client.tsx`

**Component**: `HeroVideoBackground`

**Key Features**:
- Uses `useState` to track current video index
- `useEffect` cycles through videos every 8 seconds
- `AnimatePresence` handles smooth transitions
- Videos are positioned absolutely to cover the entire container
- Dark overlay (40% opacity) ensures text readability
- Gradient overlay adds visual depth

**Code Structure**:
```typescript
export function HeroVideoBackground() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Cycle through videos every 8 seconds
  useEffect(() => {
    const videoInterval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(videoInterval);
  }, []);

  // Handle video playback
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideoIndex) {
          video.play().catch(() => {}); // Handle autoplay restrictions
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentVideoIndex]);
}
```

**Video Configuration**:
- `autoPlay`: Videos start automatically
- `muted`: Required for autoplay in browsers
- `loop`: Each video loops while active
- `playsInline`: Prevents fullscreen on mobile
- `object-cover`: Ensures videos fill the container

### 2. Animated Text Component

**Location**: `app/components/chat/AnimatedHero.client.tsx`

**Component**: `HeroTextContent`

**Key Features**:
- Two separate text animations (slogan and tagline)
- Independent timing (both change every 3 seconds)
- Smooth fade and slide transitions
- Gradient text effects with animated backgrounds
- Drop shadows for better visibility over videos

**Text Arrays**:
```typescript
export const slogans = [
  'Build your',
  'Create your',
  'Design your',
  'Launch your',
];

export const taglines = [
  'e-commerce store',
  'online business',
  'digital storefront',
  'shopping platform',
];
```

**Animation Details**:
- **Initial**: `opacity: 0, y: 20` (fade in from below)
- **Animate**: `opacity: 1, y: 0` (fade in and slide up)
- **Exit**: `opacity: 0, y: -20` (fade out and slide up)
- **Duration**: 0.5 seconds with easeInOut
- **Tagline Delay**: 0.1 seconds after slogan for staggered effect

### 3. Feature Showcase

**Location**: `app/components/chat/BaseChat.client.tsx`

**Key Features**:
- Split into initial and additional features
- Expandable with "See More" button
- Animated entrance for each feature card
- Hover effects with glow and scale animations

**Feature Definitions**:

**Initial Features** (always visible):
```typescript
export const INITIAL_FEATURES = [
  { icon: '🗄️', text: 'Database with Convex' },
  { icon: '🔐', text: 'Authentication' },
  { icon: '⚡', text: 'Real-time Preview' },
  { icon: '📁', text: 'File Storage' },
  { icon: '🚀', text: 'Deploy to Production' },
  { icon: '🚨', text: 'Error Handling' },
];
```

**Additional Features** (expandable):
```typescript
export const ADDITIONAL_FEATURES = [
  { icon: '📊', text: 'Order Dashboard' },
  { icon: '👑', text: 'Admin Dashboard' },
  { icon: '🛠️', text: 'Product Management' },
  { icon: '🎯', text: 'Category Management' },
  { icon: '⏪', text: 'Rewind Feature' },
  { icon: '📥', text: 'Download Code' },
];
```

**See More Button**:
- Toggles `showMoreFeatures` state
- Shows chevron icon (down when collapsed, up when expanded)
- Smooth expand/collapse animation using `AnimatePresence`
- Styled to match feature cards

---

## Component Structure

### BaseChat Integration

The hero section is integrated into `BaseChat.client.tsx` with the following structure:

```typescript
{!chatStarted && (
  <>
    {/* Video background - only show when chat hasn't started */}
    <HeroVideoBackground />
    
    {/* Hero text content */}
    <div id="intro" className="relative mx-auto mb-12 mt-16 max-w-5xl px-4 text-center md:mt-20 lg:px-0">
      <HeroTextContent />
    </div>
    
    {/* Feature showcase */}
    <div className="mx-auto mt-6 max-w-3xl">
      {/* Initial features */}
      {/* Additional features (expandable) */}
      {/* See More button */}
    </div>
  </>
)}
```

### Z-Index Layering

Proper layering ensures all elements display correctly:

1. **z-0**: Video background (behind everything)
2. **z-10**: Content layer (text, features, message input)
3. **z-20**: Message input (above features)

---

## Video Assets

### Video Files

All videos are stored in `public/videos/`:

- `video-3.mp4` (3.0MB)
- `video-4.mp4` (1.3MB)
- `video-5.mp4` (1.0MB)

### Video Paths

Videos are referenced as static assets:
```typescript
const videos = [
  '/videos/video-3.mp4',
  '/videos/video-4.mp4',
  '/videos/video-5.mp4',
];
```

### Video Requirements

- **Format**: MP4 (H.264 codec recommended)
- **Size**: Optimized for web (under 5MB each)
- **Aspect Ratio**: 16:9 recommended
- **Duration**: Can be any length (videos loop)
- **Content**: Abstract/background style works best

---

## Animation Details

### Video Transitions

**Transition Properties**:
- **Duration**: 1.5 seconds
- **Easing**: `easeInOut`
- **Effect**: Opacity fade (0 → 1)

**Implementation**:
```typescript
<motion.video
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 1.5, ease: 'easeInOut' }}
/>
```

### Text Animations

**Slogan Animation**:
- **Initial**: `opacity: 0, y: 20`
- **Animate**: `opacity: 1, y: 0`
- **Exit**: `opacity: 0, y: -20`
- **Duration**: 0.5 seconds
- **Easing**: `easeInOut`

**Tagline Animation**:
- Same as slogan but with 0.1s delay
- Creates staggered effect

**Text Gradient Animation**:
- Uses `animate-gradient-shift` CSS animation
- Shifts background position over 8 seconds
- Creates flowing gradient effect

### Feature Card Animations

**Entrance Animation**:
- **Initial**: `opacity: 0, scale: 0.8, y: 10`
- **Animate**: `opacity: 1, scale: 1, y: 0`
- **Duration**: 0.4 seconds
- **Stagger**: 0.1 seconds between cards (initial), 0.05 seconds (additional)

**Hover Effects**:
- Border color change (to accent color)
- Background gradient shift
- Shadow enhancement
- Slight upward translation (`-translate-y-0.5`)
- Icon scale animation (`scale-110`)

**Expand/Collapse Animation**:
- **Height**: Animates from 0 to auto
- **Opacity**: Fades in/out
- **Duration**: 0.3 seconds
- **Easing**: `easeInOut`

---

## Feature Showcase

### Initial Features Display

The first 6 features are always visible:
1. Database with Convex
2. Authentication
3. Real-time Preview
4. File Storage
5. Deploy to Production
6. Error Handling

### Additional Features (Expandable)

Clicking "See More" reveals:
1. Order Dashboard
2. Admin Dashboard
3. Product Management
4. Category Management
5. Rewind Feature
6. Download Code

### Feature Card Styling

**Base Styles**:
- Rounded corners (`rounded-xl`)
- Border with tertiary color
- Gradient background (secondary colors)
- Backdrop blur effect
- Padding and spacing

**Hover States**:
- Border changes to accent color
- Background gradient intensifies
- Shadow appears with accent color tint
- Slight upward movement
- Icon scales up

**Responsive Behavior**:
- Features wrap on smaller screens
- Gap adjusts (3 on mobile, 4 on desktop)
- Text size adapts (xs on mobile, sm on desktop)

---

## Styling Details

### Overlays

**Dark Overlay**:
```css
bg-black/40  /* 40% opacity black overlay */
```

**Gradient Overlay**:
```css
bg-gradient-to-br from-background-primary/60 via-transparent to-background-secondary/60
```

### Text Styling

**Main Heading**:
- Font: Display font family
- Size: Responsive (5xl → 8xl)
- Weight: Black (900)
- Color: White with drop shadow
- Gradient: Applied via `bg-clip-text`

**Description Text**:
- Size: Responsive (lg → 2xl)
- Color: White with 90% opacity
- Drop shadow for readability

### Feature Cards

**Container**:
- Max width: 3xl (768px)
- Centered with auto margins
- Flex wrap layout

**Individual Cards**:
- Flex row layout
- Icon and text side by side
- Responsive padding
- Transition on all properties

---

## Performance Considerations

### Video Optimization

1. **File Size**: Videos are compressed (under 5MB each)
2. **Lazy Loading**: Only active video plays
3. **Pause/Reset**: Inactive videos are paused and reset
4. **Autoplay Handling**: Graceful fallback if autoplay fails

### Animation Performance

1. **GPU Acceleration**: Transform and opacity animations
2. **Will-Change**: Applied where needed
3. **Reduced Motion**: Respects user preferences
4. **Staggered Animations**: Prevents janky simultaneous animations

### Rendering Optimization

1. **Conditional Rendering**: Hero only shows when `!chatStarted`
2. **Z-Index Management**: Prevents unnecessary repaints
3. **Pointer Events**: Background videos have `pointer-events-none`

---

## Browser Compatibility

### Video Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile**: Works with `playsInline` attribute
- **Autoplay**: Requires muted videos (handled)

### Animation Support

- **Framer Motion**: Works in all modern browsers
- **CSS Animations**: Fallback for older browsers
- **Transforms**: Hardware accelerated

---

## Accessibility

### Video Accessibility

- Videos are decorative (background)
- No audio (muted)
- No captions needed (abstract content)

### Text Accessibility

- High contrast text (white on dark overlay)
- Drop shadows improve readability
- Responsive text sizes

### Interactive Elements

- "See More" button is keyboard accessible
- Feature cards have hover states
- Focus states for keyboard navigation

---

## Future Enhancements

### Potential Improvements

1. **Video Selection**: Allow users to choose preferred video
2. **Custom Text**: User-defined slogans/taglines
3. **More Features**: Additional feature categories
4. **Video Preloading**: Preload next video for smoother transitions
5. **Performance Metrics**: Track video load times
6. **A/B Testing**: Test different video/content combinations

### Technical Improvements

1. **Video Compression**: Further optimize video file sizes
2. **Lazy Loading**: Load videos on demand
3. **Progressive Enhancement**: Fallback for no-video support
4. **Analytics**: Track feature expansion clicks

---

## Troubleshooting

### Common Issues

**Videos Not Playing**:
- Check browser autoplay policies
- Ensure videos are muted
- Verify file paths are correct
- Check video codec compatibility

**Text Not Visible**:
- Verify overlay opacity
- Check text color contrast
- Ensure z-index layering is correct

**Animations Not Smooth**:
- Check for CSS conflicts
- Verify Framer Motion is loaded
- Check browser performance

**Features Not Expanding**:
- Verify state management
- Check AnimatePresence setup
- Ensure button click handler is working

---

## Code Examples

### Complete Hero Section Structure

```typescript
{!chatStarted && (
  <>
    {/* Video Background */}
    <HeroVideoBackground />
    
    {/* Hero Text */}
    <div id="intro" className="relative mx-auto mb-12 mt-16 max-w-5xl px-4 text-center md:mt-20 lg:px-0">
      <HeroTextContent />
    </div>
    
    {/* Features */}
    <motion.div className="mx-auto mt-6 max-w-3xl">
      {/* Initial Features */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {INITIAL_FEATURES.map((feature, index) => (
          <FeatureCard key={feature.text} feature={feature} index={index} />
        ))}
      </div>
      
      {/* Additional Features */}
      <AnimatePresence>
        {showMoreFeatures && (
          <motion.div>
            {ADDITIONAL_FEATURES.map((feature, index) => (
              <FeatureCard key={feature.text} feature={feature} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* See More Button */}
      <SeeMoreButton 
        expanded={showMoreFeatures}
        onClick={() => setShowMoreFeatures(!showMoreFeatures)}
      />
    </motion.div>
  </>
)}
```

---

## Conclusion

The enhanced hero section provides a modern, engaging first impression for Chef users. The combination of video backgrounds, animated text, and feature showcases creates a dynamic and informative landing experience. The implementation is performant, accessible, and maintainable.

For questions or improvements, refer to the component files:
- `app/components/chat/AnimatedHero.client.tsx`
- `app/components/chat/BaseChat.client.tsx`
- `chef-agent/constants.ts`

