import { useMemo, useRef, useState } from "react";
import { Html, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const C = {
  rug: "#cdb2a3",
  chair: "#c4477f",
  chairSeat: "#d4608f",
  pouf: "#5c3a80",
  wood: "#d89a55",
  leg: "#1b1b22",
  pot: "#f4f1ee",
  leaf: "#3f8f4a",
};

/* ---------- Fauteuil lounge ---------- */
function Armchair(props) {
  const legs = [
    [-0.32, -0.26],
    [0.32, -0.26],
    [-0.32, 0.26],
    [0.32, 0.26],
  ];
  return (
    <group {...props}>
      {/* pieds en bois évasés */}
      {legs.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, 0.15, z]}
          rotation={[z * 0.25, 0, -x * 0.25]}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.018, 0.3, 12]} />
          <meshStandardMaterial color={C.wood} roughness={0.5} />
        </mesh>
      ))}

      {/* assise */}
      <RoundedBox
        args={[0.86, 0.14, 0.8]}
        radius={0.06}
        smoothness={5}
        position={[0, 0.34, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={C.chair} roughness={0.9} />
      </RoundedBox>

      {/* coussin d'assise */}
      <RoundedBox
        args={[0.62, 0.12, 0.62]}
        radius={0.05}
        smoothness={5}
        position={[0, 0.47, 0.04]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={C.chairSeat} roughness={1} />
      </RoundedBox>

      {/* dossier incliné */}
      <RoundedBox
        args={[0.86, 0.72, 0.16]}
        radius={0.07}
        smoothness={5}
        position={[0, 0.78, -0.36]}
        rotation={[-0.18, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={C.chair} roughness={0.9} />
      </RoundedBox>

      {/* accoudoirs */}
      {[-1, 1].map((s) => (
        <RoundedBox
          key={s}
          args={[0.12, 0.3, 0.7]}
          radius={0.05}
          smoothness={5}
          position={[s * 0.5, 0.55, -0.02]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={C.chair} roughness={0.9} />
        </RoundedBox>
      ))}
    </group>
  );
}

/* ---------- Plante ---------- */
function Plant(props) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        a: (i / 11) * Math.PI * 2 + (i % 2) * 0.3,
        tilt: 0.35 + (i % 3) * 0.25,
        s: 0.85 + ((i * 37) % 10) / 40,
      })),
    [],
  );
  return (
    <group {...props}>
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.075, 0.14, 32]} />
        <meshStandardMaterial color={C.pot} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.092, 0.092, 0.01, 32]} />
        <meshStandardMaterial color="#3a2a22" roughness={1} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} rotation={[0, l.a, 0]} position={[0, 0.14, 0]}>
          <group rotation={[0, 0, l.tilt]}>
            <mesh
              position={[0, 0.11 * l.s, 0]}
              scale={[0.028, 0.13 * l.s, 0.012]}
              castShadow
            >
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color={C.leaf} roughness={0.6} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/* ---------- Laptop provisoire (à remplacer par ton Apple) ---------- */
function LaptopPlaceholder() {
  return (
    <mesh castShadow position={[0, 0.0125, 0]}>
      <boxGeometry args={[0.42, 0.025, 0.3]} />
      <meshStandardMaterial color="#232845" roughness={0.35} metalness={0.5} />
    </mesh>
  );
}

/* ---------- Table basse ---------- */
function CoffeeTable({ children, ...props }) {
  const legs = [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2 + Math.PI / 4);
  return (
    <group {...props}>
      <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.06, 64]} />
        <meshStandardMaterial color={C.wood} roughness={0.55} />
      </mesh>
      {legs.map((a, i) => (
        <group key={i} rotation={[0, a, 0]}>
          <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -0.14]} castShadow>
            <cylinderGeometry args={[0.022, 0.016, 0.62, 12]} />
            <meshStandardMaterial
              color={C.leg}
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
        </group>
      ))}
      <Plant position={[-0.12, 0.65, -0.1]} />

      {/* Emplacement du laptop : dessus de la table */}
      <group position={[0.15, 0.65, 0.15]} rotation={[0, 0.35, 0]}>
        {children ?? <LaptopPlaceholder />}
      </group>
    </group>
  );
}

/**
 * Coin lounge, sans Canvas ni lumières : à poser dans une <Section>.
 * Les enfants (<Laptop />, <Apple />...) sont placés sur la table.
 */
// export default function LoungeCorner({ position, scale, children, ...props }) {
//   return (
//     <group {...props} position={position} scale={scale}>
//       {/* tapis rond */}
//       <mesh position={[0, 0.012, 0.2]} receiveShadow>
//         <cylinderGeometry args={[2.4, 2.4, 0.024, 96]} />
//         <meshStandardMaterial color={C.rug} roughness={1} />
//       </mesh>

//       {/* fauteuil tourné vers la table */}
//       <Armchair position={[-1.6, 0.02, -0.2]} rotation={[0, 1.15, 0]} />

//       <CoffeeTable position={[0.3, 0.02, 0.5]}>{children}</CoffeeTable>

//       <RoundedBox
//         args={[0.75, 0.62, 0.75]}
//         radius={0.14}
//         smoothness={6}
//         position={[1.6, 0.33, -0.25]}
//         rotation={[0, 0.2, 0]}
//         castShadow
//         receiveShadow
//       >
//         <meshStandardMaterial color={C.pouf} roughness={0.95} />
//       </RoundedBox>
//     </group>
//   );
// }
export default function LoungeCorner({
  position,
  scale,
  children,
  active = false,
  onSelect,
  data,
  ...props
}) {
  const tableRef = useRef();
  const [hovered, setHovered] = useState(false);

  // la table grossit au survol et davantage quand elle est ouverte
  useFrame(() => {
    const target = active ? 1.3 : hovered ? 1.08 : 1;
    const s = tableRef.current.scale.x;
    tableRef.current.scale.setScalar(s + (target - s) * 0.15);
  });

  return (
    <group {...props} position={position} scale={scale}>
      {/* tapis rond */}
      <mesh position={[0, 0.012, 0.2]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.4, 0.024, 96]} />
        <meshStandardMaterial color={C.rug} roughness={1} />
      </mesh>

      {/* fauteuil tourné vers la table */}
      <Armchair position={[-1.6, 0.02, -0.2]} rotation={[0, 1.15, 0]} />

      {/* table cliquable (le groupe est centré sur la table pour grossir sur place) */}
      <group
        ref={tableRef}
        position={[0.3, 0, 0.5]}
        onClick={(e) => {
          e.stopPropagation();
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
        <CoffeeTable position={[0, 0.02, 0]}>{children}</CoffeeTable>
      </group>

      <RoundedBox
        args={[0.75, 0.62, 0.75]}
        radius={0.14}
        smoothness={6}
        position={[1.6, 0.33, -0.25]}
        rotation={[0, 0.2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={C.pouf} roughness={0.95} />
      </RoundedBox>

      {/* carte des tâches */}
      {active && data && (
        <Html
          position={[0.3, 2.3, 0.5]}
          center
          distanceFactor={9}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              width: 500,
              padding: "14px 18px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.97)",
              border: "1px solid #e5e0e8",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              fontFamily: "system-ui, sans-serif",
              color: "#1b1f27",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 18,
                fontWeight: 600,
                color: "#8a3b12",
              }}
            >
              <span>{data.period}</span>
              <span>{data.place}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
              {data.company}
            </div>
            <div style={{ fontSize: 18, color: "#666" }}>{data.role}</div>
            <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 18 }}>
              {data.tasks.map((t) => (
                <li key={t} style={{ marginBottom: 3 }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Html>
      )}
    </group>
  );
}
