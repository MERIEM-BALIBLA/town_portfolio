import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox, useGLTF } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

useGLTF.preload("/models/linkedin.glb");

/* Ton modèle linkedin.glb, recentré et mis à l'échelle automatiquement */
export function LinkedinIcon({ size = 1.5, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF("/models/linkedin.glb");
  const { object, scale } = useMemo(() => {
    const object = scene.clone(true);
    const box = new THREE.Box3().setFromObject(object);
    const dim = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);
    return { object, scale: size / Math.max(dim.x, dim.y, dim.z) };
  }, [scene, size]);

  return (
    <group rotation={rotation} scale={scale}>
      <primitive object={object} />
    </group>
  );
}

/* Icône extrudée à partir d'un tracé SVG (viewBox 24x24) */
function SvgIcon({ path, size = 1.4, color = "#2b2233" }) {
  const geometry = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}"/></svg>`;
    const data = new SVGLoader().parse(svg);
    const shapes = data.paths.flatMap((p) => p.toShapes());

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 2.5,
      bevelEnabled: false,
    });
    geo.center();
    const s = size / 24;
    geo.scale(s, -s, s); // le SVG a l'axe Y inversé
    return geo;
  }, [path, size]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const GITHUB_PATH =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z";

export function GithubIcon({ size = 1.5, color = "#2b2233" }) {
  return <SvgIcon path={GITHUB_PATH} size={size} color={color} />;
}

export function MailIcon({ color = "#d98ad6", flapColor = "#f6c9f1" }) {
  const flap = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.7, 0.48);
    shape.lineTo(0.7, 0.48);
    shape.lineTo(0, -0.08);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: false,
    });
  }, []);

  return (
    <group>
      <RoundedBox args={[1.55, 1.1, 0.14]} radius={0.08} smoothness={3}>
        <meshStandardMaterial color={color} roughness={0.4} />
      </RoundedBox>
      <mesh geometry={flap} position={[0, 0, 0.08]}>
        <meshStandardMaterial color={flapColor} roughness={0.5} />
      </mesh>
    </group>
  );
}
