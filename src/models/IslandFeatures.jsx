import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Fox } from "./Fox";
import { InteractiveHotspot } from "./InteractiveHotspot";

// Stylized Floating Companion Islet
function CompanionIslet({ position, rotation, scale = 1, delay = 0, hasTree = false }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() + delay;
    meshRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.35;
    meshRef.current.rotation.y = rotation[1] + Math.sin(t * 0.6) * 0.08;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Upper rocky grassy plateau */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.2, 3.2, 2.8, 7]} />
        <meshStandardMaterial
          color='#475569'
          roughness={0.85}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Tapered bottom stone root */}
      <mesh castShadow position={[0, -2.4, 0]}>
        <coneGeometry args={[3.1, 3.6, 6]} />
        <meshStandardMaterial
          color='#334155'
          roughness={0.9}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Floating glowing power crystal underneath */}
      <mesh position={[0, -4.6, 0]} rotation={[0.4, 0.5, 0.2]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color='#E7E7B7'
          emissive='#E9A84A'
          emissiveIntensity={1.2}
          roughness={0.15}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Optional Bonsai Sakura Tree on the companion islet */}
      {hasTree && (
        <group position={[0, 1.4, 0]}>
          {/* Trunk */}
          <mesh castShadow position={[0, 0.8, 0]} rotation={[0.1, 0, 0.15]}>
            <cylinderGeometry args={[0.2, 0.4, 1.8, 5]} />
            <meshStandardMaterial color='#78350f' roughness={0.9} flatShading />
          </mesh>
          {/* Sakura Foliage Cloud */}
          <mesh castShadow position={[0.2, 2.1, 0]}>
            <dodecahedronGeometry args={[1.3, 1]} />
            <meshStandardMaterial
              color='#f472b6'
              emissive='#db2777'
              emissiveIntensity={0.25}
              roughness={0.6}
              flatShading
            />
          </mesh>
          <mesh castShadow position={[-0.6, 1.8, 0.3]}>
            <dodecahedronGeometry args={[0.9, 1]} />
            <meshStandardMaterial
              color='#fbcfe8'
              emissive='#f472b6'
              emissiveIntensity={0.2}
              roughness={0.6}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* Mini Stone Spirit Lantern */}
      <group position={[1.2, 1.5, 0.5]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 0.8, 6]} />
          <meshStandardMaterial color='#64748b' roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial
            color='#fef08a'
            emissive='#f59e0b'
            emissiveIntensity={2}
          />
        </mesh>
        <pointLight position={[0, 0.9, 0]} color='#fde047' intensity={0.8} distance={8} />
      </group>
    </group>
  );
}

// Cascading Cliff Waterfall
function CliffWaterfall() {
  const streamRef = useRef();

  useFrame(({ clock }) => {
    if (!streamRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle ripple wave along waterfall
    streamRef.current.rotation.z = Math.sin(t * 3.5) * 0.02;
  });

  return (
    <group position={[-16.5, -0.5, 2.5]} rotation={[0.08, 0.4, -0.05]}>
      {/* Falling water stream ribbon */}
      <mesh ref={streamRef} position={[0, -5, 0]}>
        <boxGeometry args={[2.2, 11, 0.6]} />
        <meshStandardMaterial
          color='#67e8f9'
          emissive='#0891b2'
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Mist & Splash Light at the bottom */}
      <pointLight position={[0, -10.5, 0.5]} color='#38bdf8' intensity={1.5} distance={12} />
    </group>
  );
}

