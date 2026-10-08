import LedPlatform from "../about/LedPlatform";
import Section from "../Section";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Desk from "../about/Desk";
import Plant from "../about/Plant";
import Window from "../about/Window";
import Chair from "../about/Chair";
import Bookshelf from "../about/Bookshelf";
import DeskItems from "../about/Deskitems";

import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import ProfilePanel from "../about/ProfilePanel";

export default function AboutSection({ position, scale }) {
  const materials = useLoader(MTLLoader, "/models/fat_cat_obj.mtl");

  // 2. Charge l'objet (.obj) en lui passant les matériaux
  const obj = useLoader(OBJLoader, "/models/fat_cat_obj.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const DESK_TOP = 3.75; // hauteur du dessus du plateau (monde)

  return (
    <Section position={position}>
      {/* mur  */}
      <mesh position={[0, 4, -14]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e8c1e2" />
      </mesh>
      <mesh position={[-9, 4, -0.25]} receiveShadow>
        <boxGeometry args={[0.5, 8, 28]} />
        <meshStandardMaterial color="#e8c1e2" />
      </mesh>
      <Window scale={1.7} position={[6, 6, -13.7]} />

      <ProfilePanel
        // scale={[0.5, 0.5, 0.01]}
        // position={[-8.8, 4.5, -1.4]}
        // rotation={[0, Math.PI / 2, 0]}
        position={[-8.7, 4.5, -1.4]}
        rotation={[0, Math.PI / 2, 0]}
        // scale={[0.4, 0.4, 0.1]}
        // avatarUrl={me}
        avatarFocus={[5, 0.1, 0.4]}
        scale={[1.7, 1.7, 1]}
      />

      <Bookshelf
        position={[-8.1, 1.1, 9]}
        rotation={[0, Math.PI / 2, 0]}
        width={6}
        height={3}
        depth={1}
        shelves={5}
        columns={2}
      />
      <Plant position={[-6, 1, -11]} scale={[4, 6, 4]} />

      <group position={[3, 0, -8]}>
        <Desk scale={3} position={[0, 1.15, 0]} />
        <Chair scale={3.5} position={[-1.2, 1.15, 1.9]} />
        <DeskItems position={[0, 4.2, 0]} />
      </group>

      <primitive
        object={obj}
        position={[-6, 2, 14]}
        scale={0.12}
        rotation={[0, Math.PI, 0]}
      />
      {/* <CatBed position={[1, 10, 1]} /> */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>

      <LedPlatform
        width={23}
        depth={35}
        radius={0.8}
        height={1}
        position={[0, 0.15, 0]}
      />
    </Section>
  );
}
