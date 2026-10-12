import { useMemo } from "react";
import * as THREE from "three";
import { WALL, GLOW } from "../../assets/json/Config";

export default function WallPanel(props) {
  const { wall, edge } = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-9, 0);
    shape.lineTo(-9, 6.7);
    shape.lineTo(8.6, 8.2);
    shape.bezierCurveTo(10.2, 8.0, 10.6, 5.5, 10.0, 3.8);
    shape.bezierCurveTo(9.7, 2.2, 9.2, 0.9, 8.8, 0);
    shape.closePath();

    const wall = new THREE.ExtrudeGeometry(shape, {
      depth: 0.5,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      bevelSegments: 2,
      curveSegments: 40,
    });
    wall.translate(0, 0, -0.25);

    // Liseré qui suit le bord courbe de droite
    const path = new THREE.CurvePath();
    path.add(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(8.6, 8.2, 0),
        new THREE.Vector3(10.2, 8.0, 0),
        new THREE.Vector3(10.6, 5.5, 0),
        new THREE.Vector3(10.0, 3.8, 0),
      ),
    );
    path.add(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(10.0, 3.8, 0),
        new THREE.Vector3(9.7, 2.2, 0),
        new THREE.Vector3(9.2, 0.9, 0),
        new THREE.Vector3(8.8, 0, 0),
      ),
    );
    const edge = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(path.getPoints(80)),
      160,
      0.05,
      8,
      false,
    );
    return { wall, edge };
  }, []);

  return (
    <group position={[0, 0, -14]} {...props}>
      <mesh geometry={wall} receiveShadow castShadow>
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh geometry={edge} position={[0, 0, 0.3]}>
        <meshBasicMaterial color={GLOW} />
      </mesh>
    </group>
  );
}
