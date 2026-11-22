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

  // Initialize Lenis Smooth Inertial Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.8,
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

  useEffect(() => {
    api.getFeaturedEvent().then(setEventData).catch(console.error);
    api.getArtists().then(setArtistsData).catch(console.error);
    api.getSelectedArchive().then(setArchiveData).catch(console.error);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#070709] text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* 
        Persistent Ambient Video Backdrop (landing.mp4)
        Continuously plays behind the Hero and the staggered frosted content cards across all viewports
      */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-[0.70] contrast-[1.1] scale-105"
        >
          <source src="/LANDING.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 film-grain opacity-30" />
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Community artists={artistsData} />
          </motion.div>

          {/* Lower: Audiovisual Archive with motion reveal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Archive archiveData={archiveData} />
          </motion.div>

          {/* Floating Footer Card: "STAY IN THE LOOP" with motion reveal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Footer />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
