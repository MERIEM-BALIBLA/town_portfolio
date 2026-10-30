import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Box3, Frustum, Matrix4, Vector3 } from "three";

// Empreinte d'une section (Section.jsx : 24 x 38) + marge pour éviter les clignotements
const HALF_W = 16;
const HALF_D = 23;
const HEIGHT = 12;

const frustum = new Frustum();
const matrix = new Matrix4();

// Charge une section quand elle entre dans le champ de la caméra, et ne la dessine que là.
export default function InViewSection({ center, children }) {
  const ref = useRef();
  const wasInView = useRef(true);
  const [loaded, setLoaded] = useState(false);

  const box = useMemo(
    () =>
      new Box3(
        new Vector3(center[0] - HALF_W, 0, center[1] - HALF_D),
        new Vector3(center[0] + HALF_W, HEIGHT, center[1] + HALF_D),
      ),
    [center],
  );

  useFrame(({ camera }) => {
    matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);
    const inView = frustum.intersectsBox(box);
    if (inView && !loaded) setLoaded(true);
    if (inView === wasInView.current || !ref.current) return;
    wasInView.current = inView;
    // Les lumières restent actives : si leur nombre change, Three.js recompile
    // tous les matériaux et la page se fige.
    ref.current.traverse((object) => {
      if (object.isMesh || object.isLine || object.isPoints) {
        object.visible = inView;
      }
    });
  });

  return (
    <group ref={ref}>
      {loaded && <Suspense fallback={null}>{children}</Suspense>}
    </group>
  );
}
