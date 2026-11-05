import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import useKeys from "./useKeys";
import { commands, getSection, nav, setNav } from "./navigation";

const SPEED = 8;
const TRAVEL_SPEED = 22; // déplacement automatique (menu / boutons)
const HALF_ROAD = 1.6;

// Vue "face à la section" (écran large / écran portrait)
const FACE = {
  wide: { back: 4, height: 4, look: 14, lookY: 2 },
  portrait: { back: 6, height: 7, look: 14, lookY: 1 },
};

const forward = new Vector3();
const right = new Vector3();
const move = new Vector3();
const goal = new Vector3();
const UP = new Vector3(0, 1, 0);

const VERTICAL_ROADS = [-14, 14];
const TURN = 2.2; // tolérance pour tourner à un carrefour

const nearestVerticalRoad = (x) =>
  VERTICAL_ROADS.reduce((a, b) => (Math.abs(x - b) < Math.abs(x - a) ? b : a));

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
  const travel = useRef(null); // section visée par le déplacement automatique

  // Déplace joueur + caméra ensemble
  const shift = (mx, mz) => {
    const p = playerRef.current.position;
    p.x += mx;
    p.z += mz;
    camera.position.x += mx;
    camera.position.z += mz;
    controls.target.x += mx;
    controls.target.z += mz;
    if (mx || mz) playerRef.current.rotation.y = Math.atan2(mx, mz);
  };

  const leaveSection = () => {
    if (focusRef.current) back.current = focusRef.current.saved;
    focusRef.current = null;
  };

  useFrame((_, delta) => {
    if (!controls || !playerRef.current) return;

    const k = keys.current;
    const p = playerRef.current.position;
    const t = 1 - Math.exp(-6 * delta);

    // ---------- Commandes venant du menu / des boutons / du clavier ----------
    if (commands.exit) {
      commands.exit = false;
      leaveSection();
      setNav({ current: null });
    }
    if (commands.goTo) {
      const s = getSection(commands.goTo);
      commands.goTo = null;
      leaveSection();
      travel.current = s;
      setNav({ current: null });
    }

    // ---------- Dans une section : la caméra se place face à elle ----------
    const g = focusRef.current;
    if (g) {
      const f = camera.aspect < 1 ? FACE.portrait : FACE.wide;

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
        const nextR = r + (f.back - r) * t;

        camera.position.x = p.x + nextR * Math.sin(nextAngle);
        camera.position.z = p.z + nextR * Math.cos(nextAngle);
        camera.position.y += (f.height - camera.position.y) * t;

        // le regard va vers l'intérieur de la section
        goal.set(p.x + g.dir.x * f.look, f.lookY, p.z + g.dir.z * f.look);
        controls.target.lerp(goal, t);

        playerRef.current.rotation.y = Math.atan2(g.dir.x, g.dir.z);

        if (
          Math.abs(d) < 0.01 &&
          Math.abs(nextR - f.back) < 0.05 &&
          Math.abs(camera.position.y - f.height) < 0.05
        ) {
          g.done = true;
        }
      }
      return; // pas de mouvement tant qu'on est dans une section
    }

    // ---------- Déplacement automatique vers une station ----------
    if (travel.current) {
      const s = travel.current;
      const step = TRAVEL_SPEED * Math.min(delta, 0.05);
      let mx = 0;
      let mz = 0;

      // Les stations sont sur la route horizontale (z = 0) :
      // on rejoint d'abord z = 0, puis on longe la route jusqu'à la station.
      if (Math.abs(p.z) > 0.001) {
        mz = -Math.sign(p.z) * Math.min(step, Math.abs(p.z));
      } else {
        const dx = s.x - p.x;
        mx = Math.sign(dx) * Math.min(step, Math.abs(dx));
      }
      shift(mx, mz);

      if (Math.abs(p.z) <= 0.001 && Math.abs(s.x - p.x) <= 0.001) {
        travel.current = null;
        focusRef.current = {
          owner: s.station,
          done: false,
          dir: new Vector3(0, 0, s.dir),
          saved: null,
        };
        setNav({ current: s.id, target: null });
      }
    }

    // ---------- Marche au clavier (bloquée si un menu de station est ouvert) ----------
    else if (!nav.get().menu) {
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

        // On cale le mouvement sur l'axe de la route (pas de diagonale),
        // et on recentre doucement le joueur au milieu de la voie.
        const step = SPEED * Math.min(delta, 0.05);
        const center = Math.min(1, 10 * delta);
        const vx = nearestVerticalRoad(p.x);
        const canX = Math.abs(p.z) <= HALF_ROAD; // sur la route horizontale
        const canZ = Math.abs(p.x - vx) <= TURN; // sur / à l'entrée d'une route verticale

        let axis = Math.abs(move.x) >= Math.abs(move.z) ? "x" : "z";
        if (axis === "x" && !canX && Math.abs(move.z) > 0.2) axis = "z";
        if (axis === "z" && !canZ && Math.abs(move.x) > 0.2) axis = "x";

        let mx = 0;
        let mz = 0;
        if (axis === "x" && canX) {
          mx = Math.sign(move.x) * step;
          mz = -p.z * center; // retour au centre (z = 0)
        } else if (axis === "z" && canZ) {
          mz = Math.sign(move.z) * step;
          mx = (vx - p.x) * center; // retour au centre de la route verticale
        }

        // Bout de route : on bloque l'avancée, mais on garde le recentrage
        if (!isOnRoad(p.x + mx, p.z + mz)) {
          if (axis === "x") mx = 0;
          else mz = 0;
        }

        shift(mx, mz);
        playerRef.current.rotation.y =
          axis === "x"
            ? Math.atan2(Math.sign(move.x), 0)
            : Math.atan2(0, Math.sign(move.z));
      }
    }

    // ---------- Retour doux vers la vue d'origine après une section ----------
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
        <capsuleGeometry args={[0.6, 1, 4, 8]} />
        <meshStandardMaterial color="#dc98e1" />
      </mesh>
      <mesh position={[0, 1.4, 0.5]}>
        <boxGeometry args={[0.6, 0.3, 0.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
