import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Mouse position context for parallax
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mouse;
}

function CloudNode({ 
  position, 
  color, 
  size = 0.3,
  mouseX,
  mouseY,
  parallaxStrength = 0.3
}: { 
  position: [number, number, number]; 
  color: string; 
  size?: number;
  mouseX: number;
  mouseY: number;
  parallaxStrength?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useRef(position);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Parallax effect based on mouse position
      const targetX = initialPosition.current[0] + mouseX * parallaxStrength;
      const targetY = initialPosition.current[1] + mouseY * parallaxStrength;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
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

function ServerBlock({ 
  position,
  mouseX,
  mouseY,
  parallaxStrength = 0.2
}: { 
  position: [number, number, number];
  mouseX: number;
  mouseY: number;
  parallaxStrength?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const initialPosition = useRef(position);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Parallax effect
      const targetX = initialPosition.current[0] + mouseX * parallaxStrength;
      const targetY = initialPosition.current[1] + mouseY * parallaxStrength;
      
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.03);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.03);
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

function CentralOrb({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    
    if (groupRef.current) {
      // Subtle rotation based on mouse
      const targetRotX = mouseY * 0.2;
      const targetRotY = mouseX * 0.2;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
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
      </group>
    </Float>
  );
}

function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation plus mouse influence
      const baseRotation = state.clock.elapsedTime * 0.05;
      const mouseInfluence = mouseX * 0.1;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        baseRotation + mouseInfluence,
        0.02
      );
    }
  });

  const nodes = [
    { position: [-2.5, 1.5, -1] as [number, number, number], color: "#00d4ff", parallax: 0.4 },
    { position: [2.5, 1, -1.5] as [number, number, number], color: "#22c55e", parallax: 0.35 },
    { position: [-2, -1.5, -0.5] as [number, number, number], color: "#8b5cf6", parallax: 0.5 },
    { position: [2.2, -1.2, -1] as [number, number, number], color: "#00d4ff", parallax: 0.3 },
    { position: [0, 2.5, -2] as [number, number, number], color: "#22c55e", parallax: 0.25 },
    { position: [-3, 0, -2] as [number, number, number], color: "#8b5cf6", parallax: 0.2 },
    { position: [3, 0.5, -1.5] as [number, number, number], color: "#00d4ff", parallax: 0.45 },
  ];

  return (
    <group ref={groupRef}>
      <CentralOrb mouseX={mouseX} mouseY={mouseY} />
      
      {nodes.map((node, i) => (
        <CloudNode 
          key={i} 
          position={node.position} 
          color={node.color} 
          size={0.25 + Math.random() * 0.15}
          mouseX={mouseX}
          mouseY={mouseY}
          parallaxStrength={node.parallax}
        />
      ))}

      <ServerBlock 
        position={[-3.5, -0.5, -2]} 
        mouseX={mouseX} 
        mouseY={mouseY}
        parallaxStrength={0.15}
      />
      <ServerBlock 
        position={[3.5, 0.8, -2.5]} 
        mouseX={mouseX} 
        mouseY={mouseY}
        parallaxStrength={0.18}
      />

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

function SceneWrapper() {
  const mouse = useMousePosition();
  return <Scene mouseX={mouse.x} mouseY={mouse.y} />;
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
        
        <SceneWrapper />
      </Canvas>
    </div>
  );
}
