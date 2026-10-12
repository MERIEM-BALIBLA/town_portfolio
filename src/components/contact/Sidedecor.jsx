import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox, Text } from "@react-three/drei";

export function NeonPanel(props) {
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0, 5.4);
    s.lineTo(3.8, 6.6);
    s.lineTo(4.4, 0);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.4, bevelEnabled: false });
  }, []);

  return (
    <group {...props}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#6e4a42" roughness={0.8} />
      </mesh>
      <Text
        position={[2.0, 3.4, 0.42]}
        fontSize={0.62}
        lineHeight={1.05}
        color="#fff0e0"
        outlineWidth={0.015}
        outlineColor="#ffb48f"
        outlineBlur={0.12}
        anchorX="center"
        anchorY="middle"
      >
        {"Good\nThings\nAhead"}
      </Text>
      {/* Bande lumineuse au sol */}
      <mesh position={[2.2, 0.03, 0.9]}>
        <boxGeometry args={[4.8, 0.05, 0.1]} />
        <meshBasicMaterial color="#ffd4a8" />
      </mesh>
    </group>
  );
}

export function Planter(props) {
  return (
    <group {...props}>
      <RoundedBox
        args={[4.6, 1.0, 1.8]}
        radius={0.15}
        smoothness={3}
        position={[0, 0.5, 0]}
      >
        <meshStandardMaterial color="#a0707a" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 1.01, 0]}>
        <boxGeometry args={[4.3, 0.04, 1.5]} />
        <meshStandardMaterial color="#3a2a26" roughness={1} />
      </mesh>
      {[-1.7, -0.9, -0.1, 0.8, 1.6].map((x, i) => (
        <mesh
          key={x}
          position={[x, 1.35, (i % 2) * 0.25 - 0.1]}
          scale={[0.7, 0.55 + (i % 3) * 0.1, 0.6]}
        >
          <sphereGeometry args={[0.6, 14, 14]} />
          <meshStandardMaterial
            color={i % 2 ? "#2f7d4f" : "#46a46a"}
            roughness={0.8}
          />
        </mesh>
      ))}
      {/* Rocher */}
      <mesh position={[1.1, 1.2, 0.3]} scale={[0.7, 0.45, 0.55]}>
        <sphereGeometry args={[0.6, 10, 10]} />
        <meshStandardMaterial color="#8a8486" roughness={0.9} flatShading />
      </mesh>
      {/* Bande lumineuse au sol */}
      <mesh position={[0, 0.03, 1.0]}>
        <boxGeometry args={[4.8, 0.05, 0.1]} />
        <meshBasicMaterial color="#ffd4a8" />
      </mesh>
    </group>
  );
}
