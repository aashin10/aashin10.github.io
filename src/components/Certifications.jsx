import { motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { certifications } from "../data";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";

// Rendered rocket size (the 46x114 SVG scaled 1.45x via .cert-rocket-inner).
const ROCKET_W = 67;
const ROCKET_H = 165;
const CARD_GAP = 20;
const CEILING_MARGIN = 14;

// Gentle opacity reveal — keeps the section subtle and avoids the section's
// overflow clip cutting a sliding entrance.
const reveal = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;

const Certifications = () => {
  const [active, setActive] = useState(0);
  const [playKey, setPlayKey] = useState(0);

  const wrapRef = useRef(null);
  const sidebarRef = useRef(null);
  const viewerRef = useRef(null);
  const cardRef = useRef(null);
  const rocketRef = useRef(null);
  const exhaustRef = useRef(null);
  const busyRef = useRef(false);
  const rafRef = useRef(0);
  const safetyRef = useRef(0);
  const cancelledRef = useRef(false);
  const deliveredRef = useRef(false);

  const cert = certifications[active];

  // Size the viewer (tall as the sidebar on desktop; fixed when stacked on
  // mobile) and keep an already-delivered card resting in place across
  // breakpoint changes.
  useLayoutEffect(() => {
    const sync = () => {
      if (!sidebarRef.current || !viewerRef.current) return;
      const mobile = window.innerWidth <= 640;
      const cardH = cardRef.current ? cardRef.current.offsetHeight : 0;
      viewerRef.current.style.height =
        (mobile
          ? Math.max(380, cardH + 40)
          : Math.max(sidebarRef.current.offsetHeight, 360)) + "px";
      if (deliveredRef.current && !busyRef.current && cardRef.current) {
        cardRef.current.style.top = getSizes().cardTargetTop + "px";
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const setNozzles = (on) => {
    rocketRef.current
      ?.querySelectorAll(".cert-nozzle")
      .forEach((el) =>
        el.setAttribute(
          "fill",
          on ? "rgba(255,150,30,0.9)" : "rgba(22,137,200,0.5)"
        )
      );
  };

  // All rocket coordinates live in .cert-wrap space; the card lives in viewer space.
  const getSizes = () => {
    const viewer = viewerRef.current;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const vOffTop = viewer.offsetTop;
    const vOffLeft = viewer.offsetLeft;
    const vH = viewer.offsetHeight;
    const vW = viewer.offsetWidth;
    const wH = wrap.offsetHeight;
    const cardH = card.offsetHeight || 280;
    // Centre the card when there's room; otherwise nudge it down just enough
    // that the rocket clears the ceiling and stays fully visible on delivery.
    const cardCentered = (vH - cardH) / 2;
    const minCardTop = CEILING_MARGIN + ROCKET_H + CARD_GAP - vOffTop;
    const cardTargetTop = Math.max(cardCentered, minCardTop);
    return {
      cardTargetTop,
      cardStartTop: wH - vOffTop + ROCKET_H + CARD_GAP, // below the panel, out of view
      rocketStop: vOffTop + cardTargetTop - CARD_GAP - ROCKET_H,
      rocketStart: wH, // top edge at section bottom = hidden
      rocketExit: -(ROCKET_H + 30), // up past the heading, above the section top
      rocketLeft: vOffLeft + vW / 2 - ROCKET_W / 2,
    };
  };

  // Snap the card to its resting (centred, visible) spot and hide the rocket.
  // Used as the safety net / end state so the section is never left broken,
  // even if the rAF flourish is interrupted or doesn't run.
  const settle = () => {
    cancelledRef.current = true; // stop any in-flight rAF chain from fighting us
    cancelAnimationFrame(rafRef.current);
    const card = cardRef.current;
    const rocket = rocketRef.current;
    const exhaust = exhaustRef.current;
    if (!card) return;
    card.style.top = getSizes().cardTargetTop + "px";
    card.style.opacity = "1";
    card.classList.add("live");
    if (rocket) rocket.style.opacity = "0";
    if (exhaust) exhaust.style.display = "none";
    setNozzles(false);
    deliveredRef.current = true;
    busyRef.current = false;
  };

  // Run the full rocket sequence each time playKey changes.
  useEffect(() => {
    if (playKey === 0) return; // not yet scrolled into view
    const card = cardRef.current;
    const rocket = rocketRef.current;
    const exhaust = exhaustRef.current;
    if (!card || !rocket || !exhaust) return;

    busyRef.current = true;
    cancelledRef.current = false;
    clearTimeout(safetyRef.current);
    // Safety net: if the rAF flourish stalls or is interrupted, force the card
    // into its resting visible state so the section is never left broken.
    safetyRef.current = setTimeout(settle, 3800);

    // Reset everything off-screen / hidden.
    card.style.opacity = "0";
    card.style.top = "0px";
    card.classList.remove("live");
    rocket.style.opacity = "0";
    exhaust.style.display = "none";
    setNozzles(false);

    const raf = (fn) => (rafRef.current = requestAnimationFrame(fn));

    // Double rAF so the freshly-rendered card can be measured.
    raf(() =>
      raf(() => {
        if (cancelledRef.current) return;
        const S = getSizes();

        rocket.style.left = S.rocketLeft + "px";
        rocket.style.top = S.rocketStart + "px";
        card.style.top = S.cardStartTop + "px";

        // Now reveal — positioned safely below the ceiling.
        rocket.style.opacity = "1";
        card.style.opacity = "1";
        deliveredRef.current = true;
        exhaust.style.display = "block";
        setNozzles(true);

        // PHASE 1 — fly in (rocket leads the card by CARD_GAP)
        const travelDur = 1050;
        const t0 = performance.now();
        const travel = (now) => {
          if (cancelledRef.current) return;
          const t = Math.min((now - t0) / travelDur, 1);
          const e = easeOutCubic(t);
          rocket.style.top =
            S.rocketStart + (S.rocketStop - S.rocketStart) * e + "px";
          card.style.top =
            S.cardStartTop + (S.cardTargetTop - S.cardStartTop) * e + "px";
          if (t < 1) raf(travel);
          else {
            rocket.style.top = S.rocketStop + "px";
            card.style.top = S.cardTargetTop + "px";
            card.classList.add("live");
            pause();
          }
        };

        // PHASE 2 — gentle hover
        const pause = () => {
          const dur = 500;
          const amp = 3;
          const p0 = performance.now();
          const float = (now) => {
            if (cancelledRef.current) return;
            const el = now - p0;
            if (el >= dur) {
              rocket.style.top = S.rocketStop + "px";
              exit();
              return;
            }
            rocket.style.top =
              S.rocketStop + Math.sin((el / dur) * Math.PI * 2) * amp + "px";
            raf(float);
          };
          raf(float);
        };

        // PHASE 3 — exit up past the heading, out the section top, then vanish
        const exit = () => {
          const dur = 750;
          const x0 = performance.now();
          const fly = (now) => {
            if (cancelledRef.current) return;
            const t = Math.min((now - x0) / dur, 1);
            const e = easeInCubic(t);
            rocket.style.top =
              S.rocketStop + (S.rocketExit - S.rocketStop) * e + "px";
            if (t < 1) raf(fly);
            else {
              clearTimeout(safetyRef.current);
              settle();
            }
          };
          raf(fly);
        };

        travel(performance.now());
      })
    );

    return () => {
      cancelledRef.current = true;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(safetyRef.current);
      busyRef.current = false;
    };
  }, [playKey]);

  // Fire once when the panel scrolls into view.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            obs.disconnect();
            setTimeout(() => setPlayKey((k) => k + 1), 800);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, []);

  const handleSelect = (i) => {
    if (busyRef.current || i === active) return;
    setActive(i);
    setPlayKey((k) => k + 1);
  };

  return (
    <div
      className="cert-wrap relative overflow-hidden px-6 md:px-20 lg:px-40"
      ref={wrapRef}
    >
      <motion.div variants={reveal}>
        <h2 className={`${styles.sectionText} text-white text-center`}>
          Certifications
        </h2>
      </motion.div>

      <motion.div variants={reveal} className="mt-10 md:mt-16">
        <div className="cert-layout max-w-6xl mx-auto">
            <div className="cert-sidebar" ref={sidebarRef}>
              {certifications.map((c, i) => {
                const fs = c.abbr.length > 3 ? 18 : c.abbr.length === 3 ? 22 : 26;
                return (
                  <div
                    key={c.id}
                    className={`cert-sn${i === active ? " active" : ""}`}
                    onClick={() => handleSelect(i)}
                  >
                    <div
                      className="cert-si"
                      style={{
                        background: c.glow,
                        border: `1.5px solid ${c.color}55`,
                        color: c.color,
                        fontSize: `${fs}px`,
                      }}
                    >
                      {c.abbr}
                    </div>
                    <div className="cert-sn-info">
                      <h4>
                        {c.name.length > 36 ? c.name.slice(0, 34) + "…" : c.name}
                      </h4>
                      <span>{c.platform}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cert-viewer" ref={viewerRef}>
              <div
                className="cert-card"
                ref={cardRef}
                style={{ borderColor: cert.color + "40" }}
              >
                <div className="cert-ch">
                  <div>
                    <div className="cert-cn2">{cert.name}</div>
                    <div className="cert-cpf">{cert.platform}</div>
                  </div>
                  <span className="cert-vbadge">✓ Verified</span>
                </div>
                <div className="cert-imgzone" style={{ padding: 0, background: "transparent", border: "none" }}>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", height: "100%" }}>
                    <img
                      src={cert.image}
                      alt={cert.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", display: "block", cursor: "pointer" }}
                    />
                  </a>
                </div>
                <div className="cert-meta-g">
                  <div className="cert-mi">
                    <label>Issued</label>
                    <p>{cert.date}</p>
                  </div>
                  <div className="cert-mi">
                    <label>Credential ID</label>
                    <p style={{ fontFamily: "monospace", fontSize: "18px" }}>
                      {cert.id}
                    </p>
                  </div>
                </div>
                <div className="cert-tags">
                  {cert.tags.map((t) => (
                    <span className="cert-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <span className="cert-cid">{cert.id}</span>
              </div>
            </div>
          </div>
      </motion.div>

      <div className="cert-rocket" ref={rocketRef} style={{ opacity: 0 }}>
            <div className="cert-rocket-inner">
              <svg
                width="46"
                height="114"
                viewBox="0 0 46 114"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="cert-rg1" cx="35%" cy="25%" r="70%">
                    <stop offset="0%" stopColor="#cce8f8" />
                    <stop offset="100%" stopColor="#4a82a8" />
                  </radialGradient>
                  <radialGradient id="cert-rg2" cx="40%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#d8eef8" />
                    <stop offset="100%" stopColor="#3a6a90" />
                  </radialGradient>
                  <radialGradient id="cert-rg3" cx="35%" cy="28%" r="70%">
                    <stop offset="0%" stopColor="#88d4ff" />
                    <stop offset="100%" stopColor="#185888" />
                  </radialGradient>
                  <linearGradient id="cert-fg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3A7EB9" />
                    <stop offset="100%" stopColor="#1a4670" />
                  </linearGradient>
                  <linearGradient id="cert-eg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e4868" />
                    <stop offset="100%" stopColor="#0a1e30" />
                  </linearGradient>
                </defs>
                <path
                  d="M23 2 C17 10,10 25,9 44 L37 44 C36 25,29 10,23 2Z"
                  fill="url(#cert-rg2)"
                />
                <rect x="9" y="42" width="28" height="50" rx="3" fill="url(#cert-rg1)" />
                <rect x="15" y="48" width="16" height="15" rx="2" fill="rgba(0,0,0,0.18)" />
                <circle cx="23" cy="55.5" r="6" fill="url(#cert-rg3)" />
                <circle
                  cx="23"
                  cy="55.5"
                  r="4.5"
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="0.8"
                />
                <ellipse cx="23" cy="54" rx="2.8" ry="1.6" fill="rgba(255,255,255,0.18)" />
                <rect x="17" y="69" width="12" height="2.2" rx="1" fill="rgba(58,126,185,0.5)" />
                <rect x="17" y="74" width="12" height="2.2" rx="1" fill="rgba(58,126,185,0.5)" />
                <rect x="17" y="79" width="8" height="2.2" rx="1" fill="rgba(58,126,185,0.5)" />
                <rect x="17" y="85" width="3" height="3" rx="0.5" fill="rgba(240,192,96,0.65)" />
                <rect x="21.5" y="85" width="3" height="3" rx="0.5" fill="rgba(240,192,96,0.65)" />
                <rect x="26" y="85" width="3" height="3" rx="0.5" fill="rgba(58,126,185,0.45)" />
                <path d="M9 66 L1 88 L9 85Z" fill="url(#cert-fg)" />
                <path d="M37 66 L45 88 L37 85Z" fill="url(#cert-fg)" />
                <path d="M9 78 L4 93 L9 91Z" fill="rgba(58,126,185,0.5)" />
                <path d="M37 78 L42 93 L37 91Z" fill="rgba(58,126,185,0.5)" />
                <rect x="7" y="91" width="32" height="11" rx="2.5" fill="url(#cert-eg)" />
                <rect x="10" y="94" width="7" height="7" rx="2" fill="rgba(0,0,0,0.4)" />
                <rect x="19.5" y="94" width="7" height="7" rx="2" fill="rgba(0,0,0,0.4)" />
                <rect x="29" y="94" width="7" height="7" rx="2" fill="rgba(0,0,0,0.4)" />
                <circle className="cert-nozzle" cx="13.5" cy="97.5" r="2.2" fill="rgba(22,137,200,0.5)" />
                <circle className="cert-nozzle" cx="23" cy="97.5" r="2.2" fill="rgba(22,137,200,0.5)" />
                <circle className="cert-nozzle" cx="32.5" cy="97.5" r="2.2" fill="rgba(22,137,200,0.5)" />
                <rect x="9" y="42" width="28" height="1.5" rx="0.75" fill="rgba(255,255,255,0.1)" />
                <rect x="9" y="91" width="28" height="1" rx="0.5" fill="rgba(255,255,255,0.07)" />
              </svg>
              <div
                className="cert-exhaust"
                ref={exhaustRef}
                style={{
                  display: "none",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  bottom: "-6px",
                  width: "38px",
                }}
              >
                <div
                  className="cert-exh-flame"
                  style={{
                    width: "5px",
                    height: "12px",
                    bottom: 0,
                    background:
                      "radial-gradient(ellipse at 50% 0%,#fff 0%,#F0C060 40%,rgba(255,80,0,0.5) 85%,transparent 100%)",
                    left: "calc(50% - 14px)",
                    transform: "none",
                  }}
                />
                <div
                  className="cert-exh-flame"
                  style={{
                    width: "8px",
                    height: "18px",
                    bottom: 0,
                    background:
                      "radial-gradient(ellipse at 50% 0%,#fff 0%,#F0C060 35%,rgba(255,100,0,0.55) 80%,transparent 100%)",
                  }}
                />
                <div
                  className="cert-exh-flame"
                  style={{
                    width: "5px",
                    height: "12px",
                    bottom: 0,
                    background:
                      "radial-gradient(ellipse at 50% 0%,#fff 0%,#F0C060 40%,rgba(255,80,0,0.5) 85%,transparent 100%)",
                    right: "calc(50% - 14px)",
                    left: "auto",
                    transform: "none",
                  }}
                />
                <div
                  className="cert-exh-smoke"
                  style={{
                    width: "20px",
                    height: "11px",
                    bottom: "-5px",
                    animationDuration: ".5s",
                    background: "rgba(160,190,220,0.3)",
                  }}
                />
                <div
                  className="cert-exh-smoke"
                  style={{
                    width: "26px",
                    height: "14px",
                    bottom: "-9px",
                    animationDuration: ".68s",
                    animationDelay: ".1s",
                    background: "rgba(120,155,195,0.2)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
  );
};

export default SectionWrapper(Certifications, "certifications");
