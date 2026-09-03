import { useState } from "react";
import { Html } from "@react-three/drei";

/**
 * Interactive Discovery Hotspot on the 3D Island
 * Default: clean celestial spark marker (✦), zero debug text UI
 * Hover/Focus: whisper-thin floating label
 */
export function InteractiveHotspot({
  position,
  title,
  subtitle,
  icon = "✦",
  badge,
  actionText,
  onTrigger,
  color = "#C97851",
  emissiveColor = "#E9A84A",
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <Html
        position={[0, 0, 0]}
        center
        distanceFactor={32}
        zIndexRange={[60, 0]}
      >
        <div
          className='relative flex flex-col items-center select-none cursor-pointer group'
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (onTrigger) onTrigger();
          }}
        >
          {/* Subtle Celestial Beacon Point (• / ✦) — Zero persistent text UI */}
          <div className='relative w-7 h-7 flex items-center justify-center transition-transform duration-300 group-hover:scale-125'>
            {/* Subtle radial aura ping */}
            <span
              className='absolute w-3 h-3 rounded-full opacity-30 group-hover:opacity-75 transition-opacity'
              style={{ backgroundColor: emissiveColor }}
            />
            {/* Core Spark Marker */}
            <span
              className='relative text-[13px] leading-none font-bold select-none drop-shadow-[0_1px_4px_rgba(201,120,81,0.5)] transition-colors'
              style={{ color: hovered ? "#263746" : color }}
            >
              ✦
            </span>
          </div>

          {/* Hover / Focus Label: Only reveals when discovered */}
          {hovered && (
            <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-in fade-in zoom-in-95 duration-150 z-30'>
              <div className='px-2.5 py-1 rounded-lg bg-[#F5F5F0]/95 backdrop-blur-md border border-[#E7E7B7] shadow-[0_4px_14px_rgba(38,55,70,0.12)] text-[#263746] whitespace-nowrap flex items-center gap-1.5'>
                <span className='text-[11px]'>{icon}</span>
                <span className='text-[11px] font-bold tracking-wider uppercase font-serif text-[#263746]'>
                  {title}
                </span>
                {badge && (
                  <span className='text-[8px] font-mono uppercase tracking-widest text-[#8B6A4E] px-1 py-0.5 rounded bg-[#E7E7B7]/40'>
                    {badge}
                  </span>
                )}
              </div>
              {/* Downward notch */}
              <div className='w-1.5 h-1.5 rotate-45 bg-[#F5F5F0] border-r border-b border-[#E7E7B7] -mt-1' />
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

