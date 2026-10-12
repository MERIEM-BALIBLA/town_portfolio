import { useMemo, useState } from "react";
import { RoundedBox, Html } from "@react-three/drei";

const COLORS = [
  "#3b2a6b",
  "#5b3fa0",
  "#7a52c7",
  "#2d2250",
  "#8a6bd1",
  "#4a3578",
  "#6b4a3a",
  "#a07850",
];

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Book({ position, size: [w, h, d], color, rotZ = 0 }) {
  return (
    <group position={position} rotation={[0, 0, rotZ]}>
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      {/* Liseré sur le dos du livre */}
      <mesh position={[0, h * 0.25, d / 2 + 0.002]}>
        <planeGeometry args={[w * 0.9, h * 0.06]} />
        <meshStandardMaterial color="#e8d9b5" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Lamp({ position }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#ffe2a8"
          emissive="#ffc46b"
          emissiveIntensity={1.6}
        />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.05, 16]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.6} />
      </mesh>
      <pointLight color="#ffb866" intensity={0.8} distance={3} />
    </group>
  );
}

export default function Bookshelf({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.4,
  height = 4.4,
  depth = 0.8,
  color = "#d9a96a",
  shelves = 4,
  columns = 1,
  seed = 3,
  scale = [1, 2, 1],

  onSelect, // ⬅️ ajouté : callback au clic
  active = false,
}) {
  const frame = 0.12; // montants + haut
  const plank = 0.07; // planches
  const divider = 0.1; // séparateurs verticaux
  const baseH = 0.2; // socle
  const backT = 0.04; // panneau arrière

  const innerW = width - frame * 2;
  const innerBottom = baseH + plank;
  const innerTop = baseH + height - frame;
  const innerH = innerTop - innerBottom;
  const colW = (innerW - divider * (columns - 1)) / columns;
  const rowH = (innerH - plank * (shelves - 1)) / shelves;

  const colCenterX = (c) => -innerW / 2 + c * (colW + divider) + colW / 2;
  const rowFloorY = (r) => innerBottom + r * (rowH + plank);

  // Contenu généré (livres, lampe)
  const items = useMemo(() => {
    const rand = mulberry32(seed);
    const out = [];
    const pick = () => COLORS[Math.floor(rand() * COLORS.length)];

    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < shelves; r++) {
        const cx = colCenterX(c);
        const x0 = cx - colW / 2 + 0.06;
        const xMax = cx + colW / 2 - 0.06;
        const floorY = rowFloorY(r);
        const kind = rand();
        const bd = depth * (0.6 + rand() * 0.15);
        const z = -depth / 2 + backT + bd / 2 + 0.03;

        if (r === 1) {
          // Livres à gauche + lampe à droite
          let x = x0;
          const limit = x0 + colW * 0.4;
          while (x < limit) {
            const bw = 0.1 + rand() * 0.1;
            const bh = rowH * (0.62 + rand() * 0.28);
            out.push({
              type: "book",
              position: [x + bw / 2, floorY + bh / 2, z],
              size: [bw, bh, bd],
              color: pick(),
            });
            x += bw + 0.005;
          }
          out.push({
            type: "lamp",
            position: [xMax - 0.3, floorY + 0.4, z],
          });
        } else if (kind < 0.6) {
          // Livres debout, éventuellement un penché
          let x = x0;
          const limit = x0 + colW * (0.45 + rand() * 0.35);
          while (x < limit && x < xMax - 0.2) {
            const bw = 0.1 + rand() * 0.1;
            const bh = rowH * (0.62 + rand() * 0.3);
            out.push({
              type: "book",
              position: [x + bw / 2, floorY + bh / 2, z],
              size: [bw, bh, bd],
              color: pick(),
            });
            x += bw + 0.005;
          }
          if (rand() < 0.5) {
            const bh = rowH * 0.75;
            out.push({
              type: "book",
              position: [x + 0.17, floorY + bh / 2 - 0.02, z],
              size: [0.12, bh, bd],
              color: pick(),
              rotZ: -0.25,
            });
          }
        } else if (kind < 0.9) {
          // Pile de livres à plat
          const n = 2 + Math.floor(rand() * 2);
          let y = floorY;
          for (let i = 0; i < n; i++) {
            const bl = colW * (0.55 + rand() * 0.25);
            const bt = 0.1 + rand() * 0.05;
            out.push({
              type: "book",
              position: [x0 + bl / 2 + rand() * 0.05, y + bt / 2, z],
              size: [bl, bt, bd],
              color: pick(),
            });
            y += bt;
          }
        }
        // sinon: étagère vide
      }
    }
    return out;
  }, [seed, columns, shelves, width, height, depth]); // eslint-disable-line

  const wood = <meshStandardMaterial color={color} roughness={0.55} />;

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isOpen = active || open;
  return (
    // <group position={position} rotation={rotation} scale={scale}>
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
        onSelect?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Socle */}
      <RoundedBox
        args={[width + 0.2, baseH, depth + 0.2]}
        radius={0.05}
        smoothness={4}
        position={[0, baseH / 2, 0]}
        castShadow
        receiveShadow
      >
        {wood}
      </RoundedBox>

      {/* Panneau arrière */}
      <mesh
        position={[0, baseH + height / 2, -depth / 2 + backT / 2]}
        receiveShadow
      >
        <boxGeometry args={[width - 0.02, height, backT]} />
        <meshStandardMaterial color="#8a6a45" roughness={0.8} />
      </mesh>

      {/* Montants gauche / droite */}
      {[-1, 1].map((s) => (
        <RoundedBox
          key={s}
          args={[frame, height, depth]}
          radius={0.03}
          smoothness={4}
          position={[s * (width / 2 - frame / 2), baseH + height / 2, 0]}
          castShadow
        >
          {wood}
        </RoundedBox>
      ))}

      {/* Séparateurs entre colonnes */}
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <RoundedBox
          key={i}
          args={[divider, innerH, depth]}
          radius={0.02}
          smoothness={4}
          position={[
            -innerW / 2 + (i + 1) * colW + i * divider + divider / 2,
            innerBottom + innerH / 2,
            0,
          ]}
          castShadow
        >
          {wood}
        </RoundedBox>
      ))}

      {/* Dessus */}
      <RoundedBox
        args={[width, frame, depth]}
        radius={0.03}
        smoothness={4}
        position={[0, baseH + height - frame / 2, 0]}
        castShadow
      >
        {wood}
      </RoundedBox>

      {/* Planche du bas */}
      <RoundedBox
        args={[innerW, plank, depth]}
        radius={0.02}
        smoothness={4}
        position={[0, baseH + plank / 2, 0]}
        receiveShadow
      >
        {wood}
      </RoundedBox>

      {/* Planches intermédiaires */}
      {Array.from({ length: shelves - 1 }).map((_, r) => (
        <RoundedBox
          key={r}
          args={[innerW, plank, depth]}
          radius={0.02}
          smoothness={4}
          position={[0, rowFloorY(r) + rowH + plank / 2, 0]}
          castShadow
          receiveShadow
        >
          {wood}
        </RoundedBox>
      ))}

      {/* Livres + lampe */}
      {items.map((it, i) =>
        it.type === "lamp" ? (
          <Lamp key={i} position={it.position} />
        ) : (
          <Book key={i} {...it} />
        ),
      )}

      {isOpen && (
        <Html
          position={[2, height * 0.01 + 2.6, 4]}
          center
          distanceFactor={10}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              position: "relative",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div
              style={{
                width: 340,
                padding: "16px 20px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.98)",
                border: "2px solid #1b1b22",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                color: "#1b1f27",
                position: "relative",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8a3b12" }}>
                Mobile App — Professional Project
              </div>

              <div style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.45 }}>
                Contributed to the development of a company mobile application
                using <b>Flutter</b>. The app aims to improve user experience
                and integrate mobile features with backend services. Screenshots
                and source code cannot be shared due to confidentiality.
              </div>

              <div style={{ fontSize: 12, marginTop: 10, color: "#555" }}>
                <b>Role</b> — Mobile Developer
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  marginTop: 6,
                  color: "#3a2a5a",
                  fontWeight: 600,
                }}
              >
                Flutter • REST API • Mobile UI Development
              </div>

              {/* Petits ronds de la bulle */}
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  bottom: -14,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "2px solid #1b1b22",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -18,
                  bottom: -30,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "2px solid #1b1b22",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -28,
                  bottom: -44,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "2px solid #1b1b22",
                }}
              />
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
