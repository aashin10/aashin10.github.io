import { motion, useAnimation, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { events } from "../data";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

const EventCard = ({
  index,
  title,
  category,
  date,
  description,
  images,
  heightClass
}) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setImageCount((prev) => prev + 1);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images]);

  const currentImageIndex = imageCount % (images?.length || 1);

  // Helper for category badge colors based on mockup
  const getCategoryStyles = (cat) => {
    switch (cat.toLowerCase()) {
      case "technical":
        return "bg-[#1689C8]/15 text-[#1689C8] border-[#1689C8]/30";
      case "community":
        return "bg-[#34D399]/10 text-[#34D399]/90 border-[#34D399]/25";
      case "leadership":
        return "bg-[#F59E0B]/10 text-[#FBBF24]/95 border-[#F59E0B]/25";
      case "academic":
        return "bg-[#8B5CF6]/10 text-[#A78BFA]/95 border-[#8B5CF6]/25";
      case "creative":
        return "bg-[#EC4899]/10 text-[#F472B6]/95 border-[#EC4899]/25";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
      className="bg-[#0D3056]/45 border border-[#1689C8]/20 rounded-2xl overflow-hidden flex flex-col w-full h-full"
    >
      <div className={`relative w-full ${heightClass} bg-gradient-to-br from-[#0c2a45] to-[#011825] overflow-hidden`}>
        {images && images.length > 0 && (
          <AnimatePresence initial={false}>
            <motion.img
              key={imageCount}
              src={images[currentImageIndex]}
              alt={title}
              className='absolute top-0 left-0 w-full h-full object-cover'
              initial={{ x: "-20%", zIndex: 1 }}
              animate={{ x: 0, zIndex: 2 }}
              exit={{ x: "100%", zIndex: 3 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </AnimatePresence>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0A203C]/90 to-transparent z-10 pointer-events-none"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[10px] font-semibold tracking-widest uppercase px-3 py-[2px] rounded-full border ${getCategoryStyles(category)}`}>
            {category}
          </span>
          <span className="text-[#F0EFEB]/35 text-[10px] sm:text-xs">
            {date}
          </span>
        </div>
        <h3 className="text-white text-sm sm:text-base font-bold m-0 mb-1 leading-tight">{title}</h3>
        <div className="w-8 h-[2px] bg-gradient-to-r from-[#1689C8] to-transparent mb-2"></div>
        <p className="text-[#F0EFEB]/55 text-xs sm:text-sm leading-relaxed m-0 mt-auto">{description}</p>
      </div>
    </motion.div>
  );
};

const Events = () => {
  return (
    <div className='text-center md:text-left md:px-20 lg:px-40'>
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionText} text-white`}>Events & Activities</h2>
      </motion.div>

      <div className="mt-10 md:mt-20 flex flex-col gap-4">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <EventCard index={0} {...events[0]} />
          </div>
          <div className="md:col-span-1">
            <EventCard index={1} {...events[1]} />
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <EventCard index={2} {...events[2]} />
          </div>
          <div className="md:col-span-1">
            <EventCard index={3} {...events[3]} />
          </div>
          <div className="md:col-span-1">
            <EventCard index={4} {...events[4]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Events, "events");
