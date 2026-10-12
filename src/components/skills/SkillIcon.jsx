import { useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

// Couleurs de marque trop sombres : illisibles sur le fond noir du cadre
function readable(hex) {
  const c = new THREE.Color(hex);
  const { l } = c.getHSL({});
  if (l < 0.35) {
    const hsl = c.getHSL({});
    c.setHSL(hsl.h, hsl.s, 0.75); // éclaircit
  }
  return `#${c.getHexString()}`;
}

export default function SkillIcon({
  icon,
  color, // optionnel : force une couleur
  size = 0.5,
  position = [0, 0, 0],
}) {
  const { geometries, k, cx, cy } = useMemo(() => {
    if (!icon?.path) return { geometries: [], k: 1, cx: 0, cy: 0 };

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.path}"/></svg>`;
    const data = new SVGLoader().parse(svg);

    const geos = [];
    data.paths.forEach((p) => {
      SVGLoader.createShapes(p).forEach((s) =>
        geos.push(new THREE.ShapeGeometry(s)),
      );
    });

    const box = new THREE.Box3();
    geos.forEach((g) => {
      g.computeBoundingBox();
      box.union(g.boundingBox);
    });

    const w = box.max.x - box.min.x || 1;
    const h = box.max.y - box.min.y || 1;

    return {
      geometries: geos,
      k: size / Math.max(w, h),
      cx: (box.min.x + box.max.x) / 2,
      cy: (box.min.y + box.max.y) / 2,
    };
  }, [icon, size]);

  // priorité : prop color > couleur de marque > blanc
  const finalColor = color || (icon?.hex ? readable(icon.hex) : "#ffffff");

  return (
    <group position={position}>
      <group position={[-cx * k, cy * k, 0]} scale={[k, -k, k]}>
        {geometries.map((geo, i) => (
          <mesh key={i} geometry={geo}>
            <meshStandardMaterial
              color={finalColor}
              emissive={finalColor}
              emissiveIntensity={0.35}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
