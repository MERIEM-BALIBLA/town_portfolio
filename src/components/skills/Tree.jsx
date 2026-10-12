// Composant de scène : à utiliser DANS un <Canvas> existant.
// Arbre stylisé type "toy" : tronc en bois brun + 3 grandes feuilles plates.
// Le point (0,0,0) est au sol, au centre du tronc.
import { useMemo } from "react";
import * as THREE from "three";

// -------- Palette --------
const BARK_COLOR = "#9c5a2e"; // brun tronc
const BARK_DARK = "#7a4520"; // brun foncé (nervures du tronc)
const LEAF_TOP = "#6dd45a"; // vert vif (feuille du haut)
const LEAF_LEFT = "#a8e34a"; // vert-jaune (feuille gauche)
const LEAF_RIGHT = "#2e8b46"; // vert foncé (feuille droite)

// -------- Matériaux --------
function barkMat() {
  return (
    <meshStandardMaterial
      color={BARK_COLOR}
      roughness={0.75}
      metalness={0.05}
    />
  );
}

function leafMat(color) {
  return (
    <meshStandardMaterial color={color} roughness={0.55} metalness={0.0} />
  );
}

/**
 * Une feuille : forme de goutte (amande) en ExtrudeGeometry,
 * avec une nervure centrale et des nervures latérales.
 */
function Leaf({
  color,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  // -------- forme de la feuille --------
  const leafGeo = useMemo(() => {
    const s = new THREE.Shape();
    // Forme d'amande pointue en haut, arrondie en bas
    s.moveTo(0, 0);
    s.bezierCurveTo(0.45, 0.25, 0.55, 0.75, 0, 1.1);
    s.bezierCurveTo(-0.55, 0.75, -0.45, 0.25, 0, 0);
    s.closePath();

    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 6,
      curveSegments: 32,
    });
    geo.center();
    return geo;
  }, []);

  // -------- nervure centrale (légèrement en relief) --------
  const veinGeo = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, -0.45, 0.09),
      new THREE.Vector3(0, 0.1, 0.12),
      new THREE.Vector3(0, 0.5, 0.09),
    );
    return new THREE.TubeGeometry(curve, 16, 0.018, 8, false);
  }, []);

  // -------- nervures latérales (de chaque côté) --------
  const sideVeins = useMemo(() => {
    const veins = [];
    const ys = [0.25, 0.05, -0.15];
    ys.forEach((y, i) => {
      const length = 0.28 - i * 0.03;
      // gauche
      const cL = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, y, 0.1),
        new THREE.Vector3(-length * 0.5, y + 0.08, 0.12),
        new THREE.Vector3(-length, y + 0.12, 0.09),
      );
      veins.push(new THREE.TubeGeometry(cL, 8, 0.012, 6, false));
      // droite
      const cR = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, y, 0.1),
        new THREE.Vector3(length * 0.5, y + 0.08, 0.12),
        new THREE.Vector3(length, y + 0.12, 0.09),
      );
      veins.push(new THREE.TubeGeometry(cR, 8, 0.012, 6, false));
    });
    return veins;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* feuille */}
      <mesh geometry={leafGeo} castShadow>
        {leafMat(color)}
      </mesh>
      {/* nervure centrale */}
      <mesh geometry={veinGeo}>{leafMat(color)}</mesh>
      {/* nervures latérales */}
      {sideVeins.map((g, i) => (
        <mesh key={i} geometry={g}>
          {leafMat(color)}
        </mesh>
      ))}
    </group>
  );
}

/**
 * Props :
 *   ...props    position / rotation / scale sur le <group> racine
 */
export default function Tree(props) {
  // -------- géométrie du tronc : forme organique --------
  const trunkGeo = useMemo(() => {
    // Profil du tronc (rayon par niveau de hauteur), du bas vers le haut
    const profile = [
      { y: 0.0, r: 0.22 },
      { y: 0.15, r: 0.2 },
      { y: 0.3, r: 0.18 },
      { y: 0.45, r: 0.16 },
      { y: 0.55, r: 0.15 },
      { y: 0.7, r: 0.14 },
      { y: 0.85, r: 0.13 },
      { y: 1.0, r: 0.12 },
      { y: 1.1, r: 0.1 },
    ];

    // On construit un lathe (objet de révolution) à partir du profil
    const points = profile.map((p) => new THREE.Vector2(p.r, p.y));
    const geo = new THREE.LatheGeometry(points, 32);
    return geo;
  }, []);

  return (
    <group {...props}>
      {/* ---------- TRONC ---------- */}
      <mesh geometry={trunkGeo} castShadow receiveShadow>
        {barkMat()}
      </mesh>

      {/* petit nœud sur le côté gauche */}
      <mesh position={[-0.2, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={BARK_DARK} roughness={0.8} />
      </mesh>

      {/* ---------- NERVURES DU TRONC (lignes verticales) ---------- */}
      {[0.3, 1.2, 2.1, 3.0, 3.9, 4.8].map((angle, i) => {
        const a = angle;
        const x = Math.cos(a) * 0.16;
        const z = Math.sin(a) * 0.16;
        return (
          <mesh key={i} position={[x, 0.6, z]} rotation={[0, -a, 0]} castShadow>
            <boxGeometry args={[0.02, 0.9, 0.02]} />
            <meshStandardMaterial color={BARK_DARK} roughness={0.85} />
          </mesh>
        );
      })}

      {/* ---------- FEUILLES ---------- */}
      {/* Feuille du haut (verticale, la plus grande) */}
      <Leaf
        color={LEAF_TOP}
        scale={0.95}
        position={[0, 1.45, 0]}
        rotation={[0, 0, 0]}
      />
      {/* Feuille gauche (inclinée vers la gauche) */}
      <Leaf
        color={LEAF_LEFT}
        scale={0.9}
        position={[-0.55, 1.25, 0]}
        rotation={[0, 0, Math.PI * 0.28]}
      />
      {/* Feuille droite (inclinée vers la droite) */}
      <Leaf
        color={LEAF_RIGHT}
        scale={0.88}
        position={[0.55, 1.3, 0]}
        rotation={[0, 0, -Math.PI * 0.28]}
      />
    </group>
  );
}
