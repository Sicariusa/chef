import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  '/videos/video-6.mp4',
  '/videos/video-3.mp4',
  '/videos/video-4.mp4',
  '/videos/video-5.mp4',
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
          video.play().catch(() => {
            // Handle autoplay restrictions
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentVideoIndex]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
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
      {/* Enhanced animated gradient background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-util-accent/25 via-util-info/25 to-util-accent/25 blur-3xl opacity-70 animate-pulse" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-util-info/15 via-util-accent/15 to-util-info/15 blur-2xl opacity-50 animate-pulse [animation-delay:1s]" />

      <h1 className="relative mb-4 font-display text-5xl font-black leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
        <div className="block">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentSloganIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="inline-block bg-gradient-to-r from-white via-util-accent to-util-info bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift drop-shadow-[0_0_30px_rgba(99,168,248,0.5)]"
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
              className="inline-block bg-gradient-to-r from-util-info via-util-accent to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift [animation-delay:0.5s] drop-shadow-[0_0_30px_rgba(141,38,118,0.5)]"
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
        className="mx-auto mb-12 max-w-3xl text-lg font-medium text-white/90 md:text-xl lg:text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
      >
        Create a complete online store with products, shopping cart, checkout, and admin dashboard—all powered by AI
      </motion.p>
    </motion.div>
  );
}

