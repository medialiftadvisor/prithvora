'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SceneContent() {
  const earthRef = useRef<THREE.Points>(null);
  const landRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      if (docHeight > 0) {
        setScrollPercent(Math.min(scrollPos / docHeight, 1));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    // 1. Earth rotation and translation
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.15;
      earthRef.current.rotation.x += delta * 0.05;

      // Translate the earth down and scale down on scroll
      earthRef.current.position.y = -scrollPercent * 6;
      earthRef.current.scale.setScalar(1 - scrollPercent * 0.5);
    }

    // 2. Farmland translation and tilt
    if (landRef.current) {
      // Rise farmland grid from below
      landRef.current.position.y = -6 + scrollPercent * 4.8;
      landRef.current.rotation.x = -Math.PI / 2.5 + scrollPercent * 0.2;
    }

    // 3. Floating particles translation
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * (0.3 + scrollPercent * 0.6);
        if (positions[i] > 8) {
          positions[i] = -8;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Sunrise lighting rotation and intensity
    if (lightRef.current) {
      const angle = Math.PI * 0.1 + scrollPercent * Math.PI * 0.4;
      lightRef.current.position.set(Math.cos(angle) * 10, Math.sin(angle) * 10, 5);
      lightRef.current.intensity = 0.5 + scrollPercent * 2.5;
    }

    // 5. Camera movement
    state.camera.position.z = 8 - scrollPercent * 2.5;
    state.camera.position.y = scrollPercent * 1.5;
    state.camera.lookAt(0, -scrollPercent * 1.2, 0);
  });

  // Procedural Earth sphere points
  const earthPoints = React.useMemo(() => {
    return new THREE.SphereGeometry(3, 40, 40);
  }, []);

  // Procedural Farmland grid
  const landGeometry = React.useMemo(() => {
    const geo = new THREE.PlaneGeometry(14, 14, 28, 28);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Create agricultural rows
      const row = Math.sin(x * 1.8) * 0.08;
      const landscapeVal = Math.cos(y * 0.4) * 0.15;
      pos.setZ(i, row + landscapeVal);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Floating particles position
  const particleParams = React.useMemo(() => {
    const count = 250;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[-10, -10, -10]} intensity={0.25} color="#91afa4" />
      <directionalLight
        ref={lightRef}
        position={[10, 1, 5]}
        intensity={0.6}
        color="#bda157"
      />

      {/* Space Earth Grid */}
      <points ref={earthRef} geometry={earthPoints}>
        <pointsMaterial
          color="#91afa4"
          size={0.035}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
        />
      </points>

      {/* Floating Golden Seeds/Pollen Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleParams, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#bda157"
          size={0.045}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.7}
        />
      </points>

      {/* Farmland Mesh */}
      <mesh ref={landRef} geometry={landGeometry} position={[0, -6, 0]} rotation={[-Math.PI / 2.5, 0, 0]}>
        <meshStandardMaterial
          color="#185f39"
          roughness={0.9}
          metalness={0.1}
          wireframe={true}
        />
      </mesh>
    </>
  );
}

export default function EarthFarmlandCanvasInner() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: 'linear-gradient(to bottom, #06100a 0%, #0d2216 100%)' }}
    >
      <SceneContent />
    </Canvas>
  );
}
