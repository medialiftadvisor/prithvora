'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SceneContent() {
  const earthRef = useRef<THREE.Points>(null);
  const earthWireframeRef = useRef<THREE.Mesh>(null);
  const earthGlassRef = useRef<THREE.Mesh>(null);
  const landRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const sunGlowRef = useRef<THREE.Mesh>(null);

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

  // Sky background color presets
  const skyColors = React.useMemo(() => {
    return {
      night: new THREE.Color('#020603'),
      dawn: new THREE.Color('#0b1d12'),
      sunrise: new THREE.Color('#221b0d'),
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Sky color transition based on scroll position
    const bgColor = new THREE.Color();
    if (scrollPercent < 0.5) {
      bgColor.copy(skyColors.night).lerp(skyColors.dawn, scrollPercent * 2);
    } else {
      bgColor.copy(skyColors.dawn).lerp(skyColors.sunrise, (scrollPercent - 0.5) * 2);
    }
    state.scene.background = bgColor;

    // 2. Multi-layer Earth animation
    const earthPos = -scrollPercent * 6.5;
    const earthScale = 1 - scrollPercent * 0.4;

    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.12;
      earthRef.current.rotation.x += delta * 0.04;
      earthRef.current.position.y = earthPos;
      earthRef.current.scale.setScalar(earthScale);
    }

    if (earthWireframeRef.current) {
      earthWireframeRef.current.rotation.y += delta * 0.08;
      earthWireframeRef.current.rotation.x += delta * 0.02;
      earthWireframeRef.current.position.y = earthPos;
      earthWireframeRef.current.scale.setScalar(earthScale);
    }

    if (earthGlassRef.current) {
      earthGlassRef.current.rotation.y -= delta * 0.06;
      earthGlassRef.current.position.y = earthPos;
      earthGlassRef.current.scale.setScalar(earthScale);
    }

    // 3. Farmland translation, tilt, and wind wave animation
    if (landRef.current) {
      landRef.current.position.y = -5.8 + scrollPercent * 4.8;
      landRef.current.rotation.x = -Math.PI / 2.3 + scrollPercent * 0.25;

      const geo = landRef.current.geometry;
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Create premium rolling agricultural waves simulating wind blowing over fields
        const wave = Math.sin(x * 1.2 + time * 1.6) * 0.15 * Math.cos(y * 0.3);
        const cropRow = Math.cos(x * 2.5) * 0.04;
        const landscape = Math.sin(y * 0.2) * 0.25;
        pos.setZ(i, wave + cropRow + landscape);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }

    // 4. Golden Harvest Sun rise & pulse
    if (sunRef.current) {
      sunRef.current.position.y = -5.5 + scrollPercent * 7.8;
      sunRef.current.position.x = 4.2 - scrollPercent * 2.2;
      const pulse = 1.1 + Math.sin(time * 1.5) * 0.04;
      sunRef.current.scale.setScalar(pulse);
    }
    if (sunGlowRef.current && sunRef.current) {
      sunGlowRef.current.position.copy(sunRef.current.position);
      const pulseGlow = 2.0 + Math.sin(time * 1.5) * 0.08;
      sunGlowRef.current.scale.setScalar(pulseGlow);
    }

    // 5. Floating sparkling seeds drift
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.025;
      particlesRef.current.rotation.x = time * 0.008;
      particlesRef.current.position.y = Math.sin(time * 0.4) * 0.15;
    }

    // 6. Sunrise lighting transition
    if (lightRef.current) {
      const angle = Math.PI * 0.15 + scrollPercent * Math.PI * 0.45;
      lightRef.current.position.set(Math.cos(angle) * 12, Math.sin(angle) * 12, 6);
      lightRef.current.intensity = 0.6 + scrollPercent * 3.0;

      // Transition directional light from rich amber to bright morning light
      const amber = new THREE.Color('#bda157');
      const warmWhite = new THREE.Color('#fff5d6');
      lightRef.current.color.copy(amber.lerp(warmWhite, scrollPercent));
    }

    // 7. Camera movement
    state.camera.position.z = 8.5 - scrollPercent * 2.8;
    state.camera.position.y = 0.5 + scrollPercent * 1.5;
    state.camera.lookAt(0, -scrollPercent * 1.2, 0);
  });

  // Procedural Earth points geometry
  const earthPoints = React.useMemo(() => {
    return new THREE.SphereGeometry(3, 36, 36);
  }, []);

  // Farmland grid plane geometry
  const landGeometry = React.useMemo(() => {
    return new THREE.PlaneGeometry(16, 16, 32, 32);
  }, []);

  // Floating seeds particles setup
  const particleParams = React.useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = (Math.random() - 0.5) * 18;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, []);

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[-12, -12, -10]} intensity={0.4} color="#91afa4" />
      <directionalLight
        ref={lightRef}
        position={[12, 2, 6]}
        intensity={0.8}
        color="#bda157"
      />

      {/* 1. Golden Harvest Sun in Background */}
      <mesh ref={sunRef} position={[4, -5.5, -12]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#bda157" />
      </mesh>
      
      {/* Sun Glow/Halo */}
      <mesh ref={sunGlowRef} position={[4, -5.5, -12.1]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial 
          color="#ffeb99" 
          transparent={true} 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Multi-layer Earth Globe */}
      {/* Outer Point Cloud */}
      <points ref={earthRef} geometry={earthPoints}>
        <pointsMaterial
          color="#91afa4"
          size={0.045}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.65}
        />
      </points>

      {/* Lat/Long Wireframe Sphere Overlay */}
      <mesh ref={earthWireframeRef}>
        <sphereGeometry args={[3.01, 18, 18]} />
        <meshBasicMaterial
          color="#91afa4"
          wireframe={true}
          transparent={true}
          opacity={0.12}
        />
      </mesh>

      {/* Glowing Inner Glass Core */}
      <mesh ref={earthGlassRef}>
        <sphereGeometry args={[2.92, 32, 32]} />
        <meshPhysicalMaterial
          color="#185f39"
          roughness={0.15}
          metalness={0.8}
          transmission={0.5}
          thickness={1.2}
          transparent={true}
          opacity={0.35}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 3. Floating Sparkling Golden Seeds/Pollen Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleParams, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#bda157"
          size={0.055}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.75}
        />
      </points>

      {/* 4. Animated Wind-Rippling Farmland Grid */}
      <mesh ref={landRef} geometry={landGeometry} position={[0, -5.8, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
        <meshStandardMaterial
          color="#185f39"
          roughness={0.8}
          metalness={0.2}
          wireframe={true}
        />
      </mesh>
    </>
  );
}

export default function EarthFarmlandCanvasInner() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
    >
      <SceneContent />
    </Canvas>
  );
}
