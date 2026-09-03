import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import skyScene from "../assets/3d/sky.glb";

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export function Sky({ isRotating }) {
  const sky = useGLTF(skyScene);
  const skyRef = useRef();

  // Always keep clouds in natural gentle wind flow; speed up smoothly when rotating
  useFrame(({ clock }, delta) => {
    if (!skyRef.current) return;
    const baseWind = 0.04;
    const rotationBoost = isRotating ? 0.22 : 0;
    skyRef.current.rotation.y += (baseWind + rotationBoost) * delta;
    // Subtle atmospheric pitch wave
    const t = clock.getElapsedTime();
    skyRef.current.rotation.z = Math.sin(t * 0.25) * 0.015;
  });

  return (
    <mesh ref={skyRef}>
      <primitive object={sky.scene} />
    </mesh>
  );
}
