import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GraduationCap({
  position,
  scale,
  color = "#14181f",
  tasselColor = "#e0a526",
  board = 0.34,
  floatAmplitude = 0.02, // hauteur du va-et-vient (multipliée par scale)
  floatSpeed = 1.4, // vitesse du mouvement
  ...props
}) {
  const floater = useRef();
  const tassel = useRef();

  const boardT = 0.012;
  const crownH = 0.085;
  const crownR = board * 0.3;
  const boardY = crownH + boardT / 2;

  // Gland : cordon qui part du bouton, pend sur un coin du plateau
  const cord = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, boardY + boardT / 2 + 0.012, 0),
        new THREE.Vector3(
          board * 0.25,
          boardY + boardT / 2 + 0.008,
          board * 0.12,
        ),
        new THREE.Vector3(board * 0.5, boardY, board * 0.18),
        new THREE.Vector3(board * 0.52, boardY - 0.05, board * 0.2),
      ]),
    [board, boardY],
  );

  const tasselX = board * 0.52;
  const tasselZ = board * 0.2;
  const tasselY = boardY - 0.05;

  // Mouvement vertical + légère inclinaison + balancement du gland
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    floater.current.position.y = Math.sin(t * floatSpeed) * floatAmplitude;
    floater.current.rotation.z = Math.sin(t * floatSpeed * 0.7) * 0.03;
    tassel.current.rotation.z = Math.sin(t * floatSpeed * 1.3 + 1) * 0.12;
  });

  const dark = (
    <meshStandardMaterial color={color} roughness={0.85} metalness={0.02} />
  );
  const gold = (
    <meshStandardMaterial
      color={tasselColor}
      roughness={0.45}
      metalness={0.35}
    />
  );

  return (
    <group {...props} position={position} scale={scale}>
      <group ref={floater}>
        {/* calotte */}
        <mesh position={[0, crownH / 2, 0]} castShadow>
          <cylinderGeometry args={[crownR, crownR * 1.08, crownH, 32]} />
          {dark}
        </mesh>

        {/* plateau carré */}
        <mesh
          position={[0, boardY, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <boxGeometry args={[board, boardT, board]} />
          {dark}
        </mesh>

        {/* bouton central */}
        <mesh position={[0, boardY + boardT / 2 + 0.008, 0]}>
          <sphereGeometry args={[0.014, 16, 16]} />
          {gold}
        </mesh>

        {/* cordon */}
        <mesh>
          <tubeGeometry args={[cord, 32, 0.004, 8, false]} />
          {gold}
        </mesh>

        {/* gland : se balance autour de son point d'attache */}
        <group ref={tassel} position={[tasselX, tasselY + 0.05, tasselZ]}>
          <mesh position={[0, -0.062, 0]}>
            <sphereGeometry args={[0.011, 12, 12]} />
            {gold}
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.009, 0.016, 0.07, 14]} />
            {gold}
          </mesh>
        </group>
      </group>
    </group>
  );
}
