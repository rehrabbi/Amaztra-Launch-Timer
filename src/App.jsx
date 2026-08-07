import { useEffect } from 'react';
import { initMotion, scrollToId } from './lib/motion.js';
import TopBar from './sections/TopBar.jsx';
import Hero from './sections/Hero.jsx';
import Story from './sections/Story.jsx';
import More from './sections/More.jsx';
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
      <TopBar />
      <main id="main">
        <Hero />
        <Story />
        <More />
        <Join />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
