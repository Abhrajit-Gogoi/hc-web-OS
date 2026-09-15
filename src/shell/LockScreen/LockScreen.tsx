import { useState, useEffect, KeyboardEvent } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { useSystemStore } from '../../stores/useSystemStore';

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { user } = useSystemStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onUnlock();
    }
  };

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--bg-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 20px',
        position: 'relative',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, fontWeight: 200, letterSpacing: -2, color: 'var(--txt-main)' }}>
          {timeStr}
        </div>
        <div style={{ fontSize: 18, color: 'var(--txt-muted)', marginTop: 4 }}>
          {dateStr}
        </div>
      </div>

      <div
        className="neu-flat"
        style={{
          padding: '32px 40px',
          borderRadius: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          width: 320,
        }}
      >
        <div
          className="neu-pressed"
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={36} color="var(--accent)" />
        </div>

        <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--txt-main)' }}>
          {user}
        </div>

        <div
          className="neu-pressed"
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '6px 8px 6px 14px',
            borderRadius: 12,
          }}
        >
          <input
            type="password"
            placeholder="Press Enter to unlock"
            autoFocus
            onKeyDown={handleKeyDown}
            style={{ width: '100%', fontSize: 13 }}
          />
          <button
            onClick={onUnlock}
            className="neu-btn"
            style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }}
          >
            <ArrowRight size={16} color="var(--accent)" />
          </button>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--txt-muted)', letterSpacing: 2 }}>
        SERENEOS
      </div>
    </div>
  );
}