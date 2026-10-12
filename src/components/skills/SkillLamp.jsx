export default function SkillLamp({
  position = [0, 0, 0],
  scale,
  color = "#ffd9a0", // couleur de la lumière
  shadeColor = "#c9a0dc", // couleur de l'abat-jour
}) {
  return (
    <group position={position} scale={scale}>
      {/* Pied */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.12, 32]} />
        <meshStandardMaterial color="#2a1f33" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Tige */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2, 16]} />
        <meshStandardMaterial color="#2a1f33" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Abat-jour (ouvert en bas) */}
      <mesh position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.3, 0.6, 0.7, 32, 1, true]} />
        <meshStandardMaterial
          color={shadeColor}
          emissive={shadeColor}
          emissiveIntensity={0.35}
          side={2} // DoubleSide
          toneMapped={false}
        />
      </mesh>

      {/* Ampoule */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Lumière */}
      <pointLight
        position={[0, 2.2, 0]}
        color={color}
        intensity={6}
        distance={9}
        decay={2}
      />
    </group>
  );
}
