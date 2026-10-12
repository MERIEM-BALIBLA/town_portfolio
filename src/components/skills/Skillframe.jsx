import { Text } from "@react-three/drei";
import SkillIcon from "./SkillIcon";

export default function SkillFrame({
  name,
  icon,
  colors = ["#1b1f27", "#7c5c8a"],
  textColor = "#ffffff",
  size = 1,
}) {
  const DEPTH = 0.08;
  const front = DEPTH / 2 + 0.01;

  return (
    <group>
      {/* Liseré lumineux */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[size * 1.07, size * 1.07, DEPTH]} />
        <meshStandardMaterial
          //   color={colors[1]}
          //   emissive={colors[1]}
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Fond du cadre */}
      <mesh castShadow receiveShadow position={[0, 0, 0.005]}>
        <boxGeometry args={[size, size, DEPTH]} />
        <meshStandardMaterial
          color={colors[0]}
          roughness={0.45}
          metalness={0.2}
        />
      </mesh>

      {/* Icône centrée */}
      <SkillIcon
        icon={icon}
        // color={textColor}
        size={size * 0.58}
        position={[0, 0, front + 0.005]}
      />

      {/* Nom sous le cadre */}
      <Text
        position={[0, -size / 2 - 0.2, 0.02]}
        fontSize={0.15}
        color="#f6e9f4"
        anchorX="center"
        anchorY="middle"
        maxWidth={size * 1.3}
        textAlign="center"
      >
        {name}
      </Text>
    </group>
  );
}
