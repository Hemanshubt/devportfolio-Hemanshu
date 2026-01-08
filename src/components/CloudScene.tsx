import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

function CloudNode({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function ServerBlock({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <Box args={[0.8, 1.2, 0.4]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#1e3a5f" 
            metalness={0.9} 
            roughness={0.1}
          />
        </Box>
        {/* LED lights */}
        {[0.3, 0.1, -0.1, -0.3].map((y, i) => (
          <Sphere key={i} args={[0.03]} position={[0.35, y, 0.21]}>
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#00d4ff" : "#22c55e"} 
              emissive={i % 2 === 0 ? "#00d4ff" : "#22c55e"}
              emissiveIntensity={2}
            />
          </Sphere>
        ))}
      </group>
    </Float>
  );
}

function NetworkConnection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const lineRef = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2 + (Math.random() - 0.5),
        (start[1] + end[1]) / 2 + (Math.random() - 0.5),
        (start[2] + end[2]) / 2
      ),
      new THREE.Vector3(...end),
    ]);
    const points = curve.getPoints(20);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [start, end]);

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#00d4ff', transparent: true, opacity: 0.5 }))} ref={lineRef} />
  );
}

function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Torus args={[1.8, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#22c55e" 
          emissive="#22c55e"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Torus>
      <Torus args={[2.2, 0.015, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </Torus>
    </Float>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const nodes = [
    { position: [-2.5, 1.5, -1] as [number, number, number], color: "#00d4ff" },
    { position: [2.5, 1, -1.5] as [number, number, number], color: "#22c55e" },
    { position: [-2, -1.5, -0.5] as [number, number, number], color: "#8b5cf6" },
    { position: [2.2, -1.2, -1] as [number, number, number], color: "#00d4ff" },
    { position: [0, 2.5, -2] as [number, number, number], color: "#22c55e" },
    { position: [-3, 0, -2] as [number, number, number], color: "#8b5cf6" },
    { position: [3, 0.5, -1.5] as [number, number, number], color: "#00d4ff" },
  ];

  return (
    <group ref={groupRef}>
      <CentralOrb />
      
      {nodes.map((node, i) => (
        <CloudNode key={i} position={node.position} color={node.color} size={0.25 + Math.random() * 0.15} />
      ))}

      <ServerBlock position={[-3.5, -0.5, -2]} />
      <ServerBlock position={[3.5, 0.8, -2.5]} />

      {nodes.slice(0, 4).map((node, i) => (
        <NetworkConnection 
          key={i} 
          start={[0, 0, 0]} 
          end={node.position} 
        />
      ))}

      <Stars radius={50} depth={50} count={1000} factor={3} saturation={0} fade speed={1} />
    </group>
  );
}

export default function CloudScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#080d16']} />
        <fog attach="fog" args={['#080d16', 5, 25]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
        <pointLight position={[0, 5, 5]} intensity={0.4} color="#22c55e" />
        
        <Scene />
      </Canvas>
    </div>
  );
}
