import { Text } from "@react-three/drei";
import { CREAM, PEACH } from "../../assets/json/Config";

export default function ContactTitle() {
  return (
    <group>
      <Text
        position={[0, 6.2, -13.62]}
        fontSize={1.2}
        color={CREAM}
        outlineWidth={0.02}
        outlineColor="#ffb48f"
        outlineBlur={0.15}
        anchorX="center"
        anchorY="middle"
      >
        Contact
      </Text>
      <Text
        position={[0, 5.25, -13.62]}
        fontSize={0.38}
        color={PEACH}
        anchorX="center"
        anchorY="middle"
      >
        Let's stay in touch
      </Text>
      <mesh position={[0, 4.85, -13.62]}>
        <boxGeometry args={[1.6, 0.05, 0.02]} />
        <meshBasicMaterial color="#ff9ec4" />
      </mesh>
    </group>
  );
}
