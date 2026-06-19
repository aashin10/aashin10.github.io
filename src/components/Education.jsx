import { motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { education } from "../data";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

// Outline academic glyphs (Heroicons v2) kept inline so the section adds no deps.
const ICONS = {
  cap: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
  book: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
};

const EduIcon = ({ icon }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d={ICONS[icon]} />
  </svg>
);

// Smoothly counts up to the score the first time it scrolls into view.
const CountUp = ({ value, decimals = 0, trailing = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {trailing}
    </span>
  );
};

const EduCard = ({ index, icon, title, institution, score, accent }) => (
  <div className="edu-row relative flex gap-5 pb-9 last:pb-0 sm:gap-7">
    {/* timeline node */}
    <div className="relative z-[2] flex-shrink-0">
      <div
        className="edu-node relative flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          color: accent,
          // accent tint over a solid base so the timeline line is masked behind the node
          background: `linear-gradient(${accent}24, ${accent}24), #011825`,
          border: `1px solid ${accent}66`,
        }}
      >
        <span className="edu-node-ring" style={{ borderColor: accent }} />
        <EduIcon icon={icon} />
      </div>
    </div>

    {/* card */}
    <motion.div
      variants={fadeIn("left", "spring", index * 0.15, 0.7)}
      className="edu-card group relative flex-1 overflow-hidden rounded-2xl border border-[#1689C8]/20 bg-[#0D3056]/40 p-5 sm:p-6"
      style={{ "--accent": accent }}
    >
      <span className="edu-sheen" />
      <div className="relative z-[2] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white sm:text-xl">{title}</h3>
          <p className="mt-1 text-sm text-[#F0EFEB]/55 sm:text-base">{institution}</p>
        </div>
        <div
          className="flex-shrink-0 self-start rounded-xl px-4 py-2 text-center sm:self-auto"
          style={{ background: `${accent}14`, border: `1px solid ${accent}40` }}
        >
          <div className="font-mono text-2xl font-bold sm:text-3xl" style={{ color: accent }}>
            <CountUp value={score.value} decimals={score.decimals} trailing={score.trailing} />
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[2px] text-[#F0EFEB]/45">
            {score.label}
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

const Education = () => {
  return (
    <div className="px-6 text-center md:px-20 lg:px-40">
      <motion.div variants={textVariant()}>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[6px] text-[#1689C8]">
          Academic Foundation
        </p>
        <h2 className={`${styles.sectionText} text-white`}>Education</h2>
        <div className="social-divider mx-auto mt-5 h-[2px] w-20" />
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#F0EFEB]/55">
          Where the curiosity was trained &mdash; the milestones that shaped how I learn,
          reason, and build.
        </p>
      </motion.div>

      <div className="relative mx-auto mt-12 max-w-3xl text-left">
        {/* faint static rail + animated draw-in line */}
        <span className="edu-track" aria-hidden="true" />
        <motion.span
          className="edu-progress"
          aria-hidden="true"
          variants={{
            hidden: { scaleY: 0 },
            show: { scaleY: 1, transition: { duration: 1.2, ease: "easeInOut" } },
          }}
        />

        {education.map((item, i) => (
          <EduCard key={`${item.title}-${i}`} index={i} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Education, "education");
