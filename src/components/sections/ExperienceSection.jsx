import Plant from "../about/Plant";
import AlexsysCurrentEffects from "../experiences/Alexsyscurrenteffects";
import AlexsysLogo from "../experiences/AlexsysLogo";
import Book from "../experiences/Book";
import DashyLogo from "../experiences/DashyLogo";
import Glasses from "../experiences/Glasses";
import LoungeScene from "../experiences/Loungescene ";
import WallLeds from "../experiences/Wallleds";
import Section from "../Section";
import { useGLTF } from "@react-three/drei";
import { EXPERIENCES } from "../../assets/json/experienceData";
import { useState } from "react";

export default function ExperienceSection({ position }) {
  const { scene } = useGLTF("/models/ImageToStl.com_.glb");
  const { scene: angular } = useGLTF("/models/angular.glb");
  const { scene: flutter } = useGLTF("/models/flutter.glb");
  const { scene: dotenet } = useGLTF("/models/dotenet.glb");
  const { scene: react } = useGLTF("/models/react.glb");

  const [selected, setSelected] = useState(null); // "alexsys" | "dashy" | null
  const toggle = (id) => setSelected((cur) => (cur === id ? null : id));
  return (
    <>
      <Section position={position}>
        <mesh position={[0, 4, 14]} receiveShadow>
          <boxGeometry args={[18, 8, 0.5]} />
          <meshStandardMaterial color="#e8c1e2" />
        </mesh>
        <mesh position={[-9, 4, -0.8]} receiveShadow>
          <boxGeometry args={[0.5, 8, 30]} />
          <meshStandardMaterial color="#e8c1e2" />
        </mesh>

        <WallLeds
          position={[0, 7.6, 13.65]}
          rotation={[0, Math.PI, 0]}
          length={18}
          lamps={[4, -1, -6]}
        />

        {/* mur de gauche (Alexsys) */}
        <WallLeds
          position={[-8.65, 7.6, -0.25]}
          rotation={[0, Math.PI / 2, 0]}
          length={30}
          lamps={[5, -0.75, -5.75]}
        />
        <AlexsysLogo
          position={[-8.3, 4.5, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[1.2, 1.2, 1.7]}
        />
        {/* <LoungeScene
          position={[-4, 0.3, -3]}
          scale={2}
          rotation={[0, Math.PI / 2, 0]}
        /> */}
        <LoungeScene
          position={[-4, 0.3, -3]}
          scale={2}
          rotation={[0, Math.PI / 2, 0]}
          data={EXPERIENCES.alexsys}
          active={selected === "alexsys"}
          onSelect={() => toggle("alexsys")}
        />

        <AlexsysCurrentEffects
          position={[-8.2, 5, 0]}
          rotation={[0, Math.PI / 2, 0]}
          w={6}
          h={3}
        />

        {/* ///// */}
        <DashyLogo
          position={[1.5, 4.5, 13.4]}
          rotation={[0, Math.PI, 0]}
          scale={[1.2, 1.2, 1.7]}
        />

        {/* <LoungeScene
          position={[4, 0.3, 9]}
          scale={2}
          rotation={[0, Math.PI, 0]}
        /> */}
        <LoungeScene
          position={[4, 0.3, 9]}
          scale={2}
          rotation={[0, Math.PI, 0]}
          data={EXPERIENCES.dashy}
          active={selected === "dashy"}
          onSelect={() => toggle("dashy")}
        />
        <Plant position={[-5, 0, -10]} scale={6} />
        <Plant position={[10, 0, 10.2]} scale={6} />

        <group position={[-6.5, 5, 13.6]}>
          <primitive
            object={scene}
            // position={[-6, 4.5, 13.4]}
            scale={0.01}
            rotation={[0, Math.PI, 0]}
          />
          <primitive
            object={angular}
            scale={0.01}
            position={[-0.7, -1, 0]}
            rotation={[0, Math.PI, 0]}
          />
          <primitive
            object={flutter}
            scale={0.01}
            rotation={[0, Math.PI, 0]}
            position={[0.7, -1, 0]}
          />
        </group>

        <group position={[-6.5, 5, 8]}>
          <primitive
            object={dotenet}
            scale={0.01}
            rotation={[0, Math.PI / 2, 0]}
            position={[-1.95, 0, 1]}
          />
          <primitive
            object={react}
            scale={0.01}
            rotation={[0, Math.PI / 2, 0]}
            position={[-1.95, -1, 0]}
          />
        </group>

        <group position={[-3, 0.7, 6]} scale={1.3}>
          <Glasses
            position={[9.5, 2, -11]}
            rotation={[0, Math.PI / 2 + 7, 0]}
            scale={0.7}
          />
          <Book
            position={[8, 1, -10]}
            title="ANGULAR"
            rotation={[-Math.PI / 2, 0, 1]}
            scale={1.5}
            color="#4f3349"
          />
          <Book
            position={[8, 0, -10]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={1.5}
          />
        </group>
      </Section>
    </>
  );
}
