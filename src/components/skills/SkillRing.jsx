import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import SkillIcon from "./SkillIcon";
import { ICONS } from "./Skillicons";
import DevDesk from "./DevDesk";

const RING_ICONS = [
  ICONS.java,
  ICONS.react,
  ICONS.angular,
  ICONS.spring,
  ICONS.docker,
  ICONS.postgresql,
  ICONS.github,
  ICONS.laravel,
];

export default function SkillRing({ position = [0, 0, 0], radius = 3.6 }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.3;
  });

  return (
    <group position={position}>
      {/* bureau centré sur l'axe de l'anneau */}
      <DevDesk position={[0, 0, 0]} />

      {/* anneau d'icônes, au-dessus de la hauteur de l'écran */}
      <group ref={ref} position={[0, 2.6, 0]}>
        {RING_ICONS.map((icon, i) => {
          const a = (i / RING_ICONS.length) * Math.PI * 2;
          return (
            <group
              key={i}
              position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]}
              rotation={[0, a, 0]}
            >
              <mesh>
                <boxGeometry args={[0.9, 0.9, 0.06]} />
                <meshStandardMaterial color="#1b1f27" />
              </mesh>
              <SkillIcon icon={icon} size={0.55} position={[0, 0, 0.05]} />
              {/* verso */}
              <group rotation={[0, Math.PI, 0]}>
                <SkillIcon icon={icon} size={0.55} position={[0, 0, 0.05]} />
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}
