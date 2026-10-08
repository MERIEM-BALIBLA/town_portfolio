import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { MathUtils } from "three";

function Window({ position, lit }) {
  const mat = useRef();

  useFrame((_, delta) => {
    // l'intensité glisse doucement vers 1.5 (allumé) ou 0 (éteint)
    mat.current.emissiveIntensity = MathUtils.damp(
      mat.current.emissiveIntensity,
      lit ? 1.5 : 0,
      4,
      delta,
    );
  });

  return (
    <mesh position={position}>
      <boxGeometry args={[1.2, 1.2, 0.1]} />
      <meshStandardMaterial
        ref={mat}
        color="#9fd3f0"
        emissive="#ffd479"
        emissiveIntensity={0}
      />
    </mesh>
  );
}

export default function House({
  position = [0, 0, 0],
  rotation = 0,
  open = false, // true = la maison "s'éveille"
  wall = "#f1e4c8",
  roof = "#b5533c",
}) {
  const door = useRef();

  useFrame((_, delta) => {
    door.current.rotation.y = MathUtils.damp(
      door.current.rotation.y,
      open ? -Math.PI / 2.2 : 0, // négatif = la porte s'ouvre vers l'extérieur
      4,
      delta,
    );
  });

  return (
    <group position={position} rotation-y={rotation}>
      {/* Murs */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[6, 4, 6]} />
        <meshStandardMaterial color={wall} />
      </mesh>

      {/* Toit */}
      <mesh position={[0, 5.3, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[4.6, 2.6, 4]} />
        <meshStandardMaterial color={roof} />
      </mesh>

      {/* Cheminée */}
      <mesh position={[-1.8, 5.2, -1.2]}>
        <boxGeometry args={[0.7, 2, 0.7]} />
        <meshStandardMaterial color="#8c8c8c" />
      </mesh>
      {open && (
        <Sparkles
          count={20}
          scale={[0.6, 2.5, 0.6]}
          position={[-1.8, 7.6, -1.2]}
          size={5}
          speed={0.6}
          color="#dddddd"
        />
      )}

      {/* Intérieur sombre derrière la porte */}
      <mesh position={[0, 1.1, 3.01]}>
        <planeGeometry args={[1.2, 2.2]} />
        <meshStandardMaterial color="#1b1b1b" />
      </mesh>

      {/* Porte : le group est la charnière, le mesh est décalé de la moitié de sa largeur */}
      <group ref={door} position={[-0.6, 0, 3.06]}>
        <mesh position={[0.6, 1.1, 0]}>
          <boxGeometry args={[1.2, 2.2, 0.1]} />
          <meshStandardMaterial color="#7a4a2b" />
        </mesh>
      </group>

      {/* Fenêtres */}
      <Window position={[-1.8, 1.6, 3.05]} lit={open} />
      <Window position={[1.8, 1.6, 3.05]} lit={open} />
    </group>
  );
}
