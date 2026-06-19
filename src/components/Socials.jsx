import { motion } from "framer-motion";
import React from "react";

import { socials } from "../data";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

// Brand glyphs as inline SVG paths so the section ships no extra icon deps.
const ICONS = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
};

const BrandIcon = ({ icon }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
    <path d={ICONS[icon]} />
  </svg>
);

const SocialCard = ({ index, icon, label, handle, url, blurb, accent }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${label} — ${handle}`}
    variants={fadeIn("up", "spring", index * 0.15, 0.75)}
    whileHover={{ y: -10 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="social-card group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-[#1689C8]/20 bg-[#0D3056]/40 p-6 text-left sm:w-[300px] lg:w-[330px]"
    style={{ "--accent": accent }}
  >
    {/* light sweep + accent flourishes (styled in index.css) */}
    <span className="social-sheen" />
    <span className="social-topbar" />

    <div className="relative z-[2] flex items-start justify-between">
      <div
        className="social-chip relative flex h-14 w-14 items-center justify-center rounded-xl text-[#F0EFEB]"
        style={{ background: `${accent}1f`, border: `1px solid ${accent}55` }}
      >
        <span className="social-ring" />
        <BrandIcon icon={icon} />
      </div>
      <span className="text-[#F0EFEB]/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[color:var(--accent)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>

    <div className="relative z-[2] mt-8">
      <h3 className="text-xl font-bold text-white">{label}</h3>
      <p className="mt-1 font-mono text-sm text-[color:var(--accent)]">{handle}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#F0EFEB]/55">{blurb}</p>
    </div>

    <div className="relative z-[2] mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#F0EFEB]/45 transition-colors duration-300 group-hover:text-white">
      Visit profile
      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
    </div>
  </motion.a>
);

const Socials = () => {
  return (
    <div className="px-6 md:px-20 lg:px-40 text-center">
      <motion.div variants={textVariant()}>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[6px] text-[#1689C8]">
          Reach Out
        </p>
        <h2 className={`${styles.sectionText} text-white`}>Let&apos;s Connect</h2>
        <div className="social-divider mx-auto mt-5 h-[2px] w-20" />
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#F0EFEB]/55">
          Curious, collaborative, and always up for a good problem. Find me across the web &mdash;
          the best ideas usually start with a simple hello.
        </p>
      </motion.div>

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {socials.map((s, i) => (
          <SocialCard key={s.id} index={i} {...s} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Socials, "socials");
