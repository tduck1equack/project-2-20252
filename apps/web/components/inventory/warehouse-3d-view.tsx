
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";

function Rack({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Vertical Posts */}
            <mesh position={[-1, 1.5, -0.5]}>
                <boxGeometry args={[0.1, 3, 0.1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[1, 1.5, -0.5]}>
                <boxGeometry args={[0.1, 3, 0.1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[-1, 1.5, 0.5]}>
                <boxGeometry args={[0.1, 3, 0.1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[1, 1.5, 0.5]}>
                <boxGeometry args={[0.1, 3, 0.1]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Shelves */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[2.2, 0.1, 1.2]} />
                <meshStandardMaterial color="#666" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[2.2, 0.1, 1.2]} />
                <meshStandardMaterial color="#666" />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
                <boxGeometry args={[2.2, 0.1, 1.2]} />
                <meshStandardMaterial color="#666" />
            </mesh>

            {/* Example Box Logic should be dynamic, hardcoded for visualization demo */}
            <mesh position={[-0.5, 1.8, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="orange" />
            </mesh>
            <mesh position={[0.5, 1.8, 0.2]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="blue" />
            </mesh>
        </group>
    );
}

export default function Warehouse3DView() {
    return (
        <div className="h-[500px] w-full rounded-lg border bg-slate-950">
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <OrbitControls makeDefault />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Grid args={[20, 20]} sectionSize={1} sectionColor={"#444"} cellColor={"#222"} />

                {/* Racks Layout */}
                <Rack position={[-2, 0, 0]} />
                <Rack position={[2, 0, 0]} />
                <Rack position={[-2, 0, -2]} />
                <Rack position={[2, 0, -2]} />

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
