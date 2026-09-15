import { useEffect, useState } from 'react';
import { Power } from 'lucide-react';

interface BootScreenProps {
  onDone: () => void;
}

export function BootScreen({ onDone }: BootScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const doneTimer = setTimeout(() => onDone(), 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--bg-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <div
        className="neu-flat"
        style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <Power size={36} color="var(--accent)" />
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 300,
          letterSpacing: 6,
          color: 'var(--txt-main)',
          marginBottom: 16,
        }}
      >
        SERENEOS
      </h1>
      <div
        className="neu-pressed"
        style={{
          width: 160,
          height: 6,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--accent)',
            borderRadius: 3,
            animation: 'bootProgress 2.1s ease-in-out forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes bootProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}