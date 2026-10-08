export default function CatBed({ position, scale }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial color="#5c5a66" roughness={1} />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#3d3b46" />
      </mesh>
      {/* chat */}
      <mesh position={[0, 0.08, 0]} scale={[1.2, 0.7, 1]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e9e4dc" />
      </mesh>
      <mesh position={[0.18, 0.12, 0.05]} castShadow>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#d6a46a" />
      </mesh>
    </group>
  );
}
