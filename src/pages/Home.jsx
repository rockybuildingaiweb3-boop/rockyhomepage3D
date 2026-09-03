import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import sakura from "../assets/sakura.mp3";
import { HomeInfo, Loader } from "../components";
import { Bird, DynamicClouds, Island, Plane, Sky } from "../models";
import { OMIKUJI_FORTUNES } from "../components/SkyIslandExtras";

const ATMOSPHERES = {
  day: {
    id: "day",
    label: "Day / 日照",
    icon: "☀️",
    bgClass: "from-[#BFDDF0] via-[#DCEBF5] to-[#F5F5F0]",
    sunColor: "#fff8e7",
    sunIntensity: 2.2,
    sunPosition: [15, 25, 20],
    ambientColor: "#BFDDF0",
    ambientIntensity: 0.75,
    hemiSky: "#BFDDF0",
    hemiGround: "#E7E7B7",
    hemiIntensity: 0.85,
    sparkles1: "#ffb7c5", // Sakura pink petals
    sparkles2: "#E9A84A", // Sun gold motes
    cloudMist: "#F5F5F0",
    exposure: 1.15,
  },
  sunset: {
    id: "sunset",
    label: "Sunset / 晚霞",
    icon: "🌅",
    bgClass: "from-amber-300 via-rose-300 to-purple-900/30",
    sunColor: "#ff7b39",
    sunIntensity: 2.7,
    sunPosition: [20, 14, 12],
    ambientColor: "#fda4af",
    ambientIntensity: 0.8,
    hemiSky: "#fde68a",
    hemiGround: "#581c87",
    hemiIntensity: 0.95,
    sparkles1: "#fde047", // Golden embers
    sparkles2: "#fb923c", // Warm sunset motes
    cloudMist: "#fed7aa",
    exposure: 1.25,
  },
  night: {
    id: "night",
    label: "Night / 幻夜",
    icon: "🌙",
    bgClass: "from-slate-900 via-indigo-950 to-slate-950",
    sunColor: "#93c5fd", // Moonlight
    sunIntensity: 1.6,
    sunPosition: [-12, 22, 15],
    ambientColor: "#3730a3",
    ambientIntensity: 0.6,
    hemiSky: "#60a5fa",
    hemiGround: "#0f172a",
    hemiIntensity: 0.65,
    sparkles1: "#22d3ee", // Bioluminescent fireflies
    sparkles2: "#34d399", // Mystic emerald motes
    cloudMist: "#38bdf8",
    exposure: 1.05,
  },
};

