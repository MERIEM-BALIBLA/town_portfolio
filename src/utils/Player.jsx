// import { useRef } from "react";
// import { useFrame, useThree } from "@react-three/fiber";
// import { Vector3 } from "three";
// import useKeys from "./useKeys";

// const SPEED = 8;
// const HALF_ROAD = 1.6;

// // Vue "face à la section"
// const FACE_BACK = 4; // la caméra est 4 unités derrière le joueur
// const FACE_HEIGHT = 4; // hauteur de la caméra
// const FACE_LOOK = 14; // on regarde 14 unités devant : l'intérieur de la section
// const FACE_LOOK_Y = 2;

// const forward = new Vector3();
// const right = new Vector3();
// const move = new Vector3();
// const goal = new Vector3();
// const UP = new Vector3(0, 1, 0);

// const isOnRoad = (x, z) =>
//   Math.abs(x) <= 40 &&
//   Math.abs(z) <= 40 &&
//   (Math.abs(z) <= HALF_ROAD ||
//     Math.abs(x + 14) <= HALF_ROAD ||
//     Math.abs(x - 14) <= HALF_ROAD);

// export default function Player({ playerRef, focusRef, start = [0, 0, 0] }) {
//   const keys = useKeys();
//   const camera = useThree((s) => s.camera);
//   const controls = useThree((s) => s.controls);
//   const back = useRef(null); // vue d'origine à retrouver quand on repart

//   useFrame((_, delta) => {
//     if (!controls) return;

//     const k = keys.current;
//     const g = focusRef.current;
//     const p = playerRef.current.position;
//     const t = 1 - Math.exp(-6 * delta); // doux, indépendant des FPS

//     // ---------- Une station a pris la main : on se retourne face à la section ----------
//     if (g) {
//       // ← ou → : on libère et on repart
//       if (k.ArrowUp || k.ArrowDown) {
//         // ← changé (au lieu de Left/Right)
//         back.current = g.saved;
//         focusRef.current = null;
//       } else {
//         // première image : on mémorise la vue d'origine
//         if (!g.saved) {
//           g.saved = back.current ?? {
//             offset: camera.position.clone().sub(controls.target),
//           };
//           back.current = null;
//         }

//         if (!g.done) {
//           // position actuelle de la caméra, mesurée AUTOUR DU JOUEUR
//           const ox = camera.position.x - p.x;
//           const oz = camera.position.z - p.z;
//           const r = Math.hypot(ox, oz);
//           const angle = Math.atan2(ox, oz);

//           // angle voulu : derrière le joueur, donc à l'opposé de la section
//           const want = Math.atan2(-g.dir.x, -g.dir.z);

//           // demi-tour par le chemin le plus court
//           let d = want - angle;
//           d = Math.atan2(Math.sin(d), Math.cos(d));

//           const nextAngle = angle + d * t;
//           const nextR = r + (FACE_BACK - r) * t;

//           camera.position.x = p.x + nextR * Math.sin(nextAngle);
//           camera.position.z = p.z + nextR * Math.cos(nextAngle);
//           camera.position.y += (FACE_HEIGHT - camera.position.y) * t;

//           // le regard va vers l'intérieur de la section
//           goal.set(
//             p.x + g.dir.x * FACE_LOOK,
//             FACE_LOOK_Y,
//             p.z + g.dir.z * FACE_LOOK,
//           );
//           controls.target.lerp(goal, t);

//           playerRef.current.rotation.y = Math.atan2(g.dir.x, g.dir.z);

//           if (
//             Math.abs(d) < 0.01 &&
//             Math.abs(nextR - FACE_BACK) < 0.05 &&
//             Math.abs(camera.position.y - FACE_HEIGHT) < 0.05
//           ) {
//             g.done = true;
//           }
//         }
//         return;
//       }
//     }

//     // ---------- Marche normale ----------
//     const f = (k.ArrowUp ? 1 : 0) - (k.ArrowDown ? 1 : 0);
//     const r = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);

//     if (f || r) {
//       camera.getWorldDirection(forward);
//       forward.y = 0;
//       forward.normalize();
//       right.crossVectors(forward, UP);

//       move
//         .set(0, 0, 0)
//         .addScaledVector(forward, f)
//         .addScaledVector(right, r)
//         .normalize();

//       const dx = move.x;
//       const dz = move.z;
//       const step = SPEED * Math.min(delta, 0.05);

//       let mx = 0;
//       let mz = 0;
//       if (isOnRoad(p.x + dx * step, p.z)) mx = dx * step;
//       if (isOnRoad(p.x + mx, p.z + dz * step)) mz = dz * step;

//       p.x += mx;
//       p.z += mz;
//       playerRef.current.rotation.y = Math.atan2(dx, dz);

//       camera.position.x += mx;
//       camera.position.z += mz;
//       controls.target.x += mx;
//       controls.target.z += mz;
//     }

//     // ---------- Retour doux vers la vue d'origine après une station ----------
//     if (back.current) {
//       goal.copy(p).add(back.current.offset);
//       camera.position.lerp(goal, t);
//       controls.target.lerp(p, t);

//       if (
//         camera.position.distanceTo(goal) < 0.05 &&
//         controls.target.distanceTo(p) < 0.05
//       ) {
//         back.current = null;
//       }
//     }
//   });

