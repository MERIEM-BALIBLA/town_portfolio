// Composant de scène : à utiliser DANS un <Canvas> existant (pas de Canvas ici).
// Un cadre de projet accroché au mur : image en haut, titre, description, technologies
// et un bouton GitHub en bas. Le point (0,0,0) est le centre du cadre, face vers +z.
import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Coupe le texte en lignes ; ajoute "…" si le texte dépasse maxLines
function layoutLines(ctx, text, maxW, maxLines) {
  const words = (text || "").split(" ");
  const lines = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + " " + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    let last = lines[maxLines - 1] + "…";
    while (ctx.measureText(last).width > maxW && last.length > 2) {
      last = last.slice(0, -2) + "…";
    }
    lines[maxLines - 1] = last;
  }
  return lines;
}

// Panneau de texte dessiné sur une texture. Renvoie aussi la zone du bouton GitHub.
function makeTextTexture(
  { title, description, technologies, accent, github },
  aspect,
) {
  const w = 1024;
  const h = Math.round(w / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const font = "'Segoe UI', Arial, sans-serif";

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#2d1457");
  g.addColorStop(1, "#150a2e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, w, h * 0.025);

  // bouton GitHub (en haut à droite)
  let pill = null;
  let titleMaxW = w * 0.9;
  if (github) {
    ctx.font = `bold ${h * 0.085}px ${font}`;
    const label = "GitHub ↗";
    const pw = ctx.measureText(label).width + h * 0.14;
    const ph = h * 0.15;
    const px = w * 0.95 - pw;
    const py = h * 0.09;
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, ph / 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, px + pw / 2, py + ph / 2 + 2);
    pill = {
      cx: (px + pw / 2) / w,
      cy: (py + ph / 2) / h,
      pw: pw / w,
      ph: ph / h,
    };
    titleMaxW = px - w * 0.05 - w * 0.02;
  }

  // titre
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${h * 0.17}px ${font}`;
  layoutLines(ctx, title, titleMaxW, 1).forEach((l) =>
    ctx.fillText(l, w * 0.05, h * 0.25),
  );

  // description (3 lignes max), avec de l'espace avant les technologies
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = `${h * 0.095}px ${font}`;
  layoutLines(ctx, description, w * 0.9, 3).forEach((l, i) =>
    ctx.fillText(l, w * 0.05, h * 0.43 + i * h * 0.125),
  );

  // technologies
  let x = w * 0.05;
  const y = h * 0.865;
  ctx.font = `bold ${h * 0.085}px ${font}`;
  ctx.textBaseline = "middle";
  (technologies || []).forEach((t) => {
    const tw = ctx.measureText(t).width + h * 0.13;
    if (x + tw > w * 0.96) return;
    ctx.fillStyle = "rgba(180,107,255,0.3)";
    ctx.beginPath();
    ctx.roundRect(x, y - h * 0.07, tw, h * 0.14, h * 0.07);
    ctx.fill();
    ctx.fillStyle = "#e9d8ff";
    ctx.fillText(t, x + h * 0.065, y + 1);
    x += tw + h * 0.035;
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, pill };
}

// Image du projet recadrée, non éclairée (pas d'éblouissement par les spots du mur)
function ProjectImage({ url, width, height, matRef }) {
  const tex = useTexture(url);
  useMemo(() => {
    if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
    const img = tex.image;
    if (!img) return;
    const ia = img.width / img.height;
    const pa = width / height;
    tex.repeat.set(1, 1);
    tex.offset.set(0, 0);
    if (ia > pa) {
      tex.repeat.x = pa / ia;
      tex.offset.x = (1 - tex.repeat.x) / 2;
    } else {
      tex.repeat.y = ia / pa;
      tex.offset.y = (1 - tex.repeat.y) / 2;
    }
    tex.needsUpdate = true;
  }, [tex, width, height]);

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial ref={matRef} map={tex} toneMapped={false} />
    </mesh>
  );
}

/**
 * Props :
 *  title         titre du projet
 *  description   courte description (3 lignes max, "…" si trop long)
 *  image         chemin de l'image, ex. "/images/projet1.png" (dans public/)
 *  technologies  tableau de textes, ex. ["Java", "Angular"]
 *  github        lien GitHub : affiche un bouton "GitHub ↗" qui ouvre le lien
 *  accent        couleur du liseré (violet par défaut)
 *  width/height  taille de l'écran (nombres : width={3}, pas width="3")
 *  onClick       fonction appelée au clic sur le cadre
 *  dimLevel      luminosité au repos (0 à 1). 1 au survol.
 * Les autres props (position, rotation, scale) vont au <group>.
 */
export default function ProjectFrame({
  title,
  description,
  image,
  technologies = [],
  github,
  accent = "#b46bff",
  width = 3,
  height = 2.6,
  dimLevel = 0.85,
  onClick,
  ...props
}) {
  const inner = useRef();
  const textMat = useRef();
  const imgMat = useRef();
  const pulse = useRef(0);
  const bright = useRef(dimLevel);
  const [hovered, setHovered] = useState(false);

  const imgH = height * 0.5;
  const textH = height - imgH;

  const { tex: textTex, pill } = useMemo(
    () =>
      makeTextTexture(
        { title, description, technologies, accent, github },
        width / textH,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [title, description, technologies.join("|"), accent, github, width, textH],
  );

  useFrame((_, delta) => {
    pulse.current = Math.max(0, pulse.current - delta * 3);
    const targetZ =
      (hovered ? 0.18 : 0) + Math.sin(pulse.current * Math.PI) * 0.12;
    const targetS = hovered ? 1.04 : 1;
    inner.current.position.z += (targetZ - inner.current.position.z) * 0.2;
    const s = inner.current.scale.x + (targetS - inner.current.scale.x) * 0.2;
    inner.current.scale.setScalar(s);

    // luminosité : plus sombre au repos, pleine au survol
    bright.current += ((hovered ? 1 : dimLevel) - bright.current) * 0.2;
    if (textMat.current) textMat.current.color.setScalar(bright.current);
    if (imgMat.current) imgMat.current.color.setScalar(bright.current);
  });

  const f = 0.1; // épaisseur du cadre

  return (
    <group {...props}>
      <group
        ref={inner}
        onClick={(e) => {
          e.stopPropagation();
          pulse.current = 1;
          if (onClick) onClick(e);
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
        {/* cadre */}
        <mesh position={[0, 0, 0.03]} castShadow>
          <boxGeometry args={[width + f * 2, height + f * 2, 0.06]} />
          <meshStandardMaterial
            color="#1a1426"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>

        {/* zone image (haut) */}
        <group position={[0, height / 2 - imgH / 2, 0.062]}>
          <mesh>
            <planeGeometry args={[width, imgH]} />
            <meshBasicMaterial color="#2a1a4a" toneMapped={false} />
          </mesh>
          {image && (
            <group position={[0, 0, 0.001]}>
              <Suspense fallback={null}>
                <ProjectImage
                  url={image}
                  width={width}
                  height={imgH}
                  matRef={imgMat}
                />
              </Suspense>
            </group>
          )}
        </group>

        {/* zone texte (bas) */}
        <group position={[0, -height / 2 + textH / 2, 0.062]}>
          <mesh>
            <planeGeometry args={[width, textH]} />
            <meshBasicMaterial ref={textMat} map={textTex} toneMapped={false} />
          </mesh>

          {/* zone cliquable du bouton GitHub */}
          {github && pill && (
            <mesh
              position={[
                (pill.cx - 0.5) * width,
                (0.5 - pill.cy) * textH,
                0.003,
              ]}
              onClick={(e) => {
                e.stopPropagation();
                window.open(github, "_blank", "noopener,noreferrer");
              }}
            >
              <planeGeometry args={[pill.pw * width, pill.ph * textH]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          )}
        </group>

        {/* liseré lumineux sous le cadre */}
        <mesh position={[0, -height / 2 - f * 0.5, 0.062]}>
          <boxGeometry args={[width * 0.9, 0.025, 0.01]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>
    </group>
  );
}