const Home = () => {
  const audioRef = useRef(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [targetRotation, setTargetRotation] = useState(null);
  const [showHint, setShowHint] = useState(true);
  const [atmosphere, setAtmosphere] = useState("day");
  const [autoRotate, setAutoRotate] = useState(false);
  const [activeFortune, setActiveFortune] = useState(null);
  const [showFortuneModal, setShowFortuneModal] = useState(false);

  const [showLightingMenu, setShowLightingMenu] = useState(false);
  const lightingMenuRef = useRef(null);

  // Close lighting popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (lightingMenuRef.current && !lightingMenuRef.current.contains(e.target)) {
        setShowLightingMenu(false);
      }
    };
    if (showLightingMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showLightingMenu]);

  const drawFortune = () => {
    const random = OMIKUJI_FORTUNES[Math.floor(Math.random() * OMIKUJI_FORTUNES.length)];
    setActiveFortune(random);
    setShowFortuneModal(true);
  };

  const activeAtmo = useMemo(() => ATMOSPHERES[atmosphere] || ATMOSPHERES.day, [atmosphere]);

  // Initialize audio safely once
  useEffect(() => {
    const audio = new Audio(sakura);
    audio.volume = 0.35;
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Handle music toggle
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlayingMusic) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio autoplay blocked by browser:", err);
        setIsPlayingMusic(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlayingMusic]);

  // Hide hint when user starts rotating
  useEffect(() => {
    if (isRotating && showHint) {
      setShowHint(false);
    }
  }, [isRotating, showHint]);

  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [1.02, 1.02, 1.02];
      screenPosition = [1.2, -2.4, 0];
    } else {
      // Scaled down by ~10% (from 2.05 to 1.85) for an aerodynamic, elegant silhouette
      screenScale = [1.85, 1.85, 1.85];
      // Departure position: clear of the island perimeter embarking into the open sky
      screenPosition = [3.5, -4.4, -3.2];
    }

    return [screenScale, screenPosition];
  };

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.84, 0.84, 0.84];
      screenPosition = [0, -7.45, -43.4];
    } else {
      // Scaled up by ~10% (from 0.86 to 0.95) to create a confident portfolio presence without touching borders
      screenScale = [0.95, 0.95, 0.95];
      // Positioned comfortably at -7.75 to ensure a clear layer of open sky between spire and subtitles
      screenPosition = [0, -7.75, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();

  const handleStageSelect = (stage) => {
    setShowHint(false);
    setAutoRotate(false);
    const stageRotations = {
      1: 4.5,
      2: 2.5,
      3: 1.05,
      4: 5.65,
    };
    setTargetRotation(stageRotations[stage]);
    setCurrentStage(stage);
  };

  return (
    <section
      className={`w-full h-screen relative overflow-hidden bg-gradient-to-b ${activeAtmo.bgClass} transition-colors duration-700`}
    >
      {/* Sky Canvas Hero Typography & Sanctuary Visual Lockup (Shifted up 30-35px to create pure editorial negative space above spire) */}
      <div className='absolute top-9 sm:top-10 md:top-[42px] left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4 pointer-events-none text-center flex flex-col items-center'>
        <HomeInfo currentStage={currentStage || 1} />
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: activeAtmo.exposure,
        }}
      >
        <Suspense fallback={<Loader />}>
          {/* Main Cinematic Directional Light (Sun / Moon) */}
          <directionalLight
            position={activeAtmo.sunPosition}
            intensity={activeAtmo.sunIntensity}
            color={activeAtmo.sunColor}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />

          {/* Soft Fill and Bounce Lights */}
          <ambientLight
            color={activeAtmo.ambientColor}
            intensity={activeAtmo.ambientIntensity}
          />
          <hemisphereLight
            skyColor={activeAtmo.hemiSky}
            groundColor={activeAtmo.hemiGround}
            intensity={activeAtmo.hemiIntensity}
          />

          {/* Subtle warm rim light */}
          <directionalLight
            position={[-15, 10, -15]}
            intensity={0.6}
            color={activeAtmo.sunColor}
          />

          {/* Floating Sakura Petals & Atmospheric Dust around the island */}
          <Sparkles
            count={60}
            scale={[32, 20, 32]}
            position={[0, -2, -43]}
            size={5.5}
            speed={0.35}
            opacity={0.65}
            color={activeAtmo.sparkles1}
          />

          {/* Sun/Moon Dust motes */}
          <Sparkles
            count={35}
            scale={[26, 14, 26]}
            position={[0, -3, -40]}
            size={4}
            speed={0.25}
            opacity={0.5}
            color={activeAtmo.sparkles2}
          />

          {/* Cloud Mist floating under the island base to hide rough cutoffs */}
          <Sparkles
            count={45}
            scale={[42, 6, 42]}
            position={[0, -9, -43]}
            size={8.5}
            speed={0.2}
            opacity={0.6}
            color={activeAtmo.cloudMist}
          />

          {/* Horizon Billowing Dynamic Clouds (Asymmetrical, pristine Hero negative space) */}
          <DynamicClouds atmosphere={atmosphere} />

          <Bird />
          <Sky isRotating={isRotating} />
          <Island
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            position={islandPosition}
            rotation={[0.1, 4.7077, 0]}
            scale={islandScale}
            targetRotation={targetRotation}
            setTargetRotation={setTargetRotation}
            autoRotate={autoRotate}
            onExploreStage={handleStageSelect}
          />
          <Plane
            isRotating={isRotating}
            position={biplanePosition}
            rotation={[0.16, 20.25, -0.2]}
            scale={biplaneScale}
          />
        </Suspense>
      </Canvas>

      {/* Floating World Controls Dock (Bottom-Left) — Clean seamless dock without vertical dividers */}
      <div className='absolute bottom-6 left-6 sm:left-12 z-20 pointer-events-auto'>
        <div className='relative flex items-center gap-2 h-11 px-2 rounded-[18px] bg-[#F5F5F0]/75 hover:bg-[#F5F5F0]/90 backdrop-blur-md border border-[#E7E7B7]/70 shadow-[0_2px_10px_rgba(38,55,70,0.06)] text-[#263746] transition-all duration-300'>
          {/* 1. Soundtrack Toggle (36px hit area, 17px icon, hover feedback, clear tooltip) */}
          <button
            type='button'
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className={`group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-[#E7E7B7]/50 ${
              isPlayingMusic
                ? "text-[#C97851]"
                : "text-[#263746]/60 hover:text-[#263746]"
            }`}
            title={isPlayingMusic ? "Soundtrack playing (Click to mute)" : "Soundtrack muted (Click to play)"}
          >
            <span className='text-[17px] leading-none select-none'>
              {isPlayingMusic ? "🔊" : "🔇"}
            </span>

            {/* Clear Tooltip with downward arrow pointer */}
            <div className='absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#263746] text-[#F5F5F0] text-[11px] font-sans font-medium whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30'>
              {isPlayingMusic ? "Music: Playing" : "Music: Muted"}
            </div>
          </button>

          {/* 2. Unified Atmosphere / Lighting Mode Popover */}
          <div className='relative' ref={lightingMenuRef}>
            <button
              type='button'
              onClick={() => setShowLightingMenu(!showLightingMenu)}
              className={`group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-[#E7E7B7]/50 ${
                showLightingMenu
                  ? "text-[#C97851]"
                  : "text-[#263746]/75 hover:text-[#263746]"
              }`}
              title='Atmosphere Lighting Mode'
            >
              <span className='text-[17px] leading-none select-none'>
                {activeAtmo.icon}
              </span>

              {/* Clear Tooltip */}
              <div className='absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#263746] text-[#F5F5F0] text-[11px] font-sans font-medium whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30'>
                Atmosphere: {activeAtmo.label.split(" ")[0]}
              </div>
            </button>

            {/* Soft Floating Lighting Menu */}
            {showLightingMenu && (
              <div className='absolute bottom-13 left-0 p-2 rounded-2xl bg-[#F5F5F0]/95 backdrop-blur-xl border border-[#E7E7B7]/80 shadow-[0_8px_24px_rgba(38,55,70,0.08)] text-[#263746] flex flex-col gap-1 min-w-[135px] animate-in fade-in zoom-in-95 duration-150 z-30'>
                <p className='text-[9px] font-mono font-bold tracking-wider text-[#8B6A4E]/80 px-2 pt-0.5 pb-1 uppercase'>
                  Lighting Mode
                </p>
                {Object.values(ATMOSPHERES).map((atmo) => {
                  const isSelected = atmosphere === atmo.id;
                  return (
                    <button
                      key={atmo.id}
                      type='button'
                      onClick={() => {
                        setAtmosphere(atmo.id);
                        setShowLightingMenu(false);
                      }}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors duration-150 ${
                        isSelected
                          ? "text-[#C97851] font-bold"
                          : "text-[#263746]/70 hover:text-[#263746] hover:bg-[#E7E7B7]/25"
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        <span className='text-sm leading-none'>{atmo.icon}</span>
                        <span>{atmo.label.split(" / ")[0]}</span>
                      </div>
                      {/* Refined dot active indicator */}
                      {isSelected && (
                        <span className='w-1.5 h-1.5 rounded-full bg-[#C97851]' />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Auto-Cruise Orbit Toggle */}
          <button
            type='button'
            onClick={() => setAutoRotate(!autoRotate)}
            className={`group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-[#E7E7B7]/50 ${
              autoRotate
                ? "text-[#4E7D46]"
                : "text-[#263746]/60 hover:text-[#263746]"
            }`}
            title='Toggle auto-rotation cruise'
          >
            <span
              className={`text-[15px] leading-none transition-transform duration-700 select-none ${
                autoRotate ? "animate-spin" : ""
              }`}
            >
              🔄
            </span>

            {/* Clear Tooltip */}
            <div className='absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#263746] text-[#F5F5F0] text-[11px] font-sans font-medium whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30'>
              {autoRotate ? "Cruise: Active" : "Cruise: Paused"}
            </div>
          </button>

          {/* 4. Sanctuary Fortune Omikuji (✦) */}
          <button
            type='button'
            onClick={drawFortune}
            className='group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-[#E7E7B7]/50 text-[#C97851] hover:text-[#b56742]'
            title="Today's Sanctuary Fortune (Omikuji)"
          >
            <span className='text-[16px] font-bold group-hover:rotate-12 transition-transform duration-300 select-none'>
              ✦
            </span>

            {/* Clear Tooltip */}
            <div className='absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#263746] text-[#F5F5F0] text-[11px] font-sans font-medium whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30'>
              Daily Fortune
            </div>
          </button>
        </div>
      </div>

      {/* Bottom-Right Personal Realm Footnote — Level 0 floating signature */}
      <div className='absolute bottom-6 right-6 sm:right-12 z-20 pointer-events-none select-none hidden sm:flex flex-col items-end'>
        <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F0]/75 backdrop-blur-md border border-[#E7E7B7]/70 text-[11px] font-mono text-[#263746]/80 shadow-[0_2px_8px_rgba(38,55,70,0.05)]'>
          <span className='w-1.5 h-1.5 rounded-full bg-[#4E7D46] animate-pulse' />
          <span>Built by Rocky</span>
          <span className='text-[#8B6A4E]/40'>•</span>
          <span className='text-[#8B6A4E]'>Shanghai · Remote</span>
        </div>
      </div>

      {/* Shrine Omikuji Fortune Drawer / Modal */}
      {showFortuneModal && activeFortune && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263746]/40 backdrop-blur-sm animate-in fade-in duration-200'
          onClick={() => setShowFortuneModal(false)}
        >
          <div
            className='bg-[#F5F5F0] rounded-[24px] p-6 max-w-sm w-full shadow-[0_20px_50px_rgba(38,55,70,0.18)] border border-[#E7E7B7] transform animate-in zoom-in-95 duration-200 text-[#263746] relative'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-3 border-b border-[#E7E7B7]/60'>
              <div className='flex items-center gap-2'>
                <span className='text-xl'>⛩️</span>
                <div>
                  <h3 className='font-bold text-sm text-[#263746]'>Spirit Shrine Omikuji</h3>
                  <p className='text-[10px] text-[#8B6A4E]'>Floating Island Sanctuary Fortune</p>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setShowFortuneModal(false)}
                className='w-7 h-7 rounded-lg bg-[#E7E7B7]/40 hover:bg-[#E7E7B7]/80 flex items-center justify-center text-[#263746] text-xs font-bold transition-all'
              >
                ✕
              </button>
            </div>

            <div className='my-5 text-center'>
              <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border mb-2 ${activeFortune.luckColor}`}>
                {activeFortune.rank}
              </span>
              <h4 className='text-lg font-bold text-[#263746] mb-2'>
                {activeFortune.title}
              </h4>
              <p className='text-sm text-[#263746]/85 leading-relaxed italic bg-white/70 p-3.5 rounded-xl border border-[#E7E7B7]/60'>
                "{activeFortune.message}"
              </p>
            </div>

            <div className='flex gap-2 pt-2'>
              <button
                type='button'
                onClick={drawFortune}
                className='flex-1 py-2 px-3 rounded-xl bg-[#C97851] hover:bg-[#b56742] text-[#F5F5F0] text-xs font-semibold shadow-xs transition-all active:scale-95'
              >
                Draw Again 🎋
              </button>
              <button
                type='button'
                onClick={() => setShowFortuneModal(false)}
                className='py-2 px-3 rounded-xl bg-transparent hover:bg-[#E7E7B7]/30 text-[#263746] text-xs font-semibold transition-all'
              >
                Keep Blessing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
