import Section from "../Section";
import ProjectFrame from "../project/Projectframe";
import huntersLeague from "../../assets/image/huntersLeague.webp";
import skillder from "../../assets/image/skillder.webp";
import citronix from "../../assets/image/citronix.webp";
import batiCuisine from "../../assets/image/batiCuisine.webp";
import evento from "../../assets/image/evento.webp";
import HouseStars from "../project/Housestars";
import Plant from "../about/Plant";
import Jellyfish from "../project/Portfoliofolder";
import PortfolioFolder from "../project/Portfoliofolder";

export default function ProjectSecion({ position }) {
  return (
    <Section position={position}>
      <mesh position={[0, 4, 14]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e8c1e2" />
      </mesh>
      <mesh position={[9, 4, -0.8]} receiveShadow>
        <boxGeometry args={[0.5, 8, 30]} />
        <meshStandardMaterial color="#e8c1e2" />
      </mesh>
      <ProjectFrame
        title="Hunters League"
        description="Une application web conçue pour gérer les compétitions de chasse, permettant aux organisateurs d’inscrire les participants, de suivre les scores et d’afficher les résultats des compétitions en temps réel."
        image={huntersLeague}
        technologies={["Java", "Spring Boot"]}
        position={[-4, 4.3, 13.8]}
        rotation={[0, Math.PI, 0]}
        onClick={() => console.log("clic")}
        scale={[2.3, 2.4, 5]}
        github="https://github.com/MERIEM-BALIBLA/hunter-s-League"
      />
      <ProjectFrame
        title="SkillDer"
        description="Une plateforme web d’emploi permettant aux entreprises de publier des offres d’emploi et aux candidats de postuler, gérer leurs profils et présenter leurs compétences."
        image={skillder}
        technologies={["PHP", "Larael", "HTML5", "CSS3", "Tailwind CSS"]}
        position={[4, 4.3, 13.8]}
        rotation={[0, Math.PI, 0]}
        onClick={() => console.log("clic")}
        scale={[2.3, 2.4, 5]}
        github="https://github.com/MERIEM-BALIBLA/Skillder-gestionnaire-des-Evenements-Dynamic"
      />
      <ProjectFrame
        title="Citronix"
        description="Une application web de gestion agricole conçue pour optimiser le suivi de la production de citrons et aider les agriculteurs à améliorer le rendement et la productivité."
        image={citronix}
        technologies={["Java", "Spring Boot"]}
        position={[8.8, 4.3, 8]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={() => console.log("clic")}
        scale={[2.3, 2.4, 5]}
        github="https://github.com/MERIEM-BALIBLA/Citronix"
      />
      <ProjectFrame
        title="BatiCuisine"
        description="Une application destinée à la gestion des projets de construction de cuisines permettant de gérer les clients, les composants et de générer des devis pour les projets."
        image={batiCuisine}
        technologies={["Java"]}
        position={[8.8, 4.3, -1.5]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={() => console.log("clic")}
        scale={[2.3, 2.4, 5]}
        github="https://github.com/MERIEM-BALIBLA/BatiCuisine"
      />
      <ProjectFrame
        title="Evento"
        description="Une application web de gestion d’événements permettant aux utilisateurs de créer, organiser et gérer des événements tout en suivant les participants et les informations liées aux événements."
        image={evento}
        technologies={["PHP", "Larael", "HTML5", "CSS3", "Tailwind CSS"]}
        position={[8.8, 4.3, -11]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={() => console.log("clic")}
        scale={[2.3, 2.4, 5]}
        github="https://github.com/MERIEM-BALIBLA/EvenTo_gestionnaire_des_Evenements-"
      />
      <HouseStars
        position={[0, 0.2, 5]}
        scale={1.5}
        rotation={[0, Math.PI + 7, 0]}
      />
      scale={1.5}
      <PortfolioFolder
        position={[0, 0.2, -5]}
        rotation={[0, Math.PI + 7, 0]}
        scale={1.5}
      />
      {/* <Plant position={[-9, 0, 11]} scale={6} /> */}
      <Plant position={[8, 0, -17]} scale={[4, 6, 4]} />
    </Section>
  );
}
