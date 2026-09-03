import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Japanese Shrine Omikuji / Fortunes
 */
export const OMIKUJI_FORTUNES = [
  { rank: "大吉 (Great Blessing)", title: "Infinite Flow", message: "Your creative intuition is at its peak. Every line of code will assemble flawlessly.", luckColor: "text-[#4E7D46] bg-[#F5F5F0] border-[#6F9F67]" },
  { rank: "中吉 (Middle Blessing)", title: "Starlit Path", message: "An auspicious encounter approaches. Collaborative energy will turn ambitious visions into reality.", luckColor: "text-[#263746] bg-[#BFDDF0]/50 border-[#BFDDF0]" },
  { rank: "吉 (Good Fortune)", title: "Gentle Breeze", message: "Patience will nurture wisdom. Take a breath, admire the floating clouds, and proceed with clarity.", luckColor: "text-[#C97851] bg-[#F5F5F0] border-[#C97851]" },
  { rank: "大吉 (Great Blessing)", title: "Phoenix Awakening", message: "A breakthrough project is within reach. Dare to sculpt the extraordinary.", luckColor: "text-[#8B6A4E] bg-[#E7E7B7]/50 border-[#8B6A4E]" },
  { rank: "小吉 (Modest Blessing)", title: "Dew on Sakura", message: "Small persistent improvements yield monumental elegance. Trust the continuous craft.", luckColor: "text-[#C97851] bg-[#F5F5F0] border-[#E9A84A]" },
];

/**
 * Ambient interactive fireworks/lantern particles on click
 */
export function InteractiveSparks({ sparks = [] }) {
  return (
    <group>
      {sparks.map((spark) => (
        <group key={spark.id} position={spark.position}>
          <pointLight color={spark.color} intensity={2.5} distance={15} />
        </group>
      ))}
    </group>
  );
}

/**
 * Floating Sky Origami Cranes in distant gentle flock
 */
export function OrigamiCranes() {
  const groupRef = useRef();

  const cranes = useMemo(() => [
    { offset: [-25, 12, -35], speed: 0.6, scale: 0.28, phase: 0 },
    { offset: [-28, 14, -38], speed: 0.62, scale: 0.22, phase: 1.2 },
    { offset: [-22, 10.5, -33], speed: 0.58, scale: 0.25, phase: 2.4 },
    { offset: [28, 8, -42], speed: 0.55, scale: 0.26, phase: 3.1 },
    { offset: [32, 9.5, -45], speed: 0.52, scale: 0.2, phase: 4.3 },
  ], []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.x = Math.sin(t * 0.15) * 4;
    groupRef.current.position.y = Math.sin(t * 0.35) * 1.2;
  });

  return (
    <group ref={groupRef}>
      {cranes.map((c, i) => (
        <mesh key={i} position={c.offset} scale={c.scale}>
          <coneGeometry args={[1.5, 3.2, 4]} />
          <meshStandardMaterial
            color='#ffffff'
            emissive='#f8fafc'
            emissiveIntensity={0.3}
            roughness={0.2}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
