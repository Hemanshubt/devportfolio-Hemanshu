import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, MeshDistortMaterial, Stars, Html, Ring } from '@react-three/drei';
import * as THREE from 'three';

// ─── Shared mouse hook ───────────────────────────────────────────────
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current++ % 2 !== 0) return;
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mouse;
}

// ─── Tooltip Component ───────────────────────────────────────────────
function Tooltip({ text, visible }: { text: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.4)',
          borderRadius: '8px',
          padding: '6px 14px',
          color: '#fff',
          fontSize: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
          transform: 'translateY(-30px)',
        }}
      >
        {text}
      </div>
    </Html>
  );
}

// ─── Glow Ring (hover effect) ────────────────────────────────────────
function GlowRing({ visible, color = '#00d4ff', size = 0.6 }: { visible: boolean; color?: string; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.scale.setScalar(visible ? 1.2 : 0);
      ref.current.rotation.z += 0.02;
    }
  });
  return (
    <mesh ref={ref} scale={0}>
      <ringGeometry args={[size, size + 0.05, 32]} />
      <meshBasicMaterial color={color} transparent opacity={visible ? 0.6 : 0} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Enhanced Docker Container ───────────────────────────────────────
function DockerContainer({ position, mouseX }: { position: [number, number, number]; mouseX: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const initialX = position[0];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.2;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, initialX + mouseX * 0.3, 0.03);
    const targetScale = hovered ? 1.25 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="Docker" visible={hovered} />
      <GlowRing visible={hovered} color="#0db7ed" size={0.5} />
      {/* Main container body */}
      <Box args={[0.6, 0.4, 0.4]}>
        <meshStandardMaterial
          color={hovered ? '#2ec8f7' : '#0db7ed'}
          metalness={0.9}
          roughness={0.1}
          emissive="#0db7ed"
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </Box>
      {/* Container "whale" details */}
      {[[-0.15, 0.22, 0], [0, 0.22, 0], [0.15, 0.22, 0]].map((pos, i) => (
        <Box key={i} args={[0.1, 0.06, 0.35]} position={pos as [number, number, number]}>
          <meshStandardMaterial color="#0a9ed5" metalness={0.8} roughness={0.2} />
        </Box>
      ))}
      {/* Glowing edges */}
      <Box args={[0.62, 0.42, 0.42]}>
        <meshBasicMaterial color="#0db7ed" wireframe transparent opacity={hovered ? 0.4 : 0.1} />
      </Box>
    </group>
  );
}

// ─── Enhanced Kubernetes Pod ─────────────────────────────────────────
function KubernetesPod({ position, mouseX }: { position: [number, number, number]; mouseX: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const initialX = position[0];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.6;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, initialX + mouseX * 0.4, 0.03);
      const s = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -t * 0.3;
      outerRef.current.rotation.y = -t * 0.4;
    }
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="Kubernetes" visible={hovered} />
      <mesh ref={meshRef} position={position}>
        <dodecahedronGeometry args={[0.35]} />
        <meshStandardMaterial
          color={hovered ? '#5a8ff5' : '#326ce5'}
          wireframe
          emissive="#326ce5"
          emissiveIntensity={hovered ? 0.5 : 0.15}
        />
      </mesh>
      {/* Outer orbiting ring */}
      <mesh ref={outerRef} position={position}>
        <torusGeometry args={[0.55, 0.015, 8, 32]} />
        <meshBasicMaterial color="#326ce5" transparent opacity={hovered ? 0.6 : 0.2} />
      </mesh>
    </group>
  );
}

// ─── Enhanced AWS Cloud ──────────────────────────────────────────────
function AWSCloud({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.2;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.15;
    const s = hovered ? 1.2 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
  });

  const cloudColor = hovered ? '#ffb347' : '#ff9900';
  const emissiveIntensity = hovered ? 0.35 : 0.1;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="AWS" visible={hovered} />
      <GlowRing visible={hovered} color="#ff9900" size={0.6} />
      <Sphere args={[0.25, 16, 16]} position={[-0.15, 0, 0]}>
        <meshStandardMaterial color={cloudColor} metalness={0.6} roughness={0.3} emissive="#ff9900" emissiveIntensity={emissiveIntensity} />
      </Sphere>
      <Sphere args={[0.35, 16, 16]} position={[0.1, 0.08, 0]}>
        <meshStandardMaterial color={cloudColor} metalness={0.6} roughness={0.3} emissive="#ff9900" emissiveIntensity={emissiveIntensity} />
      </Sphere>
      <Sphere args={[0.2, 16, 16]} position={[0.35, -0.03, 0]}>
        <meshStandardMaterial color={cloudColor} metalness={0.6} roughness={0.3} emissive="#ff9900" emissiveIntensity={emissiveIntensity} />
      </Sphere>
      {/* Cloud glow underside */}
      <Sphere args={[0.5, 12, 12]} position={[0.1, -0.05, 0]}>
        <meshBasicMaterial color="#ff9900" transparent opacity={hovered ? 0.08 : 0.03} />
      </Sphere>
    </group>
  );
}

