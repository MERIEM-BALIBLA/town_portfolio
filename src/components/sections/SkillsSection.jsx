import Section from "../Section";
import { Text } from "@react-three/drei";

import Vase from "../skills/Vase";
import WallLeds from "../experiences/Wallleds";
import SkillGroup from "../skills/Skillgroup";
import { SKILL_GROUPS } from "../skills/Skillsdata";
import SkillRing from "../skills/SkillRing";
import DevDesk from "../skills/DevDesk";
import SkillLamp from "../skills/SkillLamp";

function CenterPedestal({ position = [0, 0, -5], scale, rotation }) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* socle */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.6, 0.9, 32]} />
        <meshStandardMaterial color="#3a2a40" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* liseré lumineux */}
      <mesh position={[0, 0.92, 0]}>
        <torusGeometry args={[1.4, 0.03, 8, 64]} />
        <meshStandardMaterial
          color="#c9a0dc"
          emissive="#c9a0dc"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
      {/* texte */}
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
      >
        BALIBLA Meriem
      </Text>
      <Text
        position={[0, 1.15, 0]}
        fontSize={0.18}
        color="#c9a0dc"
        anchorX="center"
      >
        Développeur Full-Stack
      </Text>
    </group>
  );
}
export default function SkillsSection({ position }) {
  return (
    <Section position={position}>
      {/* Mur de fond */}
      <mesh position={[0, 4, -14]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e8c1e2" />
      </mesh>

      <mesh position={[9, 4, -0.25]} receiveShadow>
        <boxGeometry args={[0.5, 8, 28]} />
        <meshStandardMaterial color="#e8c1e2" />
      </mesh>

      <WallLeds
        position={[0, 7.6, -13.4]}
        rotation={[0, Math.PI, 0]}
        length={17}
        lamps={[4, -4]}
      />

      <WallLeds
        position={[8.4, 7.6, -0.25]}
        rotation={[0, Math.PI / 2, 0]}
        length={26}
        lamps={[10, 0, -10]}
      />

      {/* Galerie de compétences (cadres sur les murs) */}
      {SKILL_GROUPS.map((group) => (
        <SkillGroup key={group.title} {...group} />
      ))}

      <Vase position={[-9, 0, -12.5]} />
      <CenterPedestal scale={1} position={[-8, 0, 15]} rotation={[0, 0, 0]} />

      <SkillRing position={[0, 0.5, 0]} />
      {/* <SkillLamp position={[-5, 0.5, -2]} scale={[1.5, 1.5, 1.5]} /> */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        receiveShadow
      >
        <circleGeometry args={[3.6, 64]} />
        <meshStandardMaterial color="#3a2a40" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 0]}>
        <ringGeometry args={[3.5, 4, 64]} />
        <meshStandardMaterial
          color="#c9a0dc"
          emissive="#841fb2"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <ringGeometry args={[3.5, 3.6, 64]} />
        <meshStandardMaterial
          color="#c9a0dc"
          emissive="#841fb2"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
    </Section>
  );
}
