import { useMemo } from "react";
import * as THREE from "three";

/* =====================================================================
   Vase : vase orange avec lignes ondulées crème + tiges et feuilles.
   Origine = centre du fond du vase (pose-le sur le sol / une étagère).
   Hauteur du vase ≈ 1.5, avec la plante ≈ 2.8 (avant `scale`).
   Face avant du vase = +z (les lignes ondulées sont de ce côté).
   Props:
     color      : couleur du vase
     lineColor  : couleur des lignes ondulées
     plant      : false => vase vide
   ===================================================================== */

/* Profil du vase (rayon, hauteur) -> lissé avec une spline */
const PROFILE = new THREE.SplineCurve([
  new THREE.Vector2(0.0, 0.0),
  new THREE.Vector2(0.35, 0.01),
  new THREE.Vector2(0.7, 0.2),
  new THREE.Vector2(0.95, 0.5),
  new THREE.Vector2(0.9, 0.8),
  new THREE.Vector2(0.55, 1.1),
  new THREE.Vector2(0.36, 1.25),
  new THREE.Vector2(0.38, 1.38),
  new THREE.Vector2(0.46, 1.48),
]).getPoints(80);

/* rayon du vase à une hauteur y (interpolation sur le profil) */
function radiusAt(y) {
  for (let i = 1; i < PROFILE.length; i++) {
    const a = PROFILE[i - 1];
    const b = PROFILE[i];
    if (y >= a.y && y <= b.y) {
      const t = (y - a.y) / Math.max(b.y - a.y, 1e-6);
      return a.x + (b.x - a.x) * t;
    }
  }
  return PROFILE[PROFILE.length - 1].x;
}

/* lignes ondulées sur la face avant */
const WAVES = [
  { y0: 1.02, slope: -0.05, amp: 0.07, phase: 0 },
  { y0: 0.76, slope: -0.05, amp: 0.09, phase: 0.5 },
  { y0: 0.34, slope: 0.12, amp: 0.07, phase: 0 },
  { y0: 0.13, slope: 0.1, amp: 0.06, phase: 1 },
];

/* tiges (courbes 2D dans le plan XY) + angle autour de Y pour les disperser */
const STEMS = [
  {
    pts: [
      [-0.05, 1.3],
      [-0.25, 1.65],
      [-0.6, 1.95],
      [-0.95, 2.15],
    ],
    az: 0.25,
  },
  {
    pts: [
      [-0.03, 1.3],
      [-0.12, 1.8],
      [-0.1, 2.3],
      [0.03, 2.7],
    ],
    az: -0.35,
  },
  {
    pts: [
      [0.04, 1.3],
      [0.14, 1.8],
      [0.3, 2.2],
      [0.5, 2.5],
    ],
    az: 0.5,
  },
  {
    pts: [
      [0.08, 1.3],
      [0.4, 1.7],
      [0.8, 1.95],
      [1.15, 2.12],
    ],
    az: -0.15,
  },
];

const LEAF_COLORS = ["#6fb85a", "#9bd16f", "#58a64c", "#86c864"];

export default function Vase({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#f0a64f",
  lineColor = "#fbe9a8",
  plant = true,
}) {
  /* forme d'une feuille pointue, longueur 1 */
  const leafGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.28, 0.2, 0.3, 0.7, 0, 1);
    s.bezierCurveTo(-0.3, 0.7, -0.28, 0.2, 0, 0);
    return new THREE.ShapeGeometry(s, 12);
  }, []);

  /* lignes ondulées en tubes collés à la surface */
  const waveGeos = useMemo(
    () =>
      WAVES.map(({ y0, slope, amp, phase }) => {
        const pts = [];
        for (let i = 0; i <= 40; i++) {
          const u = (i / 40) * 2 - 1; // -1 .. 1
          const theta = u * 1.15;
          const y = y0 + slope * u + amp * Math.sin(u * Math.PI + phase);
          const r = radiusAt(y) + 0.006;
          pts.push(
            new THREE.Vector3(r * Math.sin(theta), y, r * Math.cos(theta)),
          );
        }
        return new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(pts),
          60,
          0.012,
          6,
        );
      }),
    [],
  );

  /* tiges + feuilles */
  const stems = useMemo(
    () =>
      STEMS.map(({ pts, az }, si) => {
        const curve = new THREE.CatmullRomCurve3(
          pts.map(([x, y]) => new THREE.Vector3(x, y, 0)),
        );
        const tube = new THREE.TubeGeometry(curve, 40, 0.014, 6);
        const leaves = [];
        const ts = [0.4, 0.55, 0.7, 0.85];
        ts.forEach((t, i) => {
          const p = curve.getPoint(t);
          const tan = curve.getTangent(t);
          const base = Math.atan2(tan.y, tan.x);
          const side = i % 2 === 0 ? 1 : -1;
          const phi = base + side * 0.75;
          leaves.push({
            pos: [p.x, p.y, 0],
            rz: phi - Math.PI / 2,
            len: 0.5 + ((i + si) % 3) * 0.06,
            tilt: side * 0.45,
            color: LEAF_COLORS[(i + si) % LEAF_COLORS.length],
          });
        });
        // feuille au bout de la tige
        const tip = curve.getPoint(1);
        const tt = curve.getTangent(1);
        leaves.push({
          pos: [tip.x, tip.y, 0],
          rz: Math.atan2(tt.y, tt.x) - Math.PI / 2,
          len: 0.55,
          tilt: 0.2,
          color: LEAF_COLORS[(si + 1) % LEAF_COLORS.length],
        });
        return { tube, leaves, az };
      }),
    [],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* corps du vase */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[PROFILE, 64]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* fond sombre dans le goulot (donne de la profondeur) */}
      <mesh position={[0, 1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.37, 32]} />
        <meshStandardMaterial color="#3a2616" roughness={1} />
      </mesh>

      {/* lignes ondulées crème */}
      {waveGeos.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial color={lineColor} roughness={0.5} />
        </mesh>
      ))}

      {/* plante */}
      {plant &&
        stems.map((s, si) => (
          <group key={si} rotation={[0, s.az, 0]}>
            <mesh geometry={s.tube} castShadow>
              <meshStandardMaterial color="#1f2a3a" roughness={0.6} />
            </mesh>
            {s.leaves.map((l, li) => (
              <group key={li} position={l.pos} rotation={[0, 0, l.rz]}>
                <mesh
                  geometry={leafGeo}
                  scale={[l.len, l.len, 1]}
                  rotation={[0, l.tilt, 0]}
                  castShadow
                >
                  <meshStandardMaterial
                    color={l.color}
                    roughness={0.65}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}
    </group>
  );
}
