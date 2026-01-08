import { useRef, useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Throttled mouse position for better performance
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle to ~30fps
      if (frameRef.current++ % 2 !== 0) return;
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return mouse;
}

// Simplified Docker Container
function DockerContainer({ position, mouseX }: { position: [number, number, number]; mouseX: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const initialX = position[0];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, initialX + mouseX * 0.3, 0.03);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Box args={[0.6, 0.4, 0.4]}>
        <meshStandardMaterial color="#0db7ed" metalness={0.8} roughness={0.2} />
      </Box>
    </group>
  );
}

// Simplified Kubernetes Pod
function KubernetesPod({ position, mouseX }: { position: [number, number, number]; mouseX: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialX = position[0];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, initialX + mouseX * 0.4, 0.03);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <dodecahedronGeometry args={[0.35]} />
      <meshStandardMaterial color="#326ce5" wireframe />
    </mesh>
  );
}

// Simplified AWS Cloud
function AWSCloud({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Sphere args={[0.25, 12, 12]} position={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#ff9900" />
      </Sphere>
      <Sphere args={[0.35, 12, 12]} position={[0.1, 0.08, 0]}>
        <meshStandardMaterial color="#ff9900" />
      </Sphere>
      <Sphere args={[0.2, 12, 12]} position={[0.35, -0.03, 0]}>
        <meshStandardMaterial color="#ff9900" />
      </Sphere>
    </group>
  );
}

// Simplified Git Node
function GitNode({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.18]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Simplified Central Core
function CentralCore({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY * 0.15, 0.03);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.15, 0.03);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.15}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <Torus ref={ringRef} args={[1.6, 0.02, 12, 60]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#22c55e" transparent opacity={0.7} />
      </Torus>
    </group>
  );
}

// Optimized Data Particles - reduced count
function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100; // Reduced from 250
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= 0.015;
        if (pos[i * 3 + 1] < -8) {
          pos[i * 3 + 1] = 8;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00d4ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Main Scene - simplified
function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneRef.current.rotation.y,
        state.clock.elapsedTime * 0.02 + mouseX * 0.08,
        0.015
      );
    }
  });

  return (
    <group ref={sceneRef}>
      <CentralCore mouseX={mouseX} mouseY={mouseY} />
      
      <DockerContainer position={[-3, 0.5, -1]} mouseX={mouseX} />
      <DockerContainer position={[3, -0.3, -1.5]} mouseX={mouseX} />
      
      <KubernetesPod position={[2.2, 2, -1]} mouseX={mouseX} />
      <KubernetesPod position={[-2.2, -1.2, -1]} mouseX={mouseX} />
      
      <AWSCloud position={[0, 2.5, -1.5]} />
      
      <GitNode position={[-2.2, 1.5, -0.8]} color="#f05032" />
      <GitNode position={[2.5, 1.2, -1]} color="#22c55e" />
      <GitNode position={[-2, -1.5, -0.5]} color="#8b5cf6" />
      <GitNode position={[2.2, -1.3, -0.8]} color="#00d4ff" />
      
      <DataParticles />
      <Stars radius={50} depth={40} count={800} factor={3} fade speed={0.3} />
    </group>
  );
}

function SceneWrapper() {
  const mouse = useMousePosition();
  return <Scene mouseX={mouse.x} mouseY={mouse.y} />;
}

export default function CloudScene() {
  const [isVisible, setIsVisible] = useState(true);

  // Pause animation when tab is not visible
  useEffect(() => {
    const handleVisibility = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  if (!isVisible) return <div className="absolute inset-0 -z-10 bg-[#080d16]" />;

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ 
          antialias: false, // Disable for performance
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]} // Reduced max DPR
        frameloop={isVisible ? 'always' : 'never'}
      >
        <color attach="background" args={['#080d16']} />
        <fog attach="fog" args={['#080d16', 6, 25]} />
        
        <ambientLight intensity={0.15} />
        <pointLight position={[8, 8, 8]} intensity={0.6} color="#00d4ff" />
        <pointLight position={[-8, -8, -8]} intensity={0.4} color="#8b5cf6" />
        <pointLight position={[0, 6, 4]} intensity={0.5} color="#22c55e" />
        
        <SceneWrapper />
      </Canvas>
    </div>
  );
}
