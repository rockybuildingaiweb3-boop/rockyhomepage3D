import { Link } from "react-router-dom";

const STAGE_CONFIGS = {
  1: {
    badge: "SANCTUARY",
    title: "ROCKY",
    subtitle: "DIGITAL BUILDER",
    descriptor: "AI · WEB3 · FULL STACK",
    link: null,
  },
  2: {
    badge: "SECTOR 02",
    title: "ABOUT ME",
    subtitle: "FULL STACK & CREATIVE TECH",
    descriptor: "ARCHITECTURE · INTERACTION · CODE",
    link: "/about",
    buttonText: "Explore Journey →",
  },
  3: {
    badge: "SECTOR 03",
    title: "PROJECTS",
    subtitle: "3D EXPERIENCES & AGENTS",
    descriptor: "WEB3 · AUTONOMOUS SYSTEMS · AI",
    link: "/projects",
    buttonText: "View Creations →",
  },
  4: {
    badge: "SECTOR 04",
    title: "CONTACT",
    subtitle: "SPIRITED COLLABORATIONS",
    descriptor: "OPEN FOR NEW HORIZONS",
    link: "/contact",
    buttonText: "Send Message →",
  },
};

const HomeInfo = ({ currentStage = 1 }) => {
  const stage = STAGE_CONFIGS[currentStage] || STAGE_CONFIGS[1];

  return (
    <div
      key={currentStage}
      className='flex flex-col items-center text-center select-none pointer-events-none transition-all duration-500 ease-out animate-in fade-in zoom-in-95'
    >
      {/* Visual Lockup: Centered in sky directly above Island Sanctuary Peak */}
      {currentStage === 1 ? (
        <>
          {/* Primary Hero Typography: ROCKY (Serif, Semibold 600, Deep Navy/Charcoal Blue, pure flat editorial) */}
          <h1 className='text-3xl sm:text-4xl md:text-[52px] font-semibold text-[#263746] tracking-[0.24em] font-serif uppercase leading-none'>
            {stage.title}
          </h1>

          {/* Delicate structural hairline divider */}
          <div className='w-12 sm:w-16 h-px bg-[#263746]/20 my-2 sm:my-2.5' />

          {/* Subtitle: Technical / Editorial Typography — DIGITAL BUILDER */}
          <p className='text-[11px] sm:text-[12px] md:text-[13px] font-mono font-medium text-[#263746]/80 tracking-[0.42em] uppercase leading-tight'>
            {stage.subtitle}
          </p>

          {/* Domain / Specialties: AI · WEB3 · FULL STACK (one scale smaller, technical) */}
          <p className='text-[9px] sm:text-[10px] md:text-[11px] font-mono font-medium text-[#8B6A4E]/90 tracking-[0.34em] uppercase mt-1'>
            {stage.descriptor}
          </p>
        </>
      ) : (
        <>
          {/* Exploration Sector Hero Typography */}
          <h2 className='text-2xl sm:text-3xl md:text-[42px] font-semibold text-[#263746] tracking-[0.18em] font-serif uppercase leading-none'>
            {stage.title}
          </h2>

          {/* Delicate structural hairline divider */}
          <div className='w-12 sm:w-16 h-px bg-[#263746]/20 my-1.5 sm:my-2' />

          {/* Subtitle: Technical / Editorial Typography */}
          <p className='text-[10px] sm:text-[11px] md:text-[12px] font-mono font-medium text-[#263746]/75 tracking-[0.32em] uppercase leading-tight'>
            {stage.subtitle}
          </p>

          {/* Domain / Tech */}
          <p className='text-[9px] sm:text-[10px] md:text-[10.5px] font-mono font-medium text-[#8B6A4E]/85 tracking-[0.26em] uppercase mt-1'>
            {stage.descriptor}
          </p>

          {/* Direct Sector CTA Button */}
          {stage.link && (
            <div className='mt-3 pointer-events-auto'>
              <Link
                to={stage.link}
                className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#C97851] hover:bg-[#b56742] active:bg-[#9e5533] text-xs font-semibold text-[#F5F5F0] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
              >
                <span>{stage.buttonText}</span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeInfo;


