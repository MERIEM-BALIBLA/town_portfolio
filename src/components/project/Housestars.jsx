import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

const WHITE = "#f4f6fa";

// Une maison : corps, toit en deux pans, cheminée, fenêtre ronde, porte arrondie.
export function House({ color = "#6ea8f2", roofColor = "#8dbaf7", ...props }) {
  const rise = 0.65;
  const run = 0.95;
  const theta = Math.atan2(rise, run);
  const slabL = Math.hypot(rise, run) + 0.25;

  // pignon : prisme triangulaire qui comble le vide entre le corps et le toit
  const gableGeo = useMemo(() => {
    const tri = new THREE.Shape();
    tri.moveTo(-0.8, 1.3);
    tri.lineTo(0.8, 1.3);
    tri.lineTo(0, 1.98);
    tri.closePath();
    const g = new THREE.ExtrudeGeometry(tri, {
      depth: 1.5,
      bevelEnabled: false,
    });
    g.translate(0, 0, -0.75);
    return g;
  }, []);

  const body = <meshStandardMaterial color={color} roughness={0.45} />;
  const roof = <meshStandardMaterial color={roofColor} roughness={0.4} />;
  const white = <meshStandardMaterial color={WHITE} roughness={0.35} />;

  return (
    <group {...props}>
      {/* corps */}
      <RoundedBox
        args={[1.6, 1.4, 1.4]}
        radius={0.2}
        smoothness={4}
        position={[0, 0.7, 0]}
        castShadow
      >
        {body}
      </RoundedBox>

      {/* pignon sous le toit (plus de vide sur les côtés) */}
      <mesh geometry={gableGeo} castShadow>
        {body}
      </mesh>

      {/* toit : deux pans épais et arrondis */}
      <RoundedBox
        args={[slabL, 0.2, 1.75]}
        radius={0.09}
        smoothness={4}
        position={[-run / 2, 1.4 + rise / 2 + 0.06, 0]}
        rotation={[0, 0, theta]}
        castShadow
      >
        {roof}
      </RoundedBox>
      <RoundedBox
        args={[slabL, 0.2, 1.75]}
        radius={0.09}
        smoothness={4}
        position={[run / 2, 1.4 + rise / 2 + 0.06, 0]}
        rotation={[0, 0, -theta]}
        castShadow
      >
        {roof}
      </RoundedBox>

      {/* cheminée */}
      <RoundedBox
        args={[0.24, 0.7, 0.24]}
        radius={0.08}
        smoothness={4}
        position={[0.55, 1.95, -0.25]}
      >
        {roof}
      </RoundedBox>

      {/* fenêtre ronde à croisillon */}
      <group position={[0, 1.0, 0.7]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.07, 32]} />
          {white}
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.56, 0.045, 0.06]} />
          {body}
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.045, 0.56, 0.06]} />
          {body}
        </mesh>
      </group>

      {/* porte arrondie */}
      <RoundedBox
        args={[0.42, 0.72, 0.08]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.36, 0.7]}
      >
        {white}
      </RoundedBox>
      <mesh position={[0.13, 0.33, 0.75]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        {body}
      </mesh>
    </group>
  );
}

// Étoile arrondie, légèrement bombée
function Star({ color, size = 1, phase = 0, ...props }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const outer = 0.5;
    const inner = 0.24;
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.07,
      bevelSegments: 6,
    });
    g.center();
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    ref.current.rotation.y = Math.sin(t * 1.2) * 0.45;
    ref.current.position.y = Math.sin(t * 1.6) * 0.08;
  });

  return (
    <group {...props} scale={size}>
      <group ref={ref}>
        <mesh geometry={geo} castShadow>
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Props : color (maisons), roofColor, starColor, + props d'un <group> (position, rotation, scale).
 */
export default function HouseStars({
  color = "#6ea8f2",
  roofColor = "#8dbaf7",
  starColor = "#f9d94f",
  ...props
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    window.open(
      "https://meriembaliblatown-rho.vercel.app/",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <group {...props}>
      <group position={[0, 0.2, 0.5]}>
        {/* Titre au-dessus de la scène */}
        <Text
          position={[0, 1.5, 1]}
          fontSize={0.2}
          color="#3a4a6b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          My first little town
        </Text>
        {/* maison centrale */}
        <House color={color} roofColor={roofColor} />

        {/* petites maisons inclinées */}

        {/* étoiles */}
        <Star color={starColor} size={1.25} position={[0, 3.35, 0]} />
        <Star
          color={starColor}
          size={0.62}
          position={[-1.35, 2.85, 0]}
          rotation={[0, 0, 0.3]}
          phase={1.3}
        />
        <Star
          color={starColor}
          size={0.62}
          position={[1.35, 2.85, 0]}
          rotation={[0, 0, -0.3]}
          phase={2.4}
        />
      </group>
      <mesh position={[0, 0.012, 0.2]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.4, 0.5, 96]} />
        <meshStandardMaterial color="#cdb2a3" roughness={1} />
      </mesh>
    </group>
  );
}
