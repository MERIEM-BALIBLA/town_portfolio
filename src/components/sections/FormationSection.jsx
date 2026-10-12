import Section from "../Section";
import WallLeds from "../experiences/Wallleds";
import Blackboard from "../formation/Blackboard";
import Cabinet from "../formation/Cabinet"; // pas d'espace avant le guillemet
import GraduationCap from "../formation/Graduationcap";
import StudentSeat from "../formation/StudentSeat";
import { useGLTF } from "@react-three/drei";
import { FORMATIONS } from "../../assets/json/formationData";
import { useState } from "react";

// Précharge le modèle (optionnel, mais évite le temps d'attente)
useGLTF.preload("/models/clock.glb");

export default function FormationSection({ position }) {
  // useGLTF est un hook : il doit être appelé DANS le composant
  const { scene: clock } = useGLTF("/models/clock.glb");
  const [selected, setSelected] = useState(null);

  return (
    <Section position={position}>
      <mesh position={[0, 4, 14]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e8c1e2" />
      </mesh>

      <Blackboard
        position={[0, 3.5, 13.7]}
        rotation={[0, Math.PI, 0]}
        scale={3}
        text="Developer Full Stack Java/Angular, Web Developer PHP/Laravel, Mechatronics, Electromechanics, Mechanics"
      />

      <primitive
        object={clock}
        position={[0, 6.5, 13.7]}
        scale={0.012}
        rotation={[0, Math.PI, 0]}
      />

      <WallLeds
        position={[0, 7.6, 13.65]}
        rotation={[0, Math.PI, 0]}
        length={18}
        lamps={[4, -1, -6]}
      />

      {FORMATIONS.map((f) => (
        <StudentSeat
          key={f.id}
          scale={1.5}
          position={f.position}
          data={f}
          active={selected === f.id}
          onSelect={() => setSelected((cur) => (cur === f.id ? null : f.id))}
        />
      ))}
      <Cabinet
        scale={3}
        rotation={[0, Math.PI / 2, 0]}
        position={[-8, 0, -14]}
      />

      <GraduationCap position={[-8, 5, -14]} scale={8} />
    </Section>
  );
}
