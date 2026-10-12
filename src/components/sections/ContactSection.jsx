import Section from "../Section";
import { CONTACT } from "../../assets/json/Config";
import WallPanel from "../contact/Wallpanel";
import ContactTitle from "../contact/Contacttitle";
import PaperPlane from "../contact/Paperplane";
import GlassCard from "../contact/GlassCard";
import { LinkedinIcon, MailIcon, GithubIcon } from "../contact/Icons";
import Podium from "../contact/Podium";
import Plant from "../about/Plant";
import { NeonPanel, Planter } from "../contact/SideDecor";

export default function ContactSection({ position }) {
  return (
    <Section position={position}>
      {/* Lumière chaude pour le mur et les cartes */}
      <pointLight
        position={[0, 5, -10]}
        color="#ffc2a0"
        intensity={30}
        distance={18}
      />

      <WallPanel />
      <ContactTitle />
      <PaperPlane />

      {/* Cartes en verre */}
      <GlassCard
        rotation={[0, -50, 0]}
        position={[-4.9, 2.45, -10.52]}
        label="LinkedIn"
        sub={CONTACT.linkedin.sub}
        href={CONTACT.linkedin.href}
        phase={0}
      >
        <LinkedinIcon />
      </GlassCard>
      <GlassCard
        position={[0, 2.45, -12.52]}
        label="Email"
        sub={CONTACT.email.sub}
        href={CONTACT.email.href}
        phase={1.5}
      >
        <MailIcon />
      </GlassCard>
      <GlassCard
        rotation={[0, 50, 0]}
        position={[4.9, 2.45, -10.52]}
        label="GitHub"
        sub={CONTACT.github.sub}
        href={CONTACT.github.href}
        phase={3}
      >
        <GithubIcon />
      </GlassCard>

      {/* Centre */}
      <Podium position={[0, 0.5, 2]} scale={1.5} />

      {/* Décor latéral */}
      <NeonPanel position={[-12.2, 0, -9.5]} rotation={[0, 0.55, 0]} />

      {/* <Plant position={[-9.6, 0, -6.5]} scale={1.3} /> */}
      <Planter position={[8, 0, 15]} rotation={[0, Math.PI, 0]} />
      <Planter position={[-8, 0, 15]} rotation={[0, Math.PI, 0]} />

      <Plant scale={[3, 6, 3]} position={[9.5, 0, -11]} />
    </Section>
  );
}