// ─── Enhanced Git Node ───────────────────────────────────────────────
function GitNode({ position, color, label }: { position: [number, number, number]; color: string; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.4;
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
      const s = hovered ? 1.4 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    }
    if (glowRef.current) {
      glowRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
      const gs = hovered ? 2.5 : 1.5;
      glowRef.current.scale.lerp(new THREE.Vector3(gs, gs, gs), 0.08);
    }
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text={label} visible={hovered} />
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.18]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.2}
        />
      </mesh>
      {/* Ambient glow sphere */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.15 : 0.05} />
      </mesh>
    </group>
  );
}

// ─── React Atom Logo ─────────────────────────────────────────────────
function ReactAtom({ position, mouseX }: { position: [number, number, number]; mouseX: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const initialX = position[0];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.15;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, initialX + mouseX * 0.25, 0.03);
    const s = hovered ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
  });

  const orbitColor = hovered ? '#88deff' : '#61dafb';
  const orbitOpacity = hovered ? 0.9 : 0.6;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="React" visible={hovered} />
      {/* Nucleus */}
      <Sphere args={[0.12, 16, 16]}>
        <meshStandardMaterial
          color="#61dafb"
          emissive="#61dafb"
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      {/* Electron orbits */}
      <Torus args={[0.4, 0.012, 8, 48]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color={orbitColor} transparent opacity={orbitOpacity} />
      </Torus>
      <Torus args={[0.4, 0.012, 8, 48]} rotation={[Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color={orbitColor} transparent opacity={orbitOpacity} />
      </Torus>
      <Torus args={[0.4, 0.012, 8, 48]} rotation={[-Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color={orbitColor} transparent opacity={orbitOpacity} />
      </Torus>
      {/* Orbiting electrons */}
      {[0, Math.PI / 3, -Math.PI / 3].map((tilt, i) => (
        <ElectronDot key={i} orbitRadius={0.4} tilt={tilt} speed={1.5 + i * 0.3} color="#61dafb" />
      ))}
    </group>
  );
}

// ─── Electron dot for React Atom ─────────────────────────────────────
function ElectronDot({ orbitRadius, tilt, speed, color }: { orbitRadius: number; tilt: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    const x = Math.cos(t) * orbitRadius;
    const y = Math.sin(t) * orbitRadius * Math.sin(tilt);
    const z = Math.sin(t) * orbitRadius * Math.cos(tilt);
    ref.current.position.set(x, y, z);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ─── TypeScript Icon ─────────────────────────────────────────────────
function TypeScriptIcon({ position, mouseX }: { position: [number, number, number]; mouseX: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const initialX = position[0];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.4;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + 1) * 0.12;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, initialX + mouseX * 0.35, 0.03);
    const s = hovered ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="TypeScript" visible={hovered} />
      <GlowRing visible={hovered} color="#3178c6" size={0.4} />
      {/* TS Shield */}
      <Box args={[0.5, 0.5, 0.12]} rotation={[0, 0, Math.PI / 12]}>
        <meshStandardMaterial
          color={hovered ? '#4a93e0' : '#3178c6'}
          metalness={0.85}
          roughness={0.15}
          emissive="#3178c6"
          emissiveIntensity={hovered ? 0.5 : 0.15}
        />
      </Box>
      {/* "TS" text using small boxes */}
      <Box args={[0.2, 0.04, 0.14]} position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 12]}>
        <meshBasicMaterial color="white" />
      </Box>
      <Box args={[0.04, 0.18, 0.14]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 12]}>
        <meshBasicMaterial color="white" />
      </Box>
    </group>
  );
}

// ─── Node.js Icon (Hexagon) ──────────────────────────────────────────
function NodeJSIcon({ position, mouseX }: { position: [number, number, number]; mouseX: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const initialX = position[0];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.3 + Math.sin(t * 0.5) * 0.2;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + 2) * 0.18;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, initialX + mouseX * 0.3, 0.03);
    const s = hovered ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="Node.js" visible={hovered} />
      <GlowRing visible={hovered} color="#68a063" size={0.45} />
      {/* Hexagon shape */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 6]} />
        <meshStandardMaterial
          color={hovered ? '#7ec87a' : '#68a063'}
          metalness={0.8}
          roughness={0.2}
          emissive="#68a063"
          emissiveIntensity={hovered ? 0.5 : 0.15}
        />
      </mesh>
      {/* Inner hexagon wireframe */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.14, 6]} />
        <meshBasicMaterial color="#68a063" wireframe transparent opacity={hovered ? 0.5 : 0.2} />
      </mesh>
    </group>
  );
}

