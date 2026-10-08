// import { useEffect, useState } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Html } from "@react-three/drei";
// import { Vector3 } from "three";
// import useKeys from "../utils/useKeys";

// const RADIUS = 2.5; // distance de déclenchement
// const tmp = new Vector3();

// export default function Station({
//   id,
//   position,
//   title,
//   north,
//   south,
//   playerRef,
//   focusRef,
// }) {
//   const keys = useKeys();
//   const [near, setNear] = useState(false);
//   const [view, setView] = useState(null); // null | "north" | "south"

//   useFrame(() => {
//     if (!playerRef.current) return;

//     tmp.set(position[0], 0, position[2]);
//     const isNear = tmp.distanceTo(playerRef.current.position) < RADIUS;
//     if (isNear !== near) setNear(isNear);

//     // Si le joueur a repris la main, on ferme la vue
//     if (view && focusRef.current?.owner !== id) setView(null);
//   });

//   useEffect(() => {
//     if (!near) return;

//     const goTo = (side) => {
//       focusRef.current = {
//         owner: id,
//         done: false,
//         dir: new Vector3(0, 0, side === "north" ? -1 : 1), // direction de la section
//         saved: focusRef.current?.saved ?? null, // garde la vue d'origine pour y revenir
//       };
//       setView(side);
//     };

//     // const onKey = (e) => {
//     //   if (e.repeat) return;
//     //   if (keys.current.ArrowLeft || keys.current.ArrowRight) return;
//     //   if (e.code === "ArrowUp") goTo("north");
//     //   else if (e.code === "ArrowDown") goTo("south");
//     // };
//     const onKey = (e) => {
//       if (e.repeat) return;
//       if (keys.current.ArrowUp || keys.current.ArrowDown) return; // ← changé
//       if (e.code === "ArrowRight")
//         goTo("north"); // ← changé
//       else if (e.code === "ArrowLeft") goTo("south"); // ← changé
//     };

//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [near, id, focusRef, keys]);

//   const current = view === "north" ? north : south;

//   return (
//     <group position={position}>
//       <mesh rotation-x={-Math.PI / 2}>
//         <circleGeometry args={[0.6, 28]} />
//         <meshStandardMaterial color={near ? "#ffd166" : "#ffffff"} />
//       </mesh>

//       {near && (
//         <Html position={[0, 4, 0]} center>
//           <div
//             style={{
//               background: "white",
//               padding: "10px 14px",
//               borderRadius: 8,
//               minWidth: 190,
//               textAlign: "center",
//               pointerEvents: "none",
//               fontFamily: "sans-serif",
//               fontSize: 13,
//             }}
//           >
//             {view ? (
//               <>
//                 <strong>{current.name}</strong>
//                 <div>{current.description}</div>
//                 <div style={{ opacity: 0.6, marginTop: 6 }}>
//                   ↑ ↓ pour continuer
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div>→ {north.name}</div>
//                 <strong style={{ display: "block", margin: "4px 0" }}>
//                   {title}
//                 </strong>
//                 <div>← {south.name}</div>
//               </>
//             )}
//           </div>
//         </Html>
//       )}
//     </group>
//   );
// }
import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import useKeys from "../utils/useKeys";

const RADIUS = 2.5;
const tmp = new Vector3();

export default function Station({
  id,
  position,
  title,
  north,
  south,
  playerRef,
  focusRef,
}) {
  const [near, setNear] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // menu ←/→ visible
  const [view, setView] = useState(null); // null | "north" | "south"

  // Détection de proximité
  useFrame(() => {
    if (!playerRef.current) return;
    tmp.set(position[0], 0, position[2]);
    const isNear = tmp.distanceTo(playerRef.current.position) < RADIUS;
    if (isNear !== near) setNear(isNear);

    // Si le joueur a repris la main, on ferme tout
    if (view && focusRef.current?.owner !== id) {
      setView(null);
      setMenuOpen(false);
    }
  });

  // Gestion clavier : Entrée ouvre le menu, ← / → choisit
  useEffect(() => {
    if (!near) {
      setMenuOpen(false);
      setView(null);
      return;
    }

    const onKey = (e) => {
      if (e.repeat) return;
      if (focusRef.current) return; // déjà engagé dans une station

      // --- Entrée : ouvrir le menu ---
      if (e.code === "Enter") {
        setMenuOpen(true);
        return;
      }

      // --- ← / → : choisir (seulement si le menu est ouvert) ---
      if (menuOpen) {
        if (e.code === "ArrowLeft") {
          focusRef.current = {
            owner: id,
            done: false,
            dir: new Vector3(0, 0, -1), // nord
            saved: null,
          };
          setView("north");
          setMenuOpen(false);
        } else if (e.code === "ArrowRight") {
          focusRef.current = {
            owner: id,
            done: false,
            dir: new Vector3(0, 0, 1), // sud
            saved: null,
          };
          setView("south");
          setMenuOpen(false);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [near, menuOpen, id, focusRef]);

  const current = view === "north" ? north : south;

  return (
    <group position={position}>
      {/* Marqueur au sol */}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.6, 28]} />
        <meshStandardMaterial color={near ? "#ffd166" : "#ffffff"} />
      </mesh>

      {/* Panneau d'info */}
      {near && (
        <Html position={[0, 4, 0]} center>
          <div
            style={{
              background: "white",
              padding: "12px 16px",
              borderRadius: 8,
              minWidth: 220,
              textAlign: "center",
              pointerEvents: "none",
              fontFamily: "sans-serif",
              fontSize: 13,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {view ? (
              // --- Vue "dans la station" ---
              <>
                <strong>{current.name}</strong>
                <div style={{ marginTop: 4 }}>{current.description}</div>
                <div style={{ opacity: 0.6, marginTop: 8 }}>↓ pour sortir</div>
              </>
            ) : menuOpen ? (
              // --- Menu de choix ---
              <>
                <div style={{ marginBottom: 6, opacity: 0.7 }}>
                  Choisir une direction
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    marginTop: 6,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 18 }}>←</div>
                    <div style={{ fontWeight: "bold" }}>{north.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18 }}>→</div>
                    <div style={{ fontWeight: "bold" }}>{south.name}</div>
                  </div>
                </div>
              </>
            ) : (
              // --- Invite ---
              <>
                <strong style={{ display: "block" }}>{title}</strong>
                <div style={{ opacity: 0.6, marginTop: 6 }}>
                  Appuyez sur Entrée
                </div>
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
