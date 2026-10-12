import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* Dégradé radial réutilisable pour les lueurs douces */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.5, "rgba(255,255,255,0.25)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
}

/* ---------- Bandeau LED sous le logo + reflet lumineux qui le balaie ---------- */
function LedStrip({ w, color }) {
  const texture = useGlowTexture();
  const sweep = useRef();
  const sweepMat = useRef();
  const light = useRef();

  const base = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0d3a4a",
        emissive: color,
        emissiveIntensity: 1.5,
        toneMapped: false,
      }),
    [color],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    base.emissiveIntensity = 1.5 + Math.sin(t * 1.3) * 0.4;

    // un reflet blanc traverse le bandeau toutes les 4 secondes
    const phase = (t % 4) / 4;
    if (sweep.current) sweep.current.position.x = -w / 2 + phase * w;
    if (sweepMat.current) sweepMat.current.opacity = Math.sin(phase * Math.PI);
    if (light.current) light.current.intensity = 2.2 + Math.sin(t * 1.3) * 0.6;
  });

  return (
    <group>
      <mesh material={base}>
        <boxGeometry args={[w, 0.07, 0.07]} />
      </mesh>

      <mesh ref={sweep} position-z={0.01}>
        <boxGeometry args={[w * 0.12, 0.1, 0.1]} />
        <meshBasicMaterial
          ref={sweepMat}
          color="#e8fbff"
          transparent
          toneMapped={false}
        />
      </mesh>

      {/* lueur diffuse sur le mur, sous le bandeau */}
      <mesh position={[0, -0.35, -0.02]}>
        <planeGeometry args={[w * 1.15, 1.8]} />
        <meshBasicMaterial
          map={texture}
          color={color}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={light}
        position={[0, -0.2, 1]}
        color={color}
        distance={7}
        intensity={2.2}
      />
    </group>
  );
}

/* ---------- Plaque "en poste actuellement" ---------- */
function LiveBadge({ label, sublabel, color }) {
  const ring = useRef();
  const ringMat = useRef();

  useFrame(({ clock }) => {
    const phase = (clock.elapsedTime % 1.8) / 1.8;
    if (ring.current) ring.current.scale.setScalar(1 + phase * 2);
    if (ringMat.current) ringMat.current.opacity = 0.7 * (1 - phase);
  });

  const width = Math.max(3.4, label.length * 0.2 + 1.2);
  const height = sublabel ? 0.95 : 0.7;
  const dotX = -width / 2 + 0.4;
  const textX = -width / 2 + 0.75;

  return (
    <group>
      {/* liseré cyan derrière la plaque */}
      <RoundedBox
        args={[width + 0.06, height + 0.06, 0.04]}
        radius={0.2}
        smoothness={6}
        position={[0, 0, -0.01]}
      >
        <meshBasicMaterial color={color} toneMapped={false} />
      </RoundedBox>
      <RoundedBox args={[width, height, 0.06]} radius={0.18} smoothness={6}>
        <meshStandardMaterial color="#10202c" roughness={0.6} />
      </RoundedBox>

      {/* point vert vivant */}
      <group position={[dotX, 0, 0.05]}>
        <mesh>
          <circleGeometry args={[0.09, 24]} />
          <meshBasicMaterial color="#4ade80" toneMapped={false} />
        </mesh>
        <mesh ref={ring}>
          <ringGeometry args={[0.09, 0.11, 32]} />
          <meshBasicMaterial
            ref={ringMat}
            color="#4ade80"
            transparent
            toneMapped={false}
          />
        </mesh>
      </group>

      <Text
        position={[textX, sublabel ? 0.14 : 0, 0.05]}
        fontSize={0.27}
        color="#e9fbff"
        anchorX="left"
        anchorY="middle"
      >
        {label}
      </Text>
      {sublabel && (
        <Text
          position={[textX, -0.17, 0.05]}
          fontSize={0.18}
          color="#8fb8c8"
          anchorX="left"
          anchorY="middle"
        >
          {sublabel}
        </Text>
      )}
    </group>
  );
}

/**
 * Effets "poste actuel" sous le logo Alexsys. Sans Canvas.
 * Même position/rotation que <AlexsysLogo />, légèrement devant le mur.
 * w = largeur du logo, h = hauteur du logo (les effets se placent dessous).
 */
export default function AlexsysCurrentEffects({
  w = 10.5,
  h = 4,
  color = "#38d4ff",
  label = "En poste actuellement",
  sublabel,
  children,
  ...props
}) {
  return (
    <group {...props}>
      <group position={[1.1, -h / 2 - 1.5, 0.05]}>
        <LedStrip w={w} color={color} />
      </group>
      {/* <group position={[0, -h / 2 - 1.9, 0.06]}>
        <LiveBadge label={label} sublabel={sublabel} color={color} />
      </group> */}
      {children}
    </group>
  );
}
