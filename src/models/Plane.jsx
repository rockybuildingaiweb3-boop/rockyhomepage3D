import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import planeScene from "../assets/3d/plane.glb";

// 3D Model from: https://sketchfab.com/3d-models/stylized-ww1-plane-c4edeb0e410f46e8a4db320879f0a1db
export function Plane({ isRotating, ...props }) {
  const ref = useRef();
  const { scene, animations } = useGLTF(planeScene);
  const { actions } = useAnimations(animations, ref);

  // Keep propeller always active, accelerating smoothly when rotating/flying fast
  useEffect(() => {
    if (actions && actions["Take 001"]) {
      actions["Take 001"].play();
      actions["Take 001"].timeScale = isRotating ? 2.8 : 0.9;
    }
  }, [actions, isRotating]);

  // Add natural aerodynamic flight climb, banking roll and forward cruise lift (↗)
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (ref.current) {
      const baseY = props.position ? props.position[1] : -4.5;
      const baseX = props.position ? props.position[0] : 3.6;
      // Active aerodynamic lift
      ref.current.position.y = baseY + Math.sin(elapsed * 1.8) * 0.12 + (isRotating ? Math.sin(elapsed * 3.2) * 0.08 : 0);
      ref.current.position.x = baseX + Math.cos(elapsed * 1.2) * 0.07;
      // Banking outward-upward departure angle (↗)
      ref.current.rotation.z = -0.2 + Math.sin(elapsed * 1.4) * 0.035;
      ref.current.rotation.x = 0.15 + Math.cos(elapsed * 1.1) * 0.03;
    }
  });

  return (
    <mesh {...props} ref={ref} castShadow receiveShadow>
      <primitive object={scene} />
    </mesh>
  );
}
