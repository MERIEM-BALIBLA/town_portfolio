import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

/* =====================================================================
   POSITION DE CHAQUE OBJET SUR LE BUREAU (unités internes du bureau)
   x  = le long du bureau  (-3 gauche -> +3 droite)
   z  = profondeur         (-0.85 fond -> +0.85 côté chaise)
   ry = rotation sur Y (radians)
   show: false => cache l'objet
   Surcharge possible: <DeskItems layout={{ plant: { x: 0 } }} />
   ===================================================================== */
export const DEFAULT_LAYOUT = {
  pencilCup: { x: -2.5, z: -0.45, ry: 0 },
  notebook: { x: -1.7, z: 0.4, ry: 0.2 },
  monitor: { x: -0.3, z: -0.5, ry: 0 },
  keyboard: { x: -0.3, z: 0.3, ry: 0 },
  mouse: { x: 0.55, z: 0.33, ry: 0 },
  plant: { x: 1.4, z: -0.5, ry: 0 },
  lamp: { x: 2.0, z: -0.5, ry: 0 },
  books: { x: 2.5, z: 0.1, ry: 0.1 },
};

/* ---------- Écran avec du code ---------- */
function useCodeTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 288;
    const g = c.getContext("2d");
    g.fillStyle = "#1a1530";
    g.fillRect(0, 0, 512, 288);
    g.fillStyle = "#231c40";
    g.fillRect(0, 0, 60, 288);
    g.fillStyle = "#2a2250";
    g.fillRect(0, 0, 512, 16);
    let s = 7;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    const cols = ["#8b7bff", "#4dd6c1", "#ff8fb1", "#f7d13a", "#9aa4d6"];
    for (let line = 0; line < 20; line++) {
      let x = 76 + Math.floor(rnd() * 4) * 18;
      const y = 30 + line * 12;
      const n = 2 + Math.floor(rnd() * 4);
      for (let i = 0; i < n; i++) {
        const w = 18 + rnd() * 60;
        g.fillStyle = cols[Math.floor(rnd() * cols.length)];
        g.fillRect(x, y, w, 5);
        x += w + 8;
      }
    }
    for (let i = 0; i < 12; i++) {
      g.fillStyle = "#5a4d99";
      g.fillRect(10, 28 + i * 14, 20 + (i % 3) * 8, 4);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Monitor() {
  const tex = useCodeTexture();
  return (
    <group scale={2}>
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[0.5, 0.03, 0.3]} />
        <meshStandardMaterial color="#1b1b22" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, -0.02]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.05]} />
        <meshStandardMaterial color="#1b1b22" roughness={0.5} />
      </mesh>
      <group position={[0, 0.72, 0]}>
        <RoundedBox
          args={[1.4, 0.82, 0.06]}
          radius={0.02}
          smoothness={3}
          castShadow
        >
          <meshStandardMaterial color="#14141b" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.3, 0.73]} />
          <meshStandardMaterial
            map={tex}
            emissiveMap={tex}
            emissive="#ffffff"
            emissiveIntensity={0.9}
            toneMapped={false}
          />
        </mesh>
        <pointLight
          position={[0, 0, 0.6]}
          color="#9d7bff"
          intensity={0.6}
          distance={3}
        />
      </group>
    </group>
  );
}

function Keyboard() {
  return (
    <group scale={2}>
      <RoundedBox
        args={[1.05, 0.04, 0.34]}
        radius={0.015}
        smoothness={3}
        position={[0, 0.02, 0]}
        castShadow
      >
        <meshStandardMaterial color="#202028" roughness={0.5} />
      </RoundedBox>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 14 }).map((__, k) => (
          <mesh
            key={`${r}-${k}`}
            position={[-0.47 + k * 0.0725, 0.05, -0.115 + r * 0.075]}
          >
            <boxGeometry args={[0.062, 0.02, 0.062]} />
            <meshStandardMaterial color="#2c2c38" roughness={0.6} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Mouse() {
  return (
    <mesh position={[0.7, 0.035, 0]} scale={[0.16, 0.08, 0.24]} castShadow>
      <sphereGeometry args={[1, 20, 14]} />
      <meshStandardMaterial color="#1f1f28" roughness={0.4} />
    </mesh>
  );
}

function PencilCup() {
  const pencils = [
    ["#ff8fb1", 0.12, 0.1],
    ["#4dd6c1", -0.1, 0.12],
    ["#f7d13a", 0.02, -0.14],
    ["#8b7bff", -0.04, 0.05],
  ];
  return (
    <group scale={1.5}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.24, 20, 1, true]} />
        <meshStandardMaterial
          color="#7a778c"
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.01, 20]} />
        <meshStandardMaterial color="#7a778c" />
      </mesh>
      {pencils.map(([c, tx, tz], i) => (
        <mesh
          key={i}
          position={[tx * 0.4, 0.3, tz * 0.4]}
          rotation={[tz, 0, -tx]}
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}
    </group>
  );
}

