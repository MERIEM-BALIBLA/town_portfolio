import { useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";

const SRC = "/Innocent.mp3";
const TITLE = "Innocent";

function readVolume() {
  try {
    const v = parseFloat(localStorage.getItem("music-volume"));
    return Number.isFinite(v) ? v : 0.5;
  } catch {
    return 0.5;
  }
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
};

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z"
      fill="currentColor"
      transform="translate(1 0)"
    />
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="5" width="14" height="14" rx="3" fill="currentColor" />
  </svg>
);

function VolumeIcon({ level }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M11 5L6 9H3v6h3l5 4V5z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {level === 0 ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" {...stroke} />
      ) : (
        <>
          <path d="M15.5 9.5a3.5 3.5 0 010 5" {...stroke} />
          {level > 0.5 && <path d="M18.5 6.5a8 8 0 010 11" {...stroke} />}
        </>
      )}
    </svg>
  );
}

// Lecteur de musique de fond : play / stop, titre, égaliseur et volume.
// `autoStart` passe à true après un clic de l'utilisateur (les navigateurs
// bloquent la lecture automatique sans interaction).
export default function MusicPlayer({ autoStart = false }) {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(readVolume);
  const [lastVolume, setLastVolume] = useState(0.5);

  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
    try {
      localStorage.setItem("music-volume", String(volume));
    } catch {
      /* stockage indisponible */
    }
  }, [volume]);

  useEffect(() => {
    if (autoStart) audio.current?.play().catch(() => {});
  }, [autoStart]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {});
    } else {
      a.pause();
      a.currentTime = 0; // stop : repart du début
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume || 0.5);
    }
  };

  return (
    <div className={`music-player${playing ? " is-playing" : ""}`}>
      <audio
        ref={audio}
        src={SRC}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <button
        type="button"
        className="mp-play"
        onClick={toggle}
        aria-label={playing ? "Arrêter la musique" : "Lancer la musique"}
        title={playing ? "Stop" : "Play"}
      >
        {playing ? <StopIcon /> : <PlayIcon />}
      </button>

      <div className="mp-info">
        <div className="mp-eq" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="mp-title">
          <strong>{TITLE}</strong>
          <span>{playing ? "En lecture" : "En pause"}</span>
        </div>
      </div>

      <div className="mp-divider" aria-hidden="true" />

      <div className="mp-volume">
        <button
          type="button"
          className="mp-mute"
          onClick={toggleMute}
          aria-label={volume === 0 ? "Réactiver le son" : "Couper le son"}
          title="Volume"
        >
          <VolumeIcon level={volume} />
        </button>
        <input
          type="range"
          className="mp-range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          aria-label="Volume"
          style={{ "--fill": `${volume * 100}%` }}
        />
      </div>
    </div>
  );
}
