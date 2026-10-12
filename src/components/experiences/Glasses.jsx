// Composant de scène : à utiliser DANS un <Canvas> existant (pas de Canvas ici).
import { useMemo } from "react";
import * as THREE from "three";

const W = 2.5; // largeur d'un verre
const H = 1.65; // hauteur d'un verre
const T = 0.2; // épaisseur de la monture
const GAP = 0.3; // espace entre les verres
const CX = W / 2 + GAP;

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2,
    y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function FrameMaterial({ color }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.28}
      metalness={0.05}
      clearcoat={0.8}
      clearcoatRoughness={0.2}
    />
  );
}

function Rim({ x, color }) {
  const { frameGeo, lensGeo } = useMemo(() => {
    const outer = roundedRect(W, H, 0.45);
    outer.holes.push(roundedRect(W - T * 2, H - T * 2, 0.3));
    const frameGeo = new THREE.ExtrudeGeometry(outer, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 4,
      curveSegments: 24,
    });
    frameGeo.translate(0, 0, -0.14);
    const lensGeo = new THREE.ShapeGeometry(
      roundedRect(W - T * 2 + 0.04, H - T * 2 + 0.04, 0.3),
      24,
    );
    return { frameGeo, lensGeo };
  }, []);

  return (
    <group position={[x, 0, 0]}>
      <mesh geometry={frameGeo}>
        <FrameMaterial color={color} />
      </mesh>
      <mesh geometry={lensGeo}>
        <meshPhysicalMaterial
          color="#cfe6f5"
          roughness={0.02}
          transmission={0.95}
          thickness={0.1}
          ior={1.45}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Bridge({ color }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.55, 0.35, 0),
        new THREE.Vector3(-0.2, 0.5, 0.02),
        new THREE.Vector3(0.2, 0.5, 0.02),
        new THREE.Vector3(0.55, 0.35, 0),
      ]),
    [],
  );
  return (
    <mesh scale={[1, 1, 1.4]}>
      <tubeGeometry args={[curve, 24, 0.09, 12, false]} />
      <FrameMaterial color={color} />
    </mesh>
  );
}

function Temple({ side, color }) {
  const x = side * (CX + W / 2 - 0.05);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, 0.45, -0.05),
        new THREE.Vector3(x + side * 0.15, 0.45, -1.5),
        new THREE.Vector3(x + side * 0.2, 0.42, -3.4),
        new THREE.Vector3(x + side * 0.15, 0.2, -4.3),
        new THREE.Vector3(x + side * 0.05, -0.25, -4.55),
      ]),
    [x, side],
  );
  return (
    <group>
      <mesh scale={[1, 1.35, 1]} position={[0, -0.16, 0]}>
        <tubeGeometry args={[curve, 64, 0.1, 12, false]} />
        <FrameMaterial color={color} />
      </mesh>
      <mesh position={[x, 0.45, -0.05]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <FrameMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Props : color, plus toutes les props d'un <group> (position, rotation, scale...).
 * Exemple : <Glasses color="#6b3f22" position={[0, 0, 0]} scale={0.5} />
 */
export default function Glasses({
  position,
  scale,
  color = "#0d0d0f",
  ...props
}) {
  return (
    <group {...props} position={position} scale={scale}>
      <Rim x={-CX} color={color} />
      <Rim x={CX} color={color} />
      <Bridge color={color} />
      <Temple side={-1} color={color} />
      <Temple side={1} color={color} />
    </group>
  );
}
