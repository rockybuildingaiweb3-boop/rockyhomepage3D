/**
 * IMPORTANT: Loading glTF models into a Three.js scene is a lot of work.
 * Before we can configure or animate our model’s meshes, we need to iterate through
 * each part of our model’s meshes and save them separately.
 *
 * But luckily there is an app that turns gltf or glb files into jsx components
 * For this model, visit https://gltf.pmnd.rs/
 * And get the code. And then add the rest of the things.
 * YOU DON'T HAVE TO WRITE EVERYTHING FROM SCRATCH
 */

import { a } from "@react-spring/three";
import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import islandScene from "../assets/3d/island.glb";
import { IslandFeatures } from "./IslandFeatures";

export function Island({
  isRotating,
  setIsRotating,
  setCurrentStage,
  currentFocusPoint,
  targetRotation,
  setTargetRotation,
  autoRotate = false,
  onExploreStage,
  ...props
}) {
  const islandRef = useRef();
  // Get access to the Three.js renderer and viewport
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  // Create specialized PBR materials for different island structures to fix flat/washed-out rendering
  const { rockMaterial, foliageMaterial, woodMaterial } = useMemo(() => {
    if (!materials || !materials.PaletteMaterial001) {
      return { rockMaterial: null, foliageMaterial: null, woodMaterial: null };
    }

    // Base rock, cliffs, stone stairs and mountain path
    const rock = materials.PaletteMaterial001.clone();
    rock.emissive = new THREE.Color(0x060c16);
    rock.emissiveIntensity = 0.08;
    rock.roughness = 0.84;
    rock.metalness = 0.05;
    rock.envMapIntensity = 0.8;
    if (rock.map) rock.map.anisotropy = 16;

    // Lush Tree Foliage & Sakura canopies
    const foliage = materials.PaletteMaterial001.clone();
    foliage.emissive = new THREE.Color(0x220c1a);
    foliage.emissiveIntensity = 0.25;
    foliage.roughness = 0.52;
    foliage.metalness = 0.0;
    foliage.envMapIntensity = 1.15;
    if (foliage.map) foliage.map.anisotropy = 16;

    // Tree trunks, wooden bridges & shrine timber
    const wood = materials.PaletteMaterial001.clone();
    wood.emissive = new THREE.Color(0x140a04);
    wood.emissiveIntensity = 0.12;
    wood.roughness = 0.68;
    wood.metalness = 0.02;
    wood.envMapIntensity = 0.85;
    if (wood.map) wood.map.anisotropy = 16;

    return { rockMaterial: rock, foliageMaterial: foliage, woodMaterial: wood };
  }, [materials]);

  // Use a ref for the last mouse x position
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping
  const dampingFactor = 0.95;
  // Track last known stage to avoid redundant state updates every frame
  const lastStageRef = useRef(1);
  const basePosY = props.position ? props.position[1] : -6.5;
  const baseRotX = props.rotation ? props.rotation[0] : 0.1;

  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (setTargetRotation) setTargetRotation(null);
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      if (setTargetRotation) setTargetRotation(null);
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the island's rotation based on the mouse/touch movement
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (setTargetRotation) setTargetRotation(null);
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (setTargetRotation) setTargetRotation(null);
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (setTargetRotation) setTargetRotation(null);
    setIsRotating(true);
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }
  
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }
  
  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
  
    if (isRotating) {
      if (setTargetRotation) setTargetRotation(null);
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;
  
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  }

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    // Remove event listeners when component unmounts
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

  // This function is called on each frame update
  useFrame((state) => {
    if (!islandRef.current) return;
    const elapsed = state.clock.getElapsedTime();

    // Gentle organic floating hover & subtle tilt
    const floatY = Math.sin(elapsed * 0.9) * 0.22;
    islandRef.current.position.y = basePosY + floatY;
    islandRef.current.rotation.x = baseRotX + Math.sin(elapsed * 0.6) * 0.008;
    islandRef.current.rotation.z = Math.cos(elapsed * 0.7) * 0.012;

    // If a target rotation is requested (e.g. via direct stage click)
    if (targetRotation !== null && targetRotation !== undefined && !isRotating) {
      const currentRot = islandRef.current.rotation.y;
      // Normalize target to closest full turn
      const diff = targetRotation - (currentRot % (2 * Math.PI));
      let adjustedTarget = currentRot + diff;
      if (diff > Math.PI) adjustedTarget -= 2 * Math.PI;
      if (diff < -Math.PI) adjustedTarget += 2 * Math.PI;

      const step = (adjustedTarget - currentRot) * 0.08;
      islandRef.current.rotation.y += step;

      if (Math.abs(adjustedTarget - currentRot) < 0.005) {
        islandRef.current.rotation.y = adjustedTarget;
        if (setTargetRotation) setTargetRotation(null);
      }
    } else if (!isRotating) {
      // If auto-touring is active, gently glide the island
      if (autoRotate) {
        islandRef.current.rotation.y += 0.0018;
      } else {
        // Apply damping to slow down user manual rotation smoothly
        rotationSpeed.current *= dampingFactor;

        // Stop rotation when speed is very small
        if (Math.abs(rotationSpeed.current) < 0.0005) {
          rotationSpeed.current = 0;
        }

        islandRef.current.rotation.y += rotationSpeed.current;
      }
    }

    // Determine current stage whenever the island is positioned
    const rotation = islandRef.current.rotation.y;
    const normalizedRotation =
      ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    let calculatedStage = null;
    if (normalizedRotation >= 5.45 && normalizedRotation <= 5.85) {
      calculatedStage = 4;
    } else if (normalizedRotation >= 0.85 && normalizedRotation <= 1.3) {
      calculatedStage = 3;
    } else if (normalizedRotation >= 2.4 && normalizedRotation <= 2.6) {
      calculatedStage = 2;
    } else if (normalizedRotation >= 4.25 && normalizedRotation <= 4.75) {
      calculatedStage = 1;
    }

    if (calculatedStage !== lastStageRef.current) {
      lastStageRef.current = calculatedStage;
      setCurrentStage(calculatedStage);
    }
  });

  return (
    // {Island 3D model from: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907}
    <a.group ref={islandRef} {...props}>
      {/* Ancient Tree Trunks & Shrine Timber */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={woodMaterial || materials.PaletteMaterial001}
      />
      {/* Lush Sakura Foliage Canopies */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={foliageMaterial || materials.PaletteMaterial001}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={foliageMaterial || materials.PaletteMaterial001}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={foliageMaterial || materials.PaletteMaterial001}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={woodMaterial || materials.PaletteMaterial001}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={woodMaterial || materials.PaletteMaterial001}
      />
      {/* Mountain Base, Cliffs, Stone Stairs & Torii Architecture */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={rockMaterial || materials.PaletteMaterial001}
      />

      {/* Island Environmental Enhancements (Inverted Keystone Root, Companion Islets, Waterfall, Lanterns, Guardian Fox, Hotspots) */}
      <IslandFeatures isRotating={isRotating} onExploreStage={onExploreStage} />
    </a.group>
  );
}