// ─── Python Icon ─────────────────────────────────────────────────────
function PythonIcon({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.25;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.55 + 3) * 0.15;
    const s = hovered ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="Python" visible={hovered} />
      <GlowRing visible={hovered} color="#3776ab" size={0.45} />
      {/* Twin intertwined snakes represented as torus knots */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <torusGeometry args={[0.2, 0.06, 8, 24, Math.PI]} />
        <meshStandardMaterial
          color={hovered ? '#5a9fd4' : '#3776ab'}
          metalness={0.85}
          roughness={0.15}
          emissive="#3776ab"
          emissiveIntensity={hovered ? 0.5 : 0.15}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI, 0]} position={[0, -0.08, 0]}>
        <torusGeometry args={[0.2, 0.06, 8, 24, Math.PI]} />
        <meshStandardMaterial
          color={hovered ? '#ffe873' : '#ffd43b'}
          metalness={0.85}
          roughness={0.15}
          emissive="#ffd43b"
          emissiveIntensity={hovered ? 0.5 : 0.15}
        />
      </mesh>
      {/* Eyes */}
      <Sphere args={[0.035, 8, 8]} position={[-0.1, 0.16, 0.08]}>
        <meshBasicMaterial color="white" />
      </Sphere>
      <Sphere args={[0.035, 8, 8]} position={[0.1, -0.16, -.08]}>
        <meshBasicMaterial color="white" />
      </Sphere>
    </group>
  );
}

// ─── Database Icon ───────────────────────────────────────────────────
function DatabaseIcon({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.2;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.45 + 4) * 0.12;
    const s = hovered ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="Database" visible={hovered} />
      <GlowRing visible={hovered} color="#47a248" size={0.4} />
      {/* Stacked cylinders to form DB icon */}
      {[-0.15, 0, 0.15].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.12, 16]} />
          <meshStandardMaterial
            color={hovered ? '#5fbf5e' : '#47a248'}
            metalness={0.7}
            roughness={0.3}
            emissive="#47a248"
            emissiveIntensity={hovered ? 0.4 : 0.1}
          />
        </mesh>
      ))}
      {/* Wireframe overlay */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.42, 16]} />
        <meshBasicMaterial color="#47a248" wireframe transparent opacity={hovered ? 0.4 : 0.1} />
      </mesh>
    </group>
  );
}

// ─── CI/CD Pipeline Visualization ────────────────────────────────────
function CICDPipeline({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.4 + 5) * 0.1;
    const s = hovered ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    if (pulseRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.1;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="CI/CD" visible={hovered} />
      {/* Pipeline stages interconnected */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color={['#e44d26', '#f7df1e', '#22c55e'][i]}
            emissive={['#e44d26', '#f7df1e', '#22c55e'][i]}
            emissiveIntensity={hovered ? 0.6 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      {/* Connection lines */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={`line-${i}`} position={[x, 0, 0]}>
          <boxGeometry args={[0.18, 0.02, 0.02]} />
          <meshBasicMaterial color={hovered ? '#ffffff' : '#888888'} transparent opacity={hovered ? 0.8 : 0.4} />
        </mesh>
      ))}
      {/* Pulsing glow */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={hovered ? 0.08 : 0.03} />
      </mesh>
    </group>
  );
}

// ─── Enhanced Central Core ───────────────────────────────────────────
function CentralCore({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.1;
      coreRef.current.rotation.y = t * 0.15;
    }
    if (ringRef.current) ringRef.current.rotation.z = t * 0.3;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.2;
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY * 0.15, 0.03);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.15, 0.03);
    }
    if (pulseRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.08;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Tooltip text="DevOps · Full Stack · Cloud" visible={hovered} />

      {/* Core icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={hovered ? 0.35 : 0.15}
          metalness={0.8}
          roughness={0.2}
          distort={hovered ? 0.5 : 0.4}
          speed={hovered ? 3 : 2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={hovered ? 0.12 : 0.06} />
      </mesh>

      {/* Primary ring */}
      <Torus ref={ringRef} args={[1.6, 0.02, 12, 60]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#22c55e" transparent opacity={0.7} emissive="#22c55e" emissiveIntensity={hovered ? 0.3 : 0.1} />
      </Torus>

      {/* Secondary ring (perpendicular) */}
      <Torus ref={ring2Ref} args={[1.8, 0.015, 12, 60]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.4} emissive="#8b5cf6" emissiveIntensity={hovered ? 0.3 : 0.1} />
      </Torus>

      {/* Orbiting energy particles on rings */}
      <OrbitalParticle radius={1.6} speed={0.8} tilt={Math.PI / 2} color="#22c55e" />
      <OrbitalParticle radius={1.6} speed={0.8} tilt={Math.PI / 2} color="#22c55e" offset={Math.PI} />
      <OrbitalParticle radius={1.8} speed={0.6} tilt={Math.PI / 4} color="#8b5cf6" />
    </group>
  );
}

