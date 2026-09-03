import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

import birdScene from "../assets/3d/bird.glb";

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export function Bird() {
  const birdRef = useRef();

  // Load the 3D model and animations from the provided GLTF file
  const { scene, animations } = useGLTF(birdScene);

  // Get access to the animations for the bird
  const { actions } = useAnimations(animations, birdRef);

  // Soften saturation and emissive brilliance so the phoenix sits harmoniously in the sky as a secondary element
  useEffect(() => {
    if (actions && actions["Take 001"]) {
      actions["Take 001"].play();
    }

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = 0.86;
        if (child.material.emissive) {
          child.material.emissiveIntensity = 0.35;
        }
        if (child.material.roughness !== undefined) {
          child.material.roughness = 0.65;
        }
      }
    });
  }, [actions, scene]);

  useFrame(({ clock }) => {
    if (!birdRef.current) return;
    const t = clock.getElapsedTime() * 0.35;

    // Elegant, distant circling arc in the upper-right quadrant (away from central Hero negative space)
    birdRef.current.position.x = 19 + Math.cos(t) * 4.0;
    birdRef.current.position.y = 8.5 + Math.sin(t * 1.8) * 0.6;
    birdRef.current.position.z = -24 + Math.sin(t) * 3.2;

    // Smooth heading tangent with gentle banking roll
    birdRef.current.rotation.y = -t + Math.PI / 2 + 0.2;
    birdRef.current.rotation.z = Math.sin(t * 1.8) * 0.08;
  });

  return (
    // Scaled down by ~25% and positioned far in the upper-right midground
    <mesh ref={birdRef} position={[19, 8.5, -24]} scale={[0.00225, 0.00225, 0.00225]}>
      <primitive object={scene} />
    </mesh>
  );
}
