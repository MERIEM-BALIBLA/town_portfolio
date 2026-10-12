import { useMemo, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { Text3D } from "@react-three/drei";

/* =====================================================================
   COULEURS DU LOGO
   ===================================================================== */
const CYAN = "#4FC3E8";
const PURPLE = "#2D1B4E";
const ORANGE = "#F5A623";
const DARK = "#1a0f2e";
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json";
/* =====================================================================
   UTILS — points d'un hexagone flat-top inversé (sommet en haut)
   ===================================================================== */
function hexPoints(radius) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push([Math.cos(a) * radius, Math.sin(a) * radius]);
  }
  return pts;
}

function shapeFromPoints(pts) {
  const s = new THREE.Shape();
  pts.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  return s;
}

/* =====================================================================
   1) DEMI-HEXAGONE HAUT (cyan)
   Le bord inférieur dessine un "V" vers le bas (comme dans le logo)
   ===================================================================== */
function useTopHalfGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, 0);
    s.lineTo(-0.5, 0.866);
    s.lineTo(0.5, 0.866);
    s.lineTo(1, 0);
    // "V" au centre : on descend puis on remonte
    s.lineTo(0.55, 0);
    s.lineTo(0, -0.22);
    s.lineTo(-0.55, 0);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.12,
      bevelEnabled: false,
    });
  }, []);
}

/* =====================================================================
   2) DEMI-HEXAGONE BAS (violet) — symétrique, "V" vers le haut
   ===================================================================== */
function useBottomHalfGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, 0);
    s.lineTo(-0.5, -0.866);
    s.lineTo(0.5, -0.866);
    s.lineTo(1, 0);
    // "V" au centre vers le haut
    s.lineTo(0.55, 0);
    s.lineTo(0, 0.22);
    s.lineTo(-0.55, 0);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.12,
      bevelEnabled: false,
    });
  }, []);
}

/* =====================================================================
   3) MARQUE "AS" — dessinée avec des traits fins
   Le A : 2 traits obliques // Le S : courbe en TubeGeometry
   ===================================================================== */
function ASMark({ scale = 1 }) {
  const stroke = 0.035;

  const A_left = useMemo(
    () => new THREE.CylinderGeometry(stroke, stroke, 0.5, 8),
    [],
  );

  const A_right = useMemo(
    () => new THREE.CylinderGeometry(stroke, stroke, 0.5, 8),
    [],
  );

  const S_geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.2, 0),
      new THREE.Vector3(-0.04, 0.24, 0),
      new THREE.Vector3(-0.12, 0.1, 0),
      new THREE.Vector3(0.02, 0.02, 0),
      new THREE.Vector3(0.12, -0.08, 0),
      new THREE.Vector3(0.02, -0.22, 0),
      new THREE.Vector3(-0.12, -0.2, 0),
    ]);

    return new THREE.TubeGeometry(curve, 24, stroke, 8, false);
  }, []);

  return (
    <group scale={scale} rotation={[0, 0, Math.PI]}>
      {/* A gauche */}
      <mesh geometry={A_left} position={[0, 0, 0]} rotation={[0, 0, 0.24]}>
        <meshBasicMaterial color={CYAN} />
      </mesh>

      {/* A droite */}
      <mesh geometry={A_right} position={[0.18, 0, 0]} rotation={[0, 0, -0.24]}>
        <meshBasicMaterial color={CYAN} />
      </mesh>

      {/* S */}
      <mesh geometry={S_geom} position={[-0.14, 0, 0]}>
        <meshBasicMaterial color={CYAN} />
      </mesh>
    </group>
  );
}

/* =====================================================================
   4) HEXAGONE COMPLET
   ===================================================================== */
function HexagonMark({ size = 1 }) {
  const topGeom = useTopHalfGeometry();
  const bottomGeom = useBottomHalfGeometry();

  return (
    <group scale={[1, 1, 3]}>
      {/* Fond sombre intérieur */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.78, 6]} />
        <meshBasicMaterial color={DARK} />
      </mesh>

      {/* Demi-hexagone haut cyan */}
      <mesh geometry={topGeom}>
        <meshStandardMaterial color={CYAN} metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Demi-hexagone bas violet */}
      <mesh geometry={bottomGeom}>
        <meshStandardMaterial color={PURPLE} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* "AS" au centre, devant */}
      <group position={[0, 0, 0.15]}>
        <ASMark scale={1} />
      </group>
    </group>
  );
}

/* =====================================================================
   5) LOGO COMPLET + BARRE DE SUPPORT
   ===================================================================== */
export default function AlexsysLogo({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  showBar = true,
  barColor = PURPLE,
  barThickness = 0.08,
  barLength = 5.6, // largeur totale de la barre
  interactive = false,
  onPointerOver,
  onPointerOut,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  /* Hauteur approximative du contenu (logo) pour placer la barre dessous */
  const CONTENT_HEIGHT = 1.2;
  //   const barY = -CONTENT_HEIGHT / 2 - barThickness / 2 - 0.05;

  const handleOver = (e) => {
    if (!interactive) return;
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
    onPointerOver?.(e);
  };
  const handleOut = (e) => {
    if (!interactive) return;
    setHovered(false);
    document.body.style.cursor = "default";
    onPointerOut?.(e);
  };
  const handleClick = (e) => {
    if (!interactive) return;
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <group
      position={position}
      rotation={rotation}
      scale={hovered ? scale * 1.03 : scale}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      {/* ---------- HEXAGONE à gauche ---------- */}
      <group position={[-3.2, -0.5, -0.2]} scale={[1.5, 1.6, 1.5]}>
        <HexagonMark size={1} />
      </group>

      {/* ---------- ALEXSYS ---------- */}

      <Text3D
        font={FONT_URL}
        size={1}
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
        ALEXSYS
        <meshPhysicalMaterial
          color={CYAN}
          roughness={0.3}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </Text3D>
      {/* ---------- SOLUTIONS ---------- */}
      <Text
        position={[-1.5, -1.3, 0]}
        fontSize={0.7}
        color={ORANGE}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.12}
      >
        SOLUTIONS
      </Text>

      {/* ---------- BARRE DE SUPPORT ---------- */}
      {showBar && (
        <group position={[1.2, -1.8, 0]}>
          {/* Barre principale */}
          <mesh>
            <boxGeometry args={[barLength, barThickness, barThickness]} />
            <meshStandardMaterial
              color={barColor}
              metalness={0.6}
              roughness={0.3}
              emissive={barColor}
              emissiveIntensity={hovered ? 0.4 : 0.15}
            />
          </mesh>

          {/* Petit reflet cyan au-dessus de la barre */}
          <mesh position={[0, barThickness / 2 + 0.005, 0]}>
            <boxGeometry args={[barLength * 0.98, 0.008, barThickness * 0.9]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
}