// Stylized stepping-stone path & celestial bridge connecting the side islet to the main sanctuary
function IsletBridgeConnection() {
  const bridgeRef = useRef();

  useFrame(({ clock }) => {
    if (!bridgeRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle floating bob for the stepping bridge
    bridgeRef.current.position.y = Math.sin(t * 1.1) * 0.12;
  });

  // 3 sequential stepping stones bridging the gap between [-23, -2.8, 10.5] and main island [-15, -1.8, 7.8]
  const steppingStones = [
    { pos: [-20.2, -2.6, 9.8], scale: [0.85, 0.4, 0.85], rot: [0.08, 0.4, -0.05] },
    { pos: [-17.8, -2.2, 9.0], scale: [0.95, 0.45, 0.95], rot: [-0.05, 0.8, 0.08] },
    { pos: [-15.5, -1.8, 8.2], scale: [0.9, 0.42, 0.9], rot: [0.06, 0.2, -0.04] },
  ];

  return (
    <group ref={bridgeRef}>
      {/* Translucent cloud ribbon cushioning the stepping path */}
      <mesh position={[-17.8, -3.1, 9.0]} scale={[4.8, 0.9, 2.8]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#ffffff'
          roughness={0.5}
          transparent
          opacity={0.55}
          flatShading
        />
      </mesh>

      {/* Stepping Plinths with mossy caps */}
      {steppingStones.map((stone, i) => (
        <group key={i} position={stone.pos} rotation={stone.rot}>
          {/* Base Stone */}
          <mesh castShadow receiveShadow scale={stone.scale}>
            <cylinderGeometry args={[1, 1.25, 0.9, 7]} />
            <meshStandardMaterial color='#475569' roughness={0.88} flatShading />
          </mesh>
          {/* Mossy Green Top Cap */}
          <mesh position={[0, stone.scale[1] * 0.48, 0]} scale={[stone.scale[0] * 0.95, 0.1, stone.scale[2] * 0.95]}>
            <cylinderGeometry args={[1, 1, 0.4, 7]} />
            <meshStandardMaterial color='#65a30d' roughness={0.75} flatShading />
          </mesh>
          {/* Subtle warm stone spirit marker on central stepping stone */}
          {i === 1 && (
            <pointLight position={[0, 0.6, 0]} color='#fed7aa' intensity={0.9} distance={6} />
          )}
        </group>
      ))}
    </group>
  );
}

// Inverted Mountain Base Keystone (solves truncated/broken bottom)
function IslandKeystone() {
  return (
    <group position={[0, -8.5, 0]}>
      {/* Central deep mountain root cone */}
      <mesh castShadow receiveShadow position={[0, -3.8, 0]}>
        <coneGeometry args={[17, 10, 8]} />
        <meshStandardMaterial
          color='#334155'
          roughness={0.92}
          metalness={0.06}
          flatShading
        />
      </mesh>

      {/* Secondary jagged inverted rock spires */}
      <mesh castShadow position={[-6, -6.5, 4]} rotation={[0.2, 0.4, -0.15]}>
        <coneGeometry args={[7, 9, 6]} />
        <meshStandardMaterial
          color='#1e293b'
          roughness={0.95}
          metalness={0.04}
          flatShading
        />
      </mesh>

      <mesh castShadow position={[7, -5.8, -5]} rotation={[-0.15, -0.3, 0.2]}>
        <coneGeometry args={[8, 8.5, 7]} />
        <meshStandardMaterial
          color='#1e293b'
          roughness={0.95}
          metalness={0.04}
          flatShading
        />
      </mesh>

      <mesh castShadow position={[4, -7.5, 6]} rotation={[0.1, 0.2, -0.2]}>
        <coneGeometry args={[5.5, 8, 5]} />
        <meshStandardMaterial
          color='#0f172a'
          roughness={0.95}
          metalness={0.04}
          flatShading
        />
      </mesh>

      {/* Deepest central tip with glowing celestial anchor crystal */}
      <mesh position={[0, -11.5, 0]} rotation={[0.2, 0.8, 0]}>
        <octahedronGeometry args={[2.2, 0]} />
        <meshStandardMaterial
          color='#60a5fa'
          emissive='#2563eb'
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>
      <pointLight position={[0, -11.5, 0]} color='#60a5fa' intensity={2.5} distance={20} />
    </group>
  );
}

// Floating cloud puffs hugging the lower island perimeter
function CloudRing() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.025;
  });

  const cloudPuffs = [
    { pos: [-18, -7.5, 12], scale: [5.5, 2.2, 4.5], color: "#ffffff" },
    { pos: [19, -8, 14], scale: [6, 2.4, 5], color: "#f8fafc" },
    { pos: [14, -7.2, -18], scale: [5.5, 2, 4.8], color: "#ffffff" },
    { pos: [-16, -8.2, -15], scale: [6.5, 2.6, 5.2], color: "#f1f5f9" },
    { pos: [0, -9, 21], scale: [7, 2.5, 5.5], color: "#ffffff" },
    { pos: [0, -9.2, -22], scale: [7.5, 2.7, 5.8], color: "#f8fafc" },
  ];

  return (
    <group ref={groupRef}>
      {cloudPuffs.map((puff, i) => (
        <mesh key={i} position={puff.pos} scale={puff.scale}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={puff.color}
            roughness={0.4}
            metalness={0.0}
            transparent
            opacity={0.72}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

// Shrine Pathway Stone Lanterns
function ShrineLanterns() {
  const lanterns = [
    { pos: [18.2, 0.4, 11.5] },
    { pos: [14.8, 1.2, 16.5] },
    { pos: [12.2, 2.8, 10.2] },
    { pos: [-8.5, 4.2, 15.5] },
  ];

  return (
    <group>
      {lanterns.map((l, i) => (
        <group key={i} position={l.pos}>
          {/* Stone Base */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.18, 0.28, 0.7, 6]} />
            <meshStandardMaterial color='#475569' roughness={0.85} flatShading />
          </mesh>
          {/* Lantern Light Box */}
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[0.38, 0.32, 0.38]} />
            <meshStandardMaterial
              color='#fef08a'
              emissive='#f59e0b'
              emissiveIntensity={2.2}
            />
          </mesh>
          {/* Lantern Roof */}
          <mesh castShadow position={[0, 1.05, 0]}>
            <coneGeometry args={[0.42, 0.25, 4]} />
            <meshStandardMaterial color='#334155' roughness={0.8} flatShading />
          </mesh>
          <pointLight position={[0, 0.85, 0]} color='#fed7aa' intensity={1.2} distance={6} />
        </group>
      ))}
    </group>
  );
}

export function IslandFeatures({ isRotating, onExploreStage }) {
  return (
    <group>
      {/* 1. Inverted Mountain Root & Power Keystone (fixes truncated base) */}
      <IslandKeystone />

      {/* 2. Soft Cloud Skirt Ring */}
      <CloudRing />

      {/* 3. Cascading Cliff Waterfall */}
      <CliffWaterfall />

      {/* 4. Japanese Shrine Pathway Lanterns */}
      <ShrineLanterns />

      {/* 5. Companion Floating Mini-Islands & Visual Bridge to Main Sanctuary */}
      <CompanionIslet
        position={[-23, -2.8, 10.5]}
        rotation={[0.08, 0.75, -0.04]}
        scale={0.72}
        delay={0}
        hasTree={true}
      />
      {/* Visual Stepping Stone Path & Cloud Tether bridging Side Islet to Main Sanctuary */}
      <IsletBridgeConnection />

      {/* 6. Animated Island Guardian Fox */}
      <group position={[17.2, 0.2, 13.6]} rotation={[0, -1.9, 0]} scale={[0.24, 0.24, 0.24]}>
        <Fox currentAnimation={isRotating ? "walk" : "idle"} />
      </group>

      {/* 7. Interactive Discovery Hotspots across the Island (Ancient Sakura, Azure Cascade, Spirit Torii) */}
      <InteractiveHotspot
        position={[17.5, 9.8, 12.8]}
        title='Ancient Sakura'
        subtitle='Centuries-old cherry blossoms blessing travelers with inspiration & calm thoughts.'
        icon='🌸'
        badge='Craft'
        actionText='View About Me'
        color='#C97851'
        emissiveColor='#E9A84A'
        onTrigger={() => onExploreStage && onExploreStage(2)}
      />

      <InteractiveHotspot
        position={[-16.5, 1.5, 2.8]}
        title='Azure Cascade'
        subtitle='Mystical cliffside waterfall feeding the celestial rivers of the floating archipelago.'
        icon='🌊'
        badge='Artifacts'
        actionText='Explore Works'
        color='#6F9F67'
        emissiveColor='#E9A84A'
        onTrigger={() => onExploreStage && onExploreStage(3)}
      />

      <InteractiveHotspot
        position={[12.5, 3.2, 15.2]}
        title='Spirit Torii Shrine'
        subtitle='The sacred entrance guarded by the Celestial Kitsune. Make a connection here.'
        icon='⛩️'
        badge='Dispatch'
        actionText='Contact Engineer'
        color='#C97851'
        emissiveColor='#E9A84A'
        onTrigger={() => onExploreStage && onExploreStage(4)}
      />
    </group>
  );
}
