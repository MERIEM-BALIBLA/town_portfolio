// Composant de scène : à utiliser DANS un <Canvas> existant (pas de Canvas ici).
import { useMemo } from "react";
import * as THREE from "three";

const W = 3; // largeur
const H = 4; // hauteur
const D = 0.6; // épaisseur totale
const C = 0.04; // épaisseur d'une couverture

function makeTexture(draw, w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function Book({
  title = "JAVA",
  color = "#c2410c",
  textColor = "#fff7ed",
  ...props
}) {
  // Couverture : titre vertical sur le côté droit
  const coverTex = useMemo(
    () =>
      makeTexture(
        (ctx, w, h) => {
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, w, h);
          // bande décorative à droite
          ctx.fillStyle = "rgba(0,0,0,0.18)";
          ctx.fillRect(w * 0.68, 0, w * 0.32, h);
          // titre vertical à droite
          ctx.save();
          ctx.translate(w * 0.84, h / 2);
          ctx.rotate(Math.PI / 2);
          ctx.fillStyle = textColor;
          ctx.font = "bold 230px 'Segoe UI', Arial, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(title, 0, 0);
          ctx.restore();
        },
        600,
        800,
      ),
    [title, color, textColor],
  );

  // Dos du livre : titre lisible de haut en bas
  const spineTex = useMemo(
    () =>
      makeTexture(
        (ctx, w, h) => {
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, w, h);
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.rotate(Math.PI / 2);
          ctx.fillStyle = textColor;
          ctx.font = "bold 120px 'Segoe UI', Arial, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(title, 0, 0);
          ctx.restore();
        },
        120,
        800,
      ),
    [title, color, textColor],
  );

  const plain = <meshStandardMaterial color={color} roughness={0.55} />;
  const pageMat = <meshStandardMaterial color="#f5efe0" roughness={0.9} />;

  return (
    <group {...props}>
      {/* Couverture avant : le 5e matériau est la face +z */}
      <mesh position={[0, 0, D / 2 - C / 2]}>
        <boxGeometry args={[W, H, C]} />
        <meshStandardMaterial attach="material-0" color={color} />
        <meshStandardMaterial attach="material-1" color={color} />
        <meshStandardMaterial attach="material-2" color={color} />
        <meshStandardMaterial attach="material-3" color={color} />
        <meshStandardMaterial
          attach="material-4"
          map={coverTex}
          roughness={0.5}
        />
        <meshStandardMaterial attach="material-5" color={color} />
      </mesh>

      {/* Couverture arrière */}
      <mesh position={[0, 0, -D / 2 + C / 2]}>
        <boxGeometry args={[W, H, C]} />
        {plain}
      </mesh>

      {/* Dos : le 2e matériau est la face -x */}
      <mesh position={[-W / 2 + C / 2, 0, 0]}>
        <boxGeometry args={[C, H, D]} />
        <meshStandardMaterial attach="material-0" color={color} />
        <meshStandardMaterial
          attach="material-1"
          map={spineTex}
          roughness={0.5}
        />
        <meshStandardMaterial attach="material-2" color={color} />
        <meshStandardMaterial attach="material-3" color={color} />
        <meshStandardMaterial attach="material-4" color={color} />
        <meshStandardMaterial attach="material-5" color={color} />
      </mesh>

      {/* Pages */}
      <mesh position={[C / 2 + 0.03, 0, 0]}>
        <boxGeometry args={[W - C - 0.06, H - 0.12, D - C * 2]} />
        {pageMat}
      </mesh>
    </group>
  );
}
