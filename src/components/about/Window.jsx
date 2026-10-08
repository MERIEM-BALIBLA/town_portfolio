import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

const W = 1.4; // largeur de l'ouverture
const H = 1.7; // hauteur de l'ouverture
const T = 0.09; // épaisseur du cadre
const D = 0.12; // profondeur du cadre

/* PRNG déterministe (pas de Math.random : même rendu à chaque fois) */
function makeRng(seed) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

function toTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* Ciel de crépuscule + deux couches de skyline avec fenêtres allumées */
function useCityTexture() {
  return useMemo(() => {
    const w = 700;
    const h = Math.round((w * H) / W);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d");
    const rnd = makeRng(11);
    const horizon = h * 0.78;

    // ciel
    const sky = g.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "#2b1a6b");
    sky.addColorStop(0.35, "#6d3fd0");
    sky.addColorStop(0.7, "#d86bc4");
    sky.addColorStop(1, "#ffb98a");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);

    // étoiles
    for (let i = 0; i < 50; i++) {
      g.fillStyle = `rgba(255,255,255,${0.25 + rnd() * 0.6})`;
      const r = rnd() < 0.15 ? 1.8 : 1;
      g.fillRect(rnd() * w, rnd() * h * 0.38, r, r);
    }

    // halo du soleil couchant
    const glow = g.createRadialGradient(
      w * 0.68,
      horizon,
      0,
      w * 0.68,
      horizon,
      w * 0.7,
    );
    glow.addColorStop(0, "rgba(255,200,140,0.85)");
    glow.addColorStop(0.4, "rgba(255,140,190,0.35)");
    glow.addColorStop(1, "rgba(255,140,190,0)");
    g.fillStyle = glow;
    g.fillRect(0, 0, w, h);

    // nuages doux
    const cloud = (x, y, sx, a) => {
      for (let i = 0; i < 6; i++) {
        const gr = g.createRadialGradient(
          x + i * sx * 0.5,
          y,
          0,
          x + i * sx * 0.5,
          y,
          sx,
        );
        gr.addColorStop(0, `rgba(255,205,230,${a})`);
        gr.addColorStop(1, "rgba(255,205,230,0)");
        g.fillStyle = gr;
        g.fillRect(x - sx, y - sx, sx * 6, sx * 2);
      }
    };
    cloud(w * 0.05, h * 0.42, 70, 0.28);
    cloud(w * 0.5, h * 0.32, 55, 0.2);
    cloud(w * 0.15, h * 0.6, 60, 0.22);

    // skyline : fond (brumeux) puis premier plan (sombre, fenêtres allumées)
    const skyline = (color, minH, maxH, minW, maxW, windows, seedOffset) => {
      const r = makeRng(seedOffset);
      let x = -10;
      while (x < w) {
        const bw = minW + r() * (maxW - minW);
        const bh = minH + r() * (maxH - minH);
        const top = horizon - bh;
        g.fillStyle = color;
        g.fillRect(x, top, bw, h - top);
        if (windows) {
          for (let wy = top + 8; wy < horizon - 4; wy += 11) {
            for (let wx = x + 5; wx < x + bw - 6; wx += 9) {
              if (r() > 0.62) {
                g.fillStyle = r() > 0.85 ? "#7dd3fc" : "#ffd88a";
                g.globalAlpha = 0.55 + r() * 0.45;
                g.fillRect(wx, wy, 4, 5);
                g.globalAlpha = 1;
              }
            }
          }
        }
        x += bw + (r() > 0.7 ? 6 : 0);
      }
    };
    skyline("#7a4fb4", 60, 190, 30, 60, false, 5);
    skyline("#2a1d52", 40, 150, 34, 70, true, 23);

    // grande tour avec antenne et balise rouge
    const tx = w * 0.3;
    const th = 330;
    g.fillStyle = "#1c1340";
    g.fillRect(tx, horizon - th, 44, th + 10);
    g.fillRect(tx + 20, horizon - th - 42, 4, 42);
    g.fillStyle = "#ff5a7a";
    g.beginPath();
    g.arc(tx + 22, horizon - th - 44, 4, 0, Math.PI * 2);
    g.fill();
    for (let wy = horizon - th + 10; wy < horizon - 6; wy += 12) {
      for (let wx = tx + 6; wx < tx + 38; wx += 10) {
        if (rnd() > 0.5) {
          g.fillStyle = "#ffd88a";
          g.fillRect(wx, wy, 4, 6);
        }
      }
    }

    // sol sombre
    g.fillStyle = "#1c1340";
    g.fillRect(0, horizon + 6, w, h);

    return toTexture(c);
  }, []);
}

