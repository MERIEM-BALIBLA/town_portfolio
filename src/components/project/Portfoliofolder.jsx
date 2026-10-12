import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const FONT = "'Segoe UI', Arial, sans-serif";

function toTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Étiquette du dossier : titre + sous-titre
function makeLabelTexture(label, subtitle, color, aspect) {
  const w = 1024;
  const h = Math.round(w / aspect);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, color);
  g.addColorStop(1, "#2a1458");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${h * 0.17}px ${FONT}`;
  ctx.fillText(label, w / 2, h * 0.46);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(w * 0.3, h * 0.6, w * 0.4, 4);

  if (subtitle) {
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = `${h * 0.075}px ${FONT}`;
    ctx.fillText(subtitle, w / 2, h * 0.72);
  }
  return toTexture(c);
}

// Carte de projet : maquette simplifiée de page web
function makeCardTexture(accent, variant, aspect) {
  const w = 512;
  const h = Math.round(w / aspect);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#fbfbfd";
  ctx.fillRect(0, 0, w, h);

  // barre de navigation
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, w, h * 0.12);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  [0.05, 0.1, 0.15].forEach((x) => {
    ctx.beginPath();
    ctx.arc(w * x, h * 0.06, h * 0.02, 0, Math.PI * 2);
    ctx.fill();
  });

  // bloc image
  const g = ctx.createLinearGradient(0, h * 0.16, w, h * 0.55);
  g.addColorStop(0, accent);
  g.addColorStop(1, "#ffffff");
  ctx.fillStyle = g;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(w * 0.07, h * 0.16, w * 0.86, h * 0.36);
  ctx.globalAlpha = 1;

  // variantes : cercle, barres ou carrés dans le bloc image
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  if (variant === 0) {
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.34, h * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (variant === 1) {
    [0.25, 0.4, 0.55, 0.7].forEach((x, i) => {
      const bh = h * (0.08 + i * 0.04);
      ctx.fillRect(w * x, h * 0.5 - bh, w * 0.08, bh);
    });
  } else {
    ctx.fillRect(w * 0.2, h * 0.24, w * 0.2, h * 0.16);
    ctx.fillRect(w * 0.55, h * 0.24, w * 0.2, h * 0.16);
  }

  // lignes de texte
  ctx.fillStyle = "#d7d9e2";
  [0.58, 0.66, 0.74].forEach((y, i) => {
    ctx.fillRect(w * 0.07, h * y, w * (i === 2 ? 0.5 : 0.86), h * 0.03);
  });

  // bouton
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(w * 0.07, h * 0.84, w * 0.3, h * 0.07, h * 0.035);
  ctx.fill();

  return toTexture(c);
}

const CARDS = [
  { accent: "#7c4dff", x: -0.4, lift: 0.5, z: -0.02, rot: 0.1, phase: 0 },
  { accent: "#ff7a59", x: 0.05, lift: 0.78, z: 0.03, rot: -0.04, phase: 1.6 },
  { accent: "#2ec4b6", x: 0.5, lift: 0.55, z: 0.08, rot: -0.12, phase: 3.1 },
];

/**
 * Props :
 *  label           texte du dossier (« PORTFOLIO » par défaut)
 *  subtitle        sous-titre sous le titre
 *  color           couleur du dossier (violet)
 *  floatAmplitude  hauteur du va-et-vient vertical
 *  speed           vitesse des animations
 * Les autres props (position, rotation, scale) vont au <group>.
 */
export default function PortfolioFolder({
  label = "PORTFOLIO",
  subtitle = "Projets & réalisations",
  color = "#6d3fd1",
  floatAmplitude = 0.06,
  speed = 1,
  href = "https://meriem-balibla.vercel.app/",
  ...props
}) {
  const floater = useRef();
  const cardRefs = useRef([]);

  const W = 2.2;
  const backH = 1.6;
  const frontH = 1.15;
  const cardW = 1.5;
  const cardH = 1.3;

  const labelTex = useMemo(
    () => makeLabelTexture(label, subtitle, color, W / frontH),
    [label, subtitle, color],
  );
  const cardTex = useMemo(
    () => CARDS.map((c, i) => makeCardTexture(c.accent, i, cardW / cardH)),
    [],
  );

  // Ouvre le lien dans un nouvel onglet
  const handleClick = (e) => {
    e.stopPropagation();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  // Curseur "main" au survol
  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    floater.current.position.y = Math.sin(t * 1.1) * floatAmplitude;
    cardRefs.current.forEach((g, i) => {
      if (!g) return;
      const c = CARDS[i];
      g.position.y = 0.9 + c.lift + Math.sin(t * 1.5 + c.phase) * 0.06;
      g.rotation.z = c.rot + Math.sin(t * 1.2 + c.phase) * 0.025;
    });
  });

  const folderMat = (
    <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />
  );

  return (
    <group {...props}>
      <group
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        position={[0, 0.4, 0]}
        scale={[1, 1, 2]}
      >
        <group ref={floater}>
          {/* dos du dossier */}
          <RoundedBox
            args={[W, backH, 0.1]}
            radius={0.06}
            smoothness={4}
            position={[0, backH / 2, -0.1]}
            castShadow
          >
            {folderMat}
          </RoundedBox>

          {/* onglet */}
          <RoundedBox
            args={[0.8, 0.22, 0.1]}
            radius={0.06}
            smoothness={4}
            position={[-0.6, backH + 0.07, -0.1]}
          >
            {folderMat}
          </RoundedBox>

          {/* cartes de projets qui sortent du dossier */}
          {CARDS.map((c, i) => (
            <group
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              position={[c.x, 0.9 + c.lift, c.z]}
            >
              <RoundedBox
                args={[cardW, cardH, 0.03]}
                radius={0.03}
                smoothness={3}
                castShadow
              >
                <meshStandardMaterial color="#f4f4f8" roughness={0.6} />
              </RoundedBox>
              <mesh position={[0, 0, 0.0165]}>
                <planeGeometry args={[cardW - 0.04, cardH - 0.04]} />
                <meshStandardMaterial map={cardTex[i]} roughness={0.6} />
              </mesh>
            </group>
          ))}

          {/* face avant du dossier, avec l'étiquette */}
          <RoundedBox
            args={[W, frontH, 0.08]}
            radius={0.06}
            smoothness={4}
            position={[0, frontH / 2, 0.14]}
            castShadow
          >
            {folderMat}
          </RoundedBox>
          <mesh position={[0, frontH / 2, 0.182]}>
            <planeGeometry args={[W - 0.12, frontH - 0.12]} />
            <meshStandardMaterial map={labelTex} roughness={0.5} />
          </mesh>

          {/* petit fermoir doré */}
          <RoundedBox
            args={[0.34, 0.1, 0.04]}
            radius={0.04}
            smoothness={3}
            position={[0, frontH - 0.02, 0.2]}
          >
            <meshStandardMaterial
              color="#e3b23c"
              roughness={0.35}
              metalness={0.6}
            />
          </RoundedBox>
        </group>
      </group>
      <mesh position={[0, 0.012, 0.2]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.4, 0.5, 96]} />
        <meshStandardMaterial color="#cdb2a3" roughness={1} />
      </mesh>
    </group>
  );
}
