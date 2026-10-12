import Laptop from "./Laptop";
import Plant from "./Plant";

export default function Podium({ rugRadius = 5, ...props }) {
  return (
    <group {...props}>
      {/* Grand tapis */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[rugRadius, rugRadius, 0.05, 96]} />
        <meshStandardMaterial color="#c68d93" roughness={1} />
      </mesh>

      {/* Estrade */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2.25, 2.25, 0.12, 64]} />
        <meshStandardMaterial color="#3a2428" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.27, 0.04, 12, 96]} />
        <meshBasicMaterial color="#ffd4a8" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2.4, 2.4, 0.3, 64]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.5} />
      </mesh>
      {/* Lumière sous le plateau : éclaire le tapis sans refléter sur le dessus */}
      <pointLight
        position={[0, 0.2, 0]}
        color="#ffcfa0"
        intensity={8}
        distance={10}
      />

      {/* Dessus */}
      <Laptop position={[0.5, 0.45, 0.35]} rotation={[0, 0.3, 0]} scale={1.2} />
      <Plant position={[-1, 0.45, -0.5]} scale={0.7} potColor="#f1d9d4" />
    </group>
  );
}
