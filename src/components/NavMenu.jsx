import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  SECTIONS,
  exitSection,
  getSection,
  nav,
  navigate,
  useNav,
} from "../utils/navigation";
import "./NavMenu.css";

const ICONS = {
  about: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
    </>
  ),
  education: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </>
  ),
  skills: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  projects: (
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  ),
  contact: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  back: <path d="M15 6l-6 6 6 6" />,
};

// Sous-titres courts (cartes du menu mobile)
const SHORT = {
  about: "Who I am",
  experience: "Where I've worked",
  education: "What I studied",
  skills: "Tools & tech",
  projects: "What I've built",
  contact: "Let's talk",
};

function Icon({ name }) {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export default function NavMenu({ visible }) {
  const { current, target } = useNav();
  const [open, setOpen] = useState(false); // feuille du menu (mobile)
  const [pill, setPill] = useState(null); // position de l'indicateur actif
  const trackRef = useRef(null);
  const activeId = target ?? current;

  // Raccourcis : 1 à 6 = aller à une section, Échap = fermer / sortir
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.repeat) return;
      const i = Number(e.key) - 1;
      if (i >= 0 && i < SECTIONS.length) {
        navigate(SECTIONS[i].id);
        setOpen(false);
      } else if (e.code === "Escape") {
        if (open) setOpen(false);
        else if (nav.get().current) exitSection();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, open]);

  // L'indicateur glisse sous l'élément actif
  useLayoutEffect(() => {
    if (!visible) return;
    const measure = () => {
      const el = trackRef.current?.querySelector(`[data-id="${activeId}"]`);
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeId, visible]);

  if (!visible) return null;

  const go = (id) => {
    navigate(id);
    setOpen(false);
  };

  return (
    <>
      <nav className={`nav${open ? " is-open" : ""}`} aria-label="Sections">
        <div className="nav__backdrop" onClick={() => setOpen(false)} />

        <button
          className="nav__fab"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen(true)}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
          Menu
        </button>

        <div className="nav__bar" id="nav-panel">
          <span className="nav__brand">
            Meriem<span>.</span>
          </span>

          <div className="nav__sheet-head">
            <span>Explore</span>
            <button
              className="nav__close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="nav__track" ref={trackRef}>
            <span
              className="nav__pill"
              style={
                pill
                  ? { left: pill.left, width: pill.width, opacity: 1 }
                  : { opacity: 0 }
              }
            />
            <ul className="nav__list">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button
                    data-id={s.id}
                    className={`nav__item${activeId === s.id ? " is-active" : ""}`}
                    aria-current={current === s.id ? "location" : undefined}
                    onClick={() => go(s.id)}
                  >
                    <Icon name={s.id} />
                    <span className="nav__text">
                      <span className="nav__label">{s.label}</span>
                      <span className="nav__desc">{SHORT[s.id]}</span>
                    </span>
                    <kbd className="nav__key">{i + 1}</kbd>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Emplacement contextuel sous la barre : en route… / retour */}
      {target && (
        <div className="nav-chip nav-status" role="status">
          <span className="nav-status__dot" />
          On the way to <b>{getSection(target).label}</b>
        </div>
      )}
      {current && !target && (
        <button className="nav-chip nav-back" onClick={exitSection}>
          <Icon name="back" />
          Back to the road
          <kbd>Esc</kbd>
        </button>
      )}
    </>
  );
}
