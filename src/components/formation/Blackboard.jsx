// import { useMemo } from "react";
// import * as THREE from "three";

// function makeBoardTexture(text, subtitle) {
//   const w = 1024,
//     h = 360;
//   const canvas = document.createElement("canvas");
//   canvas.width = w;
//   canvas.height = h;
//   const ctx = canvas.getContext("2d");

//   ctx.fillStyle = "#1f3b2d";
//   ctx.fillRect(0, 0, w, h);
//   // traces de craie effacée
//   for (let i = 0; i < 14; i++) {
//     ctx.fillStyle = `rgba(255,255,255,${0.015 + Math.random() * 0.025})`;
//     ctx.beginPath();
//     ctx.ellipse(
//       Math.random() * w,
//       Math.random() * h,
//       80 + Math.random() * 120,
//       20 + Math.random() * 30,
//       Math.random() * 3,
//       0,
//       Math.PI * 2,
//     );
//     ctx.fill();
//   }

//   ctx.fillStyle = "#f4f1e6";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   if (text) {
//     ctx.font = "bold 150px 'Segoe UI', Arial, sans-serif";
//     ctx.fillText(text, w / 2, subtitle ? h * 0.42 : h / 2);
//   }
//   if (subtitle) {
//     ctx.font = "56px 'Segoe UI', Arial, sans-serif";
//     ctx.fillText(subtitle, w / 2, h * 0.78);
//   }

//   const tex = new THREE.CanvasTexture(canvas);
//   tex.anisotropy = 8;
//   if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
//   return tex;
// }

// // Tableau mural. Le point (0,0,0) est le centre du tableau, face vers +z.
// export default function Blackboard({
//   width = 4,
//   height = 1.4,
//   text = "JAVA ",
//   subtitle = "",
//   frameColor = "#8a6a45",
//   ...props
// }) {
//   const tex = useMemo(() => makeBoardTexture(text, subtitle), [text, subtitle]);
//   const f = 0.06; // épaisseur du cadre

//   return (
//     <group {...props}>
//       {/* cadre */}
//       <mesh position={[0, 0, -0.015]}>
//         <boxGeometry args={[width + f * 2, height + f * 2, 0.03]} />
//         <meshStandardMaterial color={frameColor} roughness={0.6} />
//       </mesh>

//       {/* surface */}
//       <mesh position={[0, 0, 0.002]}>
//         <planeGeometry args={[width, height]} />
//         <meshStandardMaterial map={tex} roughness={0.9} />
//       </mesh>

//       {/* rebord pour la craie */}
//       <mesh position={[0, -height / 2 - f - 0.02, 0.04]}>
//         <boxGeometry args={[width * 0.9, 0.04, 0.1]} />
//         <meshStandardMaterial color={frameColor} roughness={0.6} />
//       </mesh>
//     </group>
//   );
// }

import { useMemo } from "react";
import * as THREE from "three";

const FONT = "'Segoe UI', Arial, sans-serif";

// Dessine le texte sur le tableau, une ligne par élément (séparés par des virgules).
// La taille de la police est calculée pour que tout rentre sans déborder.
function makeBoardTexture(text, subtitle, aspect, maxFont) {
  const w = 2048;
  const h = Math.round(w / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#1f3b2d";
  ctx.fillRect(0, 0, w, h);
  // traces de craie effacée
  for (let i = 0; i < 14; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.015 + Math.random() * 0.025})`;
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * w,
      Math.random() * h,
      160 + Math.random() * 240,
      40 + Math.random() * 60,
      Math.random() * 3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  const lines = text
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  const padX = w * 0.06;
  const padY = h * 0.08;
  const subH = subtitle ? h * 0.14 : 0;
  const availW = w - padX * 2;
  const availH = h - padY * 2 - subH;
  const lineGap = 1.25;

  // 1) taille max selon la hauteur disponible
  let size = Math.min(maxFont, availH / (lines.length * lineGap));
  // 2) réduit encore si une ligne dépasse la largeur
  ctx.font = `bold ${size}px ${FONT}`;
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 1);
  if (widest > availW) size *= availW / widest;

  ctx.fillStyle = "#f4f1e6";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${size}px ${FONT}`;

  const blockH = lines.length * size * lineGap;
  const startY = padY + (availH - blockH) / 2 + (size * lineGap) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * size * lineGap);
  });

  if (subtitle) {
    ctx.font = `${h * 0.07}px ${FONT}`;
    ctx.fillText(subtitle, w / 2, h - padY - subH / 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Tableau mural. Le point (0,0,0) est le centre du tableau, face vers +z.
// text : éléments séparés par des virgules, une ligne chacun.
export default function Blackboard({
  width = 4,
  height = 1.4,
  text = "MECANIQUE, ELECTROMECANIQUE, MECATRONIQUE, LARAVEL, JAVA",
  subtitle = "",
  maxFont = 200, // taille maximale de la police (en pixels de texture)
  frameColor = "#8a6a45",
  ...props
}) {
  const tex = useMemo(
    () => makeBoardTexture(text, subtitle, width / height, maxFont),
    [text, subtitle, width, height, maxFont],
  );
  const f = 0.06; // épaisseur du cadre

  return (
    <group {...props}>
      {/* cadre */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[width + f * 2, height + f * 2, 0.03]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* surface */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>

      {/* rebord pour la craie */}
      <mesh position={[0, -height / 2 - f - 0.02, 0.04]}>
        <boxGeometry args={[width * 0.9, 0.04, 0.1]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
    </group>
  );
}
