import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 && !('ontouchstart' in window);
    }
    return false;
  });

  // Scroller & Section Refs for Scroll-Linked Parallax Transforms
  const mainScrollerRef = useRef(null);
  const dualCardsRef = useRef(null);
  const communityRef = useRef(null);
  const archiveRef = useRef(null);
  const footerRef = useRef(null);

  // Parallax Scroll Tracking for Staggered Dual Cards ("MORE THAN MUSIC" & "SESSION III")
  const { scrollYProgress: dualCardsProgress } = useScroll({
    target: dualCardsRef,
    offset: ["start end", "end start"],
    container: isDesktop ? undefined : mainScrollerRef
  });

  // Dual-Speed Differential Parallax: Left card moves faster, right card moves in counter-balance
  const yLeftCard = useTransform(dualCardsProgress, [0, 1], isDesktop ? [55, -55] : [20, -20]);
  const yRightCard = useTransform(dualCardsProgress, [0, 1], isDesktop ? [-35, 35] : [-15, 15]);

  // Parallax Scroll Tracking for Community Section
  const { scrollYProgress: communityProgress } = useScroll({
    target: communityRef,
    offset: ["start end", "end start"],
    container: isDesktop ? undefined : mainScrollerRef
  });
  const yCommunity = useTransform(communityProgress, [0, 1], isDesktop ? [40, -40] : [15, -15]);

  // Parallax Scroll Tracking for Audiovisual Archive
  const { scrollYProgress: archiveProgress } = useScroll({
    target: archiveRef,
    offset: ["start end", "end start"],
    container: isDesktop ? undefined : mainScrollerRef
  });
  const yArchive = useTransform(archiveProgress, [0, 1], isDesktop ? [45, -45] : [15, -15]);

  // Parallax Scroll Tracking for Floating Footer
  const { scrollYProgress: footerProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"],
    container: isDesktop ? undefined : mainScrollerRef
  });
  const yFooter = useTransform(footerProgress, [0, 1], isDesktop ? [30, -30] : [10, -10]);

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

  // Adaptive motion configuration: clean fade reveal without y-translation conflicts
  const motionProps = isDesktop
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      }
    : {
        initial: false,
        animate: { opacity: 1 },
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
        True viewport-centered positioning (fixed inset-0 + object-cover object-center)
        Ensures the central video motif and Hero logo align dead-center
      */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden will-change-transform transform-gpu flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/LANDING.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Floating Top Navigation (Only Hamburger Menu per Image 1) */}
      <Navbar />

      {/* 
        SECTION 1: HERO (Image 1)
        Clean, no extra ornaments/subtitles, no artificial SVG outlines, semi-transparent grey logo
      */}
      <main ref={mainScrollerRef} className="app-viewport-scroller relative z-10 w-full overflow-x-hidden">
        <Hero />

        {/* 
          SECTION 2: CONTENT & SHOWCASE (Image 2)
          Arranged in the staggered/tiered layout ("bertingkat"), fully responsive across all screen sizes
        */}
        <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 pb-12 sm:pb-16">
          {/* 
            Staggered Dual Cards with Differential Parallax:
            - Desktop: Left card high, right card offset downwards (lg:mt-48 xl:mt-56)
            - As user scrolls, Left Card and Right Card glide with differential parallax velocities
          */}
          <motion.section
            id="about"
            ref={dualCardsRef}
            {...motionProps}
            className="flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-10 lg:gap-16 pt-4 sm:pt-6 mb-12 sm:mb-16"
          >
            {/* Left Card: High Tier (with dynamic upward parallax float) */}
            <motion.div
              style={{ y: yLeftCard }}
              className="w-full lg:w-[48%] flex justify-start will-change-transform"
            >
              <AboutSection />
            </motion.div>

            {/* Right Card: Low Tier (with counter-balanced floating parallax) */}
            <motion.div
              id="events"
              style={{ y: yRightCard }}
              className="w-full lg:w-[48%] flex justify-end lg:mt-48 xl:mt-56 will-change-transform"
            >
              <EventCard event={eventData} />
            </motion.div>
          </motion.section>

          {/* Middle: Community Section (DJs & Visual Artists) with Floating Depth Parallax */}
          <motion.div
            ref={communityRef}
            style={{ y: yCommunity }}
            {...motionProps}
            className="will-change-transform"
          >
            <Community artists={artistsData} />
          </motion.div>

          {/* Lower: Audiovisual Archive with Floating Depth Parallax */}
          <motion.div
            ref={archiveRef}
            style={{ y: yArchive }}
            {...motionProps}
            className="will-change-transform"
          >
            <Archive archiveData={archiveData} />
          </motion.div>

          {/* Floating Footer Card: "STAY IN THE LOOP" with Floating Depth Parallax */}
          <motion.div
            ref={footerRef}
            style={{ y: yFooter }}
            {...motionProps}
            className="will-change-transform"
          >
            <Footer />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
