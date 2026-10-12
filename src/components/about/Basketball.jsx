// Composant de scène : à utiliser DANS un <Canvas> existant (pas de Canvas ici).
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function makeBallTexture() {
  const w = 1024,
    h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  // fond orange avec un peu de grain
  ctx.fillStyle = "#e0661d";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }

  // coutures noires
  ctx.strokeStyle = "#1a0f08";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  // équateur
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
  // méridiens
  [0, w / 2, w].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  });
  // courbes latérales
  [w * 0.25, w * 0.75].forEach((x) => {
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + dir * 150, h * 0.3, x + dir * 150, h * 0.7, x, h);
      ctx.stroke();
    });
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Props :
 *  radius      rayon du ballon
 *  gravity     gravité (plus grand = rebond plus rapide)
 *  bounciness  0 à 1, énergie conservée à chaque rebond
 *  minBounce   vitesse minimale de rebond : le ballon ne s'arrête jamais
 *  clickBoost  vitesse verticale donnée par un clic
 *  onBallClick fonction appelée à chaque clic
 * Le point (0,0,0) du groupe est le sol. Les autres props vont au <group>.
 */
export default function Basketball({
  radius = 0.5,
  gravity = 18,
  bounciness = 0.85,
  minBounce = 6,
  clickBoost = 11,
  scale,
  onBallClick,
  ...props
}) {
  const ball = useRef();
  const shadow = useRef();
  const texture = useMemo(makeBallTexture, []);
  const s = useRef({ y: radius * 4, vy: 0, squash: 0, spin: 2, spinY: 0.6 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const st = s.current;

    st.vy -= gravity * dt;
    st.y += st.vy * dt;

    // rebond au sol
    if (st.y <= radius) {
      st.y = radius;
      const impact = Math.abs(st.vy);
      st.vy = Math.max(impact * bounciness, minBounce);
      st.squash = Math.min(1, impact / 14);
    }
    st.squash = Math.max(0, st.squash - dt * 6);

    const k = st.squash;
    ball.current.position.y = st.y - k * radius * 0.25;
    ball.current.scale.set(1 + k * 0.25, 1 - k * 0.3, 1 + k * 0.25);
    ball.current.rotation.x += st.spin * dt;
    ball.current.rotation.y += st.spinY * dt;
    st.spin += (2 - st.spin) * dt * 0.8; // la rotation reprend son rythme calme

    // ombre : plus petite et plus claire quand le ballon monte
    const height = Math.max(0, (st.y - radius) / (radius * 6));
    const sc = Math.max(0.35, 1 - height * 0.6) * (1 + k * 0.3);
    shadow.current.scale.set(sc, sc, 1);
    shadow.current.material.opacity = Math.max(0.08, 0.38 - height * 0.3);
  });

  const handleClick = (e) => {
    e.stopPropagation();
    const st = s.current;
    st.vy = clickBoost;
    st.spin = 10 + Math.random() * 6;
    st.spinY = (Math.random() - 0.5) * 6;
    if (onBallClick) onBallClick(e);
  };

  return (
    <group {...props} scale={scale}>
      <mesh
        ref={shadow}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
      >
        <circleGeometry args={[radius * 0.9, 32]} />
        <meshBasicMaterial
          color="#000"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={ball}
        castShadow
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0} />
      </mesh>
    </group>
  );
}
