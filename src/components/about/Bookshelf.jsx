// import { useMemo } from "react";
// import { RoundedBox } from "@react-three/drei";

// const COLORS = [
//   "#e63946",
//   "#f4a024",
//   "#f7d13a",
//   "#3fa34d",
//   "#2c7be5",
//   "#8b5cf6",
//   "#e63946",
//   "#f4a024",
//   "#1f6f8b",
//   "#d94f4f",
//   "#2b3a55",
//   "#f7b32b",
// ];

// function mulberry32(seed) {
//   return function () {
//     seed |= 0;
//     seed = (seed + 0x6d2b79f5) | 0;
//     let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
//     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }

// function Book({ w, h, d, color }) {
//   return (
//     <group>
//       <mesh castShadow>
//         <boxGeometry args={[w, h, d]} />
//         <meshStandardMaterial color={color} roughness={0.5} />
//       </mesh>
//       <mesh position={[w / 2 + 0.001, 0, 0]}>
//         <planeGeometry args={[d * 0.9, h * 0.88]} />
//         <meshStandardMaterial color="#f2e8d5" roughness={0.9} />
//       </mesh>
//     </group>
//   );
// }

// export default function Bookshelf({
//   position = [0, 0, 0],
//   rotation = [0, 0, 0],
//   width = 6,
//   height = 3,
//   depth = 1,
//   color = "#e2ac6f",
//   shelves = 5,
//   columns = 2,
//   seed = 1,
// }) {
//   const frame = 0.18;
//   const plank = 0.08;
//   const baseHeight = 0.22;
//   const innerWidth = width - frame * 2;
//   const innerHeight = height - frame * 2;
//   const colWidth = innerWidth / columns;
//   const rowHeight = (innerHeight - plank * (shelves - 1)) / shelves;

//   return (
//     <group position={position} rotation={rotation} scale={1.5}>
//       {/* Base débordante */}
//       <RoundedBox
//         args={[width + 0.3, baseHeight, depth + 0.3]}
//         radius={0.08}
//         smoothness={4}
//         position={[0, baseHeight / 2, 0]}
//         castShadow
//         receiveShadow
//       >
//         <meshStandardMaterial color={color} roughness={0.55} />
//       </RoundedBox>

//       {/* Montants */}
//       <RoundedBox
//         args={[frame, height, depth]}
//         radius={0.06}
//         smoothness={4}
//         position={[-width / 2 + frame / 2, baseHeight + height / 2, 0]}
//         castShadow
//       >
//         <meshStandardMaterial color={color} roughness={0.55} />
//       </RoundedBox>
//       <RoundedBox
//         args={[frame, height, depth]}
//         radius={0.06}
//         smoothness={4}
//         position={[width / 2 - frame / 2, baseHeight + height / 2, 0]}
//         castShadow
//       >
//         <meshStandardMaterial color={color} roughness={0.55} />
//       </RoundedBox>

//       {/* Séparateur central */}
//       {columns > 1 &&
//         Array.from({ length: columns - 1 }).map((_, i) => {
//           const x = -innerWidth / 2 + colWidth * (i + 1);
//           return (
//             <RoundedBox
//               key={i}
//               args={[frame, height, depth]}
//               radius={0.06}
//               smoothness={4}
//               position={[x, baseHeight + height / 2, 0]}
//               castShadow
//             >
//               <meshStandardMaterial color={color} roughness={0.55} />
//             </RoundedBox>
//           );
//         })}

//       {/* Haut */}
//       <RoundedBox
//         args={[width, frame, depth]}
//         radius={0.06}
//         smoothness={4}
//         position={[0, baseHeight + height - frame / 2, 0]}
//         castShadow
//       >
//         <meshStandardMaterial color={color} roughness={0.55} />
//       </RoundedBox>

//       {/* Planches + livres */}
//       {Array.from({ length: shelves }).map((_, row) => {
//         const yTop = baseHeight + frame + rowHeight * (row + 1) + plank * row;
//         const yBooks = baseHeight + frame + rowHeight * row + plank * row;

//         return (
//           <group key={row}>
//             {row < shelves - 1 && (
//               <RoundedBox
//                 args={[innerWidth, plank, depth]}
//                 radius={0.02}
//                 smoothness={4}
//                 position={[0, yTop, 0]}
//                 castShadow
//                 receiveShadow
//               >
//                 <meshStandardMaterial color={color} roughness={0.55} />
//               </RoundedBox>
//             )}
//           </group>
//         );
//       })}
//     </group>
//   );
// }
import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";

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

  return (
    <group position={position} rotation={rotation} scale={scale}>
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
    </group>
  );
}