function SmallPlant() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        a: (i / 7) * Math.PI * 2,
        tilt: 0.6 + (i % 3) * 0.15,
        h: 0.22 + (i % 2) * 0.06,
      })),
    [],
  );
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.09, 0.2, 20]} />
        <meshStandardMaterial color="#5b4a78" roughness={0.6} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} rotation={[0, l.a, 0]} position={[0, 0.2, 0]}>
          <mesh
            position={[0.09, l.h * 0.6, 0]}
            rotation={[0, 0, -l.tilt]}
            scale={[0.05, l.h, 0.018]}
            castShadow
          >
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial
              color={i % 2 ? "#3fa34d" : "#2f8a40"}
              roughness={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DeskLamp() {
  return (
    <group>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.03, 20]} />
        <meshStandardMaterial color="#6b4a2b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.34, 8]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshStandardMaterial
          color="#ffe2a8"
          emissive="#ffc46b"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 0.42, 0]}
        color="#ffb866"
        intensity={1}
        distance={4}
      />
    </group>
  );
}

function BookStack() {
  const books = [
    ["#2d2250", 0.1, 0.62, 0.44, 0.0],
    ["#5b3fa0", 0.09, 0.58, 0.42, 0.08],
    ["#3b2a6b", 0.08, 0.6, 0.4, -0.05],
  ];
  let y = 0;
  return (
    <group>
      {books.map(([c, h, w, d, ry], i) => {
        const el = (
          <group key={i} position={[0, y + h / 2, 0]} rotation={[0, ry, 0]}>
            <mesh castShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={c} roughness={0.55} />
            </mesh>
            <mesh position={[0.005, 0, 0.005]}>
              <boxGeometry args={[w - 0.03, h - 0.025, d + 0.004]} />
              <meshStandardMaterial color="#efe3c8" roughness={0.9} />
            </mesh>
          </group>
        );
        y += h;
        return el;
      })}
    </group>
  );
}

function Notebook() {
  return (
    <RoundedBox
      args={[0.38, 0.03, 0.28]}
      radius={0.008}
      smoothness={3}
      position={[0, 0.015, 0]}
      castShadow
    >
      <meshStandardMaterial color="#2b2a4a" roughness={0.5} />
    </RoundedBox>
  );
}

function Place({ at, y = 0, children }) {
  if (!at || at.show === false) return null;
  return (
    <group position={[at.x ?? 0, y, at.z ?? 0]} rotation={[0, at.ry ?? 0, 0]}>
      {children}
    </group>
  );
}

/* =====================================================================
   DeskItems : uniquement les objets (pas de meuble).
   Origine = DESSUS du plateau, au centre du bureau.
   Devant (côté chaise) = +z. Déjà à l'échelle monde (pas besoin de scale={3}).
   ===================================================================== */
export default function DeskItems({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.2,
  layout = {},
}) {
  const L = Object.fromEntries(
    Object.keys(DEFAULT_LAYOUT).map((k) => [
      k,
      { ...DEFAULT_LAYOUT[k], ...(layout[k] || {}) },
    ]),
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Place at={L.pencilCup}>
        <PencilCup />
      </Place>
      <Place at={L.notebook}>
        <Notebook />
      </Place>
      <Place at={L.monitor}>
        <Monitor />
      </Place>
      <Place at={L.keyboard}>
        <Keyboard />
      </Place>
      <Place at={L.mouse}>
        <Mouse />
      </Place>
      <Place at={L.plant}>
        <SmallPlant />
      </Place>
      <Place at={L.lamp}>
        <DeskLamp />
      </Place>
      <Place at={L.books}>
        <BookStack />
      </Place>
    </group>
  );
}
