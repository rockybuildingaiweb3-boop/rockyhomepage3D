import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className='header'>
      {/* Explorer Badge & World Wordmark */}
      <NavLink
        to='/'
        className='group flex items-center gap-3 select-none transition-all focus:outline-none'
        title="Rocky's 3D Island Sanctuary"
      >
        {/* Explorer Badge / Island Talisman Plaque */}
        <div className='relative flex flex-col items-center justify-between w-8 h-12 rounded-[9px] bg-gradient-to-b from-[#F5F5F0] via-[#EDE9D2] to-[#E2DEBE] border border-[#8B6A4E]/80 shadow-[0_2px_6px_rgba(38,55,70,0.1)] group-hover:border-[#C97851] group-hover:shadow-[0_4px_12px_rgba(201,120,81,0.2)] transition-all overflow-hidden'>
          {/* Top suspension rivet / brass grommet */}
          <div className='w-1.5 h-1.5 rounded-full bg-[#8B6A4E]/25 border border-[#8B6A4E]/60 mt-1' />

          {/* Vertical Stack: R / O / • */}
          <div className='flex flex-col items-center leading-none text-[#263746] my-auto'>
            <span className='text-[12px] font-black tracking-tight text-[#C97851] font-serif'>
              R
            </span>
            <span className='text-[11px] font-black tracking-tight text-[#263746] font-serif -mt-0.5'>
              O
            </span>
            <span className='w-1 h-1 rounded-full bg-[#C97851] mt-1' />
          </div>

          {/* Bottom subtle baseline */}
          <div className='w-full h-0.5 bg-[#8B6A4E]/30' />
        </div>

        {/* Wordmark with world identity */}
        <div className='flex flex-col justify-center'>
          <span className='text-sm sm:text-base font-bold tracking-[0.18em] text-[#263746] font-serif uppercase group-hover:text-[#C97851] transition-colors'>
            Rocky
          </span>
          <span className='text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#8B6A4E]/90 font-medium font-mono'>
            Digital Sanctuary
          </span>
        </div>
      </NavLink>

      {/* Header Right: Level 0 Navigation */}
      <nav className='flex items-center text-xs sm:text-[13px] gap-6 sm:gap-9 font-medium tracking-[0.14em] uppercase text-[#263746]/70 bg-transparent p-0 shadow-none border-none'>
        <NavLink
          to='/about'
          className={({ isActive }) =>
            `transition-colors duration-200 relative py-1 hover:text-[#263746] flex flex-col items-center ${
              isActive ? "text-[#263746] font-semibold" : "text-[#263746]/70"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>About</span>
              {isActive && (
                <span className='w-1 h-1 rounded-full bg-[#C97851] absolute -bottom-1.5' />
              )}
            </>
          )}
        </NavLink>
        <NavLink
          to='/projects'
          className={({ isActive }) =>
            `transition-colors duration-200 relative py-1 hover:text-[#263746] flex flex-col items-center ${
              isActive ? "text-[#263746] font-semibold" : "text-[#263746]/70"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>Projects</span>
              {isActive && (
                <span className='w-1 h-1 rounded-full bg-[#C97851] absolute -bottom-1.5' />
              )}
            </>
          )}
        </NavLink>
        <NavLink
          to='/contact'
          className={({ isActive }) =>
            `transition-colors duration-200 relative py-1 hover:text-[#263746] flex flex-col items-center ${
              isActive ? "text-[#263746] font-semibold" : "text-[#263746]/70"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>Contact</span>
              {isActive && (
                <span className='w-1 h-1 rounded-full bg-[#C97851] absolute -bottom-1.5' />
              )}
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
