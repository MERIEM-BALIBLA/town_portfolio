import { useMemo } from "react";
import * as THREE from "three";

/* Dégradé radial pour les lueurs douces sur le mur */
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

/* ---------- Spot mural qui éclaire le mur vers le bas ---------- */
function SpotLamp({ x, color, reach = 3.8, texture }) {
  const target = useMemo(() => new THREE.Object3D(), []);

  return (
    <group position={[x, 0, 0]}>
      {/* bras de fixation */}
      <mesh position={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial color="#1b1b22" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* tête du spot */}
      <mesh position={[0, -0.16, 0.3]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 0.32, 24]} />
        <meshStandardMaterial
          color="#1b1b22"
          roughness={0.45}
          metalness={0.5}
        />
      </mesh>
      {/* ampoule LED */}
      <mesh position={[0, -0.325, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.11, 24]} />
        <meshBasicMaterial
          color={color}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* lumière réelle */}
      <primitive object={target} position={[0, -reach, 0.02]} />
      <spotLight
        position={[0, -0.33, 0.3]}
        target={target}
        color={color}
        intensity={30}
        distance={9}
        angle={0.5}
        penumbra={1}
      />

      {/* traînée de lumière visible sur le mur */}
      <mesh position={[0, -reach * 0.5, -0.07]}>
        <planeGeometry args={[2.2, reach * 1.5]} />
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
    </group>
  );
}

/**
 * Liseré LED + spots muraux le long du haut d'un mur. Sans Canvas.
 * length : longueur du mur
 * lamps  : positions des spots le long du mur (coordonnée locale x)
 * Le groupe doit regarder vers l'intérieur de la pièce (z local = vers la pièce).
 */
export default function WallLeds({
  length = 18,
  lamps = [],
  color = "#ffc58a",
  ...props
}) {
  const texture = useGlowTexture();

  return (
    <group {...props}>
      {/* liseré LED continu */}
      <mesh>
        <boxGeometry args={[length, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#3a2a1a"
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* lueur diffuse sous le liseré */}
      <mesh position={[0, -0.5, -0.07]}>
        <planeGeometry args={[length, 1.2]} />
        <meshBasicMaterial
          map={texture}
          color={color}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {lamps.map((x) => (
        <SpotLamp key={x} x={x} color={color} texture={texture} />
      ))}
    </group>
  );
}
