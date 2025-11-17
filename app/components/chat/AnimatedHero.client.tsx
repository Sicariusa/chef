import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  // '/videos/video-3.mp4',
  // '/videos/video-4.mp4',
  'https://cdn.builder.io/o/assets%2F6cb30fdd1d254ba19be5ae22f1b872ab%2F9396007060b543b0b1c246e955489540?alt=media&token=90aadbb4-1c0b-445c-b58c-9c7da2820c76&apiKey=6cb30fdd1d254ba19be5ae22f1b872ab',
  'https://cdn.builder.io/o/assets%2F6cb30fdd1d254ba19be5ae22f1b872ab%2F36f8a09ed0a44b2db574c3b77f1f5313?alt=media&token=cd3d58f9-2342-4e46-99f7-2b3afc9a5288&apiKey=6cb30fdd1d254ba19be5ae22f1b872ab',
  'https://cdn.builder.io/o/assets%2F6cb30fdd1d254ba19be5ae22f1b872ab%2F9c063e24199842ebae4808f2d001498c?alt=media&token=64f1bc87-33f7-41a0-82ea-53f8a68720c5&apiKey=6cb30fdd1d254ba19be5ae22f1b872ab',
  
   
];

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

// Hero background videos only
export function HeroVideoBackground() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Cycle through videos
  useEffect(() => {
    const videoInterval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(videoInterval);
  }, []);

  // Handle video transitions
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideoIndex) {
          // Ensure video is loaded before playing
          if (video.readyState >= 2) {
            video.play().catch((err) => {
              console.error('Video play error:', err);
            });
          } else {
            video.addEventListener('loadeddata', () => {
              video.play().catch((err) => {
                console.error('Video play error:', err);
              });
            }, { once: true });
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentVideoIndex]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      {/* Video backgrounds */}
      <div className="absolute inset-0">
        {videos.map((videoSrc, index) => (
          <AnimatePresence key={videoSrc} mode="wait">
            {index === currentVideoIndex && (
              <motion.video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                key={videoSrc}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                crossOrigin="anonymous"
                preload="auto"
                onError={(e) => {
                  console.error('Video loading error:', e);
                }}
                onLoadedData={() => {
                  console.log('Video loaded successfully');
                }}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Gradient overlay for visual enhancement */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary/60 via-transparent to-background-secondary/60" />
    </div>
  );
}

// Hero text content component
export function HeroTextContent() {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  // Cycle through slogans
  useEffect(() => {
    const sloganInterval = setInterval(() => {
      setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 3000); // Change slogan every 3 seconds

    return () => clearInterval(sloganInterval);
  }, []);

  // Cycle through taglines
  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000); // Change tagline every 3 seconds

    return () => clearInterval(taglineInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Premium animated gradient background glow - aligned with video colors */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl opacity-60 animate-pulse" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-indigo-500/15 via-teal-500/15 to-violet-500/15 blur-2xl opacity-40 animate-pulse [animation-delay:1s]" />

      <h1 
        className="relative mb-4 text-5xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-[0_4px_40px_rgba(0,0,0,0.7)]"
        style={{
          fontFamily: "'Inter', 'GT America', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: 900,
          letterSpacing: '-0.03em',
        }}
      >
        <div className="block">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentSloganIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="inline-block"
              style={{
                color: '#ffffff',
                fontFamily: "'Inter', 'GT America', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 900,
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
              }}
            >
              {slogans[currentSloganIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="block mt-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentTaglineIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
              className="inline-block"
              style={{
                color: '#a78bfa',
                fontFamily: "'Inter', 'GT America', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 900,
                filter: 'drop-shadow(0 0 25px rgba(167, 139, 250, 0.5)) drop-shadow(0 0 10px rgba(196, 181, 253, 0.3))',
              }}
            >
              {taglines[currentTaglineIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-12 max-w-3xl text-lg font-medium md:text-xl lg:text-2xl tracking-wide drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)]"
        style={{
          fontFamily: "'Inter', 'GT America', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: 'rgba(255, 255, 255, 0.98)',
          fontWeight: 500,
          letterSpacing: '0.01em',
        }}
      >
        Create a complete online store with products, shopping cart, checkout, and admin dashboard—all powered by AI
      </motion.p>
    </motion.div>
  );
}

