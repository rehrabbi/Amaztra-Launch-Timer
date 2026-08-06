import { useEffect } from 'react';
import { initMotion, scrollToId } from './lib/motion.js';
import Header from './sections/Header.jsx';
import Hero from './sections/Hero.jsx';
import Story from './sections/Story.jsx';
import Trust from './sections/Trust.jsx';
import MoreInfo from './sections/MoreInfo.jsx';
import Join from './sections/Join.jsx';
import Footer from './sections/Footer.jsx';
import StickyCta from './sections/StickyCta.jsx';

export default function App() {
  useEffect(() => {
    const cleanup = initMotion();
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => scrollToId(id));
    return cleanup;
  }, []);

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Story />
        <Trust />
        <MoreInfo />
        <Join />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