// ─── Orbital Particle ────────────────────────────────────────────────
function OrbitalParticle({ radius, speed, tilt, color, offset = 0 }: { radius: number; speed: number; tilt: number; color: string; offset?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    const x = Math.cos(t) * radius;
    const y = Math.sin(t) * radius * Math.cos(tilt);
    const z = Math.sin(t) * radius * Math.sin(tilt);
    ref.current.position.set(x, y, z);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ─── Enhanced Data Particles with trails ─────────────────────────────
function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 80;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0, 0.83, 1],     // cyan
      [0.34, 0.77, 0.38], // green
      [0.55, 0.36, 0.96],  // purple
      [1, 0.6, 0],       // orange
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 0.012;
      if (pos[i * 3 + 1] < -9) pos[i * 3 + 1] = 9;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ─── Connection Lines between elements ───────────────────────────────
function ConnectionLines() {
  const ref = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const sources = [
      [-3, 0.5, -1], [3, -0.3, -1.5],
      [2.2, 2, -1], [-2.2, -1.2, -1],
      [0, 2.5, -1.5],
    ];
    // Connect each to center
    sources.forEach(([x, y, z]) => {
      pts.push(new THREE.Vector3(0, 0, 0));
      pts.push(new THREE.Vector3(x, y, z));
    });
    return pts;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.06} />
    </lineSegments>
  );
}

// ─── Nebula Background ──────────────────────────────────────────────
function NebulaCloud() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -15]}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial color="#0a0e1a" transparent opacity={0.5} />
    </mesh>
  );
}

// ─── Main Scene ──────────────────────────────────────────────────────
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

      {/* DevOps Tools */}
      <DockerContainer position={[-3.2, 0.5, -1]} mouseX={mouseX} />
      <DockerContainer position={[3.2, -0.3, -1.5]} mouseX={mouseX} />
      <KubernetesPod position={[2.2, 2.2, -1]} mouseX={mouseX} />
      <KubernetesPod position={[-2.5, -1.2, -1]} mouseX={mouseX} />
      <AWSCloud position={[0, 2.8, -1.5]} />

      {/* Programming Languages & Frameworks */}
      <ReactAtom position={[-2.8, 1.8, -0.5]} mouseX={mouseX} />
      <TypeScriptIcon position={[3, 1.5, -0.8]} mouseX={mouseX} />
      <NodeJSIcon position={[-3.5, -0.5, -1.2]} mouseX={mouseX} />
      <PythonIcon position={[2.8, -1.8, -0.8]} />
      <DatabaseIcon position={[-1.8, -2.2, -1]} />

      {/* CI/CD */}
      <CICDPipeline position={[1.5, -2.5, -1.2]} />

      {/* Git Nodes */}
      <GitNode position={[-2.2, 1.5, -0.8]} color="#f05032" label="Git" />
      <GitNode position={[2.5, 1.2, -1]} color="#22c55e" label="Merge" />
      <GitNode position={[-2, -1.5, -0.5]} color="#8b5cf6" label="Branch" />
      <GitNode position={[2.2, -1.3, -0.8]} color="#00d4ff" label="Deploy" />

      {/* Effects */}
      <DataParticles />
      <ConnectionLines />
      <NebulaCloud />
      <Stars radius={50} depth={40} count={600} factor={3} fade speed={0.3} />
    </group>
  );
}

function SceneWrapper() {
  const mouse = useMousePosition();
  return <Scene mouseX={mouse.x} mouseY={mouse.y} />;
}

// ─── Main Export ─────────────────────────────────────────────────────
export default function CloudScene() {
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleVisibility = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore...');
      setIsVisible(false);
    };
    const handleContextRestored = () => {
      console.log('WebGL context restored.');
      setIsVisible(true);
    };
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  if (!isVisible) return <div className="absolute inset-0 -z-10 bg-[#080d16]" />;

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        ref={(canvas) => {
          if (canvas) canvasRef.current = canvas as unknown as HTMLCanvasElement;
        }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <color attach="background" args={['#080d16']} />
        <fog attach="fog" args={['#080d16', 8, 28]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[8, 8, 8]} intensity={0.7} color="#00d4ff" />
        <pointLight position={[-8, -8, -8]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[0, 6, 4]} intensity={0.6} color="#22c55e" />
        <pointLight position={[-5, 3, 5]} intensity={0.3} color="#ff9900" />

        <SceneWrapper />


      </Canvas>
    </div>
  );
}
