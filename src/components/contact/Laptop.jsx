import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/*  Textures dessinées sur canvas                                      */
/* ------------------------------------------------------------------ */

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeTexture(w, h, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function drawScreen(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#4b2fb8");
  bg.addColorStop(0.6, "#9a4fd6");
  bg.addColorStop(1, "#f08ac0");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(
    w * 0.75,
    h * 0.3,
    0,
    w * 0.75,
    h * 0.3,
    w * 0.5,
  );
  glow.addColorStop(0, "rgba(255,255,255,0.28)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(20,10,40,0.35)";
  ctx.fillRect(0, 0, w, 36);

  const wx = w * 0.2,
    wy = h * 0.17,
    ww = w * 0.6,
    wh = h * 0.56;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  rr(ctx, wx, wy, ww, wh, 22);
  ctx.fill();
  ["#ff6b6b", "#ffd166", "#6bd68a"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(wx + 34 + i * 30, wy + 30, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#3b1d3f";
  rr(ctx, wx + 36, wy + 70, ww * 0.45, 22, 8);
  ctx.fill();
  [0.85, 0.7, 0.78, 0.5].forEach((f, i) => {
    ctx.fillStyle = "#d8cdee";
    rr(ctx, wx + 36, wy + 118 + i * 38, (ww - 72) * f, 16, 8);
    ctx.fill();
  });
  ctx.fillStyle = "#e0629a";
  rr(ctx, wx + ww - 190, wy + wh - 70, 150, 42, 21);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  rr(ctx, w * 0.3, h - 92, w * 0.4, 66, 24);
  ctx.fill();
  ["#ff7ac8", "#ffd166", "#6bd68a", "#8ecae6", "#b79cff", "#ff9e7a"].forEach(
    (c, i) => {
      ctx.fillStyle = c;
      rr(ctx, w * 0.3 + 22 + i * ((w * 0.4 - 44) / 6), h - 80, 40, 42, 10);
      ctx.fill();
    },
  );
}

function drawKeyboard(ctx, w, h) {
  ctx.fillStyle = "#c9ccd1";
  ctx.fillRect(0, 0, w, h);

  const cols = 14,
    rows = 5,
    gap = 6;
  const kx = 30,
    ky = 30,
    kw = w - 60,
    kh = 280;
  const cw = (kw - gap * (cols - 1)) / cols;
  const rh = (kh - gap * (rows - 1)) / rows;
  ctx.fillStyle = "#2a2a2f";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === rows - 1 && c >= 3 && c <= 10) {
        if (c === 3) {
          rr(
            ctx,
            kx + 3 * (cw + gap),
            ky + r * (rh + gap),
            8 * cw + 7 * gap,
            rh,
            6,
          );
          ctx.fill();
        }
        continue;
      }
      rr(ctx, kx + c * (cw + gap), ky + r * (rh + gap), cw, rh, 6);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#d6d9dd";
  ctx.strokeStyle = "#aeb1b6";
  ctx.lineWidth = 3;
  rr(ctx, w * 0.3, 345, w * 0.4, h - 345 - 28, 14);
  ctx.fill();
  ctx.stroke();
}

/* ------------------------------------------------------------------ */
/*  Laptop                                                             */
/* ------------------------------------------------------------------ */

export default function Laptop(props) {
  const { screen, keyboard } = useMemo(
    () => ({
      screen: makeTexture(1024, 640, drawScreen),
      keyboard: makeTexture(760, 510, drawKeyboard),
    }),
    [],
  );

  const metal = { color: "#d5d8dc", metalness: 0.25, roughness: 0.45 };

  const handleClick = (e) => {
    e.stopPropagation();
    window.open("https://meriem-balibla.vercel.app/", "_blank");
  };

  return (
    <group
      {...props}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Base + clavier */}
      <RoundedBox
        args={[1.6, 0.05, 1.1]}
        radius={0.03}
        smoothness={3}
        position={[0, 0.025, 0]}
      >
        <meshStandardMaterial {...metal} />
      </RoundedBox>
      <mesh position={[0, 0.06, 0.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.52, 1.02]} />
        <meshBasicMaterial
          map={keyboard}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      {/* Charnière */}
      <mesh position={[0, 0.05, -0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 1.3, 12]} />
        <meshStandardMaterial color="#9a9da2" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Écran */}
      <group position={[0, 0.05, -0.55]} rotation={[-1.85, 0, 0]}>
        <RoundedBox
          args={[1.6, 0.035, 1.04]}
          radius={0.02}
          smoothness={3}
          position={[0, 0, 0.52]}
        >
          <meshStandardMaterial {...metal} />
        </RoundedBox>
        <mesh position={[0, -0.03, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.54, 0.98]} />
          <meshBasicMaterial
            color="#0b0b10"
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
        <mesh position={[0, -0.033, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.44, 0.9]} />
          <meshBasicMaterial
            map={screen}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-4}
            polygonOffsetUnits={-4}
          />
        </mesh>
      </group>
    </group>
  );
}