//   return (
//     <group ref={playerRef} position={start}>
//       <mesh position={[0, 0.9, 0]}>
//         <capsuleGeometry args={[0.4, 1, 4, 8]} />
//         <meshStandardMaterial color="#e63946" />
//       </mesh>
//       <mesh position={[0, 1.4, 0.4]}>
//         <boxGeometry args={[0.3, 0.3, 0.3]} />
//         <meshStandardMaterial color="#ffffff" />
//       </mesh>
//     </group>
//   );
// }
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import useKeys from "./useKeys";

const SPEED = 8;
const HALF_ROAD = 1.6;

// Vue "face à la section"
const FACE_BACK = 4; // caméra 4 unités derrière le joueur
const FACE_HEIGHT = 4; // hauteur de la caméra
const FACE_LOOK = 14; // on regarde 14 unités devant
const FACE_LOOK_Y = 2;

const forward = new Vector3();
const right = new Vector3();
const move = new Vector3();
const goal = new Vector3();
const UP = new Vector3(0, 1, 0);

const isOnRoad = (x, z) =>
  Math.abs(x) <= 40 &&
  Math.abs(z) <= 40 &&
  (Math.abs(z) <= HALF_ROAD ||
    Math.abs(x + 14) <= HALF_ROAD ||
    Math.abs(x - 14) <= HALF_ROAD);

export default function Player({ playerRef, focusRef, start = [0, 0, 0] }) {
  const keys = useKeys();
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const back = useRef(null); // vue d'origine à retrouver quand on sort

  useFrame((_, delta) => {
    if (!controls || !playerRef.current) return;

    const k = keys.current;
    const g = focusRef.current;
    const p = playerRef.current.position;
    const t = 1 - Math.exp(-6 * delta);

    // ---------- Une station a pris la main : Entrée pour sortir ----------
    if (g) {
      if (k.ArrowDown) {
        back.current = g.saved;
        focusRef.current = null;
        return; // on sort proprement, pas de mouvement parasite
      }

      // première image : on mémorise la vue d'origine
      if (!g.saved) {
        g.saved = back.current ?? {
          offset: camera.position.clone().sub(controls.target),
        };
        back.current = null;
      }

      if (!g.done) {
        // position actuelle de la caméra, mesurée AUTOUR DU JOUEUR
        const ox = camera.position.x - p.x;
        const oz = camera.position.z - p.z;
        const r = Math.hypot(ox, oz);
        const angle = Math.atan2(ox, oz);

        // angle voulu : derrière le joueur, à l'opposé de la section
        const want = Math.atan2(-g.dir.x, -g.dir.z);

        // demi-tour par le chemin le plus court
        let d = want - angle;
        d = Math.atan2(Math.sin(d), Math.cos(d));

        const nextAngle = angle + d * t;
        const nextR = r + (FACE_BACK - r) * t;

        camera.position.x = p.x + nextR * Math.sin(nextAngle);
        camera.position.z = p.z + nextR * Math.cos(nextAngle);
        camera.position.y += (FACE_HEIGHT - camera.position.y) * t;

        // le regard va vers l'intérieur de la section
        goal.set(
          p.x + g.dir.x * FACE_LOOK,
          FACE_LOOK_Y,
          p.z + g.dir.z * FACE_LOOK,
        );
        controls.target.lerp(goal, t);

        playerRef.current.rotation.y = Math.atan2(g.dir.x, g.dir.z);

        if (
          Math.abs(d) < 0.01 &&
          Math.abs(nextR - FACE_BACK) < 0.05 &&
          Math.abs(camera.position.y - FACE_HEIGHT) < 0.05
        ) {
          g.done = true;
        }
      }
      return; // bloque le mouvement tant qu'on est dans une station
    }

    // ---------- Marche normale ----------
    const f = (k.ArrowUp ? 1 : 0) - (k.ArrowDown ? 1 : 0);
    const r = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);

    if (f || r) {
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      right.crossVectors(forward, UP);

      move
        .set(0, 0, 0)
        .addScaledVector(forward, f)
        .addScaledVector(right, r)
        .normalize();

      const dx = move.x;
      const dz = move.z;
      const step = SPEED * Math.min(delta, 0.05);

      let mx = 0;
      let mz = 0;
      if (isOnRoad(p.x + dx * step, p.z)) mx = dx * step;
      if (isOnRoad(p.x + mx, p.z + dz * step)) mz = dz * step;

      p.x += mx;
      p.z += mz;
      playerRef.current.rotation.y = Math.atan2(dx, dz);

      camera.position.x += mx;
      camera.position.z += mz;
      controls.target.x += mx;
      controls.target.z += mz;
    }

    // ---------- Retour doux vers la vue d'origine après une station ----------
    if (back.current) {
      goal.copy(p).add(back.current.offset);
      camera.position.lerp(goal, t);
      controls.target.lerp(p, t);

      if (
        camera.position.distanceTo(goal) < 0.05 &&
        controls.target.distanceTo(p) < 0.05
      ) {
        back.current = null;
      }
    }
  });

  return (
    <group ref={playerRef} position={start}>
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
      <mesh position={[0, 1.4, 0.4]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
