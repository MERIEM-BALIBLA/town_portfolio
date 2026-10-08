import { useMemo } from "react";
import { Shape, ExtrudeGeometry } from "three";

export default function LedPlatform({
  width = 6,
  depth = 6,
  radius = 0.6,
  height = 0.4,
  position,
}) {
  const { bodyGeo, ledGeo } = useMemo(() => {
    const w = width / 2;
    const d = depth / 2;
    const r = radius;

    // ---------- CORPS ----------
    const bodyShape = new Shape();
    bodyShape.moveTo(-w + r, -d);
    bodyShape.lineTo(w - r, -d);
    bodyShape.quadraticCurveTo(w, -d, w, -d + r);
    bodyShape.lineTo(w, d - r);
    bodyShape.quadraticCurveTo(w, d, w - r, d);
    bodyShape.lineTo(-w + r, d);
    bodyShape.quadraticCurveTo(-w, d, -w, d - r);
    bodyShape.lineTo(-w, -d + r);
    bodyShape.quadraticCurveTo(-w, -d, -w + r, -d);

    const bodyGeo = new ExtrudeGeometry(bodyShape, {
      depth: height,
      bevelEnabled: false,
    });
    bodyGeo.rotateX(-Math.PI / 2);
    // PLUS de translate : après rotateX, la géométrie s'étend de y=0 à y=height
    // → le corps est déjà posé au sol.

    // ---------- LED (un peu plus large que le corps) ----------
    const over = 0.06;
    const W = w + over;
    const D = d + over;
    const R = r + over;

    const ledShape = new Shape();
    ledShape.moveTo(-W + R, -D);
    ledShape.lineTo(W - R, -D);
    ledShape.quadraticCurveTo(W, -D, W, -D + R);
    ledShape.lineTo(W, D - R);
    ledShape.quadraticCurveTo(W, D, W - R, D);
    ledShape.lineTo(-W + R, D);
    ledShape.quadraticCurveTo(-W, D, -W, D - R);
    ledShape.lineTo(-W, -D + R);
    ledShape.quadraticCurveTo(-W, -D, -W + R, -D);

    const ledGeo = new ExtrudeGeometry(ledShape, {
      depth: 0.1, // un peu plus haut pour bien dépasser
      bevelEnabled: false,
    });
    ledGeo.rotateX(-Math.PI / 2);
    // PLUS de translate : la LED va de y=0 à y=0.1.
    // Le corps va de y=0 à y=height (0.4).
    // → La LED est dans le bas du corps ET dépasse sur les côtés (car W>w).
    // → On la voit tout autour du bas de la plateforme, comme sur ta photo.

    return { bodyGeo, ledGeo };
  }, [width, depth, radius, height]);

  return (
    <group position={position}>
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial color="#58035f" roughness={0.6} metalness={0.3} />
      </mesh>

      <mesh geometry={ledGeo}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
