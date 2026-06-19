import { useEffect, useRef } from 'react';
import { BrowserRouter } from "react-router-dom";
import { Contact, Experience, Hero, Navbar, Portfolio, Events, Certifications, Socials } from "./components";

const App = () => {
  const wrapperRef = useRef(null);

  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <Navbar />
        <div className='wrapper' ref={wrapperRef}>
          <div id="hero" className='z-10'>
            <Hero scrollContainer={wrapperRef} />
          </div>
          <div id="portfolio" className='relative z-30 bg-primary mt-[-2px]'>
            <Portfolio />
          </div>
          <div id="experience" className='relative z-30 bg-primary'>
            <Experience />
          </div>
          <div id="events" className='relative z-30 bg-primary'>
            <Events />
          </div>
          <div id="certifications" className='relative z-30 bg-primary'>
            <Certifications />
          </div>
          <div id="socials" className='relative z-30 bg-primary'>
            <Socials />
          </div>
          <div id="contact" className='relative z-30 bg-primary'>
            <Contact />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
