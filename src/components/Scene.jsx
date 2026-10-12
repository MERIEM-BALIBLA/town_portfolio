// import { OrbitControls } from "@react-three/drei";
// import Road from "./Road";
// import Player from "../utils/Player";
// import { useRef } from "react";
// import { stations } from "../assets/json/stations";
// import Station from "./Station";
// import Section from "./Section";
// import AboutSection from "./sections/AboutSection";
// import ExperienceSection from "./sections/ExperienceSection";
// import FormationSection from "./sections/FormationSection";
// import ProjectSecion from "./sections/ProjectSection";
// import SkillsSection from "./sections/SkillsSection";
// import ContactSection from "./sections/ContactSection";

// export default function Scene() {
//   const playerRef = useRef();
//   const focusRef = useRef(null); // partagé entre les stations et le joueur

//   return (
//     <>
//       <OrbitControls
//         makeDefault
//         enablePan={false}
//         minDistance={2}
//         maxDistance={150}
//         maxPolarAngle={Math.PI / 2.1}
//       />

//       <ambientLight intensity={0.5} />
//       <directionalLight position={[10, 10, 5]} intensity={1} />

//       <Road position={[0, 0, 0]} />
//       <Road position={[-14, 0, 0]} rotation={Math.PI / 2} />
//       <Road position={[14, 0, 0]} rotation={Math.PI / 2} />

//       <AboutSection position={[-28, -21]} />
//       <ContactSection position={[0, -21]} />
//       <SkillsSection position={[28, -21]} />

//       <ExperienceSection position={[-28, 21]} />
//       <FormationSection position={[0, 21]} />
//       <ProjectSecion position={[28, 21]} />

//       {stations.map((s) => (
//         <Station key={s.id} {...s} playerRef={playerRef} focusRef={focusRef} />
//       ))}

//       <Player playerRef={playerRef} focusRef={focusRef} start={[0, 0.1, 0]} />
//       {/* <axesHelper args={[8]} /> */}
//     </>
//   );
// }
import { OrbitControls } from "@react-three/drei";
import Road from "./Road";
import Player from "../utils/Player";
import { useRef } from "react";
import { stations } from "../assets/json/stations";
import Station from "./Station";
import Reveal from "./Reveal";
import AboutSection from "./sections/AboutSection";
import ExperienceSection from "./sections/ExperienceSection";
import FormationSection from "./sections/FormationSection";
import ProjectSecion from "./sections/ProjectSection";
import SkillsSection from "./sections/SkillsSection";
import ContactSection from "./sections/ContactSection";

export default function Scene({ started }) {
  const playerRef = useRef();
  const focusRef = useRef(null);

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2}
        maxDistance={150}
        maxPolarAngle={Math.PI / 2.1}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <Reveal active={started}>
        <Road position={[0, 0, 0]} />
        <Road position={[-14, 0, 0]} rotation={Math.PI / 2} />
        <Road position={[14, 0, 0]} rotation={Math.PI / 2} />
      </Reveal>

      <Reveal active={started} delay={0.0}>
        <AboutSection position={[-28, -21]} />
      </Reveal>
      <Reveal active={started} delay={0.1}>
        <ContactSection position={[0, -21]} />
      </Reveal>
      <Reveal active={started} delay={0.2}>
        <SkillsSection position={[28, -21]} />
      </Reveal>
      <Reveal active={started} delay={0.3}>
        <ExperienceSection position={[-28, 21]} />
      </Reveal>
      <Reveal active={started} delay={0.4}>
        <FormationSection position={[0, 21]} />
      </Reveal>
      <Reveal active={started} delay={0.5}>
        <ProjectSecion position={[28, 21]} />
      </Reveal>

      {started && (
        <>
          {stations.map((s) => (
            <Station
              key={s.id}
              {...s}
              playerRef={playerRef}
              focusRef={focusRef}
            />
          ))}
          <Player
            playerRef={playerRef}
            focusRef={focusRef}
            start={[0, 0.1, 0]}
          />
        </>
      )}
    </>
  );
}
