import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text, useCursor } from "@react-three/drei";
import { CREAM, PEACH } from "./../../assets/json/Config";

export default function GlassCard({
  position,
  rotation,
  label,
  sub,
  href,
  phase = 0,
  children,
}) {
  const group = useRef();
  const icon = useRef();
  const glass = useRef();
  const disc = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    g.scale.setScalar(
      THREE.MathUtils.damp(g.scale.x, hovered ? 1.05 : 1, 8, dt),
    );
    g.position.z = THREE.MathUtils.damp(
      g.position.z,
      position[2] + (hovered ? 0.35 : 0),
      8,
      dt,
    );
    g.position.y = position[1] + Math.sin(t * 1.2 + phase) * 0.05;
    icon.current.rotation.y = Math.sin(t * 1.1 + phase) * 0.25;
    glass.current.opacity = THREE.MathUtils.damp(
      glass.current.opacity,
      hovered ? 0.5 : 0.3,
      8,
      dt,
    );
    disc.current.opacity = THREE.MathUtils.damp(
      disc.current.opacity,
      hovered ? 0.3 : 0,
      8,
      dt,
    );
  });

  const open = (e) => {
    e.stopPropagation();
    if (href.startsWith("mailto:")) window.location.href = href;
    else window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <group
      rotation={rotation}
      ref={group}
      position={position}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={open}
    >
      {/* Bordure + verre */}
      <RoundedBox
        args={[3.68, 3.98, 0.1]}
        radius={0.38}
        smoothness={4}
        position={[0, 0, -0.02]}
      >
        <meshStandardMaterial
          color="#ffe9e2"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </RoundedBox>
      <RoundedBox args={[3.6, 3.9, 0.12]} radius={0.35} smoothness={4}>
        <meshPhysicalMaterial
          ref={glass}
          color="#f5d3d6"
          transparent
          opacity={0.3}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.2}
          depthWrite={false}
        />
      </RoundedBox>

      {/* Icône */}
      <group ref={icon} position={[0, 0.75, 0.3]}>
        {children}
      </group>

      {/* Textes */}
      <Text
        position={[0, -0.45, 0.1]}
        fontSize={0.34}
        color={CREAM}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, -0.85, 0.1]}
        fontSize={0.17}
        color={PEACH}
        anchorX="center"
        anchorY="middle"
      >
        {sub}
      </Text>

      {/* Bouton flèche */}
      <mesh position={[0, -1.4, 0.08]}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial ref={disc} color={CREAM} transparent opacity={0} />
      </mesh>
      <mesh position={[0, -1.4, 0.08]}>
        <torusGeometry args={[0.25, 0.018, 12, 48]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <Text
        position={[0, -1.4, 0.1]}
        fontSize={0.26}
        color={CREAM}
        anchorX="center"
        anchorY="middle"
      >
        →
      </Text>
    </group>
  );
}
