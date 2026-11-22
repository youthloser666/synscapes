import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import EventCard from './components/EventCard';
import Community from './components/Community';
import Archive from './components/Archive';
import Footer from './components/Footer';
import { api } from './services/api';

export default function App() {
  const [eventData, setEventData] = useState(null);
  const [artistsData, setArtistsData] = useState(null);
  const [archiveData, setArchiveData] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop vs mobile/touch devices
  useEffect(() => {
    const checkIsDesktop = () => {
      const desktop = window.innerWidth >= 1024 && !('ontouchstart' in window);
      setIsDesktop(desktop);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Initialize Lenis Smooth Inertial Scroll ONLY on Desktop (>= 1024px & non-touch)
  useEffect(() => {
    const isMobileOrTouch = window.innerWidth < 1024 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isMobileOrTouch) {
      // Use native hardware-accelerated momentum touch scrolling on mobile for flawless 120Hz/60Hz
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.95,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animFrame);
      lenis.destroy();
    };
  }, []);

  // Adaptive motion configuration: animated reveals on desktop, instant smooth render on mobile
  const motionProps = isDesktop
    ? {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
      }
    : {
        initial: false,
        animate: { opacity: 1, y: 0 },
      };

  useEffect(() => {
    api.getFeaturedEvent().then(setEventData).catch(console.error);
    api.getArtists().then(setArtistsData).catch(console.error);
    api.getSelectedArchive().then(setArchiveData).catch(console.error);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#070709] text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* 
        Persistent Ambient Video Backdrop (landing.mp4)
        Hardware-accelerated viewport lock with vertical buffer to absorb mobile address bar movement
      */}
      <div className="fixed -top-12 -bottom-12 left-0 right-0 z-0 pointer-events-none overflow-hidden will-change-transform transform-gpu">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/LANDING.mp4" type="video/mp4" />
        </video>
        {/* Pure color dark overlay to provide contrast without GPU shader overhead */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />
      </div>

      {/* Floating Top Navigation (Only Hamburger Menu per Image 1) */}
      <Navbar />

      {/* 
        SECTION 1: HERO (Image 1)
        Clean, no extra ornaments/subtitles, no artificial SVG outlines, semi-transparent grey logo
      */}
      <main className="relative z-10 w-full overflow-x-hidden">
        <Hero />

        {/* 
          SECTION 2: CONTENT & SHOWCASE (Image 2)
          Arranged in the staggered/tiered layout ("bertingkat"), fully responsive across all screen sizes
        */}
        <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 pb-12 sm:pb-16">
          {/* 
            Staggered / Bertingkat Dual Cards:
            - Desktop: Left card high, right card offset downwards (lg:mt-48 xl:mt-56)
            - Mobile/Tablet (< lg:): Stacked cleanly with zero overlap or layout break
          */}
          <motion.section
            id="about"
            {...motionProps}
            className="flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-10 lg:gap-16 pt-4 sm:pt-6 mb-12 sm:mb-16"
          >
            {/* Left Card: High Tier */}
            <div className="w-full lg:w-[48%] flex justify-start">
              <AboutSection />
            </div>

            {/* Right Card: Low Tier (Offset downwards on desktop) */}
            <div id="events" className="w-full lg:w-[48%] flex justify-end lg:mt-48 xl:mt-56">
              <EventCard event={eventData} />
            </div>
          </motion.section>

          {/* Middle: Community Section (DJs & Visual Artists) with motion reveal */}
          <motion.div {...motionProps}>
            <Community artists={artistsData} />
          </motion.div>

          {/* Lower: Audiovisual Archive with motion reveal */}
          <motion.div {...motionProps}>
            <Archive archiveData={archiveData} />
          </motion.div>

          {/* Floating Footer Card: "STAY IN THE LOOP" with motion reveal */}
          <motion.div {...motionProps}>
            <Footer />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
