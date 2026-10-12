// DevDesk.jsx
import { Text } from "@react-three/drei";

export default function DevDesk({
  position = [0, 0, -2],
  rotation = [0, 0, 0],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tapis */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        receiveShadow
      >
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial color="#3a2a40" roughness={0.9} />
      </mesh>

      {/* Plateau */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.12, 1.8]} />
        <meshStandardMaterial color="#5a3f66" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Pieds */}
      {[
        [-1.8, -0.75],
        [1.8, -0.75],
        [-1.8, 0.75],
        [1.8, 0.75],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.5, z]} castShadow>
          <boxGeometry args={[0.12, 1, 0.12]} />
          <meshStandardMaterial
            color="#2a1f33"
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Écran */}
      <group position={[0, 1.06, -0.3]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#1b1f27" />
        </mesh>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[2.2, 1.3, 0.06]} />
          <meshStandardMaterial color="#1b1f27" />
        </mesh>
        <mesh position={[0, 1.0, 0.04]}>
          <planeGeometry args={[2.1, 1.2]} />
          <meshStandardMaterial
            color="#0f1b2d"
            emissive="#2b5278"
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[-0.9, 1.4, 0.05]}
          fontSize={0.1}
          color="#8be0a4"
          anchorX="left"
        >
          {"const dev = {"}
        </Text>
        <Text
          position={[-0.9, 1.2, 0.05]}
          fontSize={0.1}
          color="#ffd36b"
          anchorX="left"
        >
          {"  stack: 'Full-Stack',"}
        </Text>
        <Text
          position={[-0.9, 1.0, 0.05]}
          fontSize={0.1}
          color="#6bc6ff"
          anchorX="left"
        >
          {"  passion: true"}
        </Text>
        <Text
          position={[-0.9, 0.8, 0.05]}
          fontSize={0.1}
          color="#8be0a4"
          anchorX="left"
        >
          {"};"}
        </Text>
      </group>

      {/* Clavier */}
      <mesh position={[0, 1.09, 0.5]}>
        <boxGeometry args={[1.2, 0.04, 0.4]} />
        <meshStandardMaterial color="#2a1f33" />
      </mesh>

      {/* Lumière de l'écran */}
      <pointLight
        position={[0, 2, 0.5]}
        color="#6bc6ff"
        intensity={4}
        distance={7}
      />
    </group>
  );
}
