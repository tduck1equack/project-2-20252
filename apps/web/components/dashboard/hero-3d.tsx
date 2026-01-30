"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function WarehouseBox({
    position,
    size,
    color,
}: {
    position: [number, number, number];
    size: [number, number, number];
    color: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y =
                Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
        }
    });

    return (
        <mesh ref={meshRef} position={position} castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial
                color={color}
                metalness={0.3}
                roughness={0.4}
            />
        </mesh>
    );
}

function WarehouseScene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Floor */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -1, 0]}
                receiveShadow
            >
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Warehouse shelves - Row 1 */}
            <WarehouseBox position={[-2, 0, -2]} size={[1, 2, 0.5]} color="#3B82F6" />
            <WarehouseBox position={[-2, 0, 0]} size={[1, 2, 0.5]} color="#60A5FA" />
            <WarehouseBox position={[-2, 0, 2]} size={[1, 2, 0.5]} color="#3B82F6" />

            {/* Warehouse shelves - Row 2 */}
            <WarehouseBox position={[0, 0, -2]} size={[1, 1.5, 0.5]} color="#F97316" />
            <WarehouseBox position={[0, 0, 0]} size={[1, 2, 0.5]} color="#FB923C" />
            <WarehouseBox position={[0, 0, 2]} size={[1, 1.5, 0.5]} color="#F97316" />

            {/* Warehouse shelves - Row 3 */}
            <WarehouseBox position={[2, 0, -2]} size={[1, 2, 0.5]} color="#3B82F6" />
            <WarehouseBox position={[2, 0, 0]} size={[1, 1.5, 0.5]} color="#60A5FA" />
            <WarehouseBox position={[2, 0, 2]} size={[1, 2, 0.5]} color="#3B82F6" />

            {/* Floating boxes */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <WarehouseBox position={[3, 2, 0]} size={[0.5, 0.5, 0.5]} color="#22C55E" />
            </Float>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
                <WarehouseBox position={[-3, 1.5, 1]} size={[0.4, 0.4, 0.4]} color="#F97316" />
            </Float>
        </group>
    );
}

function LoadingFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export function Hero3D({ className }: { className?: string }) {
    return (
        <div className={`relative ${className}`}>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--background))] via-transparent to-transparent z-10 pointer-events-none" />

            <Canvas
                shadows
                camera={{ position: [6, 4, 6], fov: 45 }}
                className="!absolute inset-0"
            >
                <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />
                    <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3B82F6" />
                    <pointLight position={[5, 5, 5]} intensity={0.3} color="#F97316" />

                    {/* Scene */}
                    <WarehouseScene />

                    {/* Controls */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 2.2}
                        minPolarAngle={Math.PI / 4}
                    />

                    {/* Environment for reflections */}
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
