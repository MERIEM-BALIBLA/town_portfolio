import { useMemo } from "react";
import * as THREE from "three";
import { Text3D } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/*  Palette (tirée du logo)                                            */
/* ------------------------------------------------------------------ */
const TEAL = new THREE.Color("#10a99b");
const NAVY = new THREE.Color("#0b3f5c");
const INK = "#16364a";

/* Police 3D : remplace par une police géométrique (Outfit, Poppins…)
   convertie en .typeface.json via https://gero3.github.io/facetype.js/
   pour coller exactement au logo. */
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json";

/* ------------------------------------------------------------------ */
/*  Utilitaire : polygone aux coins arrondis                           */
/* ------------------------------------------------------------------ */
function roundedPolygon(points, radius = 0.12) {
  const shape = new THREE.Shape();
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const prev = new THREE.Vector2(...points[(i - 1 + n) % n]);
    const curr = new THREE.Vector2(...points[i]);
    const next = new THREE.Vector2(...points[(i + 1) % n]);
    const toPrev = prev.clone().sub(curr).normalize();
    const toNext = next.clone().sub(curr).normalize();
    const start = curr.clone().addScaledVector(toPrev, radius);
    const end = curr.clone().addScaledVector(toNext, radius);
    if (i === 0) shape.moveTo(start.x, start.y);
    else shape.lineTo(start.x, start.y);
    shape.quadraticCurveTo(curr.x, curr.y, end.x, end.y);
  }
  shape.closePath();
  return shape;
}

/* ------------------------------------------------------------------ */
/*  Une moitié de l'icône (extrudée, dégradé teal → navy)              */
/* ------------------------------------------------------------------ */
function IconHalf({ points, tealSide, depth = 0.45 }) {
  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(roundedPolygon(points), {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 6,
      curveSegments: 16,
    });
    geo.translate(0, 0, -depth / 2);

    // dégradé en couleurs de sommets, selon x
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // t = 1 côté teal, 0 côté navy
      let t = tealSide === "left" ? (-x - 0.1) / 0.9 : (x - 0.1) / 0.9;
      t = THREE.MathUtils.clamp(t, 0, 1);
      c.copy(NAVY).lerp(TEAL, t);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [points, tealSide, depth]);

  return (
    <mesh geometry={geometry} castShadow>
      <meshPhysicalMaterial
        vertexColors
        roughness={0.28}
        metalness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Icône : deux moitiés séparées par la barre diagonale               */
/* ------------------------------------------------------------------ */
// Ligne de coupe y = x ± 0.12  →  l'espace vide forme la "barre" blanche
const UPPER = [
  [-0.95, -0.83],
  [-0.95, 0.35],
  [-0.4, 0.95],
  [0.83, 0.95],
];
const LOWER = [
  [0.95, 0.83],
  [0.95, -0.35],
  [0.4, -0.95],
  [-0.83, -0.95],
];

function DashyIcon(props) {
  return (
    <group {...props}>
      <IconHalf points={UPPER} tealSide="left" />
      <IconHalf points={LOWER} tealSide="right" />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Logo complet                                                       */
/* ------------------------------------------------------------------ */
export default function DashyLogo({ position, rotation, scale }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <DashyIcon position={[-3.2, 0, 0]} scale={1.05} />
      <Text3D
        font={FONT_URL}
        size={1.6}
        height={0.4}
        curveSegments={16}
        bevelEnabled
        bevelThickness={0.04}
        bevelSize={0.03}
        bevelSegments={5}
        letterSpacing={0.02}
        position={[-1.6, -0.62, -0.2]}
        castShadow
      >
        Dashy
        <meshPhysicalMaterial
          color={INK}
          roughness={0.3}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </Text3D>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scène                                                              */
/* ------------------------------------------------------------------ */
