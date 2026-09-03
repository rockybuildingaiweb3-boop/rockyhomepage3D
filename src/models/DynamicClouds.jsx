import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural Volumetric Floating Cloud Layers with waving wind distortion
 */
export function DynamicClouds({ atmosphere = "day" }) {
  const groupRef = useRef();

  // Cloud styling config based on atmosphere
  const atmoColor = useMemo(() => {
    switch (atmosphere) {
      case "sunset":
        return {
          primary: "#F5F5F0", // cloud white
          secondary: "#C97851", // roof orange warm glow
          rim: "#E9A84A", // golden sunset edge
          opacity: 0.72,
        };
      case "night":
        return {
          primary: "#263746", // ink deep sky
          secondary: "#1A2530", // dark night stone
          rim: "#8B6A4E", // warm wood rim
          opacity: 0.48,
        };
      case "day":
      default:
        return {
          primary: "#F5F5F0", // cloud
          secondary: "#EBF4FA", // soft sky tint
          rim: "#BFDDF0", // user sky palette edge
          opacity: 0.78,
        };
    }
  }, [atmosphere]);

  // Generate organic cloud clusters arranged as a natural framing vignette
  const cloudClusters = useMemo(() => {
    const clusters = [];

    // Asymmetrical framing layout:
    // Left Flank: deeper, organic tiered cloud shelf (grounding the composition)
    // Right Flank: sparser, higher and distant wisps (opening up the sky)
    // Central Sector: completely cleared out to guarantee pure negative space for ROCKY and Sanctuary
    const framingLayouts = [
      // Left Outer Tiered Bank (richer, staggered heights & depth)
      { basePos: [-48, 4, -46], scale: 1.4, phase: 0.2 },
      { basePos: [-42, -5, -42], scale: 1.5, phase: 1.6 },
      { basePos: [-56, 14, -58], scale: 1.2, phase: 2.8 },
      { basePos: [-36, -14, -48], scale: 1.35, phase: 4.1 },

      // Right Outer Flank (sparser, lighter, recessed into distance)
      { basePos: [52, 12, -55], scale: 1.15, phase: 0.9 },
      { basePos: [58, -2, -48], scale: 1.25, phase: 2.3 },

      // Distant Horizon Bed (far below and behind the island keystone base)
      { basePos: [-28, -24, -68], scale: 1.7, phase: 1.4 },
      { basePos: [18, -25, -72], scale: 1.5, phase: 3.2 },
      { basePos: [38, -22, -64], scale: 1.4, phase: 5.1 },

      // Subtle Far High Wisp on upper-left only
      { basePos: [-58, 22, -88], scale: 2.1, phase: 0.6 },
    ];

    framingLayouts.forEach((item, i) => {
      const scaleBase = item.scale;
      const puffs = [
        { offset: [0, 0, 0], r: 4.2 * scaleBase },
        { offset: [-2.6 * scaleBase, -0.4 * scaleBase, 1.0 * scaleBase], r: 3.2 * scaleBase },
        { offset: [2.8 * scaleBase, -0.4 * scaleBase, -0.8 * scaleBase], r: 3.4 * scaleBase },
        { offset: [0.8 * scaleBase, 1.6 * scaleBase, 0.5 * scaleBase], r: 2.8 * scaleBase },
        { offset: [-1.2 * scaleBase, 1.4 * scaleBase, -0.9 * scaleBase], r: 2.6 * scaleBase },
      ];

      clusters.push({
        id: i,
        basePos: item.basePos,
        puffs,
        phase: item.phase,
        scaleBase,
      });
    });

    return clusters;
  }, []);

  // Animate dynamic billowy wave motion and wind drift
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Modulate individual cluster elevations and subtle lateral drift like billowing atmospheric waves
    groupRef.current.children.forEach((clusterGroup, idx) => {
      const data = cloudClusters[idx];
      if (data) {
        // Vertical billowing wave oscillation
        clusterGroup.position.y = data.basePos[1] + Math.sin(t * 0.7 + data.phase) * 1.2;
        // Gentle horizontal drifting swell without rotating away from the frame
        clusterGroup.position.x = data.basePos[0] + Math.cos(t * 0.35 + data.phase) * 0.9;
        // Subtle organic breathing scale pulse
        const pulse = 1 + Math.sin(t * 0.5 + data.phase) * 0.03;
        clusterGroup.scale.set(pulse, pulse, pulse);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {cloudClusters.map((cluster) => (
        <group key={cluster.id} position={cluster.basePos}>
          {cluster.puffs.map((puff, pIdx) => (
            <mesh key={pIdx} position={puff.offset}>
              <sphereGeometry args={[puff.r, 8, 8]} />
              <meshStandardMaterial
                color={pIdx % 2 === 0 ? atmoColor.primary : atmoColor.secondary}
                emissive={atmoColor.rim}
                emissiveIntensity={0.15}
                roughness={0.9}
                metalness={0.0}
                transparent
                opacity={atmoColor.opacity}
                flatShading
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
