// import { useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
// import Desk from "../formation/Desk";
// import Chair from "../formation/Chair";

// const SEAT_SCALE = 3; // taille des tables (plus grand = plus gros)

// // Une table + sa chaise, cliquables ensemble (survol, saut et changement de couleur).
// export default function StudentSeat({ position, onSelect, scale }) {
//   const inner = useRef();
//   const hop = useRef(0);
//   const [active, setActive] = useState(false);
//   const [hovered, setHovered] = useState(false);

//   useFrame((_, delta) => {
//     hop.current = Math.max(0, hop.current - delta * 2.5);
//     inner.current.position.y = Math.sin(hop.current * Math.PI) * 0.35;
//     const target = SEAT_SCALE * (hovered ? 1.05 : 1);
//     const s = inner.current.scale.x + (target - inner.current.scale.x) * 0.2;
//     inner.current.scale.setScalar(s);
//   });

//   const handleClick = (e) => {
//     e.stopPropagation();
//     hop.current = 1;
//     setActive((a) => !a);
//     if (onSelect) onSelect();
//   };

//   return (
//     <group
//       scale={scale}
//       position={position}
//       onClick={handleClick}
//       onPointerOver={(e) => {
//         e.stopPropagation();
//         setHovered(true);
//         document.body.style.cursor = "pointer";
//       }}
//       onPointerOut={() => {
//         setHovered(false);
//         document.body.style.cursor = "auto";
//       }}
//     >
//       {/* rotation PI : les élèves regardent vers +z, donc vers le mur du tableau */}
//       <group ref={inner} rotation={[0, Math.PI, 0]} scale={SEAT_SCALE}>
//         <Desk
//           topColor={active ? "#e6b34a" : "#c8a27a"}
//           rotation={[0, Math.PI, 0]}
//         />
//         <Chair
//           position={[0, 0, 0.3]}
//           seatColor={active ? "#2fa56b" : "#550c5a"}
//         />
//       </group>
//     </group>
//   );
// }
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Desk from "../formation/Desk";
import Chair from "../formation/Chair";

const SEAT_SCALE = 3;

export default function StudentSeat({
  position,
  scale,
  active = false,
  onSelect,
  data,
}) {
  const inner = useRef();
  const hop = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    hop.current = Math.max(0, hop.current - delta * 2.5);
    inner.current.position.y = Math.sin(hop.current * Math.PI) * 0.35;
    const target = SEAT_SCALE * (hovered || active ? 1.05 : 1);
    const s = inner.current.scale.x + (target - inner.current.scale.x) * 0.2;
    inner.current.scale.setScalar(s);
  });

  const handleClick = (e) => {
    e.stopPropagation();
    hop.current = 1;
    onSelect?.();
  };

  return (
    <group
      scale={scale}
      position={position}
      onClick={handleClick}
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
      <group ref={inner} rotation={[0, Math.PI, 0]} scale={SEAT_SCALE}>
        <Desk
          topColor={active ? "#e6b34a" : "#c8a27a"}
          rotation={[0, Math.PI, 0]}
        />
        <Chair
          position={[0, 0, 0.3]}
          seatColor={active ? "#2fa56b" : "#550c5a"}
        />
      </group>

      {/* Carte de formation */}
      {active && data && (
        <Html
          position={[0, 3.2, 0]}
          center
          distanceFactor={9}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              width: 600,
              padding: "14px 18px",
              borderRadius: 12,
              background: "rgba(242, 216, 242, 0.97)",
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
                fontSize: 22,
                fontWeight: 600,
                color: "#8a3b12",
              }}
            >
              <span>{data.period}</span>
              <span>{data.place}</span>
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                marginTop: 6,
                color: "#6c6b6b",
              }}
            >
              {data.school}
            </div>
            <div style={{ fontSize: 27, marginTop: 4, color: "#7d7979" }}>
              {data.title}
            </div>
            <div style={{ fontSize: 25, color: "#888181", marginTop: 4 }}>
              {data.detail}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