/* Reflets en diagonale sur la vitre (texture transparente) */
function useGlassTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 312;
    const g = c.getContext("2d");
    g.clearRect(0, 0, c.width, c.height);
    g.save();
    g.translate(c.width / 2, c.height / 2);
    g.rotate(-0.55);
    [
      [-70, 38, 0.1],
      [-10, 14, 0.07],
      [40, 60, 0.05],
    ].forEach(([x, wd, a]) => {
      const gr = g.createLinearGradient(x, 0, x + wd, 0);
      gr.addColorStop(0, "rgba(255,255,255,0)");
      gr.addColorStop(0.5, `rgba(255,255,255,${a})`);
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(x, -400, wd, 800);
    });
    g.restore();
    return toTexture(c);
  }, []);
}

const frameMat = { color: "#3d3858", roughness: 0.55, metalness: 0.15 };

export default function Window({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  mullions = false, // true => croisillons (2x2 carreaux)
  light = true, // lumière violette/rose qui entre dans la pièce
}) {
  const city = useCityTexture();
  const glass = useGlassTexture();

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* paysage (ne réagit pas aux lumières) */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[W + 0.04, H + 0.04]} />
        <meshBasicMaterial map={city} toneMapped={false} />
      </mesh>

      {/* vitre : reflets + léger voile */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial
          map={glass}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* cadre épais */}
      <RoundedBox
        args={[W + 2 * T, T, D]}
        radius={0.02}
        position={[0, H / 2 + T / 2, D / 2 - 0.04]}
        castShadow
      >
        <meshStandardMaterial {...frameMat} />
      </RoundedBox>
      <RoundedBox
        args={[W + 2 * T, T, D]}
        radius={0.02}
        position={[0, -H / 2 - T / 2, D / 2 - 0.04]}
        castShadow
      >
        <meshStandardMaterial {...frameMat} />
      </RoundedBox>
      <RoundedBox
        args={[T, H, D]}
        radius={0.02}
        position={[-W / 2 - T / 2, 0, D / 2 - 0.04]}
        castShadow
      >
        <meshStandardMaterial {...frameMat} />
      </RoundedBox>
      <RoundedBox
        args={[T, H, D]}
        radius={0.02}
        position={[W / 2 + T / 2, 0, D / 2 - 0.04]}
        castShadow
      >
        <meshStandardMaterial {...frameMat} />
      </RoundedBox>

      {/* croisillons */}
      {mullions && (
        <>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.035, H, 0.04]} />
            <meshStandardMaterial {...frameMat} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[W, 0.035, 0.04]} />
            <meshStandardMaterial {...frameMat} />
          </mesh>
        </>
      )}

      {/* rebord de fenêtre */}
      <RoundedBox
        args={[W + 0.3, 0.05, 0.22]}
        radius={0.015}
        position={[0, -H / 2 - T - 0.02, 0.08]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#4a4466" roughness={0.5} />
      </RoundedBox>

      {/* lumière du crépuscule vers l'intérieur */}
      {light && (
        <>
          <pointLight
            position={[0, 0.2, 0.7]}
            color="#e879b9"
            intensity={1.6}
            distance={4}
          />
          <pointLight
            position={[0, -0.4, 0.5]}
            color="#ffb98a"
            intensity={0.8}
            distance={3}
          />
        </>
      )}
    </group>
  );
}
